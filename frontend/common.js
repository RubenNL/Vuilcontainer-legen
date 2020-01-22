serverUrl='https://afval.rubend.nl/nodejs'
markers={}
L.mapquest.key = 'hU15IN5Tl6oAibfsQy7l8ErOAnsmWqWL';
$(document).on('click','tr',function (event) {
	id=$(event.currentTarget).attr('containerid')
	if(!id) return //bij bovenste rij
	marker=markers[id]
	map.panTo(marker.getLatLng())
	map.setZoom(16)
	marker.openPopup()
})
map = L.mapquest.map('map', {
	center: [52.086459,5.086467],
	layers: L.mapquest.tileLayer('map'),
	zoom: 12,
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
function addMarker(lat,lng,inhoud,adres,id) {
	marker=L.circleMarker([lat,lng], {
		color: inhoudToColor(inhoud)
	}).addTo(map);
	marker.bindPopup(adres+'('+inhoud+'% vol)')
	markers[id]=marker;
}
function updateContainers() {
	Object.values(markers).forEach(function (marker) {
		map.removeLayer(marker);
	})
	markers={}
	$.get(serverUrl,function (containers) {
		$('#list').html('<tr><th>Adres</th><th>Inhoud</th><th>laatst geupdate</th></tr>')
		$('#list').append(containers.map(function(container) {
			addMarker(container.lat,container.lng,container.inhoud,container.adres,container.id)
			return '<tr containerId="'+container.id+'"><td>'+container.adres+'</td><td>'+inhoudToString(container.inhoud)+'</td><td>'+container.updateTime+'</td></tr>'
		}).join())
	})
}
updateContainers()
