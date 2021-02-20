const express = require("express");
const cartItems = require('./cart-items')

const app = express();
app.use(express.json());

const port = 3000;

app.use('/cart-items', cartItems);

app.listen(port, () => console.log(`Listening on port ${port}.`));

