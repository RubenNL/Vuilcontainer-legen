require('http').createServer(function(req,res) {
	json=''
	req.on('data',function (chunk) {
		json+=chunk
	})
	req.on('end',function () {
		data=JSON.parse(json)
		console.log(data)
		res.writeHead(200,{'Content-Type': 'application/json'})
		res.end(JSON.stringify({method:'sendMessage',chat_id:data.message.chat.id,text:"hoi! dit is wat ik heb ontvangen:"+data.message.text}))
	})
}).listen(1234)