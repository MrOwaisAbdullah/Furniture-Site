import { neon as neonHttp } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./neon/schema"

const sql = neonHttp(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
