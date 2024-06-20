const splashScreen = document.querySelector('.splash');
splashScreen.addEventListener('click', () => {splashScreen.style.opacity = 0;
  setTimeout(() => {
    splashScreen.classList.add('splash-hidden')}, 610);
})