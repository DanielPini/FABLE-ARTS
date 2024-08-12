// const banner = document.querySelector("#welcome-banner");
// console.log("Index.js working.")

// if ( window.innerWidth < 600 ) {
//   banner.classList.add("welcome-banner--small")
// } else {
//   banner.classList.add("welcome-banner--large")
// }

// window.addEventListener("resize", debounce((e) => {
//   let width = window.innerWidth;
//   if ( width < 600 ) {
//     banner.classList.add("welcome-banner--small")
//     banner.classList.remove("welcome-banner--large")
//     console.log(window.innerWidth + banner.classList)
//   } else {
//     banner.classList.remove("welcome-banner--small")
//     banner.classList.add("welcome-banner--large")
//     console.log(window.innerWidth + banner.classList)
//   }
// }, 250));

// function debounce() {
//   let timeout;
//   return function() {
//     let context = this, args = arguments;
//     let later = function() {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };
//     let callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//     if(callNow) func.apply(context, args);
//   };
// };

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
