const express = require('express');
const router = express.Router();
router.use(express.json());

router.post("/join",(req, res) => {
    res.status(201).json({
        message : "회원가입 성공"
    })
});

router.post("/login",(req, res) => {
    res.status(200).json({
        message : "로그인 성공"
    })
});

router.post("/reset",(req, res) => {
    res.status(200).json({
        message : "비밀번호 초기화 요청 성공"
    })
});

router.put("/reset",(req, res) => {
    res.status(200).json({
        message : "비밀번호 초기화 성공"
    })
});

module.exports = router;
