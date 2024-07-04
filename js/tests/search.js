
import artists from '../data/people.js'

const roster = document.querySelector('.artist-roster__artist-card-container')

roster.innerHTML= generateCardsHTML(artists)

const images = roster.querySelectorAll(".headshot__image")

function generateCardsHTML(database) {
  let list = "";
  database.forEach(entry => {
    list += `
    <div class="artist-roster__card-wrapper">
      <div class="artist-roster__card">
        <div class="headshot" style="background-image url('.${entry.blurredimg}')">
          <img class="headshot__image" src=".${entry.img}" loading="lazy" alt="">
        </div>
        <a class="artist-roster__link" href=".${entry.link}">
          <div class="artist-roster__card__nameplate">
            <h3 class="page-subheading">${entry.name}</h3>
          </div>
        </a>
      </div>
    </div>`
  });
  return list;
};

images.forEach((image) => {
  if (image.complete) {
    image.classList.add('loaded')
  } else {
    image.addEventListener("load", loaded())
  }
})

function loaded() {
  images.forEach(image => {
    image.classList.add('loaded');
  })
}

