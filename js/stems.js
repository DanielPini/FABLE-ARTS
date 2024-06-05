const objects = document.querySelectorAll(".object");

objects.forEach((object, index) => {
	let startX, startY, isDragging = false, soundPlayed = false;

	object.addEventListener("mousedown", handleStart);
	object.addEventListener("touchstart", handleStart);

	function handleStart(event) {
		event.preventDefault();
		startX = event.clientX || event.touches[0].clientX;
		startY = event.clientY || event.touches[0].clientY;
		isDragging = false; // Reset the flag at the start of an interaction
		soundPlayed = false; // Reset the soundPlayed flag at the start of an interaction

		document.addEventListener("mousemove", mousemoveHandler);
		document.addEventListener("touchmove", touchmoveHandler);

		document.addEventListener("mouseup", handleEnd);
		document.addEventListener("touchend", handleEnd);
	}

	function mousemoveHandler(event) {
		const newX = event.clientX;
		const newY = event.clientY;
		const deltaX = newX - startX;
		const deltaY = newY - startY;

		if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
			isDragging = true; // Set the flag if a drag is detected
		}

		if (!soundPlayed) { // Check if the sound has already been played
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				playSound(`horizontalDragSound${index + 1}`);
			} else {
				playSound(`verticalDragSound${index + 1}`);
			}
			soundPlayed = true; // Set the flag after playing the sound
		}
	}

	function touchmoveHandler(event) {
		event.preventDefault();
		const newX = event.touches[0].clientX;
		const newY = event.touches[0].clientY;
		const deltaX = newX - startX;
		const deltaY = newY - startY;

		if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
			isDragging = true; // Set the flag if a drag is detected
		}

		if (!soundPlayed) { // Check if the sound has already been played
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				playSound(`horizontalDragSound${index + 1}`);
			} else {
				playSound(`verticalDragSound${index + 1}`);
			}
			soundPlayed = true; // Set the flag after playing the sound
		}
	}

	function handleEnd() {
		document.removeEventListener("mousemove", mousemoveHandler);
		document.removeEventListener("touchmove", touchmoveHandler);
		isDragging = false; // Reset the flag when dragging ends
	}

	object.addEventListener("click", () => {
		if (!isDragging) {
			playSound(`clickSound${index + 1}`);
		}
	});
});

function playSound(soundId) {
	const sound = document.getElementById(soundId);
	if (sound) {
		sound.currentTime = 0;
		sound.play();
	}
}


document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
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
