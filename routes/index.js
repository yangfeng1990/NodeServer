var User = require('../model/user');
var express = require('express');
var router = express.Router();
var Transfer = require('./Transfer');
var fs = require('fs');
var formidable = require('formidable');
var mime=require('./mime').mime;
var TITLE = 'formidable上传示例';
var AVATAR_UPLOAD_FOLDER = '/avatar/';

var globar_username = "";
var down_file_name = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET main page. */
router.get('/main', function(req, res, next) {
	res.render('main', { title: globar_username });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login Page' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
	res.render('register', { title: 'Register Page' });
});

/* GET upload page. */
router.get('/upload', function(req, res, next) {
	res.render('upload', { title: 'upload Page' });
});

/* GET download page. */
router.get('/download', function(req, res, next) {
	var filename = [];
	var path = 'F:/testnode/htmltest/downfile';
	fs.readdir(path, function(err, files){
		//err 为错误 , files 文件名列表包含文件夹与文件
		if(err){
			console.log('error:\n' + err);
			return;
		}
		files.forEach(function(val){
			var stat = fs.statSync(path + '/' + val);
			if(stat.isDirectory(val)){
				// 遍历
				// explorer(path + '/' + val);
				//val = path.basename(val) + "/";
			}else{
				console.log('文件名:' + path + '/' + val);
				filename.push(val);
			}
		});
		console.log(filename);
		res.render('download', { title: 'download Page', filename: filename });
	});
	//res.render('download', { title: 'download Page', filename: filename });
});

/* GET download file. */
router.get('/download/:filename', function(req, res, next) {
	//res.render('download', { title: 'download Page' });
	console.log(req.query);
	var userfilename = req.query.name;
	console.log(userfilename);
	var transfer = new Transfer(req, res);
    //var filePath = './debug.dll';
	//filename = 'debug.dll';
	 var filePath = './' + userfilename;
	filename = userfilename;
	console.log('start file');
	
	fs.exists(filePath, function(exist) {
        if(exist) {
		    console.log('exist');
			res.setHeader('Content-Disposition', 'attachment; filename='+encodeURIComponent(filename));
			transfer.Download(filePath);
        } 
		else {
			console.log('not exist');
			res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
			res.write('not exitst');
			res.end();
        }
    });  
});

/* POST download file. */
router.route('/download').post(function(req, res) {
	var userfilename = req.query.userfilename;
	console.log(userfilename);
	var transfer = new Transfer(req, res);
    //var filePath = './' + userfilename;
	//filename = userfilename;
	 var filePath = './cpp11.rar';
	filename = 'cpp11.rar';
	console.log('start file');
	
	fs.exists(filePath, function(exist) {
        if(exist) {
			console.log('exist');
			res.setHeader('Content-Disposition', 'attachment; filename='+encodeURIComponent(filename));
			transfer.Download(filePath);
        } 
		else {
			console.log('not exist');
			res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
			res.write('not exist');
			res.end();
        }
    });    
});

/* POST upload file. */
router.route('/upload').post(function(req, res) {
	// 创建上传表单
	var form = new formidable.IncomingForm();   
	// 设置编辑
    form.encoding = 'utf-8';
	// 设置上传目录	
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 
	// 保留后缀
    form.keepExtensions = true;	 
	// 文件大小
    form.maxFieldsSize = 2 * 1024 * 1024;   
	form.parse(req, function(err, fields, files) {
		if (err) {
		  res.locals.error = err;
		  res.render('upload', { title: TITLE });
		  return;		
		}
		// 后缀名
		var extName = '';
		console.log('weizhang :' + files.fulAvatar.name);	
		console.log('weizhang :' + files.fulAvatar.type);
		// 支持所有类型
		var avatarName = files.fulAvatar.name;
		var newPath = form.uploadDir + avatarName;
		console.log(newPath);
		// 重命名
		fs.renameSync(files.fulAvatar.path, newPath);  
		console.log('weizhang in end');
		res.locals.success = '上传成功';
		res.render('upload', { title: TITLE });
		/*
		switch (files.fulAvatar.type) {
			case 'image/pjpeg':
				extName = 'jpg';
				break;
			case 'image/jpeg':
				extName = 'jpg';
				break;		 
			case 'image/png':
				extName = 'png';
				break;
			case 'image/x-png':
				extName = 'png';
				break;
			case 'application/x-msdownload':
				extName = 'dll';
				break;
			case 'image/bmp':
				extName = 'bmp';
				break;
		}
		console.log('weizhang : ' + extName.length);
		if(extName.length == 0){
			res.locals.error = '只支持png和jpg格式图片';
			res.render('upload', { title: TITLE });
			console.log('weizhang in length = 0');
			return;				   
		}
		else
		{
			var avatarName = Math.random() + '.' + extName;
			var newPath = form.uploadDir + avatarName;

			console.log(newPath);
			// 重命名
			fs.renameSync(files.fulAvatar.path, newPath);  
			console.log('weizhang in end');
			res.locals.success = '上传成功';
			res.render('upload', { title: TITLE });
		}
		*/		
	});
});

/*
router.route('/login').post(function(req, res) {
	console.log(req.query);
	var user = new User({username:req.query.username, password:req.query.password});
  user.save(function(err) {
    if (err) {
      return res.send(err);
    }
	res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
	res.write('user Added');
	res.end();
  });
});
*/

/* POST register */
router.route('/register').post(function(req, res) {
	// 查看数据库中是否存在该用户
	User.find({username:req.query.username}, function(err, user) {
		if (err) 
		{	// 请求出错
			res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
			res.write(err);
			res.end();
		}
		if (user.length == 0)
		{	// 数据库中不存在该用户, 写入数据库
			var user = new User({username:req.query.username, password:req.query.password});
			globar_username = req.query.username;
			user.save(function(err) {
				if (err) {
					// 请求出错
					// return res.send(err);
					res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
					res.write(err);
					res.end();
				}
				else
				{
					res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
					res.write('success');
					res.end();
				}
			});
		}
		else
		{	// 数据库中存在该用户, 注册失败
			res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
			res.write('the username has been registered!');
			res.end();
		}
	});
});

/* POST login */
router.route('/login').post(function(req, res) {
	// 查看数据库中是否存在该用户
	User.find({username:req.query.username, password:req.query.password}, function(err, user) {
		if (err) 
		{	// 请求出错
			res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
			res.write(err);
			res.end();
		}
		if (user.length == 0)
		{	// 数据库中不存在该用户
			res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
			res.write('login is blocked, because the username isnot register!');
			res.end();
		}
		else
		{	// 数据库中存在该用户
			globar_username = req.query.username;
			res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
			res.write('success');
			res.end();
		}
	});
});

module.exports = router;
