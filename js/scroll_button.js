  // Get the button:
  let scrollButton = document.getElementById("scroll-btn");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) 
    {
      scrollButton.classList.add("show-scroll-button");
      scrollButton.classList.remove("hide-scroll-button");
    } else {
      scrollButton.classList.remove("show-scroll-button");
      scrollButton.classList.add("hide-scroll-button");
    }
  };
  
  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }