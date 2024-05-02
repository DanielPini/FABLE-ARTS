const objects = document.querySelectorAll(".object");

objects.forEach((object, index) => {
	let startX, startY;

	object.addEventListener("mousedown", handleStart);
	object.addEventListener("touchstart", handleStart);

	function handleStart(event) {
		event.preventDefault();
		startX = event.clientX || event.touches[0].clientX;
		startY = event.clientY || event.touches[0].clientY;

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

		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			playSound(`horizontalDragSound${index + 1}`);
		} else {
			playSound(`verticalDragSound${index + 1}`);
		}
	}

	function touchmoveHandler(event) {
		event.preventDefault();
		const newX = event.touches[0].clientX;
		const newY = event.touches[0].clientY;
		const deltaX = newX - startX;
		const deltaY = newY - startY;

		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			playSound(`horizontalDragSound${index + 1}`);
		} else {
			playSound(`verticalDragSound${index + 1}`);
		}
	}

	function handleEnd() {
		document.removeEventListener("mousemove", mousemoveHandler);
		document.removeEventListener("touchmove", touchmoveHandler);
	}

	object.addEventListener("click", () => {
		playSound(`clickSound${index + 1}`);
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
