//处理路由访问
const express = require('express');

let router = express.Router();

router.get('/',(req,res)=>{
    res.send('登录');
})
//路由请求: /mine 
router.get('/out',(req,res)=>{
    res.send('退出');
})
    

module.exports = router;