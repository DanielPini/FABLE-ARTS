const splashScreen = document.querySelector('.splash');
let fired = sessionStorage.getItem("splashTriggered");

if (!fired) {
  splashScreen.style.opacity = 1;
  splashScreen.style.zIndex = 1;
  splashScreen.addEventListener('click', () => {
    splashScreen.style.opacity = 0; 
    splashScreen.style.transition = "opacity 1s";
    splashScreen.style.zIndex = -9999;
    setTimeout(() => {
      splashScreen.classList.add('splash-hidden')}, 1000);
  })
  sessionStorage.setItem("splashTriggered", true)
}