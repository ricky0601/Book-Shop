const express = require('express');
const router = express.Router();
const { addToCart, getCartItems, removeCartItem} = require('../controller/CartController');
const { ensureAuthorization } = require('../utils/auth');

router.use(express.json());

router.post("/", ensureAuthorization, addToCart);

router.get("/", ensureAuthorization, getCartItems);  // 선택된 id들이 req body로 같이 넘어오면 그때 선택된 장바구니 아이템 목록 조회

router.delete("/:id", ensureAuthorization, removeCartItem);

module.exports = router;
