const { ensureAuthorization } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req, res) => {
    const { category_id, check_new, limit, currentPage } = req.query;

    let offset = limit * (currentPage - 1);

    let sql = `SELECT SQL_CALC_FOUND_ROWS * , (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books`

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
        console.log(results);

        if (results.length) {
            // 도서 목록을 가져온 후, 전체 도서 개수를 가져오는 쿼리를 실행
            conn.query(`SELECT FOUND_ROWS() as totalBooks`, (err, countResult) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                const totalBooks = countResult[0].totalBooks;
                return res.status(StatusCodes.OK).json({
                    books: results,
                    pagination: {
                        currentPage: parseInt(currentPage),
                        totalCount: totalBooks,
                    }
                });
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });
};

const bookDetail = (req, res) => {

    // 로그인 상태가 아니면 liked 빼고 보내주기
    // 로그인 상태이면 liked 추가하고 보내주기
    const {bookId} = req.params;
        
    let authorization = ensureAuthorization(req, res);

    if(authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다. 다시 로그인 해주세요."
        });
    } else if(authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰입니다."
        });
    }else{
        let {bookId} = req.params;
        let values = [];
        
        let sql = `SELECT *,
            (SELECT COUNT(*) FROM likes WHERE liked_book_id=books.id) AS likes,
            (SELECT EXISTS(SELECT * FROM likes WHERE likes.user_id=? AND likes.liked_book_id=?)) AS liked`;
        values = [authorization.id, bookId];
        if(authorization instanceof ReferenceError){
            sql = `SELECT *,
            (SELECT COUNT(*) FROM likes WHERE liked_book_id=books.id) AS likes`;
            values = [];
        }
        sql+=` FROM books
            LEFT JOIN category
            ON books.category_id = category.category_id
            WHERE books.id = ?;`;
    
        console.log(sql);
        values.push(bookId);
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
    }
};

module.exports = {
    allBooks,
    bookDetail
};