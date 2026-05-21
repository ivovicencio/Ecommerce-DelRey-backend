require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { sequelize } = require('./database');

const app = express();

const isProd = process.env.NODE_ENV === 'production';

if (isProd && !process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET no está configurado en producción.');
  process.exit(1);
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: '0', msg: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: '0', msg: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' }
});
app.use(['/api/auth/login', '/api/auth/register'], authLimiter);

app.use(cors({
  origin: isProd
    ? (process.env.FRONTEND_URL || 'https://delrey.up.railway.app')
    : ['http://localhost:4200', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/productos', require('./routes/producto.route'));
app.use('/api/pedidos', require('./routes/pedido.route'));
app.use('/api/contacto', require('./routes/contacto.route'));
app.use('/api/contador', require('./routes/contador.route'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/seed-productos', async (req, res) => {
  try {
    const { Producto } = require('./database');
    const count = await Producto.count();
    if (count > 0) return res.json({ msg: `Ya existen ${count} productos.` });
    const productos = require('./scripts/productos-data');
    for (const p of productos) { await Producto.create(p); }
    res.json({ msg: `${productos.length} productos creados.` });
  } catch (e) { res.status(500).json({ msg: 'Error: ' + e.message }); }
});

if (isProd) {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return;
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.set('trust proxy', 1);
app.set('port', process.env.PORT || 3000);

sequelize.sync({ alter: true }).then(() => {
    console.log('Tablas sincronizadas en PostgreSQL');
    app.listen(app.get('port'), () => {
        console.log(`Servidor ${isProd ? 'PRODUCCIÓN' : 'DESARROLLO'} en puerto ${app.get('port')}`);
    });
}).catch(err => {
    console.error('Error sincronizando la DB:', err);
});
