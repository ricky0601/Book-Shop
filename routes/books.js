const express = require('express');
const router = express.Router();
router.use(express.json());

router.get("/",(req, res) => {
    res.status(200).json({
        message : "전제 도서 조회 성공"
    })
});

router.get("/:bookId",(req, res) => {
    const bookId = req.params.bookId;

    res.status(200).json({
        bookId : bookId,
        message : "개별 도서 조회 성공"
    })
});

router.get("/",(req, res) => {
    const categoryId = req.query.categoryId;
    const checkNew = req.query.new;

    res.status(200).json({
        message : "카테고리별 조회 성공"
    })
});

module.exports = router;
