//Deze code wordt alleen uitgevoerd bij de admin-pagina.
function postData(data,callback) {
	$.post(serverUrl,JSON.stringify(data),function(data) {
		updateContainers()
		callback(data)
	},'json')//met hulp van https://api.jquery.com/jQuery.post/
}
function addContainer(lat,lng,adres,callback) {
	postData({lat:lat,lng:lng,adres:adres},function(data){
		callback(data.id)
	})
}
function deleteContainer(id,callback) {
	postData({action:"delete",id:id},function(data){
		callback(data.status=="OK")
	})
}
map.on('click',function(event) {
	position=event.latlng
	adres=prompt('Wat is het adres van deze container?')
	if(adres) {
		addContainer(position.lat,position.lng,adres,function (id) {
			if(id) alert('Het nummer van de container is '+id+'.')
			else alert('er is iets fout gegaan bij het aanmaken van de container.')
		})
	}
})
$(document).on('click','tr',function (event) {
	id=$(event.currentTarget).attr('containerid')
	if(!id) return //bij bovenste rij
	if(confirm('wil je container '+id+' echt verwijderen?')) {
		deleteContainer(id,function (success) {
			if(!success) alert('verwijderen van container '+id+' niet gelukt. ververs de pagina en probeer het opnieuw.')
		})
	}
})
$('#h2').attr('href','instructies.html').text('Installatie instructies voor Raspberry Pi')
