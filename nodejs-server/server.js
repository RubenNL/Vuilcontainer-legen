var http = require('http')
var dbfuncs=require('./database.js')
http.createServer(function(req,res) {
	function sendResponse(response) {
		res.writeHead(200,{'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'})
		res.end(JSON.stringify(response))
	}
	var jsonData=''
	req.on('data',function (chunk) {
		jsonData+=chunk
	})
	req.on('end',function () {
		if(jsonData.length==0) {//geen data verstuurd, of een GET request.
			dbfuncs.getAllContainers(sendResponse)
			return
		}
		try {//soms is de data geen JSON, dit is de enige manier om dat te checken.
			data=JSON.parse(jsonData)
		} catch (e) {
			console.log('malformed JSON:',e,data)
			sendResponse({STATUS:'JSONERROR'})
			return
		}
		if(data.lat && data.lng && data.adres) dbfuncs.insertContainer(data.lat,data.lng,data.adres,sendResponse) //nieuwe container
		else if(data.id && data.inhoud) dbfuncs.updateInhoud(data.inhoud,data.id,sendResponse) //wordt door container aangevraagd
		else if(data.action=="delete" && data.id) dbfuncs.deleteContainer(data.id,sendResponse) //verwijderen van container
	})
}).listen(15311)
