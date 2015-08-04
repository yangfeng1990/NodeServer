var fs = require('fs');

function Transfer(req, resp) {
    this.req = req;
    this.resp = resp;
}

/**
 * [@description](/user/description) �����ϴεĶϵ���Ϣ
 * [@param](/user/param) {string} Range ����httpͷ�ļ��еĶϵ���Ϣ�����û����Ϊundefined����ʽ��range: bytes=232323-��
 * [@return](/user/return) {integer} startPos ��ʼ�����ص�
 */
Transfer.prototype._calStartPosition = function(Range) {
    var startPos = 0;
    if( typeof Range != 'undefined') {
        var startPosMatch = /^bytes=([0-9]+)-$/.exec(Range);
        startPos = Number(startPosMatch[1]);
    }
    return startPos;
}
/**
 * [@description](/user/description) ����ͷ�ļ�
 * [@param](/user/param) {object} Config ͷ�ļ�������Ϣ�����������ص���ʼλ�ú��ļ��Ĵ�С��
 */
Transfer.prototype._configHeader = function(Config) {
    var startPos = Config.startPos, 
        fileSize = Config.fileSize,
        resp = this.resp;
    // ���startPosΪ0����ʾ�ļ���0��ʼ���صģ��������ʾ�Ƕϵ����صġ�
    if(startPos == 0) {
        resp.setHeader('Accept-Range', 'bytes');
    } else {
        resp.setHeader('Content-Range', 'bytes ' + startPos + '-' + (fileSize - 1) + '/' + fileSize);
    }
    resp.writeHead(206, 'Partial Content', {
        'Content-Type' : 'application/octet-stream',
    });
}


/**
 * [@description](/user/description) ��ʼ��������Ϣ
 * [@param](/user/param) {string} filePath
 * [@param](/user/param) {function} down ���ؿ�ʼ�Ļص�����
 */
Transfer.prototype._init = function(filePath, down) {
    var config = {};
    var self = this;
    fs.stat(filePath, function(error, state) {
        if(error)
            throw error;

        config.fileSize = state.size;
        var range = self.req.headers.range;
        config.startPos = self._calStartPosition(range);
        self.config = config;
        self._configHeader(config);
        down();
    });
}
/**
 * [@description](/user/description) ���ɴ��ļ��ĵ�����������
 * [@param](/user/param) {string} filePath �ļ���ַ
 */
Transfer.prototype.DownloadOld = function(filePath) {
    var self = this;
    fs.exists(filePath, function(exist) {
		console.log(filePath);
		console.log('in download');
        if(exist) {
			console.log('exist');
            self._init(filePath, function() {
                var config = self.config;
                var resp = self.resp;
                fReadStream = fs.createReadStream(filePath, {
                    encoding : 'binary',
                    bufferSize : 1024 * 1024,
                    start : config.startPos,
                    end : config.fileSize
                });
                fReadStream.on('data', function(chunk) {
                    resp.write(chunk, 'binary');
                });
                fReadStream.on('end', function() {
                    resp.end();
                });
            });
        } else {
			console.log('not exist');
            return;
        }
    });
}

/**
 * [@description](/user/description) ���ɴ��ļ��ĵ�����������
 * [@param](/user/param) {string} filePath �ļ���ַ
 */
Transfer.prototype.Download = function(filePath) {
    var self = this;
	console.log(filePath);
    self._init(filePath, function() {
		var config = self.config;
		var resp = self.resp;
		fReadStream = fs.createReadStream(filePath, {
			encoding : 'binary',
			bufferSize : 1024 * 1024,
			start : config.startPos,
			end : config.fileSize
		});
		fReadStream.on('data', function(chunk) {
			resp.write(chunk, 'binary');
		});
		fReadStream.on('end', function() {
			console.log('end');
			resp.end();
		});
    });
}

module.exports = Transfer;