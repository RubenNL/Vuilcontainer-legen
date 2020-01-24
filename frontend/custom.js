map.locate()
map.on('locationfound',function(event) {
	latlng=event.latlng
	if(map.getBounds().contains(latlng)) {//source: https://stackoverflow.com/a/37270202/5981611
		view(latlng)//zorgt ervoor dat er niet buiten Utrecht wordt gezoomd
	}
})
