document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    // root: null, // Use the viewport as the root
    rootMargin: '0px',
    threshold: 0 // Trigger when the element is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('bamboo-image-left-side')) {
          entry.target.classList.add('js-grow-bamboo');
        } else if (entry.target.classList.contains('bamboo-image-right-side')) {
          entry.target.classList.add('js-grow-bamboo');
        }
      } else {
        entry.target.classList.remove('js-grow-bamboo');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const bambooImages = document.querySelectorAll('.bamboo-image-left-side, .bamboo-image-right-side');
  bambooImages.forEach(image => observer.observe(image));
});