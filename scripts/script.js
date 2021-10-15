
let map

const getIpData = (ip) => {
	let ipData 
	return $.ajax({
		url: `http://localhost:3000/${ip}`,
		success: function(data) {
			ipData = data

			if(map != undefined) {
				map.remove()
			}
			map = L.map('mapid', {
				center: [ipData.location.lat,ipData.location.lng],
				zoom: 13
			});
			L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				tileSize: 512,
				zoomOffset: -1,
				accessToken: 'pk.eyJ1IjoicmV0cm9ib290eSIsImEiOiJja3RkdGhyc3oyanNqMm9yNTJkcjFoZDA2In0.QSO-x9EIWy2gc2i2aXTH4w'
			}).addTo(map);
			L.marker([ipData.location.lat,ipData.location.lng]).addTo(map)
		}
	});
}

const updateUi = (data) => {
	console.log("data", data)
	document.getElementById('ip-address').innerHTML = data.ip
	document.getElementById('location').innerHTML = data.location.region
	document.getElementById('time-zone').innerHTML = `UTC ${data.location.timezone}`
	document.getElementById('isp').innerHTML = data.isp
}

const validateIPaddress = (ipaddress) => {  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
    return (true)  
  }  
  alert("You have entered an invalid IP address! - Matt 💀")  
  return (false)  
}  

$(document).ready( function() { 
	console.log("document is ready")

	$.get('https://www.cloudflare.com/cdn-cgi/trace', async function(data) {
		// Convert key-value pairs to JSON
		// https://stackoverflow.com/a/39284735/452587
		data = data.trim().split('\n').reduce(function(obj, pair) {
			pair = pair.split('=');
			return obj[pair[0]] = pair[1], obj;
		}, {});

		const userIp = data?.ip
		const res = await getIpData(userIp)

		updateUi(res)

		document.getElementById('loader').style.display = "none"
		document.getElementById('data-container').style.display = ""
	});

	$("#target").submit(async function( event ) {
		event.preventDefault();

		let data = $('#target').serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});

		let validIp = validateIPaddress(data.ip)	

		if (validIp) {
			let ipData = await getIpData(data.ip)
			// update ui
			if(ipData.ip!=undefined){
				updateUi(ipData)
			}
		}
	});
});