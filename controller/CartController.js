const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addToCart = (req, res) => {
    const {book_id, quantity, user_id} = req.body;

    const sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
    const values = [book_id, quantity, user_id];

    conn.query(sql, values, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.CREATED).json(results);
    })
};

const getCartItems = (req, res) => {
    const {user_id, selected} = req.body;

    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id = ?`;
    let values = [user_id];

    if(selected){
        sql += ` AND cartItems.id IN (?)`
        values.push(selected);
    }

    conn.query(sql, values, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results.length){
            return res.status(StatusCodes.OK).json(results);
        }else{
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })
};

const removeCartItem = (req, res) => {
    const {id} = req.params;

    const sql = "DELETE FROM cartItems WHERE id = ?;";

    conn.query(sql, parseInt(id), (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
}