var http = require('http');
var url = require('url');
var mysql = require('mysql');
var fs = require('fs');
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

con.connect(function(err){
    if(err) throw err;
    console.log("Baglandi!");
});

var transporter = nodemailer.createTransport(
    {
        service: 'Hotmail',
        auth: {
            user: '---',
            pass: '***'
        }
    }
)

http.createServer(function(req,res){

    fs.readFile("signin_form.html", function(err,data){

        if(err){
            res.writeHead(404, {'Content-Type' : 'text/html'});
            return res.end("404 Dosya Bulunamadi!");
        }

        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        return res.end();


    });

    var info = url.parse(req.url, true).query;

    if(info.username && info.password){

        var sql = "SELECT * FROM user WHERE username = '" +info.username+ "' AND password = '" + info.password + "'";

        var sql_notpass = "SELECT * FROM user WHERE username = '" + info.username + "' AND password != '" + info.password + "'";

        con.query(sql, function(err, result){

            var login = false;

            if(result.length > 0){
                login = true;
            }

            if ( login == true){
                console.log("Giris Yapıldı!");
            }
            else if ( login == false)
            {
                var mailOption =
                {
                    from: '---',
                    to: info.username,
                    subject: 'Kaydınız Oluşturuldu',
                    text: 'Sistemimiz üzerinde var olan hesabınıza yanlis bir sifre denendi.'

                }
                con.query(sql_notpass, function(err,result){
                    console.log("Kullanici adi doğru ancak şifre hatali!");
                    transporter.sendMail(mailOption, function(err,info){
                        if (err) throw err;
                        console.log("Mail gönderildi.")
                    })

                })
        
            }

        });

    }

}).listen(8080);

