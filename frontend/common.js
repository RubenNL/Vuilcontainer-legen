serverUrl='/nodejs'
L.mapquest.key = 'hU15IN5Tl6oAibfsQy7l8ErOAnsmWqWL';
map = L.mapquest.map('map', {
	center: [52.177439, 5.278999],
	layers: L.mapquest.tileLayer('map'),
	zoom: 10
});
function inhoudToString(inhoud) {
	if(inhoud<33) return "Leeg"
	else if(inhoud<66) return "Halfvol"
	else if(inhoud<80) return "Bijna vol"
	else return "Vol"
}
function addMarker(lat,lng,color) {
	const markerHtmlStyles = `
		background-color: ${color};
		width: 2rem;
		height: 2rem;
		display: block;
		left: -1rem;
		top: -1rem;
		position: relative;
		border-radius: 1rem 1rem 0;
		transform: rotate(45deg);
		border: 1px solid #FFFFFF`

	const icon = L.divIcon({
		className: "container-pin",
		iconAnchor: [0, 24],
		labelAnchor: [-6, 0],
		popupAnchor: [0, -24],
		html: `<span style="${markerHtmlStyles}" />`
	})
	L.marker([lat,lng],{icon:icon}).addTo(map);
}
function inhoudToColor(inhoud) {
	if(inhoud<33) return "green"
	else if(inhoud<66) return "yellow"
	else if(inhoud<80) return "orange"
	else return "red"
}
function addContainer(lat,lng,adres,callback) {
	$.post(serverUrl,JSON.stringify({lat:lat,lng:lng,adres:adres}),function(data){
		if(data.id) callback(data.id)
		else callback()
		updateContainers()
	},'json')
}
function updateContainers() {
	$.get(serverUrl,function (containers) {
		$('#list').html('<tr><th>Adres</th><th>Inhoud</th><th>laatst geupdate</th></tr>')
		containers.forEach(function(container) {
			$('#list').append('<tr><td>'+container.adres+'</td><td>'+inhoudToString(container.inhoud)+'</td><td>'+container.updateTime+'</td></tr>')
			addMarker(container.lat,container.lng,inhoudToColor(container.inhoud))
		})
	})
}
updateContainers() 
