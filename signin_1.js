var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require ('mysql');
var nodemailer = require('nodemailer');



var con = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nodedb',
        port: '3307'
    }
);



var transporter = nodemailer.createTransport(
    {
        service: 'Hotmail',
        auth: {
            user: '---',
            pass: '***'
        }

    }
);



con.connect(function(err){
    if(err) throw err;
    console.log("Baglandi");
});



http.createServer(function(req,res){
    fs.readFile("signin_form.html", function(err,data){                 
        if(err){
            res.writeHead(404, {'Content-Type' : 'text/html'});
            return res.end("404 Dosya bulunamadi");
        }                                                        

        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        return res.end();  
    });

    var info = url.parse(req.url, true).query;     

    if(info.username && info.password){

        var sql = "SELECT * FROM user";
        con.query(sql, function(err,result){

            con.query(sql, function(err,result){  


               var login = false;
    
               var mailOption = 
               {
                   from: '--',
                   to: info.username,                                
                   subject: 'Dikkat!',
                   text: 'Şu anda hesabınıza giriş yapılmaya çalışıldı! ' 
               }
    
                for(var i = 0; i < result.length; i++ ){
                    if(result[i].username == info.username && result[i].password == info.password){
                        login= true;
                        }
                    }
                    if( login== true ){
                    console.log("giris yapıldı");
                    
                    }else{
                    transporter.sendMail(mailOption, function(err,info){
                        if(err) throw err;
                        console.log("Bilgiler eşleşmedi");
                    });
                }
                
            });
    
        });
    }
}).listen(8080);
    

// BU YÖNTEM KULLANIŞLI DEĞİL.
