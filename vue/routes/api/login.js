let express=require ("express")
let router=express.Router()
let mgdb=require('../../utils/mgdb')
let bcrypt=require('bcrypt')
router.post('/',(req,res,next)=>{
//console.log(req.body.username,req.body.password)

let{username,password,save}=req.body
if(!username||!password){
    res.send({err:1,mess:'用户名密码不能为空'})
    return;
}
//console.log('兜库')
mgdb({
    dbName:'app',
    collectionName:'user'
},({collection,client})=>{
    collection.find({
        username
    },{
        projection:{username:0}
    }).toArray((err,result)=>{
        if(!err){
            if(result.length>0){
  //   console.log(result)
  if(bcrypt.compareSync(password,result[0].password)){
        if(save){
         //   console.log(app_name)
          req.session['app_username']=result[0]._id
             } 
             res.send({err:0,mess:'登录成功',data:result[0]})          
             }else{
                 res.send({err:1,mess:'用户名或密码有误'})
             }
                 }else{
             res.send({err:1,mess:'用户名不存在'})
           }
     }else{
       res.send({err:1,mess:'库连接错误'})
            }
          client.close()
    })
})


})

module.exports=router
