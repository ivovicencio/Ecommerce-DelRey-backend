require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.use('/api/productos', require('./routes/producto.route'));
app.use('/api/pedidos', require('./routes/pedido.route'));

app.set('port', process.env.PORT || 3000);

sequelize.sync({ alter: true }).then(() => {
    console.log('Tablas sincronizadas en PostgreSQL');
    app.listen(app.get('port'), () => {
        console.log('Server started on port', app.get('port'));
    });
}).catch(err => {
    console.error('Error sincronizando la DB:', err);
});