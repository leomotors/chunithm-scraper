import { z } from "zod";

const environmentSchema = z.object({
  USERNAME: z.string(),
  PASSWORD: z.string(),
  DATABASE_URL: z.string(),
  VERSION: z.string(),
  DISCORD_TOKEN: z.string(),
  CHANNEL_ID: z.string(),
});

export const environment = environmentSchema.parse(process.env);
