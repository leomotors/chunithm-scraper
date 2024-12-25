/// <reference types="bun-types" />

import { Page } from "playwright";
import { Sql } from "postgres";

import {
  calculateRank,
  calculateRating,
  getInternalLevel,
} from "../data/findRating.js";
import { environment } from "../environment.js";
import { PlayResultRank, RatingType, StdChartDifficulty } from "../types.js";

import { main } from "./vendor/qman.js";
import { QmanData, QmanScore, toStdDifficulty } from "./vendor/types.js";

async function uploadMusic(
  sql: Sql,
  scores: QmanScore[],
  jobId: number,
  ratingType: RatingType,
) {
  const payload = [] as Array<{
    job_id: number;
    title: string;
    score: number;
    difficulty: StdChartDifficulty;
    rating_type: RatingType;
    music_order: number;
    level: number;
    rank: PlayResultRank;
    rating: number;
  }>;

  for (const [index, score] of scores.entries()) {
    const level = await getInternalLevel(
      score.title,
      toStdDifficulty(score.difficulty),
      sql,
      environment.VERSION,
    );

    payload.push({
      job_id: jobId,
      title: score.title,
      score: score.score,
      difficulty: toStdDifficulty(score.difficulty),
      rating_type: ratingType,
      music_order: index + 1,
      level: level,
      rank: calculateRank(score.score),
      rating: calculateRating(score.score, level),
    });
  }

  await sql`INSERT INTO music_rating ${sql(
    payload,
    "job_id",
    "title",
    "score",
    "difficulty",
    "rating_type",
    "music_order",
    "level",
    "rank",
    "rating",
  )}`;
}

export async function qman(
  page: Page,
  sql: Sql,
  jobId: number,
  lastPlayed: Date,
  tempFileLocation: string,
) {
  const result = (await page.evaluate(main)) as QmanData;

  await uploadMusic(sql, result.best, jobId, "best");
  await uploadMusic(sql, result.recent, jobId, "recent");
  await uploadMusic(sql, result.candidate, jobId, "selection");

  for (const score of result.score) {
    await sql`INSERT INTO chart_score (job_id, title, difficulty, score, fc, aj, clear_mark, full_chain, updated_at) VALUES (${jobId}, ${score.title}, ${toStdDifficulty(score.difficulty)}, ${score.score}, ${score.isFullCombo}, ${score.isAllJustice}, ${score.clearMark}, ${score.fullChain}, ${lastPlayed}) ON CONFLICT DO NOTHING`;
  }

  await Bun.write(tempFileLocation, JSON.stringify(result));
}
