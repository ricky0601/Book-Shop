const express = require('express');
const router = express.Router();
const {addLike , removeLike} = require("../controller/LikeController");
const { ensureAuthorization } = require('../utils/auth');


router.use(express.json());

router.post("/:bookId", ensureAuthorization, addLike);

router.delete("/:bookId", ensureAuthorization, removeLike);

module.exports = router;
