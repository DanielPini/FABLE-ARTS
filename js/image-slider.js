import notationImageDB from "./data/notation-images.js";

const scoresContainer = document.querySelector(".scores")
const imageSlider = scoresContainer.querySelectorAll(".image-slider");

console.log(notationImageDB)

for (let i = 0; i < imageSlider.length; i++) {
  imageSlider[i].innerHTML = generateSliderHTML(notationImageDB[i].figures);
}


function generateSliderHTML(movement) {
let list = "";
movement.forEach(entry => {
  list +=
  `
  <figure>
  <img src="${entry.imageSrc}" alt="${entry.alt}">
  <figcaption>${entry.caption}</figcaption>
  </figure>`;
  });
  return list;
}



const rubbish = `<div class="numbertext">1 / 3</div>
<img src="../assets/images/notation/Movement_2_still.png" alt="Excerpt of a musical score with dots and lines.">
<div class="caption-text"></div>
</div>
<div class="movenent-2-slide fade">
<div class="numbertext">1 / 3</div>
<img src="../assets/images/notation/Movement_2_still.png" alt="">
<div class="caption-text"></div>
</div>
<div class="movenent-2-slide fade">
<div class="numbertext">1 / 3</div>
<img src="../assets/images/notation/Movement_2_still.png" alt="">
<div class="caption-text"></div>
</div>`;