// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var mapskey = config.MAPS_KEY;

/**
 * Adds a random Arlo message to the page.
 */
function addRandomArloMessage() {
    const arloMessages =
        ['Woof!', 'Woof, Woof!', 'Squirrel?!', 'Treats?!', 'Park?!', 'Zzzzz'];

    // Pick a random greeting.
    const arloMessage = arloMessages[Math.floor(Math.random() * arloMessages.length)];

    // Add it to the page.
    const arloTalksContainer = document.getElementById('arlo-talks-container');
    arloTalksContainer.innerText = arloMessage;
}

/**
 * Shrinks the navbar when user scrolls down.
 */
window.onscroll = function() {shrinkNavBar()};

function shrinkNavBar() {
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        document.getElementById("navbar").style.paddingTop = "15px";
        document.getElementById("navbar").style.paddingBottom = "15px";
        document.getElementById("navbar-title").style.fontSize = "18px";
        document.getElementById("navbar-right").style.top = "0px";
    } else {
        document.getElementById("navbar").style.paddingTop = "35px";
        document.getElementById("navbar").style.paddingBottom = "35px";
        document.getElementById("navbar-title").style.fontSize = "30px";
        document.getElementById("navbar-right").style.top = "10px";
    }
}

/**
 * Smooths scrolls to specific Section
 */
function scrollToSection(sectionId) {
    let goToLocation;

    // this assures that when scrolling to aboutme section it scrolls all the way up so the navbar expands to its initial size
    if (sectionId == 'aboutme') {
        goToLocation = - window.pageYOffset;
    } else {
        goToLocation = document.getElementById(sectionId).getBoundingClientRect().top - 30;
    }

    window.scrollBy({
        top: goToLocation,
        behavior: 'smooth'
    });
    return false;
}


// LIGHTBOX --------------------------------------------------------------------

// keeps track of current picture currently opened and of array of Pics
var currPic;
const picsArray = document.getElementsByClassName("lightbox-pic");

/** Displays Lightbox open user click */
function openLightbox(picIndex) {
    document.getElementById("lightbox").style.display = "flex";
    showPic(picIndex);
}

/** Helper function to show specific picture in lightbox */
function showPic(picIndex) {
    for (var i = 0; i < picsArray.length; i++) {
        picsArray[i].style.display = "none";
    }
    picsArray[picIndex].style.display = "block";
    currPic = picIndex;
}

/** Previous and Next picture functionality */
function changePic(byIndex) {
    currPic += byIndex;
    currPic = (currPic + picsArray.length) % picsArray.length;
    showPic(currPic);
}

/** Closes lightbox */
function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

/** Keyboard functionality */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
        closeLightbox();
    }
    else if (event.key === 'ArrowRight' || event.keyCode === 39) {
        changePic(1);
    }
    else if (event.key === 'ArrowLeft' || event.keyCode === 37) {
        changePic(-1);
    }
});


// COMMENTS --------------------------------------------------------------------

/** Fetches Comments with specified Max Number of Comments and Filter by Name */
function getComments(maxComments, filterInput) {

    if (filterInput === undefined) {
        filterInput = "";
    }

    const url = "/comments?maxcomments=" + maxComments + "&filter=" + filterInput;

    fetch(url).then(response => response.json()).then((comments) => {

        const commentsHistory = document.getElementById('comments-history');
        commentsHistory.innerHTML = '';
        
        comments.map(constructCommentNode).forEach(node => commentsHistory.appendChild(node));
    });
}

/** Helper Function that constructs commentNodes */
function constructCommentNode(comment) {

    var commentNode = document.createElement('div');
    commentNode.classList.add("comment");

    var headerNode = document.createElement('div');
    headerNode.classList.add("comment-row", "comment-header");

    var nameNode = document.createElement('div');
    nameNode.classList.add("comment-name");
    nameNode.innerText = comment.name;

    var timestampNode = document.createElement('div');
    timestampNode.classList.add("comment-timestamp");
    timestampNode.innerText = comment.datetime;

    var deleteNode = document.createElement('div');
    deleteNode.classList.add("comment-delete");
    var deleteLinkNode = document.createElement('a');
    deleteLinkNode.classList.add("comment-delete-link");

    const userId = document.body.dataset.userId;

    if (comment.userId == userId) {
        deleteLinkNode.innerText = "×";
        deleteLinkNode.setAttribute("onclick", "deleteComments(this.dataset.commentId, getFilter())");
    } else {
        deleteLinkNode.innerText = " ";
    }
    deleteLinkNode.setAttribute("data-comment-id", comment.id);
    
    deleteNode.appendChild(deleteLinkNode);

    headerNode.appendChild(nameNode);
    headerNode.appendChild(timestampNode);
    headerNode.appendChild(deleteNode);

    var messageNode = document.createElement('div');
    messageNode.classList.add("comment-row");
    messageNode.innerText = comment.message;

    commentNode.appendChild(headerNode);
    commentNode.appendChild(messageNode);

    return commentNode;
}

/** Deletes Comments */
function deleteComments(commentId, filterInput) {
    const url = "/comments?id=" + commentId;
    const request = new Request(url, {method: 'DELETE'});
    fetch(request).then(() => {
        getComments(getMaxComments(), filterInput)
    })
}

/** Gets and returns value in Filter Input field */
function getFilter() {
    return document.getElementById('filter-input').value;
}

/** Gets and returns value in maxComments input field */
function getMaxComments() {
    return document.getElementById('maxcomments').value;
}


// MAPS --------------------------------------------------------------------

let map;
let editMarker;

// map to keep track of markers and infowindows displayed so they can later be referenced to be removed
let markersMap = new Map();
let infoWindows = [];
let infoWindowsOpened = 0;

/** Function that dynamically adds the maps API and load the map */
function loadMaps(){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =  "https://maps.googleapis.com/maps/api/js?key=" + mapskey + "&callback=initMap";
    script.defer = true;
    script.async = true;

    window.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 20, lng: 10},
          zoom: 2,
          styles:   [
                        {
                            "featureType": "landscape.man_made",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#fafafa"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape.natural",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#d3d3d3"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#d3d3d3"
                                },
                                {
                                    "lightness": -15
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#4c4c4c"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#ececec"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "color": "#c8c8c8"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#fbfbfb" 
                                }
                            ]   
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text",
                            "stylers": [
                                {
                                    "color": "#4c4c4c" 
                                }
                            ]   
                        }
                    ]
        });
        
        // Closes all infowindows or allows logged users to add markers when clicking on map
        map.addListener('click', (event) => {
            if ((document.body.dataset.userLogged === "true") && (infoWindowsOpened === 0)) {
                addMarker(event.latLng.lat(), event.latLng.lng());
            }  else {
                infoWindows.forEach(infoWindow => {
                    infoWindow.close();
                });
                infoWindowsOpened = 0;
            }
        });
        fetchMarkers();

        if (document.body.dataset.userLogged === "true") {
            var deleteMarkersControlNode = document.createElement('div');
            var deleteMarkersControl = new DeleteMarkersControl(deleteMarkersControlNode);
            deleteMarkersControlNode.index = 1;
            map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(deleteMarkersControlNode);
        }
        
    }
    document.head.appendChild(script);
    document.getElementById('map').style.display = "block";
}

/** Fetches markers from servlet to display on load */
function fetchMarkers() {
    fetch('/markers').then(response => response.json()).then((markers) => {
        markers.forEach((marker) => {
            displayMarker(marker.lat, marker.lng, marker.userId, marker.id);
        });
    });
}

/** Lets user click on the map to add markers */
function addMarker(lat, lng) {

    if (editMarker) {
        editMarker.setMap(null);
    }

    editMarker = new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});
    const infoWindow = new google.maps.InfoWindow({content: constructAddMarkerButton(lat, lng)});

    // If the user closes the info window, remove the marker.
    google.maps.event.addListener(infoWindow, 'closeclick', () => {
        editMarker.setMap(null);
    });

    infoWindow.open(map, editMarker);
}

/** Builds and returns Add button node */
function constructAddMarkerButton(lat, lng) {
    const addButton = document.createElement('button');
    addButton.innerText = "Add";

    addButton.onclick = () => {
        sendMarker(lat, lng);
        editMarker.setMap(null);
    };
    return addButton;
}

/** Sends marker to servlet */
function sendMarker(lat, lng) {
    const url = "/markers?lat=" + lat + "&lng=" + lng;
    const request = new Request(url, {method: 'POST'});
    
    fetch(request).then((response) => response.json()).then((marker) => {
        displayMarker(marker.lat, marker.lng, marker.userId, marker.id);
    });
}

/** Helper function that displays markers */
function displayMarker(lat, lng, userId, id) {
    const marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        userId: userId,
        id: id});
    markersMap.set(id, marker);

    var infoWindow = new google.maps.InfoWindow;
    infoWindow.addListener('closeclick', () => {
        infoWindowsOpened--;
    });

    var geocoder = new google.maps.Geocoder;
    marker.addListener('click', () => {
        openInfoWindow(map, marker, infoWindow, geocoder);
    });
}

/** Builds and Opens Info Window */
function openInfoWindow(map, marker, infoWindow, geocoder) {
    const latlng = marker.get('position');
    const textNode = document.createElement('div');
    const windowNode = document.createElement('div');

    // Retrieves general location address and updates textNode
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status == 'OK') {
            if (results[0]) {
                var result = results[0]
                var city = "";
                var state = "";
                var country = "";
                for (var i = 0; i < result.address_components.length; i++) {
                    var component = result.address_components[i];
                    if ((city == "") && (component.types.indexOf("political") >= 0 )) {
                        city = component.long_name + ", ";
                    }
                    if ((state == "") && (component.types.indexOf("administrative_area_level_1") >= 0 )) {
                        state = component.short_name + ", ";
                    }
                    if ((country == "") && (component.types.indexOf("country") >= 0 )) {
                        country = component.long_name;
                    }
                }
                textNode.innerText = city + state + country;
            }
        }
    });

    windowNode.appendChild(textNode);

    // gives users who created the marker the option to delete it
    if (marker.get('userId') == document.body.dataset.userId) {
        const deleteButton = document.createElement('button');
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => {deleteMarker(marker.get('id'));}
        windowNode.appendChild(deleteButton);
    }
    
    infoWindow.setContent(windowNode);
    infoWindow.open(map, marker);
    infoWindows.push(infoWindow);
    infoWindowsOpened++;
}

/** Deletes Single Marker */
function deleteMarker(markerId) {
    const url = "/markers?id=" + markerId;
    const request = new Request(url, {method: 'DELETE'});
    
    fetch(request).then(() => {
        markersMap.get(markerId).setMap(null);
        markersMap.delete(markerId);
    });
}

/** Constructs Delete All Markers Map Control */
function DeleteMarkersControl(controlNode) {
    var controlUI = document.createElement('div');
    controlUI.setAttribute("id", "delete-markers-control");
    controlUI.title = "Click to delete all your markers";
    controlUI.textContent = "Delete All Your Markers";
    controlNode.appendChild(controlUI);
    controlUI.addEventListener('click', deleteAllMarkers);
}

/** Deletes All User Added Markers */
function deleteAllMarkers() {
    const request = new Request("/markers?id=all", {method: 'DELETE'});
    fetch(request).then(response => response.json()).then(markerIds => {

            // Closes all infowindows first
            infoWindows.forEach(infoWindow => {
                        infoWindow.close();
                    });
            infoWindowsOpened = 0;

            // Clears all user markers
            markerIds.forEach(markerId => {
                markersMap.get(markerId).setMap(null);
                markersMap.delete(markerId);
            })
    });

}
