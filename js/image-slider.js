import notationImageDB from "./data/notation-images.js";

window.addEventListener("resize", (e) => {
  e.target.value.onchange(() => {

  })
})

const scoresContainer = document.querySelector(".scores");

//Grab all carousel divs:
const carouselArray = scoresContainer.querySelectorAll(".carousel");

//Define each separately because code is dumb:
const carousel = carouselArray[0];
const carousel1 = carouselArray[1];
const carousel2 = carouselArray[2];

//--------------------------
//                         |
// Code for first movement:|
//                         |
//--------------------------

carousel.innerHTML = renderSliderHTML(notationImageDB[0].figures);

const track = carousel.querySelector('.carousel__track')
const slides = Array.from(track.children);
const nextButton = carousel.querySelector('.carousel__button--right');
const prevButton = carousel.querySelector('.carousel__button--left');
const dotsNav = carousel.querySelector('.carousel__nav');
const dots = Array.from(dotsNav.children);
let slideWidth = slides[0].getBoundingClientRect().width;

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

//--------------------------
//                          |
// Code for second movement:|
//                          |
//--------------------------

carousel1.innerHTML = renderSliderHTML(notationImageDB[1].figures);

const track1 = carousel1.querySelector('.carousel__track')
const slides1 = Array.from(track1.children);
const nextButton1 = carousel1.querySelector('.carousel__button--right');
const prevButton1 = carousel1.querySelector('.carousel__button--left');
const dotsNav1 = carousel1.querySelector('.carousel__nav');
const dots1 = Array.from(dotsNav1.children);
const slideWidth1 = slides1[0].getBoundingClientRect().width;

slides1.forEach(setSlidePosition)

//click left moves slides left
prevButton1.addEventListener("click", e => {
  const currentSlide = track1.querySelector('.current-slide');
  const prevSlide = currentSlide.previousElementSibling;
  const currentDot = dotsNav1.querySelector('.current-slide');
  const prevDot = currentDot.previousElementSibling;
  const prevIndex = slides1.findIndex(slide => slide === prevSlide);
  
  moveToSlide(track1, currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
  hideShowArrows(slides1, prevButton1, nextButton1, prevIndex);
})
//click right moves slides right
nextButton1.addEventListener("click", e => {
  const currentSlide = track1.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling;
  const currentDot = dotsNav1.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling;
  const nextIndex = slides1.findIndex(slide => slide === nextSlide);

  moveToSlide(track1, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
  hideShowArrows(slides1, prevButton1, nextButton1, nextIndex);
})
//nav moves to slide
dotsNav1.addEventListener("click", e => {
  const targetDot = e.target.closest('button');
  
  if (!targetDot) return;
  const currentSlide = track1.querySelector('.current-slide');
  const currentDot = dotsNav1.querySelector('.current-slide');
  const targetIndex = dots1.findIndex(dot => dot === targetDot);
  const targetSlide = slides1[targetIndex];
  
  moveToSlide(track1, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
  
  hideShowArrows(slides1, prevButton1, nextButton1, targetIndex);
});


// //--------------------------
// //                         |
// // Code for third movement:|
// //                         |
// //--------------------------

carousel2.innerHTML = renderSliderHTML(notationImageDB[2].figures);

const track2 = carousel2.querySelector('.carousel__track')
const slides2 = Array.from(track2.children);
const nextButton2 = carousel2.querySelector('.carousel__button--right');
const prevButton2 = carousel2.querySelector('.carousel__button--left');
const dotsNav2 = carousel2.querySelector('.carousel__nav');
const dots2 = Array.from(dotsNav2.children);
const slideWidth2 = slides2[0].getBoundingClientRect().width;

slides2.forEach(setSlidePosition);

//click left moves slides left
prevButton2.addEventListener("click", e => {
  const currentSlide = track2.querySelector('.current-slide');
  const prevSlide = currentSlide.previousElementSibling;
  const currentDot = dotsNav2.querySelector('.current-slide');
  const prevDot = currentDot.previousElementSibling;
  const prevIndex = slides2.findIndex(slide => slide === prevSlide);
  
  moveToSlide(track2, currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
  hideShowArrows(slides2, prevButton2, nextButton2, prevIndex);
})
//click right moves slides right
nextButton2.addEventListener("click", e => {
  const currentSlide = track2.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling;
  const currentDot = dotsNav2.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling;
  const nextIndex = slides2.findIndex(slide => slide === nextSlide);
  
  moveToSlide(track2, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
  hideShowArrows(slides2, prevButton2, nextButton2, nextIndex);
})
//nav moves to slide
dotsNav2.addEventListener("click", e => {
  const targetDot = e.target.closest('button');
  
  if (!targetDot) return;
  const currentSlide = track2.querySelector('.current-slide');
  const currentDot = dotsNav2.querySelector('.current-slide');
  const targetIndex = dots2.findIndex(dot => dot === targetDot);
  const targetSlide = slides2[targetIndex];
  
  moveToSlide(track2, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
  
  hideShowArrows(slides2, prevButton2, nextButton2, targetIndex);
});






function setSlidePosition(slide, index) {
  slide.style.left = index * slideWidth + 'px';
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


//Generate final slider html
function renderSliderHTML(array) {
  let list = ""
  list += 
  `
  <button class="carousel__button carousel__button--left is-hidden">
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
  </div>`;
  return list;
}
//Generate inner portion of html with images
function generateSliderImages(array) {
  let list = "";
  list +=
  `
  <li class="carousel__slide current-slide">
  <figure class="carousel__image">
  <img class="movement-figure_image" src="${array[0].imageSrc}" alt="${array[0].alt}">
  <figcaption class="movement-figure_caption">${array[0].caption}</figcaption>
  </figure>
  </li>`
  if (array.length <2) {
    return;
  } else {
    for (let i = 1; i < array.length; i++) {
    list += 
    ` 
    <li class="carousel__slide">
    <figure class="carousel__image">
    <img class="movement-figure_image" src="${array[i].imageSrc}" alt="${array[i].alt}">
    <figcaption class="movement-figure_caption">${array[i].caption}</figcaption>
    </figure>
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

window.addEventListener("resize", () => {
  slideWidth = slides[0].getBoundingClientRect().width;
  slides.forEach(setSlidePosition)
  slides1.forEach(setSlidePosition)
  slides2.forEach(setSlidePosition)
})