function search() {
  input.addEventListener("input", e => {
    const value = e.target.value
    artists.forEach(artist => {
    const isVisible = 
      artist.name.includes(value) || artist.year.includes(value) || artist.project.includes(value) || artist.disciplines.includes(value);
    artist.classList.toggle("hide", !isVisible)
   })
  })
}