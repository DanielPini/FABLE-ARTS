class OverworldMap {
  constructor(config) {
    this.id = config.id;
    this.overworld = null;
    this.configObjects = config.configObjects; // Configuration content
    this.gameObjects = {}; // Starts empty, live object instances in the map get added here
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};
    this.chairs = config.chairs || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
    this.mountObjects();
  }

  spawnActiveQuestObjects() {
    const activeQuests = this.overworld.questManager.activeQuests;
    if (!activeQuests) return;

    Object.values(activeQuests).forEach((quest) => {
      if (quest.spawnObjects) {
        quest.spawnObjects.forEach((obj) => {
          // Only spawn if this object is for this map, not picked up, and not already present
          if (
            obj.map === this.id &&
            !window.playerState.pickedUpQuestObjects.includes(obj.id) &&
            !this.gameObjects[obj.id]
          ) {
            // Use your existing addGameObject logic
            this.overworld.addGameObject({ ...obj });
          }
        });
      }
    });
  }

  refreshGameObjects() {
    Object.values(this.gameObjects).forEach((obj) => {
      if (typeof obj.unmount === "function") {
        obj.unmount();
      }
    });
    this.gameObjects = {};
    this.objectsMounted = false;
    this.mountObjects();
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction, ignoreId = null) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);

    if (this.walls[`${x},${y}`]) {
      return true;
    }
    // Check for objects that match, but ignore the object with ignoreId
    return Object.values(this.gameObjects).some((obj) => {
      if (ignoreId && obj.id === ignoreId) return false;
      if (obj.x === x && obj.y === y) {
        return true;
      }
      if (
        (obj.intentPosition &&
          obj.intentPosition[0] === x &&
          obj.intentPosition[1] === y) ||
        (!obj.intentPosition && obj.x === x && obj.y === y)
      ) {
        return true;
      }
      return false;
    });
  }

  mountObjects() {
    if (this.objectsMounted) {
      console.warn("Objects already mounted for this map instance.");
      return;
    }
    this.objectsMounted = true;
    Object.keys(this.configObjects).forEach((key) => {
      let config = this.configObjects[key];

      // Add guard to protect against missing configs
      if (!config) {
        console.error(`Missing config for key: ${key}`);
        return;
      }

      config.id = key;

      let obj;
      if (config.type === "Person") {
        obj = new Person(config);
      }
      if (config.type === "PizzaStone") {
        obj = new PizzaStone(config);
      }
      if (config.type === "Plates") {
        obj = new Plates(config);
      }
      if (config.type === "Table") {
        obj = new Table(config);
      }

      this.gameObjects[key] = obj;
      this.gameObjects[key].id = key;
      obj.mount(this);
    });
  }

  drawTargetHighlight(ctx, target, cameraPerson) {
    if (!target) return;
    const tileSize = 16; // or your grid size

    // If target.x/y are in pixels (from utils.withGrid), use as is:
    const screenX = target.x - cameraPerson.x - 7 + ctx.canvas.width / 2;
    const screenY = target.y - cameraPerson.y - 1 + ctx.canvas.height / 2;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 0, 0.81)";
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.7;
    ctx.strokeRect(screenX, screenY, tileSize, tileSize);
    ctx.fillStyle = "rgba(255, 255, 0, 0.37)";
    ctx.fillRect(screenX, screenY, tileSize, tileSize);
    ctx.restore();
  }

  // Right after objects are mounted and the hero is in place:
  triggerLoadCutscenes() {
    Object.keys(this.cutsceneSpaces).forEach((coord) => {
      this.cutsceneSpaces[coord].forEach((cutScene) => {
        if (cutScene.triggerOnLoad) {
          // Optionally check disqualify flags as before:
          if (
            cutScene.disqualify &&
            cutScene.disqualify.some((sf) => playerState.storyFlags[sf])
          ) {
            return;
          }
          this.startCutscene(cutScene.events);
        }
      });
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });

      const result = await eventHandler.init();

      if (result === "LOST_BATTLE") {
        break;
      }
    }
    this.isCutscenePlaying = false;
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    if (!hero) return;
    // Check if hero is facint the table
    if (this.gameObjects["table"] && Table.isHeroFacingTable(hero)) {
      // Trigger the table's talking events (e.g., placeTableObjects)
      const table = this.gameObjects["table"];
      if (table.talking && table.talking.length) {
        this.startCutscene(table.talking[0].events);
        return;
      }
    }
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        // If disqualify flags exist and any are set in playerState, skip this scenario:
        if (
          scenario.disqualify &&
          scenario.disqualify.some((sf) => playerState.storyFlags[sf])
        ) {
          return false;
        }
        // Otherwise ensure all required flags are set, if there are any:
        return (scenario.required || []).every((sf) => {
          return playerState.storyFlags[sf];
        });
      });
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    if (!hero) return;
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    this.checkForChair(hero.x, hero.y, hero.direction);
    if (!this.isCutscenePlaying && match) {
      const relevantCutscene = match.find((cutScene) => {
        if (
          cutScene.disqualify &&
          cutScene.disqualify.some((sf) => playerState.storyFlags[sf])
        ) {
          return false;
        }
        return true;
      });

      if (relevantCutscene) {
        this.startCutscene(match[0].events);
      }
    }
  }

  getChairAt(x, y) {
    return this.chairs[utils.asGridCoord(x, y)] || null;
  }

  checkForChair() {
    const hero = this.gameObjects["hero"];
    if (!hero) return;
    const x = hero.x;
    const y = hero.y;
    const chair = this.getChairAt(x, y);

    if (!this.isCutscenePlaying && this.chairs[`${x},${y}`]) {
      hero.isSitting = true;
      hero.startBehavior(this, {
        type: "sit",
        direction: this.chairs[`${x},${y}`].direction.trim() || hero.direction,
      });
    }
  }

  handleMusicEvent(event) {
    // Ensure the event contains a valid music source
    if (!event.src) {
      console.warn("No music source provided");
      return;
    }

    // Check if the music is already playing and if it's the same as the current one
    if (window.lastMusicSrc === event.src) {
      console.log("Music is already playing:", event.src);
      return; // Don't restart the music if it's the same
    }

    // If it's different, stop the current music if it exists
    if (window.currentMusic) {
      console.log("Stopping current music.");
      window.currentMusic.stop();
    }

    // Start the new music
    console.log("Starting music:", event.src);
    window.currentMusic = new Howl({
      src: [event.src],
      loop: event.loop || false,
      volume: window.audioSettings.muted ? 0 : window.audioSettings.volume,
      onend: () => {
        console.log("Music ended");
        // After the music ends, mark that the music has stopped playing
        window.lastMusicSrc = null;
      },
    });

    window.currentMusic.play();
    window.lastMusicSrc = event.src; // Store the current music source
  }
}

window.OverworldMaps = {
  Home: {
    createInstance(character) {
      return new OverworldMap({
        id: "Home",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Living.png"
            : "./images/maps/brother/Living.png",

        upperSrc: "",

        configObjects: getConfigObjectsForHome(character),
        cutsceneSpaces: getCutsceneSpacesForHome(character),
        chairs: (function () {
          let chairs = {};
          [
            // Study Chair
            "2, 16, down",
            // Dining Table Chairs
            "6, 13, right",
            "7, 11, down",
            "7, 15, up",
            "9, 11, down",
            "9, 15, up",
            "11, 11, down",
            "11, 15, up",
            "12, 13, left",
            // Bar Stools
            "16, 10, right",
            "16, 12, right",
            "16, 14, right",
            // Piano Stool
            "2, 7, up",
            // Sofa
            "6, 6, down",
          ].forEach((coord) => {
            let [x, y, direction] = coord.split(",");
            chairs[utils.asGridCoord(x, y)] = { direction };
          });
          return chairs;
        })(),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "0, 5",
            "1, 5",
            "2, 5",
            "3, 5",
            "4, 5",
            "5, 5",
            "6, 5",
            "7, 5",
            "8, 5",
            // Dividing wall to balcony
            "8, 5",
            "8, 6",
            "8, 7",
            "8, 8",
            // Balcony balastrade
            "9, 5",
            "10, 5",
            "11, 5",
            "12, 5",
            "13, 5",
            "14, 5",
            "15, 5",
            "16, 5",
            // Balcony right wall
            "17, 6",
            "17, 7",
            "17, 8",
            // Kitchen divider
            "17, 9",
            "17, 10",
            "17, 11",
            "17, 12",
            "17, 13",
            "17, 14",
            "17, 15",
            // Kitchen
            // Back wall & fridge
            "18, 9",
            "19, 9",
            "20, 9",
            // Right prep space
            "21, 10",
            "21, 11",
            "21, 12",
            "21, 13",
            "21, 14",
            "21, 15",
            // Rigth wall
            "22, 16",
            "23, 17", // Door to Kid's room
            "22, 18",
            "22, 19",
            "22, 20",
            "22, 21",
            "22, 22",
            "23, 23", // Door to bathroom
            "22, 24",
            "21, 25",
            "20, 26", // Door to master bedroom
            "19, 25",
            "18, 24",
            "17, 23", // Door to laundry
            "18, 22",
            "18, 21",
            "18, 20",
            "18, 19",
            // Middle bottom wall
            "13, 19",
            "14, 19",
            "15, 19",
            "16, 19",
            "17, 19",
            // Entrance Hallway
            // Right wll
            "12,19",
            "12,20",
            "12,21",
            "12,22",
            "12,23",
            "12,24",
            "12,25",
            // Bottom wall
            "9, 26",
            "10, 26",
            "11, 26",
            // Left wall
            "8, 19",
            "8, 20",
            "8, 21",
            "8, 22",
            "8, 23",
            "8, 24",
            "8, 25",
            // Left Bottom wall
            "0, 19",
            "1, 19",
            "2, 19",
            "3, 19",
            "4, 19",
            "5, 19",
            "6, 19",
            "7, 19",
            // Left wall
            "-1, 6",
            "-1, 7",
            "-1, 8",
            "-1, 9",
            "-1, 10",
            "-1, 11",
            "-1, 12",
            "-1, 13",
            "-1, 14",
            "-1, 15",
            "-1, 16",
            "-1, 17",
            "-1, 18",
            "-1, 19",
            // Assets
            // Study table and chair
            "1, 17",
            "2, 17",
            "3, 17",
            "1, 18",
            "2, 18",
            "3, 18",
            // Dining table and chairs
            "7, 12",
            "8, 12",
            "9, 12",
            "10, 12",
            "11, 12",
            "7, 13",
            "8, 13",
            "9, 13",
            "10, 13",
            "11, 13",
            "7, 14",
            "8, 14",
            "9, 14",
            "10, 14",
            "11, 14",
            // Piano
            "1, 6",
            "2, 6",
            "3, 6",
            // Sofa
            "5, 6",
            "7, 6",
            // Plant
            "0, 6",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },
  HomeMediation: {
    createInstance(character) {
      return new OverworldMap({
        id: "HomeMediation",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/LivingMediation.png"
            : "./images/maps/brother/LivingMediation.png",

        upperSrc: "",

        configObjects: getConfigObjectsForHomeMediation(character),
        cutsceneSpaces: getCutsceneSpacesForHomeMediation(character),
        chairs: (function () {
          let chairs = {};
          [
            // Study Chair
            "2, 16, down",
            // Dining Table Chairs
            "6, 13, right",
            "7, 11, down",
            "7, 15, up",
            "9, 11, down",
            "9, 15, up",
            "11, 11, down",
            "11, 15, up",
            "12, 13, left",
            // Bar Stools
            "16, 10, right",
            "16, 12, right",
            "16, 14, right",
            // Piano Stool
            "2, 7, up",
            // Sofa
            "6, 6, down",
          ].forEach((coord) => {
            let [x, y, direction] = coord.split(",");
            chairs[utils.asGridCoord(x, y)] = { direction };
          });
          return chairs;
        })(),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "0, 5",
            "1, 5",
            "2, 5",
            "3, 5",
            "4, 5",
            "5, 5",
            "6, 5",
            "7, 5",
            "8, 5",
            // Dividing wall to balcony
            "8, 5",
            "8, 6",
            "8, 7",
            "8, 8",
            // Balcony balastrade
            "9, 5",
            "10, 5",
            "11, 5",
            "12, 5",
            "13, 5",
            "14, 5",
            "15, 5",
            "16, 5",
            // Balcony right wall
            "17, 6",
            "17, 7",
            "17, 8",
            // Kitchen divider
            "17, 9",
            "17, 10",
            "17, 11",
            "17, 12",
            "17, 13",
            "17, 14",
            "17, 15",
            // Kitchen
            // Back wall & fridge
            "18, 9",
            "19, 9",
            "20, 9",
            // Right prep space
            "21, 10",
            "21, 11",
            "21, 12",
            "21, 13",
            "21, 14",
            "21, 15",
            // Rigth wall
            "22, 16",
            "23, 17", // Door to Kid's room
            "22, 18",
            "22, 19",
            "22, 20",
            "22, 21",
            "22, 22",
            "23, 23", // Door to bathroom
            "22, 24",
            "21, 25",
            "20, 26", // Door to master bedroom
            "19, 25",
            "18, 24",
            "17, 23", // Door to laundry
            "18, 22",
            "18, 21",
            "18, 20",
            "18, 19",
            // Middle bottom wall
            "13, 19",
            "14, 19",
            "15, 19",
            "16, 19",
            "17, 19",
            // Entrance Hallway
            // Right wll
            "12,19",
            "12,20",
            "12,21",
            "12,22",
            "12,23",
            "12,24",
            "12,25",
            // Bottom wall
            "9, 26",
            "10, 26",
            "11, 26",
            // Left wall
            "8, 19",
            "8, 20",
            "8, 21",
            "8, 22",
            "8, 23",
            "8, 24",
            "8, 25",
            // Left Bottom wall
            "0, 19",
            "1, 19",
            "2, 19",
            "3, 19",
            "4, 19",
            "5, 19",
            "6, 19",
            "7, 19",
            // Left wall
            "-1, 6",
            "-1, 7",
            "-1, 8",
            "-1, 9",
            "-1, 10",
            "-1, 11",
            "-1, 12",
            "-1, 13",
            "-1, 14",
            "-1, 15",
            "-1, 16",
            "-1, 17",
            "-1, 18",
            "-1, 19",
            // Assets
            // Study table and chair
            "1, 17",
            "2, 17",
            "3, 17",
            "1, 18",
            "2, 18",
            "3, 18",
            // Dining table and chairs
            "7, 12",
            "8, 12",
            "9, 12",
            "10, 12",
            "11, 12",
            "7, 13",
            "8, 13",
            "9, 13",
            "10, 13",
            "11, 13",
            "7, 14",
            "8, 14",
            "9, 14",
            "10, 14",
            "11, 14",
            // Piano
            "1, 6",
            "2, 6",
            "3, 6",
            // Sofa
            "5, 6",
            "7, 6",
            // Plant
            "0, 6",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  Bathroom: {
    createInstance(character) {
      return new OverworldMap({
        id: "Bathroom",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Bathroom.png"
            : "./images/maps/brother/Bathroom.png",

        upperSrc: "",

        configObjects: getConfigObjectsForBathroom(character),
        cutsceneSpaces: getCutsceneSpacesForBathroom(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "1, 3",
            "2, 3",
            "3, 3",
            "4, 3",
            "5, 3",
            "6, 3",
            "7, 3",
            "8, 3",
            // Right wall
            "6, 4",
            "6, 5",
            "6, 6",
            "6, 7",
            "6, 8",
            "6, 9",
            "6, 10",
            // Bottom wall
            "1, 11",
            "2, 11",
            "3, 11",
            "4, 11",
            "5, 11",
            "6, 11",
            "7, 11",
            "8, 11",
            // Left wall
            "0, 4",
            "0, 5",
            "0, 6",
            "0, 7",
            "-1, 8",
            "0, 9",
            "0, 10",
            // Assets
            // Shower
            "5, 8",
            "4, 8",
            "4, 9",
            // Dresser
            "3, 9",
            "2, 9",
            "1, 9",
            // Toilet
            "4, 4",
            // Bath
            "2, 4",
            "1, 4",
            // Plants
            "3, 4",
            "5, 4",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  Kid: {
    createInstance(character) {
      return new OverworldMap({
        id: "Kid",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Kid.png"
            : "./images/maps/brother/Kid.png",

        upperSrc: "",

        configObjects: getConfigObjectsForKid(character),
        cutsceneSpaces: getCutsceneSpacesForKid(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "1, 4",
            "2, 4",
            "3, 4",
            "4, 4",
            "5, 4",
            "6, 4",
            "7, 4",
            "8, 4",
            // Right wall
            "9, 5",
            "9, 6",
            "9, 7",
            "9, 8",
            "9, 9",
            "9, 10",
            "9, 11",
            "9, 12",
            "9, 13",
            "9, 14",
            "9, 15",
            // Bottom wall
            "1, 16",
            "2, 16",
            "3, 16",
            "4, 16",
            "5, 16",
            "6, 16",
            "7, 16",
            "8, 16",
            // Left wall
            "0, 5",
            "0, 6",
            "0, 7",
            "0, 8",
            "0, 9",
            "0, 10",
            "0, 11",
            "0, 12",
            "-1, 13",
            "0, 14",
            "0, 15",
            // Assets
            // Desk and chair
            "6, 13",
            "5, 14",
            "6 ,14",
            "7, 14",
            "5, 15",
            "6, 15",
            "7, 15",
            // Beds
            // Left
            "1, 5",
            "2, 5",
            "1, 6",
            "2, 6",
            "1, 7",
            "2, 7",
            // Right
            "7, 5",
            "8, 5",
            "7, 6",
            "8, 6",
            "7, 7",
            "8, 7",
            // Chest
            "4, 5",
            "5, 5",
            // Plant
            "6, 5",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  ChopRoom: {
    createInstance(character) {
      return new OverworldMap({
        id: "chop",
        lowerSrc: "./images/maps/TableclothChoppingRoom.png",

        upperSrc: "",

        configObjects: getConfigObjectsForChop(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "1, 4",
            "2, 4",
            "3, 4",
            "4, 4",
            "5, 4",
            "6, 4",
            "7, 4",
            "8, 4",
            // Right wall
            "9, 5",
            "9, 6",
            "9, 7",
            "9, 8",
            "9, 9",
            "9, 10",
            "9, 11",
            "9, 12",
            "9, 13",
            "9, 14",
            "9, 15",
            // Bottom wall
            "1, 16",
            "2, 16",
            "3, 16",
            "4, 16",
            "5, 16",
            "6, 16",
            "7, 16",
            "8, 16",
            // Left wall
            "0, 5",
            "0, 6",
            "0, 7",
            "0, 8",
            "0, 9",
            "0, 10",
            "0, 11",
            "0, 12",
            "-1, 13",
            "0, 14",
            "0, 15",
            // Assets
            // Desk and chair
            "6, 13",
            "5, 14",
            "6 ,14",
            "7, 14",
            "5, 15",
            "6, 15",
            "7, 15",
            // Beds
            // Left
            "1, 5",
            "2, 5",
            "1, 6",
            "2, 6",
            "1, 7",
            "2, 7",
            // Right
            "7, 5",
            "8, 5",
            "7, 6",
            "8, 6",
            "7, 7",
            "8, 7",
            // Chest
            "4, 5",
            "5, 5",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  Laundry: {
    createInstance(character) {
      return new OverworldMap({
        id: "Laundry",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Laundry.png"
            : "./images/maps/brother/Laundry.png",

        upperSrc: "",

        configObjects: getConfigObjectsForLaundry(character),
        cutsceneSpaces: getCutsceneSpacesForLaundry(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "0, 3",
            "1, 3",
            "2, 3",
            "3, 3",
            "4, 3",
            // Right wall
            "5, 4",
            "5, 5",
            "5, 6",
            "5, 7",
            "6, 8",
            "5, 9",
            // Bottom wall
            "0, 10",
            "1, 10",
            "2, 10",
            "3, 10",
            "4, 10",
            // Left wall
            "-1, 4",
            "-1, 5",
            "-1, 6",
            "-1, 7",
            "-1, 8",
            "-1, 9",
            // Assets
            // Ironing board
            "0, 4",
            "1, 4",
            // Dryer
            "2, 4",
            // Washing machine
            "4, 4",
            // Plant
            "4, 9",
            // Sink
            "0, 9",
            "0, 8",
            // Washing baskets
            "0, 5",
            "0, 6",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  Master: {
    createInstance(character) {
      return new OverworldMap({
        id: "Master",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Master.png"
            : "./images/maps/brother/Master.png",

        upperSrc: "",

        configObjects: getConfigObjectsForMaster(character),
        cutsceneSpaces: getCutsceneSpacesForMaster(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "0, 3",
            "1, 3",
            "2, 3",
            "3, 3",
            "4, 3",
            "5, 3",
            "6, 3",
            "7, 2",
            "8, 3",
            // Right wall
            "9, 4",
            "9, 5",
            "9, 6",
            "9, 7",
            "9, 8",
            "9, 9",
            "9, 10",
            "9, 11",
            // Bottom wall
            "0, 12",
            "1, 12",
            "2, 12",
            "3, 12",
            "4, 12",
            "5, 12",
            "6, 12",
            "7, 12",
            "8, 12",
            // Left wall
            "-1, 4",
            "-1, 5",
            "-1, 6",
            "-1, 7",
            "-1, 8",
            "-1, 9",
            "-1, 10",
            "-1, 11",
            // Assets
            // Closet
            "0, 4",
            "1, 4",
            "2, 4",
            "3, 4",
            "4, 4",
            // Stools
            // Upper
            "5, 4",
            // Lower
            "2, 11",
            // Bed
            "3, 8",
            "3, 9",
            "3, 10",
            "3, 11",
            "4, 8",
            "4, 9",
            "4, 10",
            "4, 11",
            "5, 8",
            "5, 9",
            "5, 10",
            "5, 11",
            // Plants
            "0, 5",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  BathroomMediation: {
    createInstance(character) {
      return new OverworldMap({
        id: "BathroomMediation",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Bathroom.png"
            : "./images/maps/brother/Bathroom.png",

        upperSrc: "",

        configObjects: getConfigObjectsForBathroomMediation(character),
        cutsceneSpaces: getCutsceneSpacesForBathroomMediation(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "1, 3",
            "2, 3",
            "3, 3",
            "4, 3",
            "5, 3",
            "6, 3",
            "7, 3",
            "8, 3",
            // Right wall
            "6, 4",
            "6, 5",
            "6, 6",
            "6, 7",
            "6, 8",
            "6, 9",
            "6, 10",
            // Bottom wall
            "1, 11",
            "2, 11",
            "3, 11",
            "4, 11",
            "5, 11",
            "6, 11",
            "7, 11",
            "8, 11",
            // Left wall
            "0, 4",
            "0, 5",
            "0, 6",
            "0, 7",
            "-1, 8",
            "0, 9",
            "0, 10",
            // Assets
            // Shower
            "5, 8",
            "4, 8",
            "4, 9",
            // Dresser
            "3, 9",
            "2, 9",
            "1, 9",
            // Toilet
            "4, 4",
            // Bath
            "2, 4",
            "1, 4",
            // Plants
            "3, 4",
            "5, 4",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  KidMediation: {
    createInstance(character) {
      return new OverworldMap({
        id: "KidMediation",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Kid.png"
            : "./images/maps/brother/Kid.png",

        upperSrc: "",

        configObjects: getConfigObjectsForKidMediation(character),
        cutsceneSpaces: getCutsceneSpacesForKidMediation(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "1, 4",
            "2, 4",
            "3, 4",
            "4, 4",
            "5, 4",
            "6, 4",
            "7, 4",
            "8, 4",
            // Right wall
            "9, 5",
            "9, 6",
            "9, 7",
            "9, 8",
            "9, 9",
            "9, 10",
            "9, 11",
            "9, 12",
            "9, 13",
            "9, 14",
            "9, 15",
            // Bottom wall
            "1, 16",
            "2, 16",
            "3, 16",
            "4, 16",
            "5, 16",
            "6, 16",
            "7, 16",
            "8, 16",
            // Left wall
            "0, 5",
            "0, 6",
            "0, 7",
            "0, 8",
            "0, 9",
            "0, 10",
            "0, 11",
            "0, 12",
            "-1, 13",
            "0, 14",
            "0, 15",
            // Assets
            // Desk and chair
            "6, 13",
            "5, 14",
            "6 ,14",
            "7, 14",
            "5, 15",
            "6, 15",
            "7, 15",
            // Beds
            // Left
            "1, 5",
            "2, 5",
            "1, 6",
            "2, 6",
            "1, 7",
            "2, 7",
            // Right
            "7, 5",
            "8, 5",
            "7, 6",
            "8, 6",
            "7, 7",
            "8, 7",
            // Chest
            "4, 5",
            "5, 5",
            // Plant
            "6, 5",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  LaundryMediation: {
    createInstance(character) {
      return new OverworldMap({
        id: "LaundryMediation",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Laundry.png"
            : "./images/maps/brother/Laundry.png",

        upperSrc: "",

        configObjects: getConfigObjectsForLaundryMediation(character),
        cutsceneSpaces: getCutsceneSpacesForLaundryMediation(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "0, 3",
            "1, 3",
            "2, 3",
            "3, 3",
            "4, 3",
            // Right wall
            "5, 4",
            "5, 5",
            "5, 6",
            "5, 7",
            "6, 8",
            "5, 9",
            // Bottom wall
            "0, 10",
            "1, 10",
            "2, 10",
            "3, 10",
            "4, 10",
            // Left wall
            "-1, 4",
            "-1, 5",
            "-1, 6",
            "-1, 7",
            "-1, 8",
            "-1, 9",
            // Assets
            // Ironing board
            "0, 4",
            "1, 4",
            // Dryer
            "2, 4",
            // Washing machine
            "4, 4",
            // Plant
            "4, 9",
            // Sink
            "0, 9",
            "0, 8",
            // Washing baskets
            "0, 5",
            "0, 6",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },

  MasterMediation: {
    createInstance(character) {
      return new OverworldMap({
        id: "MasterMediation",
        lowerSrc:
          character === "sister"
            ? "./images/maps/sister/Master.png"
            : "./images/maps/brother/Master.png",

        upperSrc: "",

        configObjects: getConfigObjectsForMasterMediation(character),
        cutsceneSpaces: getCutsceneSpacesForMasterMediation(character),
        walls: (function () {
          let walls = {};
          [
            // Top wall
            "0, 3",
            "1, 3",
            "2, 3",
            "3, 3",
            "4, 3",
            "5, 3",
            "6, 3",
            "7, 2",
            "8, 3",
            // Right wall
            "9, 4",
            "9, 5",
            "9, 6",
            "9, 7",
            "9, 8",
            "9, 9",
            "9, 10",
            "9, 11",
            // Bottom wall
            "0, 12",
            "1, 12",
            "2, 12",
            "3, 12",
            "4, 12",
            "5, 12",
            "6, 12",
            "7, 12",
            "8, 12",
            // Left wall
            "-1, 4",
            "-1, 5",
            "-1, 6",
            "-1, 7",
            "-1, 8",
            "-1, 9",
            "-1, 10",
            "-1, 11",
            // Assets
            // Closet
            "0, 4",
            "1, 4",
            "2, 4",
            "3, 4",
            "4, 4",
            // Stools
            // Upper
            "5, 4",
            // Lower
            "2, 11",
            // Bed
            "3, 8",
            "3, 9",
            "3, 10",
            "3, 11",
            "4, 8",
            "4, 9",
            "4, 10",
            "4, 11",
            "5, 8",
            "5, 9",
            "5, 10",
            "5, 11",
            // Plants
            "0, 5",
          ].forEach((coord) => {
            let [x, y] = coord.split(",");
            walls[utils.asGridCoord(x, y)] = true;
          });
          return walls;
        })(),
      });
    },
  },
};

function getConfigObjectsForKidMediation(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {};

  const brotherNPCs = {};

  const shared = {};

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForKidMediation(character) {
  const shared = {
    /**
     * Music
     */
    [utils.asGridCoord(0, 13)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "HomeMediation",
            x: utils.withGrid(22),
            y: utils.withGrid(17),
            direction: "left",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForLaundryMediation(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {};

  const brotherNPCs = {};

  const shared = {};

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForLaundryMediation(character) {
  const shared = {
    [utils.asGridCoord(5, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "HomeMediation",
            x: utils.withGrid(18),
            y: utils.withGrid(23),
            direction: "right",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForMasterMediation(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {};

  const brotherNPCs = {};

  const shared = {};

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForMasterMediation(character) {
  const shared = {
    [utils.asGridCoord(7, 3)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "HomeMediation",
            x: utils.withGrid(20),
            y: utils.withGrid(25),
            direction: "up",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForBathroomMediation(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {};

  const brotherNPCs = {};

  const shared = {};

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForBathroomMediation(character) {
  const shared = {
    [utils.asGridCoord(0, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "HomeMediation",
            x: utils.withGrid(22),
            y: utils.withGrid(23),
            direction: "left",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForChop(character) {
  return {
    // No hero or Person object!
    // apple: {
    //   type: "Apple",
    //   x: utils.withGrid(7),
    //   y: utils.withGrid(12),
    //   placements: [],
    //   talking: [],
    // },
    // Optionally, add a knife GameObject if you want it on the map (not needed if ChopFruitRoom handles it)
    // knife: {
    //   type: "Knife",
    //   x: utils.withGrid(8),
    //   y: utils.withGrid(10),
    //   ...
    // },
  };
}

function getConfigObjectsForHome(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(20),
      y: utils.withGrid(10),
      direction: "down",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(19),
      y: utils.withGrid(12),
      direction: "down",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {
    Didi: {
      type: "Person",
      x: utils.withGrid(18),
      y: utils.withGrid(17),
      direction: "right",
      src: "./images/characters/people/Brother.png",
      behaviorLoop: [
        { type: "stand", direction: "right", time: 200 },
        { type: "stand", direction: "right", time: 1500 },
        { type: "stand", direction: "down", time: 1400 },
        { type: "walk", direction: "down", who: "Didi" },
        { type: "walk", direction: "down", who: "Didi" },
        { type: "stand", direction: "right", time: 600 },
        { type: "walk", direction: "up", who: "Didi" },
        { type: "walk", direction: "up", who: "Didi" },
        { type: "stand", direction: "left", time: 1500 },
        { type: "stand", direction: "down", time: 1400 },
        { type: "stand", direction: "up", time: 600 },
      ],
      talking: [
        {
          required: [],
          events: [
            {
              type: "randomTextMessage",
              options: [
                "Why is everyone so obsessed with cleaning today?",
                "Ba-ba hid my games console until I finished tidying up. I'm sooo bored!",
                "What are you doing?",
              ],
              faceHero: "Didi",
            },
          ],
        },
      ],
    },
    Mama: {
      type: "Person",
      x: utils.withGrid(19),
      y: utils.withGrid(18),
      direction: "left",
      src: "./images/characters/people/Mum.png",
      behaviorLoop: [
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "down", time: 700 },
        { type: "stand", direction: "up", time: 500 },
        { type: "stand", direction: "up", time: 3000 },
        { type: "stand", direction: "up", time: 400 },
      ],
      talking: [
        {
          required: [],
          events: [
            {
              type: "randomTextMessage",
              options: [
                "Oh, you forgot to pack your own fruit",
                "You didn't finish lunch yesterday. You gotta eat more food.",
              ],
              faceHero: "Mama",
            },
          ],
        },
      ],
    },
    Baba: {
      type: "Person",
      x: utils.withGrid(3),
      y: utils.withGrid(10),
      src: "./images/characters/people/Ba-ba.png",
      behaviorLoop: [
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "down", time: 700 },
        { type: "stand", direction: "right", time: 500 },
        { type: "stand", direction: "up", time: 3000 },
        { type: "stand", direction: "up", time: 400 },
      ],
      talking: [
        {
          required: [],
          events: [
            {
              type: "textMessage",
              text: "Help your mum prepare for our guests!",
              faceHero: "Baba",
            },
            {
              type: "randomTextMessage",
              options: [
                "The laundry is a mess. Take some of the load from your mum.",
                "Your brother is making a mess again. Get him under control!",
                "Is all the food ready for this evening?",
              ],
              faceHero: "Baba",
            },
          ],
        },
      ],
    },
  };

  const brotherNPCs = {
    Jiejie: {
      type: "Person",
      name: "Jiejie",
      x: utils.withGrid(19),
      y: utils.withGrid(16),
      src: "./images/characters/people/Sister.png",
      behaviorLoop: [
        { type: "stand", direction: "left", time: 800 },
        { type: "stand", direction: "right", time: 100 },
        { type: "stand", direction: "up", time: 300 },
        { type: "stand", direction: "left", time: 100 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "up" },
        { type: "walk", direction: "up" },
        { type: "walk", direction: "up" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "right", time: 800 },
        { type: "stand", direction: "down", time: 100 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "down" },
        { type: "walk", direction: "down" },
        { type: "stand", direction: "right", time: 400 },
        { type: "stand", direction: "up", time: 200 },
        { type: "stand", direction: "left", time: 500 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "up", time: 400 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "up", time: 100 },
      ],
      talking: [
        {
          disqualify: ["FETCH_PLATES_QUEST"],
          events: [
            {
              type: "textMessage",
              text: "What do you mean I counted too quickly?!",
            },
            { type: "textMessage", text: "Try again!" },
            {
              type: "textMessage",
              text: "* New Quest: Set the table *",
            },
            {
              type: "textMessage",
              text: "* Grab all 8 plates and all 8 sets of chopsticks and bring them to the table *",
            },
            { type: "startQuest", questId: "fetchPlates" },
            { type: "addStoryFlag", flag: "FETCH_PLATES_QUEST" },
            { type: "startQuestTimer", questId: "fetchPlates" },
          ],
        },
        // After collecting plates, but before delivering
        {
          required: ["FETCH_PLATES_QUEST"],
          disqualify: ["PLATES_DELIVERED"],
          events: [
            {
              type: "condition",
              conditions: [{ type: "tableSet", plates: 8, chopsticks: 8 }],
              onSuccess: [
                { type: "completeQuest", questId: "fetchPlates" },
                { type: "addStoryFlag", flag: "PLATES_DELIVERED" },
                {
                  who: "Jiejie",
                  type: "textMessage",
                  text: "Well done. Took long enough!",
                  faceHero: "Jiejie",
                },
                {
                  who: "Didi",
                  type: "textMessage",
                  text: "EZ moneyyyyyyy.",
                },
                {
                  who: "Mama",
                  type: "textMessage",
                  text: "Here. Come get the snack I made you as a reward.",
                },
                {
                  who: "Jiejie",
                  type: "textMessage",
                  text: "...So spoiled...",
                },
                {
                  who: "Jiejie",
                  type: "textMessage",
                  text: "Go see Ba-ba. He wanted you for something",
                },
                { type: "addStoryFlag", flag: "SENT_TO_BABA" },
              ],
              onFail: [
                {
                  who: "Jiejie",
                  type: "randomTextMessage",
                  options: [
                    "You don't have all the plates yet!",
                    "How can you be taking this long?",
                    "That table won't set itself! Get going.",
                  ],
                  faceHero: "Jiejie",
                },
              ],
            },
          ],
        },
        // After quest is complete, fallback dialogue
        {
          required: ["PLATES_DELIVERED"],
          disqualify: ["FETCH_NERFS_QUEST"],
          events: [
            {
              who: "Jiejie",
              type: "textMessage",
              text: "Go see Ba-ba. He wanted you for something.",
              faceHero: "Jiejie",
            },
          ],
        },
        // After quest is complete, fallback dialogue
        {
          required: ["FETCH_NERFS_QUEST"],
          disqualify: [],
          events: [
            {
              who: "Jiejie",
              type: "randomTextMessage",
              options: [
                "You're finally picking those up!",
                "How do you have so much stuff?",
              ],
              faceHero: "Jiejie",
            },
          ],
        },
      ],
    },
    Mama: {
      type: "Person",
      name: "Mama",
      x: utils.withGrid(18),
      y: utils.withGrid(17),
      src: "./images/characters/people/Mum.png",
      behaviorLoop: [
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "right", time: 2800 },
        { type: "stand", direction: "up", time: 1500 },
        { type: "stand", direction: "left", time: 2200 },
      ],
      talking: [
        {
          disqualify: ["PLATES_DELIVERED"],
          events: [
            {
              who: "Mama",
              type: "randomTextMessage",
              options: [
                "Such a good boy.",
                "Have you finished your homework?",
                "* Sigh * You know when your sister was your age, she got straight 'A's",
              ],
              faceHero: "Mama",
            },
          ],
        },
        {
          required: ["PLATES_DELIVERED"],
          events: [
            {
              who: "Mama",
              type: "textMessage",
              text: "Here, try this. I made a snack just for you!",
              faceHero: "Mama",
            },
          ],
        },
      ],
    },
    Baba: {
      type: "Person",
      x: utils.withGrid(5),
      y: utils.withGrid(10),
      src: "./images/characters/people/Ba-ba.png",
      behaviorLoop: [
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "right", time: 800 },
        { type: "stand", direction: "up", time: 1500 },
        { type: "stand", direction: "left", time: 1200 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "right", time: 800 },
        { type: "stand", direction: "up", time: 1500 },
        { type: "stand", direction: "left", time: 1200 },
        { type: "walk", direction: "down" },
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "right", time: 800 },
        { type: "stand", direction: "up", time: 1500 },
        { type: "stand", direction: "left", time: 1200 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "right", time: 800 },
        { type: "stand", direction: "up", time: 1500 },
        { type: "stand", direction: "left", time: 1200 },
        { type: "walk", direction: "left" },
        { type: "walk", direction: "left" },
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "right", time: 800 },
        { type: "stand", direction: "up", time: 1500 },
        { type: "stand", direction: "left", time: 1200 },
        { type: "walk", direction: "up" },
        { type: "stand", direction: "left", time: 1200 },
        { type: "stand", direction: "right", time: 800 },
        { type: "stand", direction: "up", time: 1500 },
        { type: "stand", direction: "left", time: 1200 },
        { type: "walk", direction: "right" },
        { type: "walk", direction: "right" },
      ],
      talking: [
        {
          disqualify: ["SENT_TO_BABA"],
          events: [
            {
              who: "Baba",
              type: "randomTextMessage",
              options: [
                "Such a good boy Didi!",
                "Did you leave some Nerfs around the house?",
                "Your mother is in a rush. Best be on your best behaviour!",
              ],
              faceHero: "Baba",
            },
            {
              who: "Baba",
              type: "textMessage",
              text: "Best go help your mother and sister!",
            },
          ],
        },
        {
          required: ["PLATES_COLLECTED", "SENT_TO_BABA"],
          disqualify: ["FETCH_NERFS_QUEST"],
          events: [
            { type: "startQuest", questId: "fetchNerfs" },
            { type: "addStoryFlag", flag: "FETCH_NERFS_QUEST" },
            {
              who: "Baba",
              type: "textMessage",
              text: "Clean this up before your mother sees!",
              faceHero: "Baba",
            },
            { type: "stand", direction: "up", who: "Baba" },
            {
              who: "Baba",
              type: "textMessage",
              text: "Just look at how many Nerf bullets are lying on the floor!",
              faceHero: "Baba",
            },
            {
              who: "Didi",
              type: "textMessage",
              text: "...I used the sofa as a barricade for my Nerf Wars...",
            },
            {
              who: "Baba",
              type: "textMessage",
              text: "Your mum has guests arriving for dinner soon!",
              faceHero: "Baba",
            },
            {
              who: "Baba",
              type: "textMessage",
              text: "Stop messing around and get to cleaning!",
              faceHero: "Baba",
            },
            {
              who: "Didi",
              type: "textMessage",
              text: "We used to play together, pillow forts and everything...",
            },
            { type: "walk", direction: "down", who: "hero" },
            {
              who: "Didi",
              type: "textMessage",
              text: "This was our playground...",
            },
            { type: "walk", direction: "down", who: "hero" },
            {
              type: "textMessage",
              text: "Once upon a time, this home was a playground.",
              who: "Didi",
            },
            { type: "walk", direction: "down", who: "hero" },
            { type: "stand", direction: "right", who: "hero" },
            {
              who: "Didi",
              type: "textMessage",
              text: "Where footsteps turn into a chase.",
            },
            { type: "stand", direction: "up", who: "hero" },
            {
              who: "Didi",
              type: "textMessage",
              text: "Where walls don't mean stop.",
            },
            { type: "stand", direction: "right", who: "hero" },
            {
              who: "Didi",
              type: "textMessage",
              text: "Where Yu-Gi-Oh cards slap the ground,",
            },
            { type: "stand", direction: "down", who: "hero" },
            {
              who: "Didi",
              type: "textMessage",
              text: "That was long ago,",
            },
            { type: "stand", direction: "down", who: "Baba" },
            {
              who: "Baba",
              type: "textMessage",
              text: "Didi!",
            },
            { type: "stand", direction: "up", who: "hero" },
            {
              who: "Baba",
              type: "textMessage",
              text: "Stop daydreaming and get cleaning!",
            },
            {
              type: "textMessage",
              text: "* New Quest: Find and collect all the Nerf bullets around the house! *",
            },
            { type: "startQuest", questId: "fetchNerfs" },
            { type: "addStoryFlag", flag: "FETCH_NERFS_QUEST" },
          ],
        },
        {
          required: ["FETCH_NERFS_QUEST"],
          disqualify: ["NERFS_COLLECTED"],
          events: [
            {
              type: "condition",
              conditions: [{ type: "nerfsCollected", count: 25 }],
              onSuccess: [
                { type: "completeQuest", questId: "fetchNerfs" },
                { type: "addStoryFlag", flag: "NERFS_COLLECTED" },
                {
                  type: "textMessage",
                  text: "Well done!",
                  who: "Baba",
                },
                {
                  type: "textMessage",
                  text: "Now the house is spotless!",
                  who: "Baba",
                },
                {
                  type: "textMessage",
                  text: "I think you've proven you can think of other people.",
                  who: "Baba",
                },
                { type: "addStoryFlag", flag: "SISTER_UNLOCKED" },
                { type: "unlockSister" },
                {
                  type: "textMessage",
                  text: "* Jiejie is now playable *",
                },
                {
                  type: "textMessage",
                  text: "* Continue with Jiejie's character to experience the second part of the game *",
                },
              ],
              onFail: [
                {
                  type: "textMessage",
                  text: "You haven't picked up all the Nerfs yet! Keep looking.",
                  who: "Baba",
                },
              ],
            },
          ],
        },
        {
          required: ["NERFS_COLLECTED"],
          disqualify: ["ASKED_TO_PLAY_AS_SISTER"],
          events: [
            {
              type: "textMessage",
              text: "Didi, you did a good job, but do you know how tough it is for your sister?",
              who: "Baba",
            },
            {
              type: "textMessage",
              text: "You seem dismissive, but let me show you.",
              who: "Baba",
            },
            {
              type: "yesNoPrompt",
              text: "Play as Jiejie?",
              onYes: [
                { type: "addStoryFlag", flag: "ASKED_TO_PLAY_AS_SISTER" },
                {
                  type: "textMessage",
                  text: "You are now playing as Jiejie! Experience her perspective.",
                  who: "Baba",
                },
                // Optionally trigger the character switch or cutscene here
                { type: "changeCharacter", character: "sister" },
              ],
              onNo: [
                { type: "addStoryFlag", flag: "ASKED_TO_PLAY_AS_SISTER" },
                {
                  type: "textMessage",
                  text: "Come back to me when you're ready to walk a mile in her shoes.",
                  who: "Baba",
                },
              ],
            },
          ],
        },
        {
          required: ["ASKED_TO_PLAY_AS_SISTER"],
          events: [
            {
              type: "textMessage",
              text: "Are you ready to see things from your sister's perspective?",
              who: "Baba",
            },
            {
              type: "yesNoPrompt",
              text: "Play as Jiejie?",
              onYes: [
                {
                  type: "textMessage",
                  text: "You are now playing as Jiejie! Experience her perspective.",
                  who: "Baba",
                },
                // Optionally trigger the character switch or cutscene here
                { type: "changeCharacter", character: "sister" },
              ],
              onNo: [
                {
                  type: "textMessage",
                  text: "Come back to me when you're ready to walk a mile in her shoes.",
                  who: "Baba",
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const shared = {
    table: {
      type: "Table",
      x: utils.withGrid(7),
      y: utils.withGrid(12),
      placements: [],
      talking: [
        {
          events: [{ type: "placeTableObjects" }],
        },
      ],
    },
  };

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForHome(character) {
  const shared = {
    /**
     * Music
     */
    // [utils.asGridCoord(10, 25)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/We_Song_entryway-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entering from Kid room
    // [utils.asGridCoord(22, 17)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entering from Bathroom
    // [utils.asGridCoord(22, 23)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entering from MasterBedroom
    // [utils.asGridCoord(20, 25)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entering from Laundry
    // [utils.asGridCoord(18, 23)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entryway audio
    // [utils.asGridCoord(9, 18)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/We_Song_entryway-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],

    /**
     * ChangeMap
     */
    [utils.asGridCoord(22, 17)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Kid",
            x: utils.withGrid(0),
            y: utils.withGrid(13),
            direction: "right",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/Timestables_kid-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
    [utils.asGridCoord(22, 23)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Bathroom",
            x: utils.withGrid(0),
            y: utils.withGrid(8),
            direction: "right",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/We_Song_entryway-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
    [utils.asGridCoord(20, 25)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Master",
            x: utils.withGrid(7),
            y: utils.withGrid(3),
            direction: "down",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/JieJie_balcony-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
    [utils.asGridCoord(18, 23)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Laundry",
            x: utils.withGrid(5),
            y: utils.withGrid(8),
            direction: "left",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/Lao_Gan_Ma_kitchen-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {
    // First entrance
    [utils.asGridCoord(19, 10)]: [
      {
        triggerOnLoad: true,
        disqualify: ["SEEN_INTRO"],
        events: [
          { type: "addStoryFlag", flag: "SEEN_INTRO" },
          { type: "walk", who: "Mama", direction: "up" },
          { type: "walk", who: "Mama", direction: "up" },
          { type: "walk", who: "Mama", direction: "up" },
          { type: "walk", who: "Mama", direction: "up" },
          {
            who: "Mama",
            type: "textMessage",
            text: "Guests are arriving!",
            faceHero: "Mama",
          },
          {
            who: "Mama",
            type: "textMessage",
            text: "We have exactly 1 hour and 12 minutes to get ready and if we round that down...!",
            faceHero: "Mama",
          },
          {
            who: "Mama",
            type: "textMessage",
            text: "We really only have 1 hour, which means 60 minutes, which is really 45 minutes if we think about plating...",
            faceHero: "Mama",
          },
          {
            who: "Mama",
            type: "textMessage",
            text: "... and also in case they get lost on the way here which is really 30 minutes because we need to tidy up the house...",
            faceHero: "Mama",
          },
          {
            who: "Mama",
            type: "textMessage",
            text: "... WHICH IS NOT ENOUGH TIME!!!",
            faceHero: "Mama",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "...",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "How the heck did we get from 1 hour and 12 minutes down to 30 minutes...",
          },
          {
            who: "Mama",
            type: "textMessage",
            text: "And no one helps me around the house anymore. I have to do EVERYTHING.",
            faceHero: "Mama",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "I can set up the table-",
          },
          {
            who: "Mama",
            type: "textMessage",
            text: "But you never do it right. Ayaaaaaa just forget, I'll do it.",
            faceHero: "Mama",
          },
          { type: "walk", who: "Jiejie", direction: "up" },
          { type: "walk", who: "Jiejie", direction: "up" },
          { type: "walk", who: "Jiejie", direction: "up" },
          {
            who: "Jiejie",
            type: "textMessage",
            text: "No mum, you already work so hard. Didi can handle it.",
            faceHero: "Jiejie",
          },
          { type: "stand", direction: "left", who: "Jiejie" },
          { type: "stand", direction: "right", who: "Mama" },
          {
            who: "Jiejie",
            type: "textMessage",
            text: "Trust me. Just let Didi do it. It'll be good for him to know how to.",
          },
          {
            who: "Mama",
            type: "textMessage",
            text: "But if he doesn't do it right, I'll have to redo it -- and we only have 3 minutes!",
            faceHero: "Mama",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "... 3 minutes down from 1 hour and 12? How?? ( • ᴖ • ｡)",
          },
          { type: "stand", direction: "up", who: "Jiejie" },
          {
            who: "Jiejie",
            type: "textMessage",
            text: "Mama, you concentrate on getting the house ready, I'll make sure Didi gets it done",
          },
          {
            who: "Mama",
            type: "stand",
            direction: "right",
          },
          {
            who: "Mama",
            type: "stand",
            direction: "down",
          },
          {
            who: "Mama",
            type: "stand",
            direction: "right",
          },
          {
            who: "Mama",
            type: "textMessage",
            text: "I'll count on you this time. But let me know if he breaks anything!! (¬_¬\")",
          },
          { type: "walk", who: "Mama", direction: "down" },
          { type: "walk", who: "Mama", direction: "down" },
          { type: "walk", who: "Mama", direction: "down" },
          { type: "walk", who: "Mama", direction: "down" },
          {
            who: "Jiejie",
            type: "textMessage",
            text: "I'm going to count to 3, and you must finish setting the table!",
          },
          { type: "stand", direction: "left", who: "Jiejie" },
          {
            who: "Jiejie",
            type: "textMessage",
            text: "I want all of the chopsticks and plates set on the dining room table before I get to san, or there'll be trouble!",
          },
          { type: "walk", who: "Jiejie", direction: "down" },
          { type: "walk", who: "Jiejie", direction: "down" },
          { type: "walk", who: "Jiejie", direction: "down" },
          { type: "stand", direction: "down", who: "hero" },
          {
            who: "Jiejie",
            type: "stand",
            direction: "up",
          },
          {
            who: "Jiejie",
            type: "textMessage",
            text: "Don't just stand there! Hurry up!",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "...",
          },
          {
            who: "hero",
            type: "stand",
            direction: "left",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "...",
          },
          {
            who: "hero",
            type: "stand",
            direction: "down",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "...",
          },
          {
            who: "hero",
            type: "stand",
            direction: "left",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "San is a very scary number!",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "You never want them to count to three",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "Slam the door or get low scores",
          },
          {
            who: "Didi",
            type: "textMessage",
            text: "You'll be dead as 四 (the number 4)",
          },
          {
            type: "textMessage",
            text: "* Help Didi dodge trouble by having him set the dining table in record time, before Jiejie counts to 3 *",
          },
          {
            type: "textMessage",
            text: "* New Quest: Set the table *",
          },
          {
            type: "textMessage",
            text: "* Grab all 8 plates and all 8 sets of chopsticks and bring them to the table *",
          },
          { type: "startQuest", questId: "fetchPlates" },
          { type: "addStoryFlag", flag: "FETCH_PLATES_QUEST" },
          { type: "startQuestTimer", questId: "fetchPlates" },
          { type: "startQuest", questId: "fetchPlates" },
          { type: "addStoryFlag", flag: "FETCH_PLATES_QUEST" },
          { type: "startQuestTimer", questId: "fetchPlates" },
        ],
      },
    ],
  };
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForHomeMediation(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(2),
      y: utils.withGrid(7),
      direction: "up",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  // const brotherHero = {
  //   hero: {
  //     type: "Person",
  //     isPlayerControlled: true,
  //     x: utils.withGrid(19),
  //     y: utils.withGrid(12),
  //     direction: "down",
  //     src: `./images/characters/people/Brother.png`,
  //     scale: 1,
  //   },
  // };

  const sisterNPCs = {
    Didi: {
      type: "Person",
      x: utils.withGrid(18),
      y: utils.withGrid(17),
      src: "./images/characters/people/Brother.png",
      behaviorLoop: [
        { type: "stand", direction: "down", who: "Didi", time: 200 },
        { type: "stand", direction: "left", who: "Didi", time: 2000 },
        { type: "stand", direction: "down", who: "Didi", time: 700 },
        { type: "walk", direction: "right", who: "Didi" },
        { type: "walk", direction: "right", who: "Didi" },
        { type: "stand", direction: "down", who: "Didi", time: 700 },
        { type: "stand", direction: "up", who: "Didi", time: 300 },
        { type: "stand", direction: "right", who: "Didi", time: 1000 },
        { type: "walk", direction: "left", who: "Didi" },
        { type: "walk", direction: "left", who: "Didi" },
      ],
      talking: [
        {
          required: [],
          events: [
            {
              type: "randomTextMessage",
              options: [
                "Why is everyone so obsessed with cleaning today?",
                "Ba-ba hid my games console until I finished tidying up. I'm sooo bored!",
                "What are you doing?",
              ],
              faceHero: "Didi",
            },
          ],
        },
      ],
    },
    // Mama: {
    //   type: "Person",
    //   x: utils.withGrid(19),
    //   y: utils.withGrid(16),
    //   src: "./images/characters/people/Mum.png",
    //   behaviorLoop: [{ type: "stand", direction: "left" }],
    //   talking: [
    //     {
    //       required: [],
    //       events: [
    //         {
    //           type: "randomTextMessage",
    //           options: [
    //             "Oh, you forgot to pack your own fruit",
    //             "You didn't finish lunch yesterday. You gotta eat more food.",
    //           ],
    //           faceHero: "Mama",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // Baba: {
    //   type: "Person",
    //   x: utils.withGrid(3),
    //   y: utils.withGrid(10),
    //   src: "./images/characters/people/Ba-ba.png",
    //   behaviorLoop: [{ type: "stand", direction: "right" }],
    //   talking: [
    //     {
    //       required: [],
    //       events: [
    //         {
    //           type: "textMessage",
    //           text: "Help your mum prepare for our guests!",
    //           faceHero: "Baba",
    //         },
    //         {
    //           type: "randomTextMessage",
    //           options: [
    //             "The laundry is a mess. Take some of the load from your mum.",
    //             "Your brother is making a mess again. Get him under control!",
    //             "Is all the food ready for this evening?",
    //           ],
    //           faceHero: "Baba",
    //         },
    //       ],
    //     },
    //   ],
    // },
  };

  // const brotherNPCs = {
  //   Jiejie: {
  //     type: "Person",
  //     name: "Jiejie",
  //     x: utils.withGrid(19),
  //     y: utils.withGrid(16),
  //     src: "./images/characters/people/Sister.png",
  //     behaviorLoop: [
  //       { type: "stand", direction: "left", time: 800 },
  //       { type: "stand", direction: "right", time: 100 },
  //       { type: "stand", direction: "up", time: 300 },
  //       { type: "stand", direction: "left", time: 100 },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "up" },
  //       { type: "walk", direction: "up" },
  //       { type: "walk", direction: "up" },
  //       { type: "walk", direction: "right" },
  //       { type: "stand", direction: "right", time: 800 },
  //       { type: "stand", direction: "down", time: 100 },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "down" },
  //       { type: "walk", direction: "down" },
  //       { type: "walk", direction: "down" },
  //       { type: "stand", direction: "right", time: 400 },
  //       { type: "stand", direction: "up", time: 200 },
  //       { type: "stand", direction: "left", time: 500 },
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "right" },
  //       { type: "stand", direction: "up", time: 400 },
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "right" },
  //       { type: "stand", direction: "up", time: 100 },
  //     ],
  //     talking: [
  //       {
  //         disqualify: ["FETCH_PLATES_QUEST"],
  //         events: [
  //           {
  //             type: "textMessage",
  //             text: "What do you mean I counted too quickly?!",
  //           },
  //           { type: "textMessage", text: "Try again!" },
  //           {
  //             type: "textMessage",
  //             text: "* New Quest: Set the table *",
  //           },
  //           {
  //             type: "textMessage",
  //             text: "* Grab all 8 plates and all 8 sets of chopsticks and bring them to the table *",
  //           },
  //           { type: "startQuest", questId: "fetchPlates" },
  //           { type: "addStoryFlag", flag: "FETCH_PLATES_QUEST" },
  //           { type: "startQuestTimer", questId: "fetchPlates" },
  //         ],
  //       },
  //       // After collecting plates, but before delivering
  //       {
  //         required: ["FETCH_PLATES_QUEST"],
  //         disqualify: ["PLATES_DELIVERED"],
  //         events: [
  //           {
  //             type: "condition",
  //             conditions: [{ type: "tableSet", plates: 8, chopsticks: 8 }],
  //             onSuccess: [
  //               { type: "completeQuest", questId: "fetchPlates" },
  //               { type: "addStoryFlag", flag: "PLATES_DELIVERED" },
  //               {
  //                 who: "Jiejie",
  //                 type: "textMessage",
  //                 text: "Well done. Took long enough!",
  //                 faceHero: "Jiejie",
  //               },
  //               {
  //                 who: "Didi",
  //                 type: "textMessage",
  //                 text: "EZ moneyyyyyyy.",
  //               },
  //               {
  //                 who: "Mama",
  //                 type: "textMessage",
  //                 text: "Here. Come get the snack I made you as a reward.",
  //               },
  //               {
  //                 who: "Jiejie",
  //                 type: "textMessage",
  //                 text: "...So spoiled...",
  //               },
  //               {
  //                 who: "Jiejie",
  //                 type: "textMessage",
  //                 text: "Go see Ba-ba. He wanted you for something",
  //               },
  //               { type: "addStoryFlag", flag: "SENT_TO_BABA" },
  //             ],
  //             onFail: [
  //               {
  //                 who: "Jiejie",
  //                 type: "randomTextMessage",
  //                 options: [
  //                   "You don't have all the plates yet!",
  //                   "How can you be taking this long?",
  //                   "That table won't set itself! Get going.",
  //                 ],
  //                 faceHero: "Jiejie",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       // After quest is complete, fallback dialogue
  //       {
  //         required: ["PLATES_DELIVERED"],
  //         disqualify: ["FETCH_NERFS_QUEST"],
  //         events: [
  //           {
  //             who: "Jiejie",
  //             type: "textMessage",
  //             text: "Go see Ba-ba. He wanted you for something.",
  //             faceHero: "Jiejie",
  //           },
  //         ],
  //       },
  //       // After quest is complete, fallback dialogue
  //       {
  //         required: ["FETCH_NERFS_QUEST"],
  //         disqualify: [],
  //         events: [
  //           {
  //             who: "Jiejie",
  //             type: "randomTextMessage",
  //             options: [
  //               "You're finally picking those up!",
  //               "How do you have so much stuff?",
  //             ],
  //             faceHero: "Jiejie",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   Mama: {
  //     type: "Person",
  //     name: "Mama",
  //     x: utils.withGrid(18),
  //     y: utils.withGrid(17),
  //     src: "./images/characters/people/Mmum.png",
  //     behaviorLoop: [
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "stand", direction: "right", time: 2800 },
  //       { type: "stand", direction: "up", time: 1500 },
  //       { type: "stand", direction: "left", time: 2200 },
  //     ],
  //     talking: [
  //       {
  //         disqualify: ["PLATES_DELIVERED"],
  //         events: [
  //           {
  //             who: "Mama",
  //             type: "randomTextMessage",
  //             options: [
  //               "Such a good boy.",
  //               "Have you finished your homework?",
  //               "* Sigh * You know when your sister was your age, she got straight 'A's",
  //             ],
  //             faceHero: "Mama",
  //           },
  //         ],
  //       },
  //       {
  //         required: ["PLATES_DELIVERED"],
  //         events: [
  //           {
  //             who: "Mama",
  //             type: "textMessage",
  //             text: "Here, try this. I made a snack just for you!",
  //             faceHero: "Mama",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   Baba: {
  //     type: "Person",
  //     x: utils.withGrid(5),
  //     y: utils.withGrid(12),
  //     src: "./images/characters/people/Ba-ba.png",
  //     behaviorLoop: [
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "stand", direction: "right", time: 800 },
  //       { type: "stand", direction: "up", time: 1500 },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "stand", direction: "right", time: 800 },
  //       { type: "stand", direction: "up", time: 1500 },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "walk", direction: "down" },
  //       { type: "walk", direction: "down" },
  //       { type: "walk", direction: "down" },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "stand", direction: "right", time: 800 },
  //       { type: "stand", direction: "up", time: 1500 },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "right" },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "stand", direction: "right", time: 800 },
  //       { type: "stand", direction: "up", time: 1500 },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "walk", direction: "left" },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "stand", direction: "right", time: 800 },
  //       { type: "stand", direction: "up", time: 1500 },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "walk", direction: "up" },
  //       { type: "walk", direction: "up" },
  //       { type: "walk", direction: "up" },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "stand", direction: "right", time: 800 },
  //       { type: "stand", direction: "up", time: 1500 },
  //       { type: "stand", direction: "left", time: 1200 },
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "right" },
  //       { type: "walk", direction: "right" },
  //     ],
  //     talking: [
  //       {
  //         disqualify: ["SENT_TO_BABA"],
  //         events: [
  //           {
  //             who: "Baba",
  //             type: "randomTextMessage",
  //             options: [
  //               "Such a good boy Didi!",
  //               "Did you leave some Nerfs around the house?",
  //               "Your mother is in a rush. Best be on your best behaviour!",
  //             ],
  //             faceHero: "Baba",
  //           },
  //           {
  //             who: "Baba",
  //             type: "textMessage",
  //             text: "Best go help your mother and sister!",
  //           },
  //         ],
  //       },
  //       {
  //         required: ["PLATES_COLLECTED", "SENT_TO_BABA"],
  //         disqualify: ["FETCH_NERFS_QUEST"],
  //         events: [
  //           { type: "startQuest", questId: "fetchNerfs" },
  //           { type: "addStoryFlag", flag: "FETCH_NERFS_QUEST" },
  //           {
  //             who: "Baba",
  //             type: "textMessage",
  //             text: "Clean this up before your mother sees!",
  //             faceHero: "Baba",
  //           },
  //           { type: "stand", direction: "up", who: "Baba" },
  //           {
  //             who: "Baba",
  //             type: "textMessage",
  //             text: "Just look at how many Nerf bullets are lying on the floor!",
  //             faceHero: "Baba",
  //           },
  //           {
  //             who: "Didi",
  //             type: "textMessage",
  //             text: "...I used the sofa as a barricade for my Nerf Wars...",
  //           },
  //           {
  //             who: "Baba",
  //             type: "textMessage",
  //             text: "Your mum has guests arriving for dinner soon!",
  //             faceHero: "Baba",
  //           },
  //           {
  //             who: "Baba",
  //             type: "textMessage",
  //             text: "Stop messing around and get to cleaning!",
  //             faceHero: "Baba",
  //           },
  //           {
  //             who: "Didi",
  //             type: "textMessage",
  //             text: "We used to play together, pillow forts and everything...",
  //           },
  //           { type: "walk", direction: "down", who: "hero" },
  //           {
  //             who: "Didi",
  //             type: "textMessage",
  //             text: "This was our playground...",
  //           },
  //           { type: "textMessage", text: "Inside, the walls don't move." },
  //           {
  //             type: "textMessage",
  //             text: "So I turn them into something else.",
  //           },
  //           { type: "textMessage", text: "A fort. A maze. A game." },
  //           { type: "textMessage", text: "Until someone calls my name," },
  //           { type: "textMessage", text: "and the spell breaks." },
  //           { type: "stand", direction: "down", who: "Baba" },
  //           { type: "stand", direction: "up", who: "hero" },
  //           {
  //             type: "textMessage",
  //             text: "Didi, stop daydreaming and get cleaning!",
  //           },
  //           {
  //             type: "textMessage",
  //             text: "* New Quest: Find and collect all the Nerf bullets around the house! *",
  //           },
  //           { type: "startQuest", questId: "fetchNerfs" },
  //           { type: "addStoryFlag", flag: "FETCH_NERFS_QUEST" },
  //         ],
  //       },
  //       {
  //         required: ["NERFS_COLLECTED"],
  //         events: [
  //           {
  //             type: "textMessage",
  //             text: "Well done! Don't forget to clean up when you play in the future",
  //             who: "Baba",
  //           },
  //           {
  //             type: "textMessage",
  //             text: "...and I think you're mature enough now to see things from other people's perspective.",
  //             who: "Baba",
  //           },
  //           { type: "storyFlag", flag: "SISTER_UNLOCKED" },
  //           { type: "unlockSister" },
  //           {
  //             type: "textMessage",
  //             text: "* Jiejie is now playable through the Pause Menu (press Escape) *",
  //           },
  //           {
  //             type: "textMessage",
  //             text: "* Continue with Jiejie's character to experience the second half of the game *",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // };

  const shared = {
    table: {
      type: "Table",
      x: utils.withGrid(7),
      y: utils.withGrid(12),
      placements: [],
      talking: [
        {
          events: [{ type: "placeTableObjects" }],
        },
      ],
    },
  };

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForHomeMediation(character) {
  const shared = {
    /**
     * Music
     */
    // [utils.asGridCoord(10, 25)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/We_Song_entryway-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entering from Kid room
    // [utils.asGridCoord(22, 17)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entering from Bathroom
    // [utils.asGridCoord(22, 23)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entering from MasterBedroom
    // [utils.asGridCoord(20, 25)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entering from Laundry
    // [utils.asGridCoord(18, 23)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],
    // // Entryway audio
    // [utils.asGridCoord(9, 18)]: [
    //   {
    //     events: [
    //       {
    //         type: "playMusic",
    //         src: "./audio/We_Song_entryway-audio.mp3",
    //         loop: true,
    //       },
    //     ],
    //   },
    // ],

    /**
     * ChangeMap
     */
    [utils.asGridCoord(22, 17)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "KidMediation",
            x: utils.withGrid(0),
            y: utils.withGrid(13),
            direction: "right",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/Timestables_kid-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
    [utils.asGridCoord(22, 23)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "BathroomMediation",
            x: utils.withGrid(0),
            y: utils.withGrid(8),
            direction: "right",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/We_Song_entryway-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
    [utils.asGridCoord(20, 25)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "MasterMediation",
            x: utils.withGrid(7),
            y: utils.withGrid(3),
            direction: "down",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/JieJie_balcony-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
    [utils.asGridCoord(18, 23)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "LaundryMediation",
            x: utils.withGrid(5),
            y: utils.withGrid(8),
            direction: "left",
          },
          // {
          //   type: "playMusic",
          //   src: "./audio/Lao_Gan_Ma_kitchen-audio.mp3",
          //   loop: true,
          // },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForKid(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {};

  const brotherNPCs = {};

  const shared = {};

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForKid(character) {
  const shared = {
    [utils.asGridCoord(0, 13)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Home",
            x: utils.withGrid(22),
            y: utils.withGrid(17),
            direction: "left",
          },
          /**
           * Music
           */
          //       {
          //         type: "playMusic",
          //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
          //         loop: true,
          //       },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForLaundry(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {};

  const brotherNPCs = {};

  const shared = {};

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForLaundry(character) {
  const shared = {
    [utils.asGridCoord(5, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Home",
            x: utils.withGrid(18),
            y: utils.withGrid(23),
            direction: "right",
          },
          //       {
          //         type: "playMusic",
          //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
          //         loop: true,
          //       },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForMaster(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {};

  const brotherNPCs = {};

  const shared = {};

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForMaster(character) {
  const shared = {
    [utils.asGridCoord(7, 3)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Home",
            x: utils.withGrid(20),
            y: utils.withGrid(25),
            direction: "up",
          },
          //       {
          //         type: "playMusic",
          //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
          //         loop: true,
          //       },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

function getConfigObjectsForBathroom(character) {
  const sisterHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Sister.png`,
      scale: 1,
    },
  };

  const brotherHero = {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(9),
      direction: "right",
      src: `./images/characters/people/Brother.png`,
      scale: 1,
    },
  };

  const sisterNPCs = {};

  const brotherNPCs = {};

  const shared = {};

  return {
    ...shared,
    ...(character === "sister" ? sisterHero : brotherHero),
    ...(character === "sister" ? sisterNPCs : brotherNPCs),
  };
}

function getCutsceneSpacesForBathroom(character) {
  const shared = {
    [utils.asGridCoord(0, 8)]: [
      {
        events: [
          {
            type: "changeMap",
            map: "Home",
            x: utils.withGrid(22),
            y: utils.withGrid(23),
            direction: "left",
          },
          //       {
          //         type: "playMusic",
          //         src: "./audio/Sounds_of_my_house_at_seven_living-audio.mp3",
          //         loop: true,
          //       },
        ],
      },
    ],
  };

  const sisterCutScenes = {};

  const brotherCutScenes = {};
  return {
    ...shared,
    ...(character === "sister" ? sisterCutScenes : brotherCutScenes),
  };
}

//   // DemoRoom: {
//   //   id: "DemoRoom",
//   //   lowerSrc: "./images/maps/DemoLower.png",
//   //   upperSrc: "./images/maps/DemoUpper.png",
//   //   configObjects: {
//   //     hero: {
//   //       type: "Person",
//   //       isPlayerControlled: true,
//   //       x: utils.withGrid(23),
//   //       y: utils.withGrid(23),
//   //     },
//   //     npcA: {
//   //       type: "Person",
//   //       x: utils.withGrid(10),
//   //       y: utils.withGrid(8),
//   //       src: "./images/characters/people/npc1.png",
//   //       behaviorLoop: [
//   //         { type: "walk", direction: "left" },
//   //         { type: "walk", direction: "down" },
//   //         { type: "walk", direction: "right" },
//   //         { type: "walk", direction: "up" },
//   //         { type: "stand", direction: "up", time: 400 },
//   //       ],
//   //       talking: [
//   //         {
//   //           required: ["TALKED_TO_ERIO"],
//   //           events: [
//   //             {
//   //               type: "textMessage",
//   //               text: "Isn't Erio the coolest?",
//   //               faceHero: "npcA",
//   //             },
//   //           ],
//   //         },
//   //         {
//   //           events: [
//   //             {
//   //               type: "textMessage",
//   //               text: "I'm going to crush you!",
//   //               faceHero: "npcA",
//   //             },
//   //             { type: "battle", enemyId: "beth" },
//   //             { type: "addStoryFlag", flag: "DEFEATED_BETH" },
//   //             {
//   //               type: "textMessage",
//   //               text: "You crushed me like weak pepper.",
//   //               faceHero: "npcA",
//   //             },
//   //             { type: "textMessage", text: "Go away!" },
//   //             //{ who: "npcB", type: "walk",  direction: "up" },
//   //           ],
//   //         },
//   //       ],
//   //     },
//   //     npcC: {
//   //       type: "Person",
//   //       x: utils.withGrid(4),
//   //       y: utils.withGrid(8),
//   //       src: "./images/characters/people/npc1.png",
//   //       behaviorLoop: [
//   //         { type: "stand", direction: "left", time: 500 },
//   //         { type: "stand", direction: "down", time: 500 },
//   //         { type: "stand", direction: "right", time: 500 },
//   //         { type: "stand", direction: "up", time: 500 },
//   //         { type: "walk", direction: "left" },
//   //         { type: "walk", direction: "down" },
//   //         { type: "walk", direction: "right" },
//   //         { type: "walk", direction: "up" },
//   //       ],
//   //     },
//   //     npcB: {
//   //       type: "Person",
//   //       x: utils.withGrid(8),
//   //       y: utils.withGrid(5),
//   //       src: "./images/characters/people/erio.png",
//   //       talking: [
//   //         {
//   //           events: [
//   //             { type: "textMessage", text: "Bahaha!", faceHero: "npcB" },
//   //             { type: "addStoryFlag", flag: "TALKED_TO_ERIO" },
//   //             //{ type: "battle", enemyId: "erio" }
//   //           ],
//   //         },
//   //       ],
//   //       // behaviorLoop: [
//   //       //   { type: "walk",  direction: "left" },
//   //       //   { type: "stand",  direction: "up", time: 800 },
//   //       //   { type: "walk",  direction: "up" },
//   //       //   { type: "walk",  direction: "right" },
//   //       //   { type: "walk",  direction: "down" },
//   //       // ]
//   //     },
//   //     pizzaStone: {
//   //       type: "PizzaStone",
//   //       x: utils.withGrid(2),
//   //       y: utils.withGrid(7),
//   //       storyFlag: "USED_PIZZA_STONE",
//   //       pizzas: ["v001", "f001"],
//   //     },
//   //   },
//   //   walls: {
//   //     [utils.asGridCoord(7, 6)]: true,
//   //     [utils.asGridCoord(8, 6)]: true,
//   //     [utils.asGridCoord(7, 7)]: true,
//   //     [utils.asGridCoord(8, 7)]: true,
//   //   },
//   //   cutsceneSpaces: {
//   //     [utils.asGridCoord(7, 4)]: [
//   //       {
//   //         events: [
//   //           { who: "npcB", type: "walk", direction: "left" },
//   //           { who: "npcB", type: "stand", direction: "up", time: 500 },
//   //           { type: "textMessage", text: "You can't be in there!" },
//   //           { who: "npcB", type: "walk", direction: "right" },
//   //           { who: "hero", type: "walk", direction: "down" },
//   //           { who: "hero", type: "walk", direction: "left" },
//   //         ],
//   //       },
//   //     ],
//   //     [utils.asGridCoord(5, 10)]: [
//   //       {
//   //         events: [
//   //           {
//   //             type: "changeMap",
//   //             map: "Kitchen",
//   //             x: utils.withGrid(2),
//   //             y: utils.withGrid(2),
//   //             direction: "down",
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   },
//   // },
//   // };
