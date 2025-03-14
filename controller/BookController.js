const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req, res) => {
    const { category_id, check_new, limit, currentPage } = req.query;

    let offset = limit * (currentPage - 1);

    let sql = `SELECT * , (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books`

    let values =[];

    if (category_id && check_new){
        sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values = [category_id];
    }
    else if(category_id){
        sql += ` WHERE category_id=?`;
        values = [category_id];
    }else if(check_new){
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }
    sql += ` LIMIT ? OFFSET ?`

    values.push(parseInt(limit) , offset);

    conn.query(sql, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        };

        if(results.length){
            return res.status(StatusCodes.OK).json(results);
        }else{
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });
};

const bookDetail = (req, res) => {
    const {bookId} = req.params;
    const {userId} = req.body;

    let sql = `SELECT *,
	                (SELECT COUNT(*) FROM likes WHERE liked_book_id=books.id) AS likes,
	                (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id=? AND likes.liked_book_id=?)) AS liked
                FROM books
                LEFT JOIN category
	            ON books.category_id = category.category_id
	            WHERE books.id = ?;`;

    const values = [userId, bookId, bookId];
    conn.query(sql, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        };

        if(results[0]){
            return res.status(StatusCodes.OK).json(results[0]);
        }else{
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });
};

module.exports = {
    allBooks,
    bookDetail
};