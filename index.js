require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database');

const app = express();

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/productos', require('./routes/producto.route'));
app.use('/api/pedidos', require('./routes/pedido.route'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.set('port', process.env.PORT || 3000);

sequelize.sync({ alter: true }).then(() => {
    console.log('Tablas sincronizadas en PostgreSQL');
    app.listen(app.get('port'), () => {
        console.log('Server started on port', app.get('port'));
    });
}).catch(err => {
    console.error('Error sincronizando la DB:', err);
});
