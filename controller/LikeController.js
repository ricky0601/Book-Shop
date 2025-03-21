// controller/LikeController.js (수정)

const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const { ensureAuthorization } = require('../utils/auth'); // 모듈 import

const addLike = (req, res) => {
    const {bookId} = req.params;
    const userId = req.user.id; // ensureAuthorization에서 저장한 user 정보 사용

    const sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
    const values = [userId, bookId];

    conn.query(sql, values, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
};

const removeLike = (req, res) => {
    const {bookId} = req.params;
    const userId = req.user.id;

    const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
    const values = [userId, bookId];

    conn.query(sql, values, (err, results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
};

module.exports = {
    addLike,
    removeLike
};
