var express = require('express');
var router = express.Router();
var fs=require("fs"),
	http=require("http"),
	url=require("url"),
	path=require("path"),
	mime=require("./mime").mime,
	util=require('util');
var filename;

router.route('/').get(function(req, res) {
console.log(req.url);

});



router.route('/file').get(function(req, res) {
	console.log(req.url);
	console.log(__dirname);
	//res.render('main', { title: 'Express' });
	
	//将url地址的中的%20替换为空格，不然Node.js找不到文件
	var pathname = url.parse(req.url).pathname.replace(/%20/g, ' '),
		re = /(%[0-9A-Fa-f]{2}){3}/g;
	//能够正确显示中文，将三字节的字符转换为utf-8编码
	pathname = pathname.replace(re, function(word){
		var buffer = new Buffer(3),
			array = word.split('%');
		array.splice(0, 1);
		array.forEach(function(val, index){
			buffer[index] = parseInt('0x' + val, 16);
		});
		return buffer.toString('utf8');
	});
	console.log(pathname);
	if(pathname == '/'){
		listDirectory(__dirname, req, res);
	}else{
		filename = path.join(__dirname, pathname);
		console.log(filename);
		fs.exists(filename, function(exists){
		console.log('fs');
			if(!exists){
				util.error('找不到文件' + filename);
				write404(req, res);
			}else{
				console.log('before fs..stat');
				fs.stat(filename, function(err, stat){
					console.log('in fs..stat');
					if(stat.isFile()){
						console.log('stat is file');
						//showFile(filename, req, res);
					}else if(stat.isDirectory()){
						console.log('stat is directory');
						listDirectory(filename, req, res);
					}
				});
			}
		});
	} 
});
  
/*if(!fs.existsSync(root)){
	util.error(root+"文件夹不存在，请重新制定根文件夹！");
	process.exit();
} */
	
//显示文件夹下面的文件
function listDirectory(parentDirectory, req, res){
	fs.readdir(parentDirectory, function(error, files){
		console.log(parentDirectory);
		var body=formatBody(parentDirectory, files);
		res.writeHead(200, {
			"Content-Type":"text/html;charset=utf-8",
			"Content-Length":Buffer.byteLength(body, 'utf8'),
			"Server":"NodeJs("+process.version+")"
		});
		res.write(body, 'utf8');
		res.end(); 
	});
}

//显示文件内容
function showFile(file, req, res){
	fs.readFile(filename, 'binary', function(err, file){
		var contentType = mime.lookupExtension(path.extname(filename));
		res.writeHead(200, {
			"Content-Type": contentType,
			"Content-Length": Buffer.byteLength(file, 'binary'),
			"Server": "NodeJs(" + process.version + ")"
		});
		res.write(file, "binary");
		res.end();
	})
}

//在Web页面上显示文件列表，格式为<ul><li></li><li></li></ul>
function formatBody(parent, files){
	var res = [],
	length = files.length;
	res.push("<!doctype>");
	res.push("<html>");
	res.push("<head>");
	res.push("<meta http-equiv='Content-Type' content='text/html;charset=utf-8'></meta>")
	res.push("<title>Node.js文件服务器</title>");
	res.push("</head>");
	res.push("<body width='100%'>");
	res.push("<ul>")
	files.forEach(function(val, index){
		var stat = fs.statSync(path.join(parent, val));
		if(stat.isDirectory(val)){
			val = path.basename(val) + "/";
		}else{
			val = path.basename(val);
		}
		console.log('weizhang' + val);
		//res.push("<li><a href='" + val + "'>" + val + "</a></li>");
		res.push("<li><a href=/file/www.baidu.com>" + val + "</a></li>");
	});
	res.push("</ul>");
	res.push("<div style='position:relative;width:98%;bottom:5px;height:25px;background:gray'>");
	res.push("<div style='margin:0 auto;height:100%;line-height:25px;text-align:center'>Powered By Node.js</div>");
	res.push("</div>")
	res.push("</body>");
	return res.join("");
}

//如果文件找不到，显示404错误
function write404(req, res){
	var body = "文件不存在:-(";
	res.writeHead(404, {
		"Content-Type": "text/html;charset=utf-8",
		"Content-Length": Buffer.byteLength(body, 'utf8'),
		"Server": "NodeJs(" + process.version + ")"
	});
	res.write(body);
	res.end();
}  


module.exports = router;