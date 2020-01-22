serverUrl='https://afval.rubend.nl/nodejs'
markers=[]
L.mapquest.key = 'hU15IN5Tl6oAibfsQy7l8ErOAnsmWqWL';
map = L.mapquest.map('map', {
	center: [52.177439, 5.278999],
	layers: L.mapquest.tileLayer('map'),
	zoom: 10,
	preferCanvas: true//source:https://stackoverflow.com/a/43019740
}); //source: https://developer.mapquest.com/
function inhoudToString(inhoud) {
	if(inhoud==null) return "Onbekend"
	else if(inhoud<33) return "Leeg"
	else if(inhoud<66) return "Halfvol"
	else if(inhoud<80) return "Bijna vol"
	else return "Vol"
}
function inhoudToColor(inhoud) {
	if(inhoud==null) return "black"
	if(inhoud<33) return "green"
	else if(inhoud<66) return "yellow"
	else if(inhoud<80) return "orange"
	else return "red"
}
function addMarker(lat,lng,inhoud,adres) {
	marker=L.circleMarker([lat,lng], {
		color: inhoudToColor(inhoud)
	}).addTo(map);
	marker.bindPopup(adres+'('+inhoud+'% vol)')
	markers.push(marker);
}
function addListRow() {
	items=Object.values(arguments)
	$('#list').append('<tr containerId="'+items.shift()+'"><td>'+items.join('</td><td>')+'</td></tr>')
}
function updateContainers() {
	markers.forEach(function (marker) {
		map.removeLayer(marker);
	})
	$.get(serverUrl,function (containers) {
		$('#list').html('<tr><th>Adres</th><th>Inhoud</th><th>laatst geupdate</th></tr>')
		containers.forEach(function(container) {
			addListRow(container.id,container.adres,inhoudToString(container.inhoud),container.updateTime)
			addMarker(container.lat,container.lng,container.inhoud,container.adres)
		})
	})
}
updateContainers() 
