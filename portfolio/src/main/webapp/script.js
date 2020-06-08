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

/**
 * Lightbox Gallery Implementation
 */

// keeps track of current picture currently opened and of array of Pics
var currPic;
const picsArray = document.getElementsByClassName("lightbox-pic");

// Displays Lightbox open user click
function openLightbox(picIndex) {
    document.getElementById("lightbox").style.display = "flex";
    showPic(picIndex);
}

// Helper function to show specific picture in lightbox
function showPic(picIndex) {

    for (var i = 0; i < picsArray.length; i++) {
        picsArray[i].style.display = "none";
    }

    picsArray[picIndex].style.display = "block";
    currPic = picIndex;

}

// Previous and Next picture functionality
function changePic(byIndex) {
    currPic += byIndex;
    currPic = (currPic + picsArray.length) % picsArray.length;
    showPic(currPic);
}

// Closes lightbox
function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

// Keyboard functionality
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

/** Fetches Comments with specified Max Number of Comments and Filter by Name */
function getComments(maxComments, filterInput) {

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

    if (comment.email === "") {
        nameNode.innerText = comment.name;
    } else {
        var emailNode = document.createElement('a');
        emailNode.classList.add("comment-email");
        emailNode.innerText = comment.name;
        emailNode.href = "mailto:" + comment.email;
        nameNode.appendChild(emailNode);
    }

    var timestampNode = document.createElement('div');
    timestampNode.classList.add("comment-timestamp");
    timestampNode.innerText = comment.datetime;

    var deleteNode = document.createElement('div');
    deleteNode.classList.add("comment-delete");
    var deleteLinkNode = document.createElement('a');
    deleteLinkNode.classList.add("comment-delete-link");
    deleteLinkNode.innerText = "×";
    deleteLinkNode.setAttribute("data-comment-id", comment.id);
    deleteLinkNode.setAttribute("onclick", "deleteComments(this.dataset.commentId, getFilter())");
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