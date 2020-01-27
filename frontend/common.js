serverUrl='/nodejs'
maxBounds=[[52.030854,4.981787],[52.142064,5.1911489]]
L.mapquest.key = 'hU15IN5Tl6oAibfsQy7l8ErOAnsmWqWL';
markers={}
function view(latlng) {
	map.setView(latlng,16);//source: https://gis.stackexchange.com/a/147121
}
function trClick(event) {
	id=$(event.currentTarget).attr('containerid')
	if(!id) return //bij bovenste rij
	marker=markers[id]
	view(marker.getLatLng())
	marker.openPopup()
}
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
	if(inhoud==null) inhoud="onbekend"
	marker.bindPopup(adres+'('+inhoud+'% vol)')
	markers[id]=marker;
}
function updateContainers() {
	Object.keys(markers).forEach(function (id) {
		map.removeLayer(markers[id]);
	})
	markers={}
	$.get(serverUrl,function (containers) {
		$('#list').html('<tr><th>Adres</th><th>Inhoud</th><th>laatst geupdate</th></tr>')
		$('#list').append(containers.map(function(container) {
			addMarker(container.lat,container.lng,container.inhoud,container.adres,container.id)
			return '<tr containerId="'+container.id+'"><td class="containerNaam">'+container.adres+'</td><td>'+inhoudToString(container.inhoud)+'</td><td>'+container.updateTime+'</td></tr>'
		}).join())
	}) //met hulp van https://api.jquery.com/jQuery.get
}
map = L.mapquest.map('map', {
	center: [52.086459,5.086467],
	zoom: 11,
	layers: L.mapquest.tileLayer('map'),
	preferCanvas: true,//source:https://stackoverflow.com/a/43019740
	maxBounds:maxBounds
}); //source: https://developer.mapquest.com/
setTimeout(function () {
	if($('#map').height()==0) {
		$('tr').on('click',trClick)
		$('#map').height('256px')
		map.setMinZoom(11)
	}
},500) //allemaal voor compatibility op oude iphone(4s)
$(document).on('click','tr',trClick)
updateContainers()
/*
 * In dit bestand is veel gebruik gemaakt van https://leafletjs.com/reference-1.6.0.html
 */
