console.log("script loaded");

import artists from './data/people.js'

const roster = document.querySelector('.artist-roster__artist-card-container')
const images = roster.querySelectorAll(".headshot__image")
const input = document.querySelector('#search')

roster.innerHTML= generateCardsHTML(artists.reverse());

input.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  if (value) {
    document.querySelector('.error-message').classList.remove('no-results')
    const sorted = artists.filter(artist => {
      return artist.name.toLowerCase().includes(value) || artist.year.toString().includes(value) || artist.project.toString().toLowerCase().includes(value) || artist.disciplines.toString().toLowerCase().includes(value) || artist.season.toString().toLowerCase().includes(value);
    })
    roster.innerHTML = generateCardsHTML(sorted)
    if (sorted.length < 1) {
      document.querySelector('.error-message').classList.add('no-results')
    }
  } else {
    roster.innerHTML = generateCardsHTML(artists)
    document.querySelector('.error-message').classList.remove('no-results')
  }
})



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
function generateCardsHTML(database) {
  let list = "";
  database.forEach(entry => {
    list += `
    <div class="artist-roster__card-wrapper">
      <div class="artist-roster__card">
        <div class="headshot" style="background-image url(${entry.blurredimg})">
          <img class="headshot__image" src="${entry.img}" loading="lazy" alt="">
        </div>
        <a class="artist-roster__link" href="${entry.link}">
          <div class="artist-roster__card__nameplate">
            <h3 class="page-subheading">${entry.name}</h3>
          </div>
        </a>
      </div>
    </div>`
  });
  return list;
};

