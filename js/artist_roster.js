const artists = [
  {
    id: 0,
    name: "Victoria Pham",
    img: "../assets/images/headshots/Victoria_Pham.webp",
    blurredimg: "../assets/images/headshots/Victoria_Pham_blurred.webp",
    season: "",
    date: [210424, 210626],
    year: 2021,
    project: ["FABLE & FOOD | SPRING: 120 Years of 'The Tale of Peter Rabbit'", "Solos II: Daniel"],
    disciplines: ["Sound Design", "Composition", "Music", "Videography", "Writing"],
    biography: "Spanning art, technology and science, Victoria Pham is an Australian artist, evolutionary biologist, writer and composer. She is based between Paris and Sydney. Originally trained as an archaeologist, she holds a PhD in Biological Anthropology from the University of Cambridge, St John's College. As a composer, she trained under the tutelage of Richard Gill OAM, Liza Lim, Carl Vine AO, Gerard Brophy and Thierry Escaich. Victoria is represented by the Australian Music Centre as an Associate Artist where a collection of her scores are available. Currently, she is the Editor-in-Chief of Debris Magazine, lead artist in the RE:SOUNDING project with James Nguyen, and co-lead artist in the collective SONANT BODIES with James Hazel. She was the host and producer of podcast series DECLASSIFY (2020-2022)  and co-founded and directed FABLE ARTS from (2020-2023).",
    website: "https://www.victoriaavpham.com/",
    link: "../artist_pages/victoriapham.html"
  },
  {
    id: 1,
    name: "Daniel Pini",
    img: "../assets/images/headshots/Daniel_Pini.webp",
    blurredimg: "../assets/images/headshots/Daniel_Pini_blurred.webp",
    season: "",
    date: [201031, 210626],
    year: [2020, 2021],
    project: ["Seasonal Foodles - FABLE ARTS Premiere Event", "Solos II: Daniel"],
    disciplines: ["Cello", "Music", "Videography"],
    biography: "Daniel is an Australian conductor and cellist based in Paris. He is an advocate for authentic contemporary stories, particularly from those whose voices often go unheard. His practice centers around the belief that music, art, and the stories they tell can change hearts and minds.",
    website: "https://www.danielpini.com/",
    link: "../artist_pages/danielpini.html"
  },
  {
    id: 2,
    name: "Alison Wormell",
    img: "../assets/images/headshots/Alison_Wormell.webp",
    blurredimg: "../assets/images/headshots/Alison_Wormell_blurred.webp",
    season: "",
    date: 210529,
    year: 2021,
    project: "Solos I: A Series of Escapes",
    disciplines: ["Bassoon", "Music", "Gravel Riding", "Cycling", "Videography"],
    biography: "Alison Wormell is a bassoonist from Sydney, Australia. She is currently studying at the Royal College of Music for a Masters in Performance with professors Joost Bosdijk, Andrea de Flammineis, and Sarah Burnett. Her studies are generously supported by the Tegner Scholarship. In 2020, Alison won the RCM Woodwind Competition, was selected for the BBC Symphony Orchestra Pathways Scheme, and performed with the London Mozart Players.",
    website: "https://alisonwormell.com/",
    link: "../artist_pages/alisonwormell.html"
  },
  {
    id: 3,
    name: "Justin Julian",
    img: "../assets/images/headshots/Justin_Julian.webp",
    blurredimg: "../assets/images/headshots/Justin_Julian_blurred.webp",
    season: "",
    date: 210731,
    year: 2021,
    project: "Solos III: Freedom Within Restrictions",
    disciplines: ["Viola", "Road Cycling", "Cycling"],
    biography: "Justin Julian studied with Roger Benedict at the Sydney Conservatorium. He has worked with the Sydney, Melbourne, Adelaide and Canberra Symphony Orchestras and the Opera Australia Orchestra. Justin was a 2017 Emerging Artist with the Australian Chamber Orchestra and completed the 2018 Sydney Symphony Orchestra Fellowship program. Justin has also performed with the Omega Ensemble and was a founding member of the Pietra Quartet and Nautilus Ensemble.",
    website: "https://www.aso.com.au/profiles/justin-julian/",
    link: "../artist_pages/justinjulian.html"
  },
  {
    id: 4,
    name: "Lotte Betts-Dean",
    img: "../assets/images/headshots/Lotte_Betts-Dean(1).webp",
    blurredimg: "../assets/images/headshots/Lotte_Betts-Dean_blurred(1).webp",
    season: "",
    date: 210925,
    year: 2021,
    project: "Solos IV: Four White Walls",
    disciplines: ["Singing", "Music"],
    biography: "Praised by The Guardian for her “irrepressible sense of drama and unmissable, urgent musicality”, Lotte Betts-Dean is a mezzo soprano with a wide ranging repertoire, predominantly performing chamber music, art song and contemporary music. She is a Young Artist with Oxford Lieder, City Music Foundation, Musicians Company, Associate Artist with Southbank Sinfonia and Ensemble x.y, and graduate of the RAM. She won both the Overseas Prize and the Audrey Strange Prize.",
    website: "https://www.lottebettsdean.com/",
    link: "../artist_pages/lottebettsdean.html"
  },
  {
    id: 5,
    name: "Sebastian Pini",
    img: "../assets/images/headshots/Sebastian_Pini.webp",
    blurredimg: "../assets/images/headshots/Sebastian_Pini_blurred.webp",
    season: "",
    date: 211218,
    year: 2021,
    project: "Solos VI: Down by the Riverside",
    disciplines: ["Double Bass", "Music"],
    biography: "Sebastian is a current student of the Hochschule für Musik Freiburg, where he learns with Božo Paradžik, after having previously studied with Alex Henery for over a decade. He is a recipient of the International String Prize at Gisborne international Music Competition, winning other events such as the Melbourne Bass Day 2019, and the Edna Wilde award for Most Outstanding Instrumentalist, and he hopes to be able share his love of music and the double bass going forward.",
    website: "",
    link: "../artist_pages/sebastianpini.html"
  },
  {
    id: 6,
    name: "Mary Osborn",
    img: "../assets/images/headshots/Mary_Osborn.webp",
    blurredimg: "../assets/images/headshots/Mary_Osborn_blurred.webp",
    date: 210130,
    year: 2021,
    project: "Fable & Food | Winter",
    disciplines: ["Saxophone", "Music"],
    biography: "Australian saxophonist Mary Osborn is currently based in Paris. Having completed a bachelors of music performance at the Sydney Conservatorium of Music, a performance diploma and Masters of music at the Versailles Conservatoire and Université de Versailles Saint-Quentin, Mary is forming her career as a classical and contemporary performer, creator and teacher. Mary has won numerous awards at international music competitions, she has worked closely with many composers.",
    website: "https://www.maryosbornsaxophone.com/",
    link: "../artist_pages/maryosborn.html"
  },
  {
    id: 7,
    name: "James Nguyen",
    img: "../assets/images/headshots/James_Nguyen.webp",
    blurredimg: "../assets/images/headshots/James_Nguyen_blurred.webp",
    season: "",
    date: 210828,
    year: 2021,
    project: "Fable & Food | Summer: Danica Hobden X James Nguyen",
    disciplines: ["Filmmaking", "Visual Art", "Writing"],
    biography: "James Nguyen is an Australian artist and filmmaker based in Melbourne. He has been commissioned by institutions such as the Australian War Memorial, the Museum of Contemporary Art for the National 2019, and others. A past recipient of the Maddocks Art prize and the Anne & Gordon Samstag International Visual Arts Scholarship, James has had the opportunity to develop projects and work collaboratively on experimental documentary, research and curatorial exchanges in NYC, Europe and the Asia Pacific",
    website: "https://www.jamesnguyens.com/",
    link: "../artist_pages/jamesnguyen.html"
  },
  {
    id: 8,
    name: "Danica Hobden",
    img: "../assets/images/headshots/Danica_Hobden.webp",
    blurredimg: "../assets/images/headshots/Danica_Hobden_blurred.webp",
    season: "",
    date: 210828,
    year: 2021,
    project: "Fable & Food | Summer: Danica Hobden X James Nguyen",
    disciplines: ["Guitar", "Music", "Jazz"],
    biography: "Danica Hobden is a graduate and current student of the Sydney Conservatorium, having completed a BMus in Classical Guitar, before continuing her studies with a Bachelor of Jazz Performance. Following a keen interest in language learning, she completed 3 semesters of study at the Hochschule für Künste Bremen in Germany, under the tutelage of Andreas Wahl and Jens Wagner from 2019-2021. Danica is currently working on various personal projects & performing with Celtic Rock band Bread and Seaweed.",
    website: "https://www.danicahobden.com/",
    link: "../artist_pages/danicahobden.html"
  },
  {
    id: 9,
    name: "Jaap Saers",
    img: "../assets/images/headshots/Jaap_Saers.webp",
    blurredimg: "../assets/images/headshots/Jaap_Saers_blurred.webp",
    season: "",
    date: 211127,
    year: 2021,
    project: "Fable & Food | Autumn: Pholk-tales",
    disciplines: ["Guitar", "Banjo", "Human Evolution", "Science", "Folk Music"],
    biography: "By day, Jaap works as a researcher in Human Evolutionary Biology. At night he haunts the pubs of Cambridge with the Cambridge University Ceilidh band. Originally from the Netherlands, he is a self-taught guitarist who fell in love with British folk music when he arrived in the UK in 2013.",
    website: "https://www.naturalis.nl/en/jaap-saers",
    link: "../artist_pages/jaapsaers.html"
  },
  {
    id: 10,
    name: "Laura van Holstein",
    img: "../assets/images/headshots/Laura_van_Holstein.webp",
    blurredimg: "../assets/images/headshots/Laura_van_Holstein_blurred.webp",
    date: 211127,
    year: 2021,
    project: "Fable & Food | Autumn: Pholk-tales",
    disciplines: ["Human Evolution", "Science", "Writing", "Visual Arts"],
    biography: "Laura is a lecturer in human evolution at the University of Cambridge, and researches the evolution of the traits that set humans apart from other species. Following in the footsteps of Homo erectus, Laura is a keen visual artist and plays the whistle, in the manner of the Neanderthal musician that played the 60,000-year-old cave bear flute. Her favourite medium, however, is the written word. She has published poetry and short stories (in addition to academic papers).",
    website: "https://www.arch.cam.ac.uk/staff/dr-laura-van-holstein",
    link: "../artist_pages/lauravanholstein.html"
  },
  {
    id: 11,
    name: "James Hazel",
    img: "../assets/images/headshots/James_Hazel.webp",
    blurredimg: "../assets/images/headshots/James_Hazel_blurred.webp",
    season: "the threads that bind",
    date: 220601,
    year: 2022,
    project: "b(z)loom dayzzz (or the first step of neoliberals anonymous anonymous is admitting you have a problem)",
    disciplines: ["Writing", "Composition", "Videography", "Music"],
    biography: "James Hazel is a composer, artist, editor and educator based on the unceded Gadigal land of the Eora Nation (so-called Sydney). James works across score practices, sound, video, archive, text, language, research and performance.  As someone who lived in an underclass (social-housing) community for most of his life, James employs sound, utterance, and (re)performance to interrogate what it means to live, love & labour under & through precarity.",
    website: "https://jameshazel.net/",
    link: "../artist_pages/jameshazel.html"
  },
  {
    id: 12,
    name: "Sonya Holowell",
    img: "../assets/images/headshots/Sonya_Holowell(1).webp",
    blurredimg: "../assets/images/headshots/Sonya_Holowell(1)_blurred.webp",
    season: "the threads that bind",
    date: 220701,
    year: 2022,
    project: "This is the Anterior: Alpine",
    disciplines: ["Writing"],
    biography: "Sonya Holowell is a vocalist, composer, writer and educator of Dharawal/Inuit descent. Her work spans many contexts and takes multiple forms, with improvisation as a primary MO. Sonya was co-founder and editor of online arts publication ADSR Zine 2018-2020. Recent projects include the duos Sumn Conduit with Ben Carey, holowell with Jonathan Holowell and Danger/Dancer with James Hazel. She is on a new threshold of personal, expository work.",
    website: "https://www.sonyaholowell.com/",
    link: "../artist_pages/sonyaholowell.html"
  },
  {
    id: 13,
    name: "Alexander Cigana",
    img: "../assets/images/headshots/Alexander_Cigana.webp",
    blurredimg: "../assets/images/headshots/Alexander_Cigana_blurred.webp",
    season: "the threads that bind",
    date: 220801,
    year: 2022,
    project: "Impotent the flow of years",
    disciplines: ["Visual Arts", "Writing", "Sculpture"],
    biography: "Alexander Cigana recently graduated from a PhD in Art History at the University of Sydney. His thesis “The Concert of Parts: Origins and Revolutions of the Trophy” traced the trophy motif from the tropaia of Archaic Greece through to the trophées of eighteenth-century France. His work as a visual artist, principally in sculpture, ceramics and drawing, emerges from a preoccupation with many of the same themes: violence and the decorative, and the body and the ways it comes together and apart.",
    website: "https://www.instagram.com/alexander_cigana/",
    link: "../artist_pages/alexandercigana.html"
  },
  {
    id: 14,
    name: "Sonja Schebeck",
    img: "../assets/images/headshots/Sonja_Schebeck.webp",
    blurredimg: "../assets/images/headshots/Sonja_Schebeck_blurred.webp",
    season: "the threads that bind",
    date: 221009,
    year: 2022,
    project: "Moving Cordes",
    disciplines: ["Violin", "Circus", "Fire-breathing", "Music"],
    biography: "Sonja Schebeck was born in Sydney, Australia and her violin teachers have included Barbara Hayward (Suzuki), Christopher Kimber (Sydney Conservatorium) and Florian Zwiauer (MUK Vienna). She founded ‘The Freestyle Orchestra’ in 2006 and is a founding member of Nigel Kennedy’s ‘Orchestra of Life’. Her masters thesis is in “Innovations in Classical Music Presentation” (MUK Vienna). Sonja is currently touring Europe with Australian circus company ‘Gravity & Other Myths’ as violinist/multi-instrument",
    website: "https://sonjaschebeck.com/",
    link: "../artist_pages/sonjaschebeck.html"
  },
  {
    id: 15,
    name: "Natalia Zdorovtsova",
    img: "../assets/images/headshots/Natalia_Zdorovtsova.webp",
    blurredimg: "../assets/images/headshots/Natalia_Zdorovtsova_blurred.webp",
    season: "the threads that bind",
    date: 221107,
    year: 2022,
    project: "Symbiosis",
    disciplines: ["Videography", "Writing"],
    biography: "Natalia Zdorovtsova is a neuroscience PhD student at the University of Cambridge. She was born in Saint Petersburg, Russia, but has spent much of her life between the United States and United Kingdom. As a neuroscientist, Natalia is interested in how the brain coordinates attention in our day-to-day lives. Lately, Natalia has been interested in the processes by which we can engage with the concept of the Sacred. In her abstract art series, Symbiosis, she merges her love of art and neuroscience.",
    website: "https://www.nataliazdorovtsova.com/",
    link: "../artist_pages/nataliazdorovtsova.html"
  },
  {
    id: 16,
    name: "Christine Pan",
    img: "../assets/images/headshots/Christine_Pan.webp",
    blurredimg: "../assets/images/headshots/Christine_Pan_blurred.webp",
    season: "the threads that bind",
    date: 221217,
    year: 2022,
    project: "On the Margins",
    disciplines: ["Composition", "Music"],
    biography: "Christine Pan is a Sydney-based composer who often develops her works from social-cultural and philosophical frameworks that she takes great pride in meticulously researching. Her music has been played by the Goldner Quartet, Ensemble Offspring and members of WASO.In 2022, Christine will be premiering an audio-visual work at Konzertprojekt’s Sound Stories Concert supported by the City of Sydney and a new chamber work to be premiered by Corvus at the Fairbanks Summer Festival Alaska.",
    website: "https://www.christinepanmusic.com/",
    link: "../artist_pages/christinepan.html"
  },
  {
    id: 17,
    name: "Xenia Deviatkina-Loh",
    img: "../assets/images/headshots/Xenia_Deviatkina-Loh.webp",
    blurredimg: "../assets/images/headshots/Xenia_Deviatkina-Loh_blurred.webp",
    season: "the threads that bind",
    date: 221217,
    year: 2022,
    project: "On the Margins",
    disciplines: ["Violin", "Music"],
    biography: "Award winning violinist Dr. Xenia Deviatkina-Loh has performed as soloist and recitalist in various venues across Australia, New Zealand, the UK, the US, and China. She also frequently performs with major ensembles and concert series around LA. As of 2021, she is a member of ECHOI — MEC’s ensemble-in-residence. In 2019, Dr. Deviatkina-Loh released her debut album under SHEVA Contemporary. Most recently, she was invited to serve as an Artist and Adjudicator for the International Grand Festival.",
    website: "https://www.xeniadeviatkinaloh.com/",
    link: "../artist_pages/xeniadeviatkinaloh.html"
  },
  {
    id: 18,
    name: "Hamish Upton",
    img: "../assets/images/headshots/Hamish_Upton.webp",
    blurredimg: "../assets/images/headshots/Hamish_Upton_blurred.webp",
    season: "Reflections and Resonance",
    date: 240807,
    year: 2024,
    project: "Navigating Distance and Closeness",
    disciplines: ["Percussion", "Music"],
    biography: "",
    website: "https://www.hamishupton.com/",
    link: "../artist_pages/hamishupton.html"
  },  
  {
    id: 19,
    name: "Niki Johnson",
    img: "../assets/images/headshots/Niki_Johnson.webp",
    blurredimg: "../assets/images/headshots/Niki_Johnson_blurred.webp",
    season: "Reflections and Resonance",
    date: 240807,
    year: 2024,
    project: "Navigating Distance and Closeness",
    disciplines: ["Percussion", "Cermaics", "Music"],
    biography: "",
    website: "https://niki-johnson.com/",
    link: "../artist_pages/nikijohnson.html"
  }
];

const artistRoster = document.querySelector('.artist-roster__artist-card-container');

renderCardsHTML(artistRoster);

const images = artistRoster.querySelectorAll(".headshot__image")

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

function renderCardsHTML(div) {
  div.innerHTML = generateCardsHTML(artists);
};

// const input = getElementbyID('search')
// console.log(input)
// input.addEventListener("input", (e) => {
//   const value = e.target.value.toLowerCase()
//   artists.forEach(artist => {
//   const isVisible = 
//     artist.name.toLowerCase().includes(value) || artist.year.includes(value) || artist.project.toLowerCase().includes(value) || artist.disciplines.toLowerCase().includes(value);
//   artist.classList.toggle("hide", !isVisible);
//   })
// })
