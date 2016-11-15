var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser = require('body-parser');
var api = require('./api/index');
var io = require('socket.io')(http);
















// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public/img/mini_logo.ico')));
app.use(logger('dev'));
app.use(express.bodyParser());
app.use(cookieParser());
app.use(cookieParser());
app.use(session({
    secret: 'UncoJet'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);






//io.sockets.on('connection', socket);









app.post('/sendEmail',api.sendEmail);
app.post('/addFilesTo/:element',api.addFilesTo);
app.post('/addPictureTo/action',api.addPictureAction);
app.post('/postActionData',api.postActionData);
app.get('/getActions',api.getActions);
app.get('/deleteAction/:title',api.deleteAction);
app.post('/deleteCategoryVideoYoutube',api.deleteCategoryVideoYoutube);
app.post('/deleteCategoryVideoFile',api.deleteCategoryVideoFile);
app.post('/deleteCategoryDoc',api.deleteCategoryDoc);
app.post('/deleteCategoryArea',api.deleteCategoryArea);
app.post('/deleteCategoryPhoto',api.deleteCategoryPhoto);
app.post('/makeCategoryChanges',api.makeCategoryChanges);

app.post('/deleteAreaEquipment',api.deleteAreaEquipment);
app.post('/deleteAreaDoc',api.deleteAreaDoc);
app.post('/deleteAreaVideoFile',api.deleteAreaVideoFile);
app.post('/deleteAreaVideoYoutube',api.deleteAreaVideoYoutube);
app.post('/deleteAreaPhoto',api.deleteAreaPhoto);
app.post('/makeAreaChanges',api.makeAreaChanges);

app.post('/deleteEquipmentVideoFile',api.deleteEquipmentVideoFile);
app.post('/deleteEquipmentVideoYoutube',api.deleteEquipmentVideoYoutube);
app.post('/deleteEquipmentDoc',api.deleteEquipmentDoc);
app.post('/deleteEquipmentArea',api.deleteEquipmentArea);
app.post('/deleteEquipmentSpec',api.deleteEquipmentSpec);
app.post('/deleteEquipmentPhoto',api.deleteEquipmentPhoto);
app.post('/makeEquipmentChanges',api.makeEquipmentChanges);


app.get('/deleteFileEquipment/:type/:file',api.deleteFileEquipment);
app.get('/deleteFileArea/:file',api.deleteFileArea);
app.get('/deleteFileCategory/:type/:file',api.deleteFileCategory);

app.get('/deleteEquipmentTotal/:equipment',api.deleteEquipmentTotal);
app.get('/deleteAreaTotal/:area',api.deleteAreaTotal);
app.get('/deleteCategoryTotal/:category',api.deleteCategoryTotal);
app.post('/postEquipmentOutOfFile',api.postEquipmentOutOfFile);
app.post('/postAreaOutOfFile',api.postAreaOutOfFile);
app.post('/postCategoryOutOfFile',api.postCategoryOutOfFile);
app.get('/getEquipmentsTotal',api.getEquipmentsTotal);
app.get('/getAreasTotal',api.getAreasTotal);
app.get('/getAreaTotal/:area',api.getAreaTotal);
app.get('/getCategoriesTotal',api.getCategoriesTotal);
app.get('/getCategory/:category',api.getCategory);
app.get('/getArea/:area',api.getArea);
app.get('/getEquipment/:equipment',api.getEquipment);
app.get('/getEquipmentTotal/:equipment',api.getEquipmentTotal);
app.get('/getEquipmentsTotal/:bycat',api.getEquipmentsTotalByCat);
app.get('/getEquipmentsTotalByArea/:area',api.getEquipmentsTotalByArea);
app.get('/getAreasTotalByEquipment/:equipment',api.getAreasTotalByEquipment);
app.get('/searchFor/:item',api.search);

app.get('*',function(req, res) {
    res.sendfile('index.html');
});




/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err.message);
});

module.exports = app;
http.listen(80, function(){
    console.log('listening on 80');
});