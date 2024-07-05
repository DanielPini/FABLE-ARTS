import artists from './data/people.js'

const artistInfoBlock = document.querySelector('.artist-info-block');
const pageID = artistInfoBlock.dataset.id;

renderArtistInfoBlock(artistInfoBlock);

function renderArtistInfoBlock(div) {
  div.innerHTML = generateArtistInfoBlock(artists[pageID]);
}

function generateArtistInfoBlock(entry) {
  let list = "";
  list += `
  <div class="artist-info-block-container">
  <img class="artist-info-block__artist-img" src=".${entry.img}" alt="Headshot of ${entry.name}">
  <h1 class="artist-info-block__artist-name page-subheading">${entry.name}</h1>
  <h3 class="artist-info-block__artist-projects">Projects</h3><p class="artist-info-block__artist-projects-list">${entry.project.toString().split(",").join("<br>")}</p>
  <div class="artist-info-block__artist-bio"><p>${entry.biography}</p></div>
  <div class="artist-info-block__artist-website"><a href="${entry.website}"><p>${entry.website}</p></a></div>
  </div>`;
  return list;
}

function addBreaksAtComma(string) {
  string.split(',').join("<br>");
}