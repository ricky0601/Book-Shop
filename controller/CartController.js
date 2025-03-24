const { ensureAuthorization } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addToCart = (req, res) => {
    const {book_id, quantity} = req.body;
    
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
        const sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
        const values = [book_id, quantity, authorization.id];
    
        conn.query(sql, values, (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
    
            return res.status(StatusCodes.CREATED).json(results);
        })
    }
};

const getCartItems = (req, res) => {
    const {selected} = req.body;
    
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
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                    FROM cartItems LEFT JOIN books 
                    ON cartItems.book_id = books.id
                    WHERE user_id = ?`;
        let values = [authorization.id];
    
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
    }
};

const removeCartItem = (req, res) => {
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
        const cartItemId = req.params.id;
    
        const sql = "DELETE FROM cartItems WHERE id = ?;";
    
        conn.query(sql, parseInt(cartItemId), (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
    
            return res.status(StatusCodes.OK).json(results);
        })
    }
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
}
