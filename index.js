const ex = require("express");
const app = ex();
const bp = require("body-parser");
app.use(bp.urlencoded({extended:true}));

const mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db7"
});


app.set('views','./view');
app.set('view engine', 'ejs');
con.connect(function(err)
{
    if(err)throw err;
    else
    console.log("connected");
}
);

app.get("/",function(req,res){
    res.sendFile(__dirname + "/htmlpages/first.html");
});


app.get("/lo",function(req,res){
    res.sendFile(__dirname + "/htmlpages/login.html");
});


app.get("/wl",function(req,res){
    res.sendFile(__dirname + "/htmlpages/welcome.html");
});
app.post("/log" ,function(req,res)
{
    let c = req.body.t1;
    let pw = req.body.t2;

    
    
        con.query("SELECT * FROM log_in WHERE username = '"+c+"' and password = '"+pw+"'", function (err, result) {
          if (err) throw err;
          else
          console.log("login");
        });
          res.sendFile(__dirname+"/htmlpages/welcome.html");
      });



      app.post("/item",function(req,res){
        let s = req.body.t1;
        let f = req.body.t2;
        let p = req.body.t3;
        
            var sql = "INSERT INTO menu (snake,flavor,price) VALUES ('"+s+"','"+f+"','"+p+"')";
            con.query(sql,function(err,result){
                if(err) throw err;
                console.log("data inserted");
            });
    
        
        res.sendFile(__dirname+"/htmlpages/welcome.html");
    
    });
    
    

    


    app.get('/list' , function(req,res){
   
        var sql = "SELECT * FROM menu";
        con.query(sql,function(err,result){
            if(err) throw err;
            else
            res.render('print',{data:result});
        });
    });
   


    app.get("/edit",function(req,res)
{
            con.query("SELECT * FROM menu WHERE id="+req.query["id"], function (err1, result) {
          if (err1) throw err1;
          else
          res.render('editd',{data:result});
        });


    
      });

      app.post("/upload",function(req,res){
        let s = req.body.t1;
        let f = req.body.t2;
        let p = req.body.t3;
        let id = req.body.t0;
        
            var sql = "update menu set snake='"+s+"',flavor='"+f+"',price='"+p+"' where id="+id;
            con.query(sql,function(err,result){
                if(err) throw err;
                else
                {
                    var sql = "SELECT * FROM menu";
                    con.query(sql,function(err,result){
                        if(err) throw err;
                        else
                        res.render('print',{data:result});
                    });
                }
            });
    });



    app.get("/del",function(req,res)
    {
    
        var sql = "delete from menu where id="+req.query["id"];
        con.query(sql,function(err,result){
            if(err) throw err;
            else
            var sql = "SELECT * FROM menu";
            con.query(sql,function(err,result){
                if(err) throw err;
                else
                res.render('print',{data:result});
            });
        });
    });
    

//// user register by using mongodb////



const mongodb = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";



app.get("/reg", function(req,res){
    res.sendFile(__dirname + "/htmlpages/user_reg.html");
});

app.get("/user_log", function(req,res){
    res.sendFile(__dirname + "/htmlpages/user_log.html");
});

app.get("/user_welcome",function(res,req){
    res.sendFile(__dirname + "/htmlpages/welcome_user.html");

});




app.post("/ur", function(req,res){
    let u = req.body.t1;
    let e = req.body.t2;
    let p = req.body.t3;



    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("pro");
        var myobj = { username:u , email:e, password:p };
        dbo.collection("user").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
      res.sendFile(__dirname + "/htmlpages/welcome_user.html")
});



app.post("/ul",function(req,res){
    let e = req.body.t2;
    let p = req.body.t3;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("pro");
        dbo.collection("user").findOne({email: e,password: p}, function(err, result) {
          if (err) throw err;
          console.log(result.username);
          db.close();
        });
      });
      res.sendFile(__dirname + "/htmlpages/welcome_user.html");
     });



app.listen(2030,function(req,res){
    console.log("server is running on port no 2030");
});

