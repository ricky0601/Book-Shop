const { ensureAuthorization } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const conn = require('../mariadb'); 
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {

    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        port: 3306,
        dateStrings: true,
    });
    
    let authorization = ensureAuthorization(req, res);
        
    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다. 다시 로그인 해주세요."
        });
    } else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    } else{
        const {items, delivery, totalQuantity, totalPrice, firstBookTitle} = req.body;

        // delivery 테이블 넣기
        let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
        let values = [delivery.address, delivery.receiver, delivery.contact];

        let [results] = await conn.execute(sql, values);

        let delivery_id = results.insertId;

        // orders 테이블 넣기
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
                    VALUES (?, ?, ?, ?, ?);`
        values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, delivery_id];

        [results] = await conn.execute(sql, values);
        let order_id = results.insertId;

        // items 를 가지고 장바구니에서 book_id, quantity 꺼내기
        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        let [orderItems, fields] = await conn.query(sql, [items]);

        // orderedBook 데이터 넣기
        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;

        values = [];
        orderItems.forEach((item) => {
            values.push([order_id, item.book_id, item.quantity]);
        });

        results = await conn.query(sql, [values]);

        let result = await deleteCartItems(conn, [items]);

        return res.status(StatusCodes.OK).json(result);
    }
};

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;

    let result = await conn.query(sql, items);
    return result;
}

const getOrders = (req, res) => {
    let authorization = ensureAuthorization(req, res);

    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다. 다시 로그인 해주세요."
        });
    } else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    } else{
        const sql = `SELECT orders.id, created_at, address, receiver, contact,
                book_title, total_quantity, total_price
                FROM orders LEFT JOIN delivery
                ON orders.delivery_id = delivery.id
                WHERE orders.user_id = ?;
                `;

        conn.query(sql, authorization.id, (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
    }
};

const getOrderDetail = (req, res) => {
    let authorization = ensureAuthorization(req, res);
    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다. 다시 로그인 해주세요."
        });
    } else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    } else{
        const {orderId} = req.params;
    
        let sql = `SELECT book_id, books.title AS book_title, author, price, quantity
                    FROM orderedBook LEFT JOIN books
                    ON orderedBook.book_id = books.id
                    WHERE order_id = ?;`;
    
        conn.query(sql, orderId, (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
    }
};

module.exports = {
    order,
    getOrders,
    getOrderDetail
};