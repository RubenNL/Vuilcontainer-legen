var sqlite3 = require('sqlite3') //gebruik gemaakt van https://github.com/mapbox/node-sqlite3/wiki/API
var db = new sqlite3.Database('database.db');
process.on("exit", function () {
	db.close()
})
function updateInhoud(inhoud,id,callback) {
	db.run("UPDATE containers SET inhoud = ?, updateTime=datetime('now','localtime') WHERE id = ?",[parseInt(inhoud),parseInt(id)],function (err) {
		if(err) console.log('error updating inhoud',err,inhoud,id)
		else callback({status:'OK'})
	});
}
function insertContainer(lat,lng,adres,callback) {
	db.run("INSERT INTO containers('lat','lng','adres') VALUES ((?),(?),(?));",[lat,lng,adres],function (err) {
		if(err) console.log('error inserting',err)
		else {
			db.get('SELECT id FROM containers ORDER BY id DESC LIMIT 1;',function(err,row) {
				console.log(err,row)
				if(err) {
					console.log('error getting last row',err)
					callback({status:'ERR'})
				} else callback(row)
			})
		}
	});
}
function deleteContainer(id,callback) {
	db.run('DELETE FROM containers WHERE id = ?',[id],function (err) {
		if(err) {
			console.log('error deleting container:',err,id)
			callback({status:'ERR'})
		} else callback({status:'OK'})
	})
}
function getAllContainers(callback) {
	db.all("SELECT * FROM containers", function(err, rows) {
		if(err) console.log('select error:',err)
		else callback(rows)
	})
}
function getNotUpdatedContainers(callback) {
	db.all('SELECT * FROM containers WHERE updateTime<datetime("now","-20 minute","localtime") AND inhoud IS NOT NULL',function (err,rows) {
		if(err) console.log('notupdated err:',err)
		else callback(rows)
	})
}
function cleanDatabase() {
	getNotUpdatedContainers(function (containers) {
		containers.forEach(function(container) {
			updateInhoud(null,container.id,function () {})
		})
	})
}
db.run(`
	CREATE TABLE IF NOT EXISTS "containers" (
		"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		"lat"	DECIMAL(8, 5) NOT NULL,
		"lng"	DECIMAL(7, 5) NOT NULL,
		"adres"	TEXT NOT NULL,
		"inhoud"	INTEGER,
		"updateTime"	DATE DEFAULT (datetime('now','localtime'))
	);
`); //bron van DEFAULT van updateTime: https://stackoverflow.com/a/228070/5981611
setInterval(cleanDatabase,1000*60*15)//inhoud naar NULL voor elke container die niet is geupdate in 20 minuten.
cleanDatabase() //ook bij starten
module.exports={updateInhoud:updateInhoud,insertContainer:insertContainer,deleteContainer:deleteContainer,getAllContainers:getAllContainers}
