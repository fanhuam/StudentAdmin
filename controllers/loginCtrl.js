const formidable = require('formidable'),
    Admin = require('../models/Admin');

/* 登录块 */
//渲染登录页:
exports.showLogin = function (req,res){
    if( req.session['s_id'] ){ //如果已经登陆过就不访问登录页   直接到首页根路径
        res.redirect('/');
        return;
    }

    //设置了ejs模板引擎 通过render渲染login时它就会自动到views目录下寻找名为login.ejs的模板文件进行渲染
    res.render('login');
}
//处理登录
exports.doLogin = function (req,res){
    let form = formidable();
    form.parse(req,(err,fields)=>{
        // console.log(fields);
         
        // fields   前台发送的数据    {username:'fanhua',password:'21351'}
        Admin.checkLogin(fields,function(data){
            console.log(data);
            if(data == 1){//如果登陆成功  中session
                req.session['s_id'] = fields.username;

            }
            res.send(`${data}`);//当字符串传
            // res.json(data); 
        })
    }) 
}


//验证用户是否存在 在admin文件里的  checkUser 的静态方法
exports.checkUser = function (req,res){
    let form = formidable();
    form.parse(req,(err,fields)=>{
        // console.log(fields);//fields前台发送的数据
        if(err){
            res.json({results:false});
            return;
        }
        Admin.checkUser(fields.username,function(val){
            // console.log(val);
            res.json({results:val.t});
        });
    });
}
/* 登录块 --end-- */


