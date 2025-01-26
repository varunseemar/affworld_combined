const express = require('express')
const TaskSchema = require('../schemas/task.schema')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

router.post('/Post',authMiddleware, async(req,res)=>{
    try{
        const {taskDetails, email} = req.body;
        const title = taskDetails.title;
        const description = taskDetails.description;
        if(!title || !description){
            return res.status(400).json("Please provide all the required fields");
        }
        const taskData ={
            title,
            description,
            creator: email,
        };
        const task = new TaskSchema(taskData);
        await task.save();
        res.status(200).send("Task Created Successfully");
    } 
    catch(error){
        throw new Error(error.message)
    }
});

router.get('/usertasks', async(req,res)=>{
    try{
        const {email} = req.query;
        if(!email){
            return res.status(400).json({
                message: "Email is required to retrieve tasks"
            });
        }
        const tasks = await TaskSchema.find({creator: email});
        if(tasks.length === 0){
            return res.status(404).json({message: "No tasks found for this creator"});
        }
        res.status(200).json(tasks);
    }
    catch(error){
        throw new Error(error.message)
    }
});

router.patch('/updateStatus', async(req,res)=>{
    try{
        const {taskId,newStatus} = req.body;
        const validStatuses = ['pending','todo','completed'];
        if(!validStatuses.includes(newStatus)){
            return res.status(400).json({message: 'Invalid status value'});
        }
        const updatedTask = await TaskSchema.findByIdAndUpdate(
            taskId,
            {status: newStatus},
            {new: true}
        );
        if(!updatedTask){
            return res.status(404).json({message: 'Task not found'});
        }
        res.status(200).json({message: 'Task status updated successfully'});
    }
    catch(error){
        throw new Error(error.message)
    }
});


router.delete('/Delete/:taskId', async(req,res)=>{
    try{
        const {taskId} = req.params;
        const task = await TaskSchema.findByIdAndDelete(taskId);
        if(!task){
            return res.status(404).json({message: "Task Not Found"});
        }
        res.status(200).send("Task deleted Successfully");
    }
    catch(error){
        throw new Error(error.message)
    }
});

module.exports = router;