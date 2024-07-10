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
        <a href="./2_about.html">About</a>
        <div class="nav-inner-dropdown">
          <ul>
            <li class="nav-item">
              <a href="./2_about.html"><span>FABLE ARTS</span></a>
            </li>
            <li class="nav-item">
              <a href="./3_staff.html">Team</a>
            </li>
            <li class="nav-item">
              <a href="./4_artists.html">Artists</a>
            </li>
          </ul>
        </div>
      </li>
      <li class="nav-item">
        <a href="./5_discover.html">Discover</a>
        <div class="nav-inner-dropdown">
          <ul>
            <li class="nav-item">
              <a href="./6_events.html">Events</a>
            </li>
            <li class="nav-item">
              <a href="./7_media.html">Media</a>
            </li>
          </ul>
        </div>
      </li>
      <li class="nav-item nav-support-item">
        <a href="./8_support_FA.html"
          >Support
          <span style="font-style: italic; font-weight: bold">FA</span></a
        >
        <div class="nav-inner-dropdown">
          <ul>
            <li class="nav-item">
              <a href="./9_contact.html">Mailing List</a>
            </li>
            <li class="nav-item">
              <a href="./8_support_FA.html">Donate</a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
  <div class="small-nav-box">
    <img alt="menu icon" onclick="toggleShow()"/>
    <div class="small-page-nav-list">
      <ul class="">
        <li class="nav-item">
          <a href="#">Home</a>
        </li>
        <li class="nav-item">
          <a href="#">About</a>
        </li>
        <li class="nav-item">
          <a href="#">Discover</a>
        </li>
        <li class="nav-item nav-support-item">
          <a href="./8_support_FA.html"
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
      Copyright 2024 <span class="fa">FABLE ARTS</span>
    </p>
  </div>
  <div class="footer-right">
    <a
      href="./9_contact.html"
      class="contact"
      >Contact <span class="fa contact">FA</span>.</a
    >
  </div>`;

const smallNav = document.querySelector(".small-nav-box")
const navList = smallNav.querySelector(".small-page-nav-list")

smallNav.addEventListener("click", (e) => {
  navList.classList.toggle("visible-nav-list")
})
smallNav.addEventListener("hover", (e) => {
  navList.classList.toggle("visible-nav-list")
})