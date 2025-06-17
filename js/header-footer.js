const header = document.querySelector("header");
const footer = document.querySelector("footer");

header.innerHTML = `
  <a href="./index.html">
    <img
      class="fa-logo"
      src="./assets/images/logos/FA Logo Centered.jpg"
      alt="FableArts logo" />
  </a>
  <div class="spacer"></div>
  <nav class="nav-container">
    <ul class="nav-list">
      <li class="nav-item">
        <a href="./index.html">Home</a>
      </li>
      <li class="nav-item">
        <a href="./about.html">About</a>
        <div class="nav-inner-dropdown">
          <ul>
            <li class="nav-item">
              <a href="./about.html"><span>FABLE ARTS</span></a>
            </li>
            <li class="nav-item">
              <a href="./team.html">Team</a>
            </li>
            <li class="nav-item">
              <a href="../artists.html">Artists</a>
            </li>
          </ul>
        </div>
      </li>
      <li class="nav-item">
        <a href="./discover.html">Discover</a>
        <div class="nav-inner-dropdown">
          <ul>
            <!-- <li class="nav-item">
              <a href="./events.html">Events</a>
            </li> -->
          <!--  <li class="nav-item">
              <a href="./media.html">Media</a>
            </li> -->
          </ul>
        </div>
      </li>
      <li class="nav-item nav-support-item">
        <a href="./support_FA.html">
          Support
          <span style="font-style: italic; font-weight: bold">FA</span>
        </a>
        <div class="nav-inner-dropdown">
          <ul>
            <li class="nav-item">
              <a href="./contact.html">Mailing List</a>
            </li>
            <li class="nav-item">
              <a href="./support_FA.html">Donate</a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
  <div class="small-nav-box">
    <img class="burger-menu-image" alt="menu icon" onclick="toggleShow()"/>
    <div class="small-page-nav-list">
      <ul class="">
        <li class="nav-item">
          <a href="./index.html">Home</a>
        </li>
        <li class="nav-item">
          <a href="./about.html">About</a>
        </li>
        <li class="nav-item">
          <a href="./team.html">The Team</a>
        </li>
        <li class="nav-item">
          <a href="./artists.html">The Artists</a>
        </li>
        <li class="nav-item">
          <a href="./discover.html">Discover</a>
        </li>
        <!-- <li class="nav-item">
          <a href="./events.html">Events</a>
        </li> -->
        <li class="nav-item nav-support-item">
          <a href="./support_FA.html"
            >Support <span class="fa">FA</span></a
          >
        </li>
      </ul>
    </div>
  </div>
  <div class="socials-container">
    <div class="test"></div>
    <a
      href="https://www.instagram.com/fable_arts"
      target="_blank"
      class="insta-link">
      <img
        src="./assets/images/icons/instagram_icon.svg"
        alt="Instagram logo" />
    </a>
    <a
      href="https://www.youtube.com/@fable_arts"
      target="_blank"
      class="youtube-link">
      <img
        src="./assets/images/icons/youtube_icon.svg"
        alt="YouTube logo" />
    </a>
    <a
      href="https://www.facebook.com/fableartsfb"
      target="_blank"
      class="facebook-link">
      <img
        src="./assets/images/icons/facebook_icon.svg"
        alt="Facebook logo" />
    </a>
  </div>`;

footer.innerHTML = `
  <div class="footer-left"></div>
  <div class="copyright-container">
    <p class="copyright">
      Copyright 2024 <span class="fa">FABLE\&nbsp;ARTS</span>
    </p>
  </div>
  <div class="footer-right">
    <a
      href="./contact.html"
      class="contact">
      Contact <span class="fa contact">FA</span>. 
    </a>
  </div>`;

const smallNav = document.querySelector(".small-nav-box");
const navList = smallNav.querySelector(".small-page-nav-list");
const smallNavImg = smallNav.querySelector(".burger-menu-image");
let isNavShown = false;
function toggleShow() {
  if (!isNavShown) {
    navList.style.display = "block";
  } else {
    navList.style.display = "none";
  }
  navList.classList.toggle("visible-nav-list");
  isNavShown = !isNavShown;
  console.log(navList);
  smallNavImg.classList.toggle("burger-menu-image--clicked");
}
