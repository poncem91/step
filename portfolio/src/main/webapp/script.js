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
    document.getElementById("navbar-right").style.top = "5px";
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