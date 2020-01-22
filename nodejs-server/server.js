var http = require('http')
var dbfuncs=require('./database.js')
function makeHtml(containers) {
	return '<tr><th>Adres</th><th>Inhoud</th><th>laatst geupdate</th></tr>'+containers.map(function(container) {
		addMarker(container.lat,container.lng,container.inhoud,container.adres,container.id)
		return '<tr containerId="'+container.id+'"><td>'+container.adres+'</td><td>'+inhoudToString(container.inhoud)+'</td><td>'+container.updateTime+'</td></tr>'
	}).join('')
}
http.createServer(function(req,res) {
	function sendResponse(response) {
		res.writeHead(200,{'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'})
		res.end(JSON.stringify(response))
	}
	jsonData=''
	req.on('data',function (chunk) {
		jsonData+=chunk
	})
	req.on('end',function () {
		if(jsonData.length==0) {
			dbfuncs.getAllContainers(function (containers) {
				res.end(makeHtml(containers))
			})
			return
		}
		try {
			data=JSON.parse(jsonData)
		} catch (e) {
			console.log('mallformed JSON:',e,data)
			sendResponse({STATUS:'JSONERROR'})
			return
		}
		if(data.lat && data.lng && data.adres) {
			if(data.id) dbfuncs.updateLocation(data.id,data.lat,data.lng,data.adres,sendResponse) //is nog niet aan de frontend toegevoegd
			else dbfuncs.insertContainer(data.lat,data.lng,data.adres,sendResponse) //nieuwe container
		} else if(data.id && data.inhoud) dbfuncs.updateInhoud(data.inhoud,data.id,sendResponse) //wordt door container aangevraagd
		else if(data.action=="delete" && data.id) dbfuncs.deleteContainer(data.id,sendResponse) //verwijderen van container
	})
}).listen(15311)
