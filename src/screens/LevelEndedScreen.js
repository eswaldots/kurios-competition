import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class LevelEndedScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine
   * @param {{ id: number }} level*/
  constructor(root, engine, level) {
    this.level = level;
    this.engine = engine;
    this.root = root;
  }

  render() {
    if (this.level.id === 4) {
      this.engine.handleStateUpdate(GameState.FINAL_LEVEL_SEQUENCE);

      return;
    }

    const screen = `
      <div class="center-container text-lg pony-glitch-flash" style="color: #00ff33;">
        <div style="font-size: 0.9rem; display: grid; gap: 8px; font-family: monospace;">
          <p id="le-line1" style="opacity: 0;">[ OK ] ROOT ACCESS GRANTED</p>
          <p id="le-line2" style="opacity: 0;">[ PROCESS ] DECRYPTING SECTOR 0${this.level.id + 1}...</p>
          <p id="le-line3" style="opacity: 0;">[<span id="le-bar">----------</span>] <span id="le-num">0</span>%</p>
        </div>
      </div>
    `;

    this.engine.renderScreen(this.root, screen);

    const line1 = document.getElementById("le-line1");
    const line2 = document.getElementById("le-line2");
    const line3 = document.getElementById("le-line3");
    const pBar = document.getElementById("le-bar");
    const pNum = document.getElementById("le-num");

    setTimeout(() => {
      line1.style.opacity = "1";
    }, 150);
    setTimeout(() => {
      line2.style.opacity = "1";
    }, 500);
    setTimeout(() => {
      line3.style.opacity = "1";
    }, 800);

    let progress = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        progress += 25;
        pNum.innerText = progress;
        pBar.innerText =
          "█".repeat(progress / 10) + "-".repeat(10 - progress / 10);

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => this.finish(), 300); // Pequeña pausa al llegar a 100%
        }
      }, 70);
    }, 800);
  }

  finish() {
    this.root.classList.add("pony-glitch-out");

    setTimeout(() => {
      const nextLevelState = Object.values(GameState).find(
        (l) => l === `level_${this.level.id + 1}`,
      );

      if (nextLevelState) {
        this.root.classList.remove("pony-glitch-out");
        this.engine.handleStateUpdate(nextLevelState);
      } else {
        this.root.classList.remove("pony-glitch-out");
        this.engine.handleStateUpdate(GameState.FINAL_LEVEL);
      }
    }, 100);
  }
}

export { LevelEndedScreen };
