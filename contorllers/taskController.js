const jwt = require('jsonwebtoken');
const tasks = require('../models/taskSchema'); 

exports.createTask = async (req,res)=>{
   // const token = req.params.token;
    const {token,task} = req.body;
   // console.log(token);
    try{
        const user = await jwt.verify(token,process.env.JWT_SECRET);
        const userId = user.username;
        const result =  await tasks.create({
            userId,
            task
        })
        return res.json({
            status : 'ok',
            data : result
        })
    }
    catch(error){
        console.log(error);
        return res.json({
            status : 'error',
            error : 'token signature not mathced'
        })
    }   
}
exports.getTasks = async (req,res)=>{
    const token = req.params.token;
   // console.log(token);
    try{
        const user = await jwt.verify(token,process.env.JWT_SECRET);
        const userId = user.username;
        const result = await tasks.find({userId})
        if(result.length == 0 ){
            return res.json({
                status : 'error',
                error : 'no records found'
            })
        }
        else{
            return res.json({
                status : 'ok',
                data : result,
                count : result.length
            })
        }
    }catch(error){
        console.log(JSON.stringify(error));
        return res.json({
            status : 'error',
            error : 'token signature is not matched'
        })
    }

}
exports.deleteTask =  async (req,res)=>{
    //const token  = req.params.token;
    const {token,_id} = req.body;
    try{
        const user = await jwt.verify(token,process.env.JWT_SECRET);
        const result = await tasks.deleteOne({ 
            userId : user.username,
            _id
        });
        if(result.deletedCount == 0){
            return res.json({
                status : "error",
                error: "the item not found to delete"
            })
        }
        return res.json({
            status : "ok",
            data : result
        })
    }catch(error){
        console.log(JSON.stringify(error));
        return res.json({
            status : 'error',
            error : JSON.stringify(error)
        })
    } 
}
exports.updateTask = async (req,res)=>{
    console.log(req.body);
    const {token,_id, task} = req.body;
    try{
        const user = await jwt.verify(token,process.env.JWT_SECRET);
        const result = await tasks.updateOne({
            userId : user.username,
            _id
        },
        {
            $set : {task}
        })
        if(result.modifiedCount == 0){
            return res.json({
                status : "error",
                error : "Not found the task"
            })
        }
        else{
             return res.json({
                status : 'ok',
                data : result
            })
        }
    }catch(error){
        console.log(JSON.stringify(error));
        return res.json({
            status : "error",
            error : error
        })
    }
}