const smokeDatabaseUrl = process.env.SMOKE_DATABASE_URL
const testDatabaseUrl = process.env.TEST_DATABASE_URL

if (smokeDatabaseUrl) {
  // Modo smoke: la suite borra SOLO los registros que crea, por id. Nunca hace
  // TRUNCATE, así que puede correr contra la base real sin tocar datos ajenos.
  process.env.DATABASE_URL = smokeDatabaseUrl
  process.env.DATABASE_URL_UNPOOLED = smokeDatabaseUrl
} else if (testDatabaseUrl) {
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
