const { sign, verify } = require("jsonwebtoken");
const {User} = require("../models");

const createTokens = (user) => {
  const accessToken = sign({ email: user.email, id: user.id, name: user.name }, process.env.TOKEN_SECRET);
  return accessToken;
};

const validateToken = (req,res,next)=>{
    //console.log("req",req);
    const accessToken = req.headers["access-token"] || req.query["access-token"];
    if(!accessToken) return res.status(400).json({error: "user not Authenticated"});

    try{
        const validToken = verify(accessToken, process.env.TOKEN_SECRET)
        if(validToken){
            User.findByPk(validToken.id).then(user =>{
                req.user = user;
                req.authenticated = true
                return next();
            })
           
        }
    }catch(err){
        return res.status(400).json({error:err});
    }
}
module.exports = {createTokens, validateToken};