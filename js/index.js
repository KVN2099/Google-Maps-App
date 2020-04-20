var map;
var markers = [];
var infoWindow;

function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    });
    infoWindow = new google.maps.InfoWindow();
    showStoresMarkers();
}
function displayStores() {
  var storesHtml = '';
  var counter = 0;
  for (var store of stores) {
    var address = store['addressLines'];
    var phone = store['phoneNumber'];
    storesHtml += `<div class="store-container" onClick='setOnClickListener(${counter})'>
      <div class="store-info-container">
        <div class="store-address">
            <span>${address[0]}</span>
            <span>${address[1]}</span>
        </div>
        <div class="store-phone-number">${phone}</div>
      </div>
        <div class="store-number-container">
          <div class="store-number">
              ${counter+1}
          </div>
        </div>
    </div>`;
    document.getElementById('lista').innerHTML = storesHtml;
    counter++;
  }
}

function showStoresMarkers() {
  var bounds = new google.maps.LatLngBounds();
  var index = 0;
  for (var store of stores) {
    index++;
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );
    var name = store["name"];
    var address = store["addressLines"][0];
    var phone = store["phoneNumber"];
    var openStatus = store["openStatusText"];
    bounds.extend(latlng);
    createMarker(latlng, name, address, index+1, phone, openStatus);
  }
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, index, phone, status) {
  index--;
  var html = "<b>" + name + "</b> <br/><span id='infoWindow-address'>" + status + "</span><br><hr><i class='fas fa-directions'></i>  <a href='https://maps.google.com/?q="+address+"'>"
  + address + "</a><br><i class='fas fa-phone-square-alt'></i>  " + phone;
  // var image = 'https://image.flaticon.com/icons/svg/2754/2754727.svg';
  var image = {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Shopping_Cart_Flat_Icon_Vector.svg/512px-Shopping_Cart_Flat_Icon_Vector.svg.png',
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize : new google.maps.Size(45, 45)
  }
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    // label: index.toString(),
    icon: image
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function setOnClickListener(x) {
  var storeElements = document.querySelectorAll('.store-container');
  for (var storeElement of storeElements) {
      google.maps.event.trigger(markers[x], 'click');
    };
}
//  Id: zip-code-input
function searchPostalCode() {
  var code = document.getElementById('zip-code-input').value;
  if (code == "") {
    displayStores();
    return 0;
  }
  var count = 0;
  var storeHtml = ``;
    for (var store of stores) {
      if (store["address"]["postalCode"].substring(0,code.length) == code) {
        // google.maps.event.trigger(markers[count], 'click');
        storeHtml += `<div class="store-container" onClick='setOnClickListener(${count})'>
        <div class="store-info-container">
        <div class="store-address">
        <span>${store["addressLines"][0]}</span>
        <span>${store["addressLines"][1]}</span>
        </div>
        <div class="store-phone-number">${store["phoneNumber"]}</div>
        </div>
        <div class="store-number-container">
        <div class="store-number">
        ${count+1}
        </div>
        </div>
        </div>`;
        console.log(storeHtml);
      }
      count++;
    }
    document.getElementById('lista').innerHTML = "";
    document.getElementById('lista').innerHTML = storeHtml;
}
