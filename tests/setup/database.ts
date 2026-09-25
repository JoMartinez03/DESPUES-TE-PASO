const testDatabaseUrl = process.env.TEST_DATABASE_URL

if (testDatabaseUrl) {
  if (/neon\.tech/i.test(testDatabaseUrl)) {
    throw new Error(
      "TEST_DATABASE_URL apunta a Neon. Los tests de integración no pueden correr contra la base real.",
    )
  }
  process.env.DATABASE_URL = testDatabaseUrl
  process.env.DATABASE_URL_UNPOOLED = testDatabaseUrl
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgres://postgres:postgres@127.0.0.1:1/nunca-conectar"
}
