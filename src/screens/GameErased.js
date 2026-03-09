import { DELAY_BEFORE_CALLBACK, GAME_OVER_QUOTES } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class GameErased {
  /**
   * @param {Element} root
   * @param {Engine} engine*/
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }
  callback() {
    const button = document.getElementById("restart");

    button.onclick = () => {
      this.engine.handleStateUpdate(GameState.FINAL_LEVEL_SEQUENCE);
    };
  }
  render() {
    // STYLE: animation chingona
    const screen = `<div class="center-container" style="background-color: white; font-family: fallback; color: black">
<h1 style="animation: fade-in 0.01s 0.25s forwards; opacity: 0">Segment fault</h1>
<p style="animation: fade-in 0.01s 1s forwards; opacity: 0">${GAME_OVER_QUOTES[Math.floor(Math.random() * GAME_OVER_QUOTES.length)]}</p>
<button id="restart" style="animation: fade-in 0.01s 3s forwards; opacity: 0" onclick="window.location.reload()">Reiniciar</button>
		  </div>`;

    this.engine.renderScreen(this.root, screen);

    setTimeout(() => {
      this.callback();
    }, DELAY_BEFORE_CALLBACK);
  }
}

export { GameErased };
