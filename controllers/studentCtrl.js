const Student = require('../models/Student');
const Admin = require('../models/Admin');
const formidable = require('formidable');
const nodeXlsx = require('node-xlsx');

//渲染首页( 包含管理员信息)
exports.showIndex = function(req,res){ 
    //调用Admin身上的发方法  找req.session.s_id这个用户的信息   adminR是json用户信息
    Admin.checkUser(req.session.s_id,function(adminR){  
            res.render('index',{
                adminData:adminR,   //用户信息 
            }) 

    }) 
}


//访问几口获取学生某一页的数据
exports.showList = function(req,res){
    //给前台渲染学生数据 ( 那一页的数据 ，回调) 
    let page = req.query.page? req.query.page : 1;//获取页数

    Student.findPageData(page,function(results){
        res.json(results);
    });

}


//修改学生
exports.updateStudent = function(req,res){
    let xueid = req.params.xueid;
    let form = formidable();
    form.parse(req,(err,fields)=>{
        // console.log(fields);//{ name: ' 江南车王as', sex: ' 男 ', age: '111' }
        Student.changeStudent(xueid,fields,(results)=>{
            res.json({error:results});
        });
    }) 
}


//学生姓名模糊搜索学生
exports.searchStudent = function(req,res){
    // console.log(req.query);
    let search = req.query.search;
    Student.findStudentNames(search,(results)=>{
        res.json(results);
    })
    
}

 
//处理学生数据导出
exports.exportStudentToExcel = function(req,res){
    Student.exportExcel((data)=>{
        res.send(data);        
    })
}


//访问增加学生数据 
exports.showAddStudent = function (req,res){
    // 调用Admin身上的发方法  找req.session.s_id这个用户的信息   adminR是json用户信息
    Admin.checkUser(req.session.s_id,function(adminR){  
        res.render('addStudent',{
            adminData:adminR,   //用户信息 
        })
    }) 
    // res.render('addStudent')
}



//访问接口处理增加学生
exports.addStudent = function (req,res){ 
    let form = formidable();

    form.parse(req,(err,fields)=>{
        // console.log(fields);
        Student.saveStudent(fields,(results)=>{
            // console.log(results);
            res.json(results);
        });
    });
    
}

 

//访问接口处理删除学生
exports.deleteStudent = function (req,res){
    let xueid = req.params.xueid; 
    
    Student.deleteStudent(xueid,(results)=>{
        res.json(results);
    });
}
    