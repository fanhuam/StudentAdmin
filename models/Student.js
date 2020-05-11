const mongoose = require('mongoose');
const nodeXlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs');
    
var db = mongoose.connection;  // 获取数据库的连接对象。
db.once('open', function (callback) {
    console.log("数据库成功打开");
});


//1.声明schema
let studentSchema = new mongoose.Schema({
    xueid : Number , //学生的学号
    name : String , //名字
    sex : String , //性别
    age : Number //年龄    
});


//获取某一页的学生数据   
studentSchema.statics.findPageData = async function(page,calback){
    //skip跳过几条      limit限制几条     exec 回调   
    //分页
    let pageSize = 4;       //一页4条数据
    let start = (page - 1) * pageSize;  //起始位置
    let count = await this.find().countDocuments();  //获取数据总条数    await等待后边执行完毕  配合async
    
    this.find({}).sort({'xueid':1}).skip(start).limit(pageSize).exec(
        function(err,results){
            if(err){
                callback(null);
                return;
            }
            calback({
                results,
                count,
                length : Math.ceil(count / pageSize),//几页数据
                now : page //now当前在的这一页
            });
        }
    )
}


//修改学生信息的方法
studentSchema.statics.changeStudent = function(xueid,data,callback){
    // console.log(data);
     
    this.find({xueid},(err,results)=>{
        // console.log(results);

        var somebody = results[0];
        somebody.name = data.name;
        somebody.sex = data.sex;
        somebody.age = data.age;
        somebody.save((err)=>{
            if(err){
                callback(-1);//失败
                return;
            }
            callback(1);//成功
        })

    });
}


//正则模糊搜索学生
studentSchema.statics.findStudentNames = function(reg,callback){
    // let val = new RegExp(reg,'g');
    // let val =  eval(`/${reg}/g`);

    this.find(
        {name:{$regex:reg,$options:'$g'}},
        (err,results)=>{
            // console.log(results);
            if(err){
                callback({ error :0, data:null});
                return;
            }
            callback({error :1, data:results});
        }
    );
}


//把查询到的学生数据转成excel
studentSchema.statics.exportExcel = function(callback){
    //查询所有学生数据
    this.find({},(err,results)=>{
        if(err){
            callback({error:0,msg:'数据查询失败'});
            return;
        }
        var datas = [];//存储excel表的格式
        var col = ['_id','xueid','name','sex','age'];//列
        datas.push(col);
        //内容
        results.forEach( function(item){
            var arrInner = [];
            arrInner.push(item._id);
            arrInner.push(item.xueid);
            arrInner.push(item.name);
            arrInner.push(item.sex);
            arrInner.push(item.age);
            datas.push(arrInner);
        });
        //把数组的数据转换为得层excel表的二进制数据
        var buffer = nodeXlsx.build([
            {name:'1998',data:datas},
            {name:'1999',data:datas}//可生成多个
        ]);

        let urlLib = path.join(__dirname,'../');
        //(路径，数据，写入方式（w），回调)
        fs.writeFile(
            `${urlLib}public/excel/banji.xlsx`,
            buffer,
            {'flag':'w'},
            function(err){
                if(err){
                    callback({error:0,msg:'excel导出失败'});
                    return;
                }
                callback({error:1,msg:`banji.xlsx`});
            }
        ); 
    })
}



//增加学生
studentSchema.statics.saveStudent = function(data,callback){
     
    //查询表里的最大的xueid字段
    this.find({},{xueid:1}).sort({xueid:-1}).limit(1).exec(function(err,results){
        if(err){
            callback({error:0,msg:'添加失败'});
            return ;
        }
        // console.log(results);
        let xueid = results.length > 0? Number(results[0]['xueid']) + 1 : 10001;//设置学号+1

        let student = new Student({
            xueid,
            ...data 
        }); 
        student.save (err=>{
            if(err) {
                callback({error:0,msg:'添加失败'});
                return ;
            }
            callback({error:1,msg:'添加成功'});
        })
    })
}


//删除学生
studentSchema.statics.deleteStudent = function(xueid,callback){
    this.find({xueid},(err,results)=>{
        // results [ { id:23423, name :xxx} ] 
        // console.log(results);
        var somebody = results[0];
        somebody.remove(err=>{
            if(err){
                callback({error:0,msg:"删除失败"});
                return;
            }
            callback({error:1,msg:"删除成功"});
        })
    });
}




//2.初始化Student类 该类会声明一个名为students的集合
let Student = mongoose.model('Student',studentSchema);



//3.导出集合
module.exports = Student;


 