import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const dbUrl = process.env.DATABASE_URL || "file:./local.db";
const authToken = process.env.DATABASE_AUTH_TOKEN || "dummy-token";

const turso = createClient({
  url: dbUrl,
  authToken,
});

export const db = drizzle(turso);
