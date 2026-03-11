const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Variables d'environnement Netlify (configurées dans le dashboard)
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Réponse 401 générique (ne pas révéler la raison exacte du refus)
const RESPONSE_401 = {
  statusCode: 401,
  headers: {
    "WWW-Authenticate": 'Basic realm="Admin Restricted Area"',
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  },
  body: "<h1>401 — Acc&egrave;s non autoris&eacute;</h1>",
};

// Headers de sécurité ajoutés à toute réponse
const SECURITY_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
};

/**
 * Comparaison timing-safe de deux strings.
 * Empêche les timing attacks sur la vérification des credentials.
 */
function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Comparer avec un buffer de même longueur pour éviter le timing leak
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// Répertoire racine admin (résolu une seule fois)
const ADMIN_ROOT = path.resolve(__dirname, "..", "..", "admin");

exports.handler = async function (event) {
  // Guard : variables d'environnement obligatoires
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    console.error("ADMIN_USER ou ADMIN_PASSWORD non configuré.");
    return { statusCode: 500, body: "Internal Server Error" };
  }

  // Récupérer le header Authorization (Netlify normalise en minuscules)
  const authHeader = event.headers.authorization || "";

  if (!authHeader.startsWith("Basic ")) {
    return RESPONSE_401;
  }

  // Décoder les credentials Base64
  const base64Credentials = authHeader.split(" ")[1] || "";
  let credentials;
  try {
    credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  } catch (e) {
    return RESPONSE_401;
  }

  // Split sur le PREMIER ":" uniquement (le mot de passe peut contenir ":")
  const separatorIndex = credentials.indexOf(":");
  if (separatorIndex === -1) return RESPONSE_401;
  const user = credentials.substring(0, separatorIndex);
  const pwd = credentials.substring(separatorIndex + 1);

  // Vérification timing-safe
  const userMatch = safeCompare(user, ADMIN_USER);
  const pwdMatch = safeCompare(pwd, ADMIN_PASSWORD);
  if (!userMatch || !pwdMatch) {
    return RESPONSE_401;
  }

  // Authentifié : résoudre le fichier demandé depuis /admin/
  const requestPath = event.path
    .replace("/.netlify/functions/auth-admin", "")
    .replace(/^\/admin/, "") || "/index.html";
  const safePath = requestPath.startsWith("/") ? requestPath : "/" + requestPath;

  // Sécurité : résoudre le chemin absolu et vérifier qu'il reste dans ADMIN_ROOT
  const resolvedPath = path.resolve(ADMIN_ROOT, "." + safePath);
  if (!resolvedPath.startsWith(ADMIN_ROOT + path.sep) && resolvedPath !== ADMIN_ROOT) {
    return { statusCode: 403, headers: SECURITY_HEADERS, body: "Forbidden" };
  }

  // Déterminer le Content-Type
  const ext = path.extname(resolvedPath).toLowerCase();
  const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  try {
    const isBinary = [".png", ".jpg", ".jpeg", ".ico"].includes(ext);
    const fileContent = await fs.promises.readFile(resolvedPath, isBinary ? null : "utf-8");

    return {
      statusCode: 200,
      headers: { ...SECURITY_HEADERS, "Content-Type": contentType },
      body: isBinary ? fileContent.toString("base64") : fileContent,
      isBase64Encoded: isBinary,
    };
  } catch (err) {
    return {
      statusCode: 404,
      headers: { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=utf-8" },
      body: "<h1>404 — Fichier introuvable</h1>",
    };
  }
};
