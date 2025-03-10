const express = require('express');
const router = express.Router();
router.use(express.json());

router.post("/:bookId",(req, res) => {
    const bookId = req.params.bookId;
    res.status(200).json({
        bookId : bookId,
        message : "좋아요 추가 성공"
    })
});

router.delete("/:bookId",(req, res) => {
    const bookId = req.params.bookId;
    res.status(200).json({
        bookId : bookId,
        message : "좋아요 취소 성공"
    })
});
module.exports = router;
