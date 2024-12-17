import postgres from "postgres";

import { environment } from "../src/environment.js";
import { StdChartDifficulty } from "../src/types.js";

const dataUrl = "https://dp4p6x0xfi5o9.cloudfront.net/chunithm/data.json";

console.log("Fetching Chart Data");

const data = await fetch(dataUrl).then((res) => res.json());
const songs = data.songs;

const payload = [] as Array<{
  title: string;
  difficulty: StdChartDifficulty;
  version: string;
  level: number;
}>;

for (const song of songs) {
  for (const sheet of song.sheets) {
    if (sheet.type !== "std") {
      continue;
    }

    payload.push({
      title: song.title,
      difficulty: sheet.difficulty,
      version: environment.VERSION,
      level: sheet.internalLevelValue,
    });
  }
}

const sql = postgres(environment.DATABASE_URL);

await sql`INSERT INTO chart_constant ${sql(payload, "title", "difficulty", "version", "level")} ON CONFLICT (title, difficulty, version) DO UPDATE SET level = EXCLUDED.level`;

await sql.end();

export {};
