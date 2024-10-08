require('dotenv').config();
const express = require('express')
const cors = require('cors');
const routes = require('./routes');
const sequelize = require('./config/database.js');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173' 
}));
app.use(express.json());

app.use('/', routes);

const port = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente.');
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  })
  .catch(err => {
    console.error('No se puede conectar a la base de datos:', err);
  });