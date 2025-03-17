const express = require('express');
const router = express.Router();
router.use(express.json());

const { addToCart, getCartItems, removeCartItem} = require('../controller/CartController');

router.post("/", addToCart);

router.get("/", getCartItems);  // 선택된 id들이 req body로 같이 넘어오면 그때 선택된 장바구니 아이템 목록 조회

router.delete("/:id", removeCartItem);

module.exports = router;
