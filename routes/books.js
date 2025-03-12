const express = require('express');
const router = express.Router();
router.use(express.json());
const { allBooks , bookDetail } = require("../controller/BookController");

router.get("/", allBooks);
router.get("/:bookId", bookDetail);

module.exports = router;
