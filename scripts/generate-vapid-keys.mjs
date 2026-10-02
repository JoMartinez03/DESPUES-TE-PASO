import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpush from "web-push";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// El subject es un contacto real del servicio push: `mailto:` o una URL https.
// Safari rechaza el push si apunta a https://localhost.
const SUBJECT = process.env.VAPID_SUBJECT ?? "mailto:admin@despuestepaso.app";

/**
 * Genera un par de claves VAPID. Se generan UNA sola vez y se reutilizan para
 * siempre: si se regeneran, las suscripciones existentes quedan inservibles y
 * hay que volver a suscribir cada dispositivo.
 *
 * Con --write agrega las tres variables a .env (que está gitignored) solo si
 * todavía no están.
 */
const keys = webpush.generateVAPIDKeys();

console.log("Agregá estas variables a tu .env y a Vercel:\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_SUBJECT="${SUBJECT}"`);
console.log("\nLa clave privada no puede viajar al navegador: solo el servidor la usa.");

if (!process.argv.includes("--write")) {
  console.log("\n(Corré `npm run vapid:keys -- --write` para escribirlas en .env)");
  process.exit(0);
}

const envPath = path.join(ROOT, ".env");
const envPathLocal = path.join(ROOT, ".env.local");

for (const target of [envPath, envPathLocal]) {
  let current = "";
  try {
    current = await readFile(target, "utf8");
  } catch {
    // El archivo todavia no existe: se crea con solo el bloque de push.
  }

  const block = [
    "",
    "# Web Push (VAPID)",
    `NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`,
    `VAPID_PRIVATE_KEY=${keys.privateKey}`,
    `VAPID_SUBJECT="${SUBJECT}"`,
    "",
  ].join("\n");

  if (current.includes("VAPID_PRIVATE_KEY=")) {
    console.log(`\n${path.basename(target)} ya tiene claves VAPID: no se tocaron.`);
    continue;
  }

  await appendFile(target, block, "utf8");
  console.log(`\nClaves escritas en ${path.basename(target)}.`);
}