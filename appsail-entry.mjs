if (process.env.X_ZOHO_CATALYST_LISTEN_PORT) {
  process.env.PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT;
}

await import("./app.js");
