const { response } = require('express');
const express = require('express');
const cartItems = express.Router();

const pool = require ('./pg-connection-pool');

cartItems.get('/', (req, res) => {

    const maxPrice = req.query.maxPrice;
    const prefix = req.query.prefix;
    const pageSize = req.query.pageSize;


    if(maxPrice){

        pool.query('SELECT * FROM shopping_cart WHERE price <= $1', [maxPrice]).then( (results) =>{
            res.json(results.rows);
        })

    }else if(prefix){

        const searchTerm = prefix + '%';
        console.log(searchTerm);

        pool.query('SELECT * FROM shopping_cart WHERE product LIKE $1', [searchTerm]).then ( (results) => {
            res.json(results.rows);
        });

    }else if(pageSize){

        pool.query('SELECT * FROM shopping_cart LIMIT $1', [pageSize]).then( (results) =>{
            res.json(results.rows);
        })
        
    }else{
        pool.query('SELECT * FROM shopping_cart').then( (results) => {
            res.json(results.rows);
        })
        
    }
})

cartItems.get('/:id', (req, res) => {
    
    const id = parseInt(req.params.id);
  
    pool.query('SELECT * FROM shopping_cart WHERE id = $1', [id]).then( (results) => {
        const items = results.rows;

        if(!items.length){
            res.status(404).send('Item Not Found'); 
        }else{
            res.status(200);
            res.json(items);
        }

    });
})

cartItems.post("/", (req, res) => {

    let addItem = req.body;

    console.log(addItem.product);

    pool.query('INSERT INTO shopping_cart (product, price, quantity) VALUES( $1, $2, $3 )', [
        addItem.product,
        addItem.price,
        addItem.quantity
    ]).then( () =>{
        res.status(201);
        res.json(addItem);
    });
   
});

cartItems.put("/:id", (req, res) => {

    const id = req.params.id;
    const updateItem = req.body;

    pool.query('UPDATE shopping_cart SET product = $1, price = $2, quantity = $3 WHERE id = $4', [
        req.body.product,
        req.body.price,
        req.body.quantity,
        id
    ]).then( () => {

        res.status(200);
        res.json(updateItem);

    });
});

cartItems.delete("/:id", (req, res) => { 

    const id = req.params.id;

   pool.query('DELETE FROM shopping_cart WHERE id= $1', [id]).then( () =>{
       res.json(204);
       res.json();
   })
});


module.exports = cartItems;