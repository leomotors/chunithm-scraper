import { chromium } from "playwright";
import postgres from "postgres";

import { environment } from "./environment.js";
import { login } from "./steps/1-login.js";
import { playerData } from "./steps/2-playerdata.js";
import { qman } from "./steps/3-qman.js";
import { genImage } from "./steps/4-genimage.js";

const sql = postgres(environment.DATABASE_URL);

const jobId = (
  await sql`INSERT INTO job (timestamp) VALUES (NOW()) RETURNING id`
)[0].id as number;

console.log(`Created job with ID: ${jobId}`);

const start = performance.now();

const browser = await chromium.launch({
  headless: !process.env.DEBUG,
  args: ["--disable-blink-features=AutomationControlled", "--start-maximized"],
});

const page = await browser.newPage();

// * Step 1: Login
await login(page);
await page.getByRole("link", { name: "PLAYER DATA" }).click();
await page.waitForURL("https://chunithm-net-eng.com/mobile/home/playerData");

const step1Time = performance.now();
console.log(`Step 1 Completed: Took ${Math.round(step1Time - start)}ms`);

// * Step 2: Player Data
const lastPlayed = await playerData(page, sql, jobId);

const step2Time = performance.now();
console.log(`Step 2 Completed: Took ${Math.round(step2Time - step1Time)}ms`);

// * Step 3: Qman
const tempFileLocation = "./temp.json";
await qman(page, sql, jobId, lastPlayed, tempFileLocation);

const step3Time = performance.now();
console.log(`Step 3 Completed: Took ${Math.round(step3Time - step2Time)}ms`);

// * Step 4: Generate Image
await genImage(page, tempFileLocation);

const step4Time = performance.now();
console.log(`Step 4 Completed: Took ${Math.round(step4Time - step3Time)}ms`);

await sql.end();
await browser.close();
