serverUrl='https://afval.rubend.nl/nodejs'
markers=[]
L.mapquest.key = 'hU15IN5Tl6oAibfsQy7l8ErOAnsmWqWL';
map = L.mapquest.map('map', {
	center: [52.177439, 5.278999],
	layers: L.mapquest.tileLayer('map'),
	zoom: 10
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
	const markerHtmlStyles = `
		background-color: ${inhoudToColor(inhoud)};
		width: 2rem;
		height: 2rem;
		display: block;
		left: -1rem;
		top: -1rem;
		position: relative;
		border-radius: 1rem 1rem 0;
		transform: rotate(45deg);
		border: 1px solid #FFFFFF`	//bron:https://stackoverflow.com/a/40870439
	const icon = L.divIcon({
		className: "container-pin",
		iconAnchor: [0, 24],
		labelAnchor: [-6, 0],
		popupAnchor: [0, -24],
		html: `<span style="${markerHtmlStyles}" />`
	})
	marker=L.marker([lat,lng],{icon:icon}).addTo(map)
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
