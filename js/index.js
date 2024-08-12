let width = "";
const banner = document.querySelector("#welcome-banner");

window.addEventListener("resize", (e) => {
  width = window.innerWidth;
  if ( width < 600 ) {
    banner.classList.add("welcome-banner--small")
    banner.classList.remove("welcome-banner--large")
  } else {
    banner.classList.remove("welcome-banner--small")
    banner.classList.add("welcome-banner--large")
  }
});
