var http= require('http');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');
var nodemailer = require('nodemailer');

//function isEmailAddress(str) {
 //   var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 //   return pattern.test(str);
 // }

var con = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        port: '3307',
        database: 'nodedb'
        
    }
);

var transporter = nodemailer.createTransport(

    {
        service:'Hotmail',
        auth: {
            user: '--',
            pass: '**'
            
        }
    }
);


http.createServer(function(req,res){

    fs.readFile('signup_form.html' , function(err,data){

        if(err){
            res.writeHead(404, {'Content-Type' : 'text/html'});
            res.end('404 not found');
        }

        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    });



    var info = url.parse(req.url,true).query;
    if(info.username && info.password ){

        var mailOption = 
            {   

                from: '---',
                to: info.username,
                subject: '100 KY',
                text: 'kayıt oluşturuldu '
            };

        con.connect(function(err){
            if(err) throw err;
            console.log("Baglandi");

            var values = [info.username, info.password];
            var sql = "INSERT INTO user (username,password) VALUE (?,?)";

            con.query(sql, values, function(err,result){
                if(err) throw err;
                else{

                    transporter.sendMail(mailOption, function(err,info){
                        if(err) throw err;
                        console.log("Mail Gönderildi!" + info )
                        
                    });
                    console.log("1 kayıt oluştu.")
                }
                
            })
        })
    }
    

}).listen(8080);