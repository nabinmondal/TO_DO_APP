const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/userSchemajs');
exports.changePassword =  async(req,res)=>{
    const {token , newPassword} = req.body;
    if(!newPassword || typeof(newPassword) !== 'string'){
        return res.json({
            status : 'error',
            error : "Invalid password"
        })
    }
    if(newPassword.length <=5){
        return res.json({
            status :  'error',
            error : "Password too small,  the minimum length should be atleast 6"
        })
    }
    try{
        const user = jwt.verify(token, JWT_SECRET);
        const _id = user.id;
        const hash = await bcrypt.hash(newPassword , 10);
        const result = await users.updateOne(
            { _id },
            {
                $set: {password : hash}
            }
        ).lean();
        res.json({
            status: 'ok',
            data  : result
        }) 
    }catch(error){
        res.json({
            status : 'error',
            error : 'token not verified correctly'
        })
    }
}
exports.registerUser = async (req,res)=>{
    const {username , password} = req.body;
    if( !username || typeof(username)!== 'string'){
        return res.json({
            status : 'error',
            error : 'invalid username'
        })
    }
    if( !password || typeof(password)!=='string'){
        return res.json({
            status : 'error',
            error : 'invalid password'
        })
    }
    if(password.length < 5){
        return res.json({
            status  : 'error',
            error : 'password too small , the length should be atleast 6 characters'
        })
    }
    const hash = await bcrypt.hash(password, 10);   
    try{
        const result = await users.create({
            username : username,
            password : hash
        })
        console.log(result);
        res.json({
            status : 'ok',
            message : 'the user created successfully'
        })            
    }catch(err){
        if(err.code === 11000){
            return res.json({
                status : 'error',
                error : 'username already exists'
            })
        }
        throw err;   
    }
}
exports.loginUser = async(req,res)=>{
    const {username , password} = req.body;
    try{
    const result = await users.findOne({username}).lean();
    console.log(result);
    if(!result){
        return res.json({
            status : 'error',
            error : 'wrong username/password'
        })
    }
    if(await bcrypt.compare(password,result.password)==true){
        const token = jwt.sign(
            {
                id : result._id,
                username : result.username
            },
            process.env.JWT_SECRET
        )
        res.json({
            status : 'ok',
            data : token
        })
    }
    else{
        return res.json({
           status : 'error',
            error : 'invalid userame/password'
        })
    }
    }catch(error){
        console.log(JSON.stringify(error));
        return res.json({
            status : "error",
            error
        })
    }
}
