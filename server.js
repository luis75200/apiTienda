const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");  // Esta es la función que se conecta a MongoDB.

dotenv.config();
connectDB();  // Llamada para conectar a MongoDB.

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/productos", require("./routes/productos"));
app.use("/api/ventas", require("./routes/ventas"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/categorias", require("./routes/categorias"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
