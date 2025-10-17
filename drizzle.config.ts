import type { Config } from "drizzle-kit"

export default {
  schema: "./src/utils/storage/schema.ts",
  out: "./drizzle",
  driver: "expo",
} satisfies Config

