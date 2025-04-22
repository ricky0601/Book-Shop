const express = require('express');
const app = express();
const cors = require("cors");

const dotenv = require('dotenv').config();
const port = process.env.PORT;

console.log(port);

const corsOptions = {
    origin: "http://localhost:3000", // 프론트엔드 주소
    credentials: true,
};
app.use(cors(corsOptions));

app.listen(port);

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/categories');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
