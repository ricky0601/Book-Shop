// utils/auth.js (새로운 파일 생성)

const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

function ensureAuthorization(req, res, next) {
    try {
        let receivedJWT = req.headers["authorization"];
        if (!receivedJWT) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "인증 토큰이 없습니다."
            });
        }
        let decodedJWT = jwt.verify(receivedJWT, process.env.PRIVATE_KEY);
        console.log("decoded JWT : ", decodedJWT);
        req.user = decodedJWT; // decodedJWT를 req.user에 저장하여 다음 미들웨어에서 사용할 수 있도록 함
        next(); // 다음 미들웨어로 진행
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다."
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "서버 오류가 발생했습니다."
            });
        }
    }
}

module.exports = {
    ensureAuthorization,
};
