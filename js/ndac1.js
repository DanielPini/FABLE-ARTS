import password from "./data/ndac-password.js"

const ndac1Body = document.querySelector("body");
ndac1Body.innerHTML = `
<div class="pass-background">
  <form class="pass-container" action="#">
    <p>Please enter the passphrase to access <span style="font-size: 18px; font-style: italic; font-weight: 600;">Navigating Distance and </br> Closeness</span></p>
    <input class="pass-field" id="pass-field" type="password" placeholder="Password">
    <input class="pass-submit-btn" type="submit" value="Submit">
    </form>
</div>`;

const passForm = document.querySelector(".pass-container")
const passField = passForm.querySelector(".pass-field");
const submitBtn = passForm.querySelector(".pass-submit-btn");
passField.addEventListener("input", (e) => {
  console.log(e.target.value)
})
console.log(passField.innerText);
submitBtn.addEventListener("click", () => {
  const userPassword = document.getElementById("pass-field").value.toLowerCase();
  if(userPassword != password) {
    console.log(password);
    console.log(userPassword);
    console.log(userPassword + " does not equal " + password);
    passField.classList.add("wrong");
    passField.value = "";
    passField.placeholder = "Wrong password";
    submitBtn.value = "Please try again";
    console.log(userPassword);
    // window.location.assign("../index.html");
  } else {
    ndac1Body.classList.add("ndac-background-welcome")
    ndac1Body.innerHTML = `
    <header>
        <a href="../index.html">
          <img
            class="fa-logo"
            src="../assets/images/logos/FA Logo Centered.jpg"
            alt="FableArts logo" />
        </a>
        <nav class="ndac-nav-container">
          <a href="#"
            ><h1 class="ndac-header-title">
              Navigating Distance and Closeness
            </h1></a
          >
        </nav>
        <img
          src="#"
          alt=""
          id="ndac" />
        <div class="socials-container">
          <div class="test"></div>
          <a
            href="https://www.instagram.com/fable_arts"
            target="_blank"
            class="insta-link">
            <img
              src="../assets/images/icons/instagram_icon.svg"
              alt="Instagram logo" />
          </a>
          <a
            href="https://www.youtube.com/@fable_arts"
            target="_blank"
            class="youtube-link">
            <img
              src="../assets/images/icons/youtube_icon.svg"
              alt="YouTube logo" />
          </a>
          <a
            href="https://www.facebook.com/fableartsfb"
            target="_blank"
            class="facebook-link">
            <img
              src="../assets/images/icons/facebook_icon.svg"
              alt="Facebook logo" />
          </a>
        </div>
      </header>
      <main class="welcome-page-main">
        <section>
          <div class="welcome-video-container">
            <div class="welcome-headings">
              <h1 class="page-heading">Navigating Distance and Closeness</h1>
              <div class="welcome-subheading">
                <h2 class="page-subheading welcome-subheading">
                  About the work, <br />About the performers.
                </h2>
              </div>
            </div>
            <div class="welcome-video-wrapper">
              <iframe
                id="welcome-video"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/JAK1Uffr45Y"
                title="Navigating Distance and Closeness Welcome Video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen>
              </iframe>
            </div>
            <details class="transcript ndac-bio-text">
              <p>
                Hi, I'm Hamish - and I'm Niki - and welcome to our website where
                we're going to be exploring our work Navigating Distance and
                Closeness. We made this website in collaboration with
                <span class="fa">FABLE ARTS</span>
                and you're going to see some behind the scenes on how we made the
                work, what exactly is the work, and a performance of our work.
                Hamish and I were brought together as part of the Speak Percussion
                bespoke program which is for early- to mid-career artists.
                <br /><br />We were brought together to create a work that
                explored distance, closeness, and the things that we're both
                interested in, which includes found sounds, making new
                instruments, and exploratory percussion music.
                <br /><br />Navigating Distance and Closeness is a work created
                with purely home-made and bespoke instruments that are made from
                organic materials, and these instruments often have textured
                surfaces and they have kind of resonant cavities and we decided to
                create a work where they interact across space hence the title
                Navigating Distance and Closeness, so through the development
                process we explored close miking of the instruments, we explored
                how they can work together, and then we co-composed the work using
                a lot of different techniques including: working with electronics,
                working with traditional scores and less traditional scores, with
                texts, and other things like that. <br /><br />Hamish and I made
                this work during the COVID lockdowns and we were living in
                different States at the time, so Hamish was in Victoria and I was
                in New South Wales and during this period of COVID isolation we
                chose to use that idea of isolation and physical distance from
                each other as a conceptual framework for the piece. So that
                manifests in musical ideas of synchronized gestures, playing
                physically next to each other, and distance - us being physically
                separated on stage. <br /><br />Navigating Distance and Closeness
                is a composition in three movements. The first explores the
                interaction between ceramics and bamboo in close format, the
                second explores with electronics the bamboo and ceramic
                instruments with much more metered and rhythmic aspect, and the
                third movement explores the space with the instruments actually
                moving around while also interacting with an electronic backing
                track Niki and I premiered the work at Daraban Arts Center in
                Melbourne in 2012 and the video that you'll see at the end of this
                multi-page website is footage from that Premiere. Going forward
                we'd like to look at presenting this work in different kinds of
                venues and spaces where we're really able to exaggerate our themes
                of physical distance and physical closeness.
                <br /><br />Navigating Distance and Closeness is significant to
                both of us because it represents a work where we have, for the
                first time, created our instruments, created the stands that the
                instruments are performed upon, and also we've co-composed the
                work. For me that's definitely the first time we've done this I
                know I'm pretty sure that's the with you Niki and we're so excited
                for you to learn more about it and to see what makes this work
                special! <br /><br />Thanks for watching our introduction video
                and we hope you enjoy our website.
              </p>
              <summary class="page-subheading">
                <h3 style="font-size: 22px">Video transcript</h3>
              </summary>
            </details>
          </div>
        </section>
        <section class="about-the-artists-wrapper">
          <div class="artist-card">
            <figure>
              <img
                src="../assets/images/headshots/Niki_Johnson--larger.jpg"
                alt="Portrait shot of Niki Johnson"
                class="ndac-headshot" />
              <figcaption class="ndac-bio-text">
                Niki Johnson is a contemporary percussionist and
                composer-performer whose musical practice incorporates
                interdisciplinary collaboration and artistic research.
                <br /><br />She has been commissioned to compose and perform solo
                percussion works for the Sydney Powerhouse Museum and Art Gallery
                of New South Wales, and is a current PhD student and teacher at
                Monash University. <br /><br />As an interdisciplinary
                collaborator she works with sound designers, musicians, fine
                artists, and theatre-makers to create instrumental sculptures and
                performances across the disciplines of music, sculpture,
                installation and experimental theatre. As a freelancing
                percussionist she has recorded percussion for the ABC, Sydney
                Opera House, Phoenix Central Park, and Trackdown Fox studios.
              </figcaption>
            </figure>
          </div>
          <div class="artist-card">
            <figure>
              <img
                src="../assets/images/headshots/Hamish_Upton--larger.jpg"
                alt="Portrait shot of Hamish Upton"
                class="ndac-headshot" />
              <figcaption class="ndac-bio-text">
                Hamish Upton is a percussionist who thrives as a contemporary
                music collaborator and educator. <br /><br />He has performed with
                many of Australia’s leading new music ensembles, including Speak
                Percussion, most recently in Scream Star featuring premieres by
                Matthew Shlomowitz, Johannes Kreidler and Jessie Marino. He has
                worked with James Hullick & the BOLT ensemble, Elision, and was a
                performer at Bendigo International Festival of Exploratory Music
                in 2016, 2017 and 2019. <br /><br />Hamish co-directs the
                award-winning exploratory ensemble Ossicle Duo with trombonist
                Benjamin Anderson, and the pair have commissioned 6 new works for
                this unique instrumental combination.
              </figcaption>
            </figure>
          </div>
        </section>
        <section class="button-section">
          <a href="../index.html">
            <button onclick="">
              <p>
                <img
                  class="chevron previous-button"
                  src="../assets/images/icons/double-caret-up_black.svg"
                  alt="" />
                Back
              </p>
              <p><span class="hidden fa">FABLE ARTS</span></p>
            </button>
          </a>
          <a href="../ndac/ndac2_developing_instruments.html">
            <button>
              <p>
                Next
                <img
                  style="fill: red"
                  class="chevron next-button"
                  src="../assets/images/icons/double-caret-up_black.svg"
                  alt="" />
              </p>
              <p><span class="hidden">Developing the Instruments</span></p>
            </button>
          </a>
        </section>
      </main>

      <footer>
        <div class=""></div>
        <div class="copyright-container">
          <p class="copyright">
            Copyright 2024 <span class="fa">FABLE ARTS</span>
          </p>
        </div>
        <div class=""></div>
      </footer>`;
  }
})
