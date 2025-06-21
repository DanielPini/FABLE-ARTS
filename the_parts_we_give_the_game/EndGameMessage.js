class EndGameMessage {
  constructor({ onComplete, overworld }) {
    this.onComplete = onComplete;
    this.overworld = overworld;
    this.element = null;
  }

  createElement() {
    const currentTime = new Date();
    const code = String(Date.now()).slice(-8);
    const date = currentTime.toDateString();
    this.element = document.createElement("div");
    this.element.classList.add("WelcomeMessage");
    this.element.innerHTML = `
      <div class="WelcomeMessage_p">
        <h2>CONGRATULATIONS ON COMPLETING</h2>
        <div class="inner-div">
          <img
            src="./images/TitleEndMessage.png"
            alt="The Parts We Give, the Game" />
          <div class="codes">
            <p>COUPON CODE: <br />${code}</p>
            <p>DATE: <br />${date}</p>
          </div>
        </div>
        <p>
          Redeem your exclusive sticker at the ticket booth at Christine Pan's
          sonng cycle "The Parts We Give".
        </p>
        <div class="EndGameMessage_ticket">
          <button class="EndGameMessage_print">Print Ticket</button>
          <button class="song-cycle">Info about the Song Cycle</button>
        </div>
        <br />
        <button class="EndGameMessage_return">Return to Title Screen</button>
      </div>
    `;

    // Print button
    this.element
      .querySelector(".EndGameMessage_print")
      .addEventListener("click", () => {
        window.print();
      });

    // Get information about song cycle
    this.element.querySelector(".song-cycle").addEventListener("click", () => {
      window.open(
        "https://www.eventbrite.com.au/e/the-parts-we-give-songcycle-world-premiere-tickets-1343827035839?aff=oddtdtcreator"
      );
    });

    // Return to title screen button
    this.element
      .querySelector(".EndGameMessage_return")
      .addEventListener("click", () => {
        this.done();
      });
  }

  done() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    // if (this.overworld) {
    //   this.overworld.showTitleScreen();
    // }
    if (window.overworld) {
      window.overworld.restartGameToTitle();
    }
    if (this.onComplete) this.onComplete();
  }

  init(container = document.querySelector(".game-container")) {
    this.createElement();
    container.appendChild(this.element);
  }
}

window.EndGameMessage = EndGameMessage;
