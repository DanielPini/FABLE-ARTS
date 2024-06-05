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


let observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add("jsGrowBamboo");
		} else {
			entry.target.classList.remove("jsGrowBamboo");
		}
	});
});

document.querySelectorAll(".bambooImage").forEach((e) => {
	observer.observe(e);
});
