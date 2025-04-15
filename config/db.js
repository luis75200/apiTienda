const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado:', conn.connection.host);
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err);
    process.exit(1);  // Termina el proceso si no se puede conectar
  }
};

module.exports = connectDB;
