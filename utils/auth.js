const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const ensureAuthorization = (req, res) => {
    try{
        let receivedJWT = req.headers["authorization"];
        console.log("received JWT : ", receivedJWT);

        if(receivedJWT){
            let decodedJWT = jwt.verify(receivedJWT, process.env.PRIVATE_KEY);
            console.log(decodedJWT);

            return decodedJWT;
        }else{
            throw new ReferenceError("JWT not found");
        }
    }catch(err){
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = {
    ensureAuthorization
}