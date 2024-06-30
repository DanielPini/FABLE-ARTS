const images = [];
const time = 15000;


images[0] = "../assets/images/notation/Movement_1_excerpt.png";
images[1] = "../assets/images/notation/Movement_1_still1.png";
images[2] = "../assets/images/notation/Movement_1_still2.png";

function changeImg() {
  document.slide.src = images[i];

  if (i < images.length - 1) {
    i++;
  } else {
    i = 0;
  }
  setTimeout("changeImg()", time);
}

window.onload = changeImg;

let i = 0;
