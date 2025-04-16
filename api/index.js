// api/index.js
const express = require('express');
const serverless = require('serverless-http'); // <--- IMPORTANTE

const app = express();
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API funcionando desde Vercel 🚀');
});

// Solo esta exportación
module.exports = serverless(app);
