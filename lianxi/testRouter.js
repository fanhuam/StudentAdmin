const express = require('express');
const router = require('./index');
const student = require('./student');

var app = express();

//处理路由 
app.use('/login',router);

app.use('/student',student);


app.listen(3000);