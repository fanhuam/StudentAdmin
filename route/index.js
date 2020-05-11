const express = require('express'),
        {
            showLogin,
            doLogin,
            checkUser
        } = require('../controllers/loginCtrl'),
        {
            showIndex: sI,
            showList: sL,
            searchStudent: sS,
            exportStudentToExcel: eSTE,
            showAddStudent: sAS ,
            addStudent: aS,
            updateStudent: uS,
            deleteStudent: dS 
        } = require('../controllers/studentCtrl'),
        {logout} = require('../controllers/Logout');

let router = express.Router();

//登录验证      验证如果没有登陆过不能访问管理界面的内容
router.use((req,res,next)=>{ 
    if( !req.session['s_id'] && req.url != '/login'){//如果session里面没有s_id 说明没有登陆过
        res.redirect('/login');
        return;
    }
    next();
})
//路径清单:
router.get('/login',showLogin); //访问登录页面
router.post('/login',doLogin); //访问登录接口 处理登录操作
router.propfind('/login',checkUser); //访问接口 验证用户名是否存在

router.get('/',sI);//访问首页
router.get('/student/msg',sL);//访问接口处理学生数据
router.get('/student/:search',sS);//访问接口  处理搜索学生
router.get('/exportExcel',eSTE);//学生数据导出Excel
router.get('/addStudent',sAS);//访问增加学生页面
router.put('/student/addStudent',aS);//处理增加学生
router.post('/student/:xueid',uS);//访问接口 处理修改学生数据
router.delete('/student/:xueid',dS);//删除学生数据

//退出接口
router.get('/Logout',logout);


module.exports = router;

