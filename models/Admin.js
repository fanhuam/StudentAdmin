const mongoose = require('mongoose');
const md5 = require('md5-node');

//1.声明schema
let adminSchema = new mongoose.Schema({
    username : String, //用户名
    password : String, //密码
    posttime : Number, //注册时间
    lastLoginTime : Number //最后一次登录时间
});


//验证用户是否存在的静态方法
adminSchema.statics.checkUser = function(user,callback){
    this.find({'username':user},(err,results)=>{
        if(err){
            callback({t:false,val:null});
            return;
        }
        //results [ { username:'siqi' ,password:'13151351'}]
        if(results.length != 0){
            callback({t:true,val:results[0]});
            return;
        }
        callback({t:false,val:null});
    })
}

//处理登录
adminSchema.statics.checkLogin = function(json,callback){
    // json  前台发送的 { username: 'fanhua', password: '123456' }
    
    this.checkUser(json.username,function(torf){
        // torf.val   {username : XxXX，password: 23ssfsa, posttime: 234234, lastLoginTime : 234234 }  
        //torf.t == results.t 
        if(torf.t){//如果是true  用户名对了
            if( md5(json.password) == torf.val.password ){
                callback(1);//登陆成功

                //类调用静态方法  Admin
                //实例调用的方法是动态方法这里 torf相当于实例
                torf.val.changelastLoginTime();

                return;
            }
            callback(-1);//密码输入错误
        }else{//用户名错误
            callback(-2);//用户名不存在
        }
    })
}

//修改用户登录后的登录时间
adminSchema.methods.changelastLoginTime = function(){
    var timeStemp = new Date().getTime();
    this.lastLoginTime = timeStemp;
    this.save();
}



//2.初始化Admin类 该类会声明一个名为admins的集合
let Admin = mongoose.model('Admin',adminSchema);

//3.导出集合
module.exports = Admin;