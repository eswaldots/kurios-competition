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
    const screen = `<div class="center-container text-lg">
		  <div style="font-size: 0.8rem; display: grid; gap: 2px;">
		  <p>[ OK ] Access granted</p>
		  <p>[ PROCESS ] DECRYPTING SECTOR 02...</p>
		  <p>[##########----------] 50%</p>
		  </div>
		  </div>`;

    this.engine.renderScreen(this.root, screen);

    setTimeout(() => {
      // TODO: handle final level
      this.engine.handleStateUpdate(
        Object.values(GameState).find(
          (l) => l === `level_${this.level.id + 1}`,
        ),
      );
    }, 2000);
  }
}

export { LevelEndedScreen };
