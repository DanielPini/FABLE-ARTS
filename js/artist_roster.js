const artists = [
  {
    id: 19,
    name: "Niki Johnson",
    img: "",
    season: "Reflections and Resonance",
    date: 240807,
    year: 2024,
    project: "Navigating Distance and Closeness",
    disciplines: ["Percussion", "Cermaics", "Music"],
    biography: "",
    website: "https://niki-johnson.com/"
  },  
  {
    id: 18,
    name: "Hammish Upton",
    img: "",
    season: "Reflections and Resonance",
    date: 240807,
    year: 2024,
    project: "Navigating Distance and Closeness",
    disciplines: ["Percussion", "Music"],
    biography: "",
    website: "https://www.hamishupton.com/"
  },  
  {
    id: 17,
    name: "Xenia Deviatkina-Loh",
    img: "",
    season: "the threads that bind",
    date: 221217,
    year: 2022,
    project: "On the Margins",
    disciplines: ["Violin", "Music"],
    biography: "Award winning violinist Dr. Xenia Deviatkina-Loh has performed as soloist and recitalist in various venues across Australia, New Zealand, the UK, the US, and China. She also frequently performs with major ensembles and concert series around LA. As of 2021, she is a member of ECHOI — MEC’s ensemble-in-residence. In 2019, Dr. Deviatkina-Loh released her debut album under SHEVA Contemporary. Most recently, she was invited to serve as an Artist and Adjudicator for the International Grand Festival.",
    website: "https://www.xeniadeviatkinaloh.com/"
  },
  {
    id: 16,
    name: "Christine Pan",
    img: "",
    season: "the threads that bind",
    date: 221217,
    year: 2022,
    project: "On the Margins",
    disciplines: ["Composition", "Music"],
    biography: "Christine Pan is a Sydney-based composer who often develops her works from social-cultural and philosophical frameworks that she takes great pride in meticulously researching. Her music has been played by the Goldner Quartet, Ensemble Offspring and members of WASO.In 2022, Christine will be premiering an audio-visual work at Konzertprojekt’s Sound Stories Concert supported by the City of Sydney and a new chamber work to be premiered by Corvus at the Fairbanks Summer Festival Alaska.",
    website: "https://www.christinepanmusic.com/"
  },
  {
    id: 15,
    name: "Natalia Zdorovtsova",
    img: "",
    season: "the threads that bind",
    date: 221107,
    year: 2022,
    project: "Symbiosis",
    disciplines: ["Videography", "Writing"],
    biography: "Natalia Zdorovtsova is a neuroscience PhD student at the University of Cambridge. She was born in Saint Petersburg, Russia, but has spent much of her life between the United States and United Kingdom. As a neuroscientist, Natalia is interested in how the brain coordinates attention in our day-to-day lives. Lately, Natalia has been interested in the processes by which we can engage with the concept of the Sacred. In her abstract art series, Symbiosis, she merges her love of art and neuroscience.",
    website: "https://www.nataliazdorovtsova.com/"
  },
  {
    id: 14,
    name: "Sonja Schebeck",
    img: "",
    season: "the threads that bind",
    date: 221009,
    year: 2022,
    project: "Moving Cordes",
    disciplines: ["Violin", "Circus", "Fire-breathing", "Music"],
    biography: "Sonja Schebeck was born in Sydney, Australia and her violin teachers have included Barbara Hayward (Suzuki), Christopher Kimber (Sydney Conservatorium) and Florian Zwiauer (MUK Vienna). She founded ‘The Freestyle Orchestra’ in 2006 and is a founding member of Nigel Kennedy’s ‘Orchestra of Life’. Her masters thesis is in “Innovations in Classical Music Presentation” (MUK Vienna). Sonja is currently touring Europe with Australian circus company ‘Gravity & Other Myths’ as violinist/multi-instrument",
    website: "https://sonjaschebeck.com/"
  },
  {
    id: 13,
    name: "Alexander Cigana",
    img: "",
    season: "the threads that bind",
    date: 220801,
    year: 2022,
    project: "Impotent the flow of years",
    disciplines: ["Visual Arts", "Writing", "Sculpture"],
    biography: "Alexander Cigana recently graduated from a PhD in Art History at the University of Sydney. His thesis “The Concert of Parts: Origins and Revolutions of the Trophy” traced the trophy motif from the tropaia of Archaic Greece through to the trophées of eighteenth-century France. His work as a visual artist, principally in sculpture, ceramics and drawing, emerges from a preoccupation with many of the same themes: violence and the decorative, and the body and the ways it comes together and apart.",
    website: "https://www.instagram.com/alexander_cigana/"
  },
  {
    id: 12,
    name: "Sonya Holowell",
    img: "",
    season: "the threads that bind",
    date: 220701,
    year: 2022,
    project: "This is the Anterior: Alpine",
    disciplines: ["Writing"],
    biography: "Sonya Holowell is a vocalist, composer, writer and educator of Dharawal/Inuit descent. Her work spans many contexts and takes multiple forms, with improvisation as a primary MO. Sonya was co-founder and editor of online arts publication ADSR Zine 2018-2020. Recent projects include the duos Sumn Conduit with Ben Carey, holowell with Jonathan Holowell and Danger/Dancer with James Hazel. She is on a new threshold of personal, expository work.",
    website: "https://www.sonyaholowell.com/"
  },
  {
    id: 11,
    name: "James Hazel",
    img: "",
    season: "the threads that bind",
    date: 220601,
    year: 2022,
    project: "b(z)loom dayzzz (or the first step of neoliberals anonymous anonymous is admitting you have a problem)",
    disciplines: ["Writing", "Composition", "Videography", "Music"],
    biography: "James Hazel is a composer, artist, editor and educator based on the unceded Gadigal land of the Eora Nation (so-called Sydney). James works across score practices, sound, video, archive, text, language, research and performance.  As someone who lived in an underclass (social-housing) community for most of his life, James employs sound, utterance, and (re)performance to interrogate what it means to live, love & labour under & through precarity.",
    website: "https://jameshazel.net/"
  },
  {
    id: 10,
    name: "Laura van Holstein",
    season: "",
    date: 211127,
    year: 2021,
    project: "Fable & Food | Autumn: Pholk-tales",
    disciplines: ["Human Evolution", "Science", "Writing", "Visual Arts"],
    biography: "Laura is a lecturer in human evolution at the University of Cambridge, and researches the evolution of the traits that set humans apart from other species. Following in the footsteps of Homo erectus, Laura is a keen visual artist and plays the whistle, in the manner of the Neanderthal musician that played the 60,000-year-old cave bear flute. Her favourite medium, however, is the written word. She has published poetry and short stories (in addition to academic papers).",
    website: "https://www.arch.cam.ac.uk/staff/dr-laura-van-holstein"
  },
  {
    id: 9,
    name: "Jaap Saers",
    img: "",
    season: "",
    date: 211127,
    year: 2021,
    project: "Fable & Food | Autumn: Pholk-tales",
    disciplines: ["Guitar", "Banjo", "Human Evolution", "Science", "Folk Music"],
    biography: "By day, Jaap works as a researcher in Human Evolutionary Biology. At night he haunts the pubs of Cambridge with the Cambridge University Ceilidh band. Originally from the Netherlands, he is a self-taught guitarist who fell in love with British folk music when he arrived in the UK in 2013.",
    website: "https://www.naturalis.nl/en/jaap-saers"
  },
  {
    id: 8,
    name: "Danica Hobden",
    img: "",
    season: "",
    date: 210828,
    year: 2021,
    project: "Fable & Food | Summer: Danica Hobden X James Nguyen",
    disciplines: ["Guitar", "Music", "Jazz"],
    biography: "Danica Hobden is a graduate and current student of the Sydney Conservatorium, having completed a BMus in Classical Guitar, before continuing her studies with a Bachelor of Jazz Performance. Following a keen interest in language learning, she completed 3 semesters of study at the Hochschule für Künste Bremen in Germany, under the tutelage of Andreas Wahl and Jens Wagner from 2019-2021. Danica is currently working on various personal projects & performing with Celtic Rock band Bread and Seaweed.",
    website: "https://www.danicahobden.com/"
  },
  {
    id: 7,
    name: "James Nguyen",
    img: "",
    season: "",
    date: 210828,
    year: 2021,
    project: "Fable & Food | Summer: Danica Hobden X James Nguyen",
    disciplines: ["Filmmaking", "Visual Art", "Writing"],
    biography: "James Nguyen is an Australian artist and filmmaker based in Melbourne. He has been commissioned by institutions such as the Australian War Memorial, the Museum of Contemporary Art for the National 2019, and others. A past recipient of the Maddocks Art prize and the Anne & Gordon Samstag International Visual Arts Scholarship, James has had the opportunity to develop projects and work collaboratively on experimental documentary, research and curatorial exchanges in NYC, Europe and the Asia Pacific",
    website: "https://www.jamesnguyens.com/"
  },
  {
    id: 6,
    name: "Mary Osborn",
    season: "",
    date: 210130,
    year: 2021,
    project: "Fable & Food | Winter",
    disciplines: ["Saxophone", "Music"],
    biography: "Australian saxophonist Mary Osborn is currently based in Paris. Having completed a bachelors of music performance at the Sydney Conservatorium of Music, a performance diploma and Masters of music at the Versailles Conservatoire and Université de Versailles Saint-Quentin, Mary is forming her career as a classical and contemporary performer, creator and teacher. Mary has won numerous awards at international music competitions, she has worked closely with many composers.",
    website: "https://www.maryosbornsaxophone.com/"
  },
  {
    id: 5,
    name: "Sebastian Pini",
    img: "",
    season: "",
    date: 211218,
    year: 2021,
    project: "Solos VI: Down by the Riverside",
    disciplines: ["Double Bass", "Music"],
    biography: "Sebastian is a current student of the Hochschule für Musik Freiburg, where he learns with Božo Paradžik, after having previously studied with Alex Henery for over a decade. He is a recipient of the International String Prize at Gisborne international Music Competition, winning other events such as the Melbourne Bass Day 2019, and the Edna Wilde award for Most Outstanding Instrumentalist, and he hopes to be able share his love of music and the double bass going forward.",
    website: ""
  },
  {
    id: 4,
    name: "Lotte Betts-Dean",
    img: "",
    season: "",
    date: 210925,
    year: 2021,
    project: "Solos IV: Four White Walls",
    disciplines: ["Singing", "Music"],
    biography: "Praised by The Guardian for her “irrepressible sense of drama and unmissable, urgent musicality”, Lotte Betts-Dean is a mezzo soprano with a wide ranging repertoire, predominantly performing chamber music, art song and contemporary music. She is a Young Artist with Oxford Lieder, City Music Foundation, Musicians Company, Associate Artist with Southbank Sinfonia and Ensemble x.y, and graduate of the RAM. She won both the Overseas Prize and the Audrey Strange Prize.",
    website: "https://www.lottebettsdean.com/"
  },
  {
    id: 3,
    name: "Justin Julian",
    img: "",
    season: "",
    date: 210731,
    year: 2021,
    project: "Solos III: Freedom Within Restrictions",
    disciplines: ["Viola", "Road Cycling", "Cycling"],
    biography: "Justin Julian studied with Roger Benedict at the Sydney Conservatorium. He has worked with the Sydney, Melbourne, Adelaide and Canberra Symphony Orchestras and the Opera Australia Orchestra. Justin was a 2017 Emerging Artist with the Australian Chamber Orchestra and completed the 2018 Sydney Symphony Orchestra Fellowship program. Justin has also performed with the Omega Ensemble and was a founding member of the Pietra Quartet and Nautilus Ensemble.",
    website: "https://www.aso.com.au/profiles/justin-julian/"
  },
  {
    id: 2,
    name: "Alison Wormell",
    img: "",
    season: "",
    date: 210529,
    year: 2021,
    project: "Solos I: A Series of Escapes",
    disciplines: ["Bassoon", "Music", "Gravel Riding", "Cycling", "Videography"],
    biography: "Alison Wormell is a bassoonist from Sydney, Australia. She is currently studying at the Royal College of Music for a Masters in Performance with professors Joost Bosdijk, Andrea de Flammineis, and Sarah Burnett. Her studies are generously supported by the Tegner Scholarship. In 2020, Alison won the RCM Woodwind Competition, was selected for the BBC Symphony Orchestra Pathways Scheme, and performed with the London Mozart Players.",
    website: "https://alisonwormell.com/"
  },
  {
    id: 1,
    name: "Daniel Pini",
    img: "",
    season: "",
    date: [201031, 210626],
    year: [2020, 2021],
    project: ["Seasonal Foodles - FABLE ARTS Premiere Event", "Solos II: Daniel"],
    disciplines: ["Cello", "Music", "Videography"],
    biography: "Daniel is an Australian conductor and cellist based in Paris. He is an advocate for authentic contemporary stories, particularly from those whose voices often go unheard. His practice centers around the belief that music, art, and the stories they tell can change hearts and minds.",
    website: "https:www.danielpini.com/"
  },
];

const artistRoster = document.querySelector('.artist-roster__artist-card-container');

renderCardsHTML(artistRoster);

function generateCardsHTML(database) {
  let list = "";
  database.forEach(entry => {
    list += `
    <div class="artist-roster__card-wrapper">
      <div class="artist-roster__card">
        <div class="headshot">
          <img src="${entry.img}" alt="">
        </div>
        <div class="artist-roster__card__nameplate">
          <h3 class="name">${entry.name}</h3>
        </div>
      </div>
    </div>`
  });
  return list;
};
function renderCardsHTML(div) {
  div.innerHTML = generateCardsHTML(artists);
};

