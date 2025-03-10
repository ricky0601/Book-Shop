const express = require('express');
const router = express.Router();
router.use(express.json());

router.post("/",(req, res) => {
    res.status(200).json({
        message : "결제하기 성공"
    })
});

router.get("/",(req, res) => {
    res.status(200).json({
        message : "주문 목록(내역) 조회 성공"
    })
});

router.post("/:orderId",(req, res) => {
    const orderId = req.params.orderId;
    
    res.status(200).json({
        orderId : orderId,
        message : "주문 상세 상품 조회 성공"
    })
});

module.exports = router;
