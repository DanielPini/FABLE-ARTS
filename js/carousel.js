const movement1Images = [
  {
    src: "../assets/images/notation/Movement_1_excerpt.png",
    alt: "",
    figText: ""
  },
  {
    src: "../assets/images/notation/Movement_1_still1.png",
    alt: "",
    figText: ""
  },
  {
    src: "../assets/images/notation/Movement_1_still2.png",
    alt: "",
    figText: ""
  },
];

const images = [{
  src: "../assets/images/icons/facebook_icon.svg",
  alt: "An F character with a blue background.",
  figText: "This is the icon for Facebook."
},{
  src: "../assets/images/icons/youtube_icon.svg",
  alt: "An play button on a red background.",
  figText: "This is the icon for Youtube."
},{
  src: "../assets/images/icons/instagram_icon.svg",
  alt: "A multicoloured camera.",
  figText: "This is the icon for Instagram."
},
];

const carousel = document.querySelector('.carousel')
renderCarouselHTML(images, carousel);

const track = carousel.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = carousel.querySelector('.carousel__button--right');
const prevButton = carousel.querySelector('.carousel__button--left');
const dotsNav = carousel.querySelector('.carousel__nav');
const dots = Array.from(dotsNav.children);
const slideWidth = slides[0].getBoundingClientRect().width;

slides.forEach(setSlidePosition);

//click left moves slides left
prevButton.addEventListener("click", e => {
  const currentSlide = track.querySelector('.current-slide');
  const prevSlide = currentSlide.previousElementSibling;
  const currentDot = dotsNav.querySelector('.current-slide');
  const prevDot = currentDot.previousElementSibling;
  const prevIndex = slides.findIndex(slide => slide === prevSlide);
  
  moveToSlide(track, currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
  hideShowArrows(slides, prevButton, nextButton, prevIndex);
})
//click right moves slides right
nextButton.addEventListener("click", e => {
  const currentSlide = track.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling;
  const currentDot = dotsNav.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling;
  const nextIndex = slides.findIndex(slide => slide === nextSlide);
  
  moveToSlide(track, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
  hideShowArrows(slides, prevButton, nextButton, nextIndex);
})
//nav moves to slide
dotsNav.addEventListener("click", e => {
  const targetDot = e.target.closest('button');
  
  if (!targetDot) return;
  const currentSlide = track.querySelector('.current-slide');
  const currentDot = dotsNav.querySelector('.current-slide');
  const targetIndex = dots.findIndex(dot => dot === targetDot);
  const targetSlide = slides[targetIndex];
  
  moveToSlide(track, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
  
  hideShowArrows(slides, prevButton, nextButton, targetIndex);
});

function setSlidePosition(slide, index) {
  slide.style.left = index * slideWidth + 'px';
}
function renderCarouselHTML(array, htmlElement) {
  htmlElement.innerHTML =
  `
    <button class="carousel__button carousel__button--left">
      <img src="../assets/images/icons/left.svg" alt="">
    </button>
    <button class="carousel__button carousel__button--right">
      <img src="../assets/images/icons/right.svg" alt="">
    </button>
      <div class="carousel__track-container">
        <ul class="carousel__track">
          ${generateSliderImages(array)}
        </ul>
      </div>
    <div class="carousel__nav">
      ${generateDotsNavIndicators(array)}
    </div>
    `
  return htmlElement.innerHTML
}

function moveToSlide(track, currentSlide, targetSlide) {
  track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
}
function updateDots(currentDot, targetDot) {
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
} 
function hideShowArrows(slides, prevButton, nextButton, targetIndex) {
  if (targetIndex === 0) {
    prevButton.classList.add('is-hidden');
    nextButton.classList.remove('is-hidden');
  } else if (targetIndex === (slides.length - 1)) {
    nextButton.classList.add('is-hidden');
      prevButton.classList.remove('is-hidden');
    } else {
      nextButton.classList.remove('is-hidden');
      prevButton.classList.remove('is-hidden');
    }
}


//create list from array
function generateSliderImages(arg) {
  let list = "";
  list += `
  <li class="carousel__slide current-slide">
    <img class="carousel__image" src="${arg[0].src}" alt="${arg[0].alt}">
  </li>`;
  if (arg.length < 2) {
    return;
   } else {
  for (let i = 1; i < arg.length; i++){
    list += `
    <li class="carousel__slide">
      <img class="carousel__image" src="${arg[i].src}" alt="${arg[i].alt}">
    </li>`
  }
  return list;
  }
}

function generateDotsNavIndicators(arg) {
  let list = "";
  list += `
  <button class="carousel__indicator current-slide"></button>`
  if (arg.length < 2) {
    return } else {
      for (let i = 1; i < arg.length; i++) {
      list += `
      <button class="carousel__indicator"></button>`
  }
  return list;
 }
}