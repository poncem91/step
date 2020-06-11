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

// map to keep track of markers displayed so they can later be referenced to be removed
let markersMap = new Map();

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
        
        map.addListener('click', (event) => {
            addMarker(event.latLng.lat(), event.latLng.lng());
        });

        fetchMarkers();
    }
    document.head.appendChild(script);
    document.getElementById('map').style.display = "block";
}

/** Fetches markers from servlet to display */
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

/** Helper function that displays markers with specified lat and lng */
function displayMarker(lat, lng, userId, id) {
    const marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        userId: userId,
        id: id});
    markersMap.set(id, marker);

    if (marker.get('userId') == document.body.dataset.userId) {
        const infoWindow = new google.maps.InfoWindow({content: constructDeleteMarkerButton(lat, lng, marker.get('id'))});
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
}

/** Builds and returns Delete button node */
function constructDeleteMarkerButton(lat, lng, id) {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";

    deleteButton.onclick = () => {
        markersMap.get(id).setMap(null);
        markersMap.delete(id);
        deleteMarker(lat, lng);
    };
    return deleteButton;
}

/** Deletes Marker */
function deleteMarker(lat, lng) {
    const url = "/markers?lat=" + lat + "&lng=" + lng;
    const request = new Request(url, {method: 'DELETE'});
    
    fetch(request);
}
