import { JSDOM } from "jsdom";
import { Page } from "playwright";
import { Sql } from "postgres";

import {
  parseCurrentCurrency,
  parseCurrentRating,
  parseHonorText,
  parseLastPlayed,
  parseMaxRating,
  parseOverpower,
  parsePlayCount,
  parsePlayerLevel,
  parsePlayerName,
  parseTeamName,
  parseTotalCurrency,
} from "../parser/playerData.js";

export async function playerData(page: Page, sql: Sql, jobId: number) {
  const rightData = page.locator(".player_data_right");
  const rightDataHTML = await rightData.innerHTML();
  const rightDataDom = new JSDOM(rightDataHTML);

  const bottomData = page.locator(".w420.box01");
  const bottomDataHTML = await bottomData.innerHTML();
  const bottomDataDom = new JSDOM(bottomDataHTML);

  const currentRating = parseCurrentRating(rightDataDom);
  const maxRating = parseMaxRating(rightDataDom);
  const overpower = parseOverpower(rightDataDom);
  const lastPlayed = parseLastPlayed(rightDataDom);
  const currentCurrency = parseCurrentCurrency(bottomDataDom);
  const totalCurrency = parseTotalCurrency(bottomDataDom);
  const playCount = parsePlayCount(bottomDataDom);

  const playerLevel = parsePlayerLevel(rightDataDom);
  const playerName = parsePlayerName(rightDataDom);
  const teamName = parseTeamName(rightDataDom);
  const honorText = parseHonorText(rightDataDom);

  await sql`INSERT INTO player_data (
    job_id,
    current_rating,
    max_rating,
    overpower_value,
    overpower_percent,
    last_played,
    current_currency,
    total_currency,
    play_count,
    right_html_raw,
    bottom_html_raw,
    player_level,
    player_name,
    team_name,
    honor_text
  )
  VALUES (
    ${jobId},
    ${currentRating},
    ${maxRating},
    ${overpower.value},
    ${overpower.percent},
    ${lastPlayed},
    ${currentCurrency},
    ${totalCurrency},
    ${playCount},
    ${rightDataHTML},
    ${bottomDataHTML},
    ${playerLevel},
    ${playerName},
    ${teamName},
    ${honorText}
  )`;

  return lastPlayed;
}
