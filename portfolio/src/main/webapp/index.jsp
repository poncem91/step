<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>Mafe's Portfolio</title>
    <link rel="stylesheet" href="style.css">
    <script type='text/javascript' src='config.js'></script>
    <script src="script.js"></script>
    <!--Social Media Icons -->
    <script src="https://kit.fontawesome.com/71105f4105.js" crossorigin="anonymous"></script> 
  </head>
  <%@ page import = "com.google.appengine.api.users.UserService" %>
  <%@ page import = "com.google.appengine.api.users.UserServiceFactory" %>
  <%
        UserService userService = UserServiceFactory.getUserService();
        String userId = "";
        boolean userLogged = false;
        if (userService.isUserLoggedIn()) {
            userId = userService.getCurrentUser().getUserId();
            userLogged = true;
        }
  %>
  <body onload="getComments(5); loadMaps()" data-user-id="<%=userId%>" data-user-logged="<%=userLogged%>">

    <!-- Sticky Navbar -->
    <div id="navbar">
        <div id="navbar-title">
            Mafe's Portfolio
        </div>
        <div id="navbar-right">
            <a href="#" onclick="return scrollToSection('aboutme');">About Me</a>
            <a href="#" onclick="return scrollToSection('projects');">Projects</a>
            <a href="#" onclick="return scrollToSection('workexperience');">Work Experience</a>
            <a href="#" onclick="return scrollToSection('contactme');">Contact Me</a>
        </div>
    </div>

    <!-- Site Content -->
    <div id="content">

      <!-- About Me Section -->
      <section id="aboutme">
          <h1>About Me</h1>
          <p>Hello! My name is Mafe and I am currently a STEP intern at Google. 
          I was born and raised in Lima, Peru and moved to the US about 6 years ago to pursue my college degree. 
          It wasn't until after I graduated from college that I discovered my passion for Computer Science and programming, 
          so I decided to go back to school to complete a second bachelors in Computer Science. 
          I just wrapped up my first year as a CS student and I am loving every minute of it!
          </p>
          <p>In my free time I enjoy cooking, playing tennis, skiing or snowboarding, and hiking with my dog Arlo. 
          Arlo is a 4-year-old English Setter who enjoys eating, sleeping, eating, hiking, and sleeping.
          </p>
          
          <!-- Arlo Sub-Section -->
          <div id="arlo">
              <!-- Gallery Thumbnails -->
              <div class="row">
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo1-t.jpg" alt="Arlo chilling in driveway" onclick="openLightbox(0);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo2-t.jpg" alt="Arlo cooling himself down in stream" onclick="openLightbox(1);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo3-t.jpg" alt="Arlo happy next to lake" onclick="openLightbox(2);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo4-t.jpg" alt="Lazy Arlo" onclick="openLightbox(3);">
                  </div>
              </div>
              <div class="row">
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo5-t.jpg" alt="Arlo looking at the neighbours" onclick="openLightbox(4);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo6-t.jpg" alt="Arlo sitting during hike" onclick="openLightbox(5);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo7-t.jpg" alt="Arlo relaxing on grass" onclick="openLightbox(6);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo8-t.jpg" alt="Arlo about to be hit by a snowball" onclick="openLightbox(7);">
                  </div>
              </div>
              <div class="row">
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo9-t.jpg" alt="Arlo dozing off" onclick="openLightbox(8);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo10-t.jpg" alt="Arlo and his brother Benji" onclick="openLightbox(9);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo11-t.jpg" alt="Arlo pretending he's a human sitting on the couch" onclick="openLightbox(10);">
                  </div>
                  <div class="column">
                      <img class="thumbnail" src="/images/arlo12-t.jpg" alt="Arlo being goofy" onclick="openLightbox(11);">
                  </div>
              </div>

              <!-- Make Arlo Talk -->
              <p>Click here to make Arlo talk:</p>
              <button onclick="addRandomArloMessage()">Talk</button>
              <div id="arlo-talks-container"></div>
          </div>
      </section>

      <!-- Projects Section -->
      <section id="projects">
          <h1>Projects</h1>
          <dl>
              <dt>Finance:</dt>
              <dd>A mock stock-trading website implemented using Python, SQL, and Flask, where a user can register, login, change passwords, buy and sell stocks, and see their transaction history.</dd>
              
              <dt>Liberty Slot Machine:</dt>
              <dd>A three-part program implemented in Python to simulate a game of the Liberty Bell Slot Machine.<dd>
              <dd>Part one tests a series of known spins and outputs expected payout.</dd>
              <dd>Part two estimates how much money you would expect to earn for every $1 spent, using a simulation of 5000 rounds of the game.</dd>
              <dd>Part three simulates an Interactive Liberty Bell Game with a starting amount of money inputted by the user, deducts money spent and adds payouts to user's balance as user keeps playing, while letting user know the result of each round played. As each round ends, the user's current balance is printed and user is asked if they want to continue playing. Once balance reaches less than 5 cents, current game ends as not enough money is available to play.</dd>
              
              <dt>Data Visualizations:</dt>
              <dd>Program implemented in Python that uses Pandas, Matplotlib and Numpy to create data visualizations from a csv file.</dd>
              
              <dt>Speller Dictionary:</dt>
              <dd>A dictionary implemented in C used in a program that spell-checks a file.</dd>
          </dl>
      </section>

      <!-- Work Experience Section -->
      <section id="workexperience">
          <h1>Work Experience</h1>
          <dl>
              <dt>Google</dt>
              <dt class="workposition">Current - Student Training in Engineering Program (STEP) Intern</dt>
              <dd>Gain experience using different tools and technologies and develop a web application with other STEP team members.</dd>

              <dt>Montana State University - Human Interaction Lab</dt>
              <dt class="workposition">Spring 2020 - Student Research Assistant</dd>
              <dd>Assist in the preliminary stages of a research project that seeked to use machine learning to improve the collaboration between humans and robots.</dd>
              
              <dt>Foundant Technologies</dt>
              <dt class="workposition">Spring 2020 - Client Services Intern</dt>
              <dd>Assist clients that use Foundant's grant and scholarship management software or fund accounting software with any technical support questions or issues they might have.</dd>
              
              <dt>Silver Lining Entertainment</dt>
              <dt class="workposition">October 2016 to November 2018 - Talent Manager's Assistant</dt>
              <dd>Managed desk of 20+ actors and coordinated between production, publicists, casting, and clients. Logged over 2,000 company commissions and increased efficiency by digitizing the tracking system.</dd>
              
              <dt>USC Annenberg - Media, Diversity, & Social Change Initiative</dt>
              <dt class="workposition">Summer 2015 - Student Research Assistant</dt>
              <dd>Analyzed and quantified TV & Film content metrics for the 2014-2015 study: 'Inclusion or Invisibility? The Comprehensive Annenberg Report on Diversity in Entertainment' as seen <a href="https://bit.ly/2oBKDUr">here.</a></dd>
      </section>

      <!-- Contact Me Section -->
      <section id="contactme">
          <h1>Contact Me</h1>
          <p>Please feel free to connect with me through any of the below social platforms, by leaving a comment below, or by sharing where you are visiting from using the map below!</p>

          <%
          if (userService.isUserLoggedIn()) {
            String urlToRedirectToAfterUserLogsOut = "/";
            String logoutUrl = userService.createLogoutURL(urlToRedirectToAfterUserLogsOut);

          %>
          <p class="login-messages">(You are logged in as <%=userService.getCurrentUser().getEmail()%>. <a href="<%=logoutUrl%>">Logout.</a>)</p>

          <!-- Comments Sub-Section -->
          <form action="/comments" method="POST" id="commentform" data-user-id="<%=userId%>">
          <p>
              <label for="name">Name:</label>
              <input id="name" type="text" name="name" placeholder="Optional">
          </p>
          <p>
              <label for="comment">Comment:</label>
              <textarea id="comment" name="comment" rows="5" required="required" placeholder="Required"></textarea>
          </p>
          <p>
              <input id="submit" type="submit" />
          </p>
          </form>
          <%
          } else {
              String urlToRedirectToAfterUserLogsIn = "/";
              String loginUrl = userService.createLoginURL(urlToRedirectToAfterUserLogsIn);
          %>
          <p class="login-messages">(You must login before submitting a comment or adding a marker in the map. <a href="<%=loginUrl%>">Login.</a>)</p>
          <%
          }
          %>
          <p>
              <div id="display-options">
                  <div id="maxcomments-div">
                      <label for="maxcomments">Choose the Number of Comments to Display Below:</label>
                      <select name="maxcomments" id="maxcomments" onchange="getComments(this.value, getFilter())">
                          <option value="5" selected>5</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="50">50</option>
                      </select>
                  </div>
                  <div id="filtercomments-div">
                      <label for="filter-input">Filter comments by name:</label>
                      <input id="filter-input" name="filter-input" type="text" placeholder="Enter Full Name">
                      <button id="filter-button" onclick="getComments(getMaxComments(), getFilter())">Filter</button>
                  </div>
              </div>
          </p>
          <div id="comments-history"></div>

          <%
          if (userService.isUserLoggedIn()) {
          %>
          <button onclick="deleteComments('all');" id="delete-all">Delete All Your Comments</button>
          <%
          }
          %>

          <!-- Map Sub-Section -->
          <div id="map"></div>

          <!-- Social Media Sub-Section -->
          <div class="row">
              <div class="column social-media">
                  <a href="https://linkedin.com/in/mariafep" id="linkedin"><i class="fab fa-linkedin fa-7x"></i></a>
              </div>
              <div class="column social-media">
                  <a href="https://facebook.com/mariafe.ponce" id="facebook"><i class="fab fa-facebook-square fa-7x"></i></a>
              </div>
              <div class="column social-media">
                  <a href="https://instagram.com/mafeponce91" id="instagram"><i class="fab fa-instagram-square fa-7x"></i></a>
              </div>
              <div class="column social-media">
                  <a href="https://github.com/poncem91" id="github"><i class="fab fa-github fa-7x"></i></a>
              </div>
          </div>
      </section>
    </div>

    <!-- Lightbox Gallery -->
          <div id="lightbox">
              <a class="interface-buttons" id="close" onclick="closeLightbox();">Close X</a>
              <div class="lightbox-content">
                  <a class="interface-buttons" id="prev" onclick="changePic(-1)">&#10094;</a>
                  <a class="interface-buttons" id="next" onclick="changePic(1)">&#10095;</a>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo1.jpg" alt="Arlo chilling in driveway">
                      <figcaption>Arlo chilling in driveway</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo2.jpeg" alt="Arlo cooling himself down in stream">
                      <figcaption>Arlo cooling himself down in stream</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo3.jpeg" alt="Arlo happy next to lake">
                      <figcaption>Arlo happy next to lake</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo4.jpeg" alt="Lazy Arlo">
                      <figcaption>Lazy Arlo</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo5.jpg" alt="Arlo looking at the neighbours">
                      <figcaption>Arlo looking at the neighbours</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo6.jpeg" alt="Arlo sitting during hike">
                      <figcaption>Arlo sitting during hike</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo7.jpeg" alt="Arlo relaxing on grass">
                      <figcaption>Arlo relaxing on grass</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo8.jpeg" alt="Arlo about to be hit by a snowball">
                      <figcaption>Arlo about to be hit by a snowball</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo9.jpeg" alt="Arlo dozing off">
                      <figcaption>Arlo dozing off</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo10.jpeg" alt="Arlo and his brother Benji">
                      <figcaption>Arlo and his brother Benji</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo11.jpeg" alt="Arlo pretending he's a human sitting on the couch">
                      <figcaption>Arlo pretending he's a human sitting on the couch</figcaption>
                  </figure>
                  <figure class="lightbox-pic">
                      <img src="/images/arlo12.jpeg" alt="Arlo being goofy">
                      <figcaption>Arlo being goofy</figcaption>
                  </figure>
              </div>
          </div>
          
  </body>
</html>
