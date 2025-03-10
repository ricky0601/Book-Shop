const express = require('express');
const router = express.Router();
router.use(express.json());

router.post("/",(req, res) => {
    res.status(201).json({
        message : "장바구니 담기 성공"
    })
});

router.get("/",(req, res) => {
    res.status(200).json({
        message : "장바구니 조회 성공"
    })
});

router.delete("/:bookId",(req, res) => {
    const bookId = req.params.bookId;

    res.status(200).json({
        bookId : bookId,
        message : "장바구니 도서 삭제 성공"
    })
});

router.get("/",(req, res) => {
    res.status(200).json({
        message : "(장바구니에서 선택한) 주문 예상 상품 목록 조회 성공"
    })
});

module.exports = router;
