import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { auth } from "../src/lib/auth"

async function main() {
  console.log("Testing BetterAuth signIn...")

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: "mrowaisabdullah@gmail.com",
        password: "Admin123!",
      },
    })
    console.log("SUCCESS:", JSON.stringify(result, null, 2))
  } catch (err: any) {
    console.error("ERROR:", err.message)
    console.error("FULL:", err)
  }

  process.exit(0)
}

main()
