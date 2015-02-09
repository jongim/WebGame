//http 서버
var http = require('http');
var express = require('express');
var routes = require('./routes');
var app = express();
var server = http.createServer(app);
server.listen(3000);

//웹페이지 구성
var engine = require('ejs-locals');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var favicon = require('serve-favicon');

//비밀번호 암호화
var crypto = require('crypto');
var myHash = function myHash(key) {
    var hash = crypto.createHash('sha1');
    hash.update(key);
    return hash.digest('hex');
}

//Create Session
var createSession = function createSession() {
    return function (req, res, next) {
        if (!req.session.login) {
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('express-method-override')('method_override_param_name'));
app.use(session({secret: 'secret key'}));
app.use(express.static(path.join(__dirname, '/views')));

app.engine('ejs', engine);

app.get('/', routes.index);

app.get('/SIGN_UP', routes.sign_up);

app.get('/CHECKUSERNAME', routes.checkUserName);

app.post('/SIGN_UP', function (req, res, next) {
    if (req.body.password == req.body.confirm_password) {
        req.username = req.body.username;
        req.password = myHash(req.body.password);
        next();
    }
    else {
        res.redirect('/SIGN_UP');
    }
}, routes.sign_up_post);

app.post('/LOGIN', function (req, res, next) {
    req.username = req.body.username;
    req.password = myHash(req.body.password);
    next();
}, routes.login_post);

app.get('/LOGOUT', routes.logout);

app.get('/MEMBERDB', routes.member_db);

