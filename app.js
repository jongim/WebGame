var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/users')
    , http = require('http')
    , engine = require('ejs-locals')
    , fs = require('fs')
    , util = require('util')
    , url = require('url')
    , crypto = require('crypto')
    , path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');

var app = express();
var favicon = require('serve-favicon');
var logger = require('express-logger');

//Hash Key Generator for Password
var myHash = function myHash(key){
    var hash = crypto.createHash('sha1');
    hash.update(key);
    return hash.digest('hex');
}

//Create Session
var createSession = function createSession(){
    return function(req, res, next){
        if(!req.session.login){
            req.session.login = 'logout';
        }
        next();
    };
};

//all environment
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger({path: "/path/to/logfile.txt"}));
//app.use(express. body-parser({limit:'800mb', uploadDir:__dirname + '/public/se/uploadTmp'}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.method-override());
app.use(require('express-method-override')('method_override_param_name'));
//app.use(express.cookie-parser());
app.use(cookieParser());
/*app.use(express.session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }}));
app.use(createSession());*/
app.use(session({secret:'secret key'}));
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs',engine);

//main (page:0)
app.get('/',routes.index);

//Members (page:1)
app.get('/MEMBERDB', routes.member_db);

//Data View (page:2)
app.get('/DATAVIEW', routes.dataview);

//Login Button
app.post('/LOGIN', function(req,res,next) {
    req.username = req.body.username;
    req.password = myHash(req.body.password);
    next();
},routes.login_post);

//Login Button (Enabled after loggin in)
app.get('/LOGOUT', routes.logout);

//Sign uo Button
app.get('/SIGN_UP', routes.sign_up);
app.post('/SIGN_UP', function(req,res,next) {
    if(req.body.password == req.body.confirm_password) {
        req.username = req.body.username;
        req.password = myHash(req.body.password);
        req.email = req.body.email;
        next();
    }
    else
    {
        res.redirect('/');
    };
},routes.sign_up_post);

//Check User Name Button (Display in sign up page)
app.get('/CHECKUSERNAME',routes.checkusername);

//Naver Smarteditor Image Upload
app.post('/UPLOAD',function(req,res) {
    var str = req.header('User-Agent');
    var os = str.search("Win");
    var fileName = req.files.file.path;
    if(os == -1) {
        fileName = fileName.split('/')[fileName.split('/').length-1];
    }
    else {
        fileName = fileName.split('\\')[fileName.split('\\').length-1];
    }
    res.writeHeader(200,{'Content-Type':'text/plain'});
    res.write('&bNewLine=true');
    res.write('&sFileName=' + fileName);
    res.write('&sFileURL=/se/uploadTmp/' + fileName);
    res.end();
});

//Naver SmartEditor Content Submit
app.post('/SUBMIT', routes.insertData);

module.exports = app;