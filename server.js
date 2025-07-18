const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const { validateProduct } = require('./middleware/validate');
const { NotFoundError } = require('./middleware/errors');

const app = express();
const port = 3000;

let products = [];

app.use(bodyParser.json());
app.use(logger);
app.use(auth);

// Routes
app.get('/', (req, res) => res.send('Hello World'));

app.get('/api/products', (req, res) => {
    const { category, page = 1, limit = 5, search } = req.query;
    let filtered = [...products];

    if (category) filtered = filtered.filter(p => p.category === category);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const start = (page - 1) * limit;
    const end = start + +limit;
    res.json(filtered.slice(start, end));
});

app.get('/api/products/:id', (req, res, next) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return next(new NotFoundError('Product not found'));
    res.json(product);
});

app.post('/api/products', validateProduct, (req, res) => {
    const product = { id: uuidv4(), ...req.body };
    products.push(product);
    res.status(201).json(product);
});

app.put('/api/products/:id', validateProduct, (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});

app.delete('/api/products/:id', (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    products.splice(index, 1);
    res.status(204).send();
});

app.get('/api/statistics', (req, res) => {
    const stats = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    res.json(stats);
});

app.use(require('./middleware/errorHandler'));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));