var http = require('http') 
var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('database.db');
db.serialize(function() {
	function updateInhoud(inhoud,id,callback) {
		console.log(inhoud,id)
		db.run("UPDATE containers SET inhoud = ?, updateTime=datetime('now','localtime') WHERE id = ?",[parseInt(inhoud),parseInt(id)],function (err) {
			if(err) {
				console.log('error updating inhoud',err,inhoud,id)
				callback({status:'ERR'})
			} else callback({status:'OK'})
		});
	}
	function insertContainer(lat,lng,adres,callback) {
		db.run("INSERT INTO containers('lat','lng','adres') VALUES ((?),(?),(?));",[lat,lng,adres],function (err) {
			if(err) {
				callback({status:'ERR'})
				console.log('error inserting',err)
			} else {
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
	function updateLocation(id,lat,lng,adres,callback) {
		db.run("UPDATE containers SET lat = ?, lng = ?, adres= ? WHERE id = ?",[lat,lng,adres,parseInt(id)],function (err) {
			if(err) {
				console.log('error updating location',err,inhoud,id)
				callback({status:'ERR'})
			} else callback({status:'OK'})
		});
	db.run(`
		CREATE TABLE IF NOT EXISTS "containers" (
			"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"lat"	DECIMAL(8, 5) NOT NULL,
			"lng"	DECIMAL(7, 5) NOT NULL,
			"adres"	TEXT NOT NULL,
			"inhoud"	INTEGER,
			"updateTime"	DATE
		);
	`);
	server=http.createServer(function(req,res) {
		containers={}
		data=''
		req.on('data',function (chunk) {
			data+=chunk
		})
		req.on('end',function () {
			console.log(data)
			res.writeHead(200,{'Content-Type': 'application/json'})
			try {
				data=JSON.parse(data)
			} catch (e) {
				db.all("SELECT * FROM containers", function(err, rows) {
					if(err) console.log('select error:',err)
					else {
						res.end(JSON.stringify(rows))
					}
				})
			}
			if(data) {
				if(!data.id) {
					insertContainer(data.lat,data.lng,data.adres,function(response) {
						res.end(JSON.stringify(response))
					})
				} else if(data.adres && data.lat && data.lng) {
					updateLocation(data.id,data.lat,data.lng,function (response) {
						res.end(JSON.stringify(response))
					})
				} else if(data.inhoud) {
					updateInhoud(data.inhoud,data.id,function(response) {
						res.end(JSON.stringify(response))
					})
				} else {
					deleteContainer(data.id,function (response) {
						res.end(JSON.stringify(response))
					})
				}
			}
		})
	}).listen(15311)
})
process.on("exit", function () {
	db.close()
})
