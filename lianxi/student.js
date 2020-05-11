//处理路由访问
const express = require('express');

let student = express.Student();

student.get('/',(req,res)=>{
    res.send('学生');
}) 

student.get('/add',(req,res)=>{
    res.send('添加');
})
   
student.get('/:sid',(req,res)=>{
    res.json(req.params.sid);
})

module.exports = student;