// api/index.js
const express = require('express');
const app = express();
const serverless = require('serverless-http'); // <--- IMPORTANTE

app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API funcionando desde Vercel 🚀');
});

// Exportar para serverless
module.exports = app;
module.exports.handler = serverless(app); 