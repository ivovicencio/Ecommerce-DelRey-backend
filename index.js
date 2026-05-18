require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./database');

const app = express();

const isProd = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProd ? process.env.FRONTEND_URL || true : ['http://localhost:4200', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/productos', require('./routes/producto.route'));
app.use('/api/pedidos', require('./routes/pedido.route'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

if (isProd) {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return;
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.set('port', process.env.PORT || 3000);

sequelize.sync({ alter: true }).then(() => {
    console.log('Tablas sincronizadas en PostgreSQL');
    app.listen(app.get('port'), () => {
        console.log(`Servidor ${isProd ? 'PRODUCCIÓN' : 'DESARROLLO'} en puerto ${app.get('port')}`);
    });
}).catch(err => {
    console.error('Error sincronizando la DB:', err);
});
