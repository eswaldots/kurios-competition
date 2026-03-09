import { LivesComponent } from "../components/lives.js";
import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class InstructionsScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine*/
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }
  callback() {
    /** @type {HTMLButtonElement}*/
    const button = document.querySelector(".continue-button");

    button.onclick = () => {
      this.engine.audio.accept.play();

      this.engine.handleStateUpdate(GameState.LEVEL1);
    };
  }
  render() {
    const screen = `
	  <div class="center-container">
		<h1 class="text-2xl font-semibold">Instrucciones</h1>
		  <div class="gap">
		  ${LivesComponent({
        onRanOut: () => {
          // TODO: el engine podria hacer un game over
          this.engine.handleStateUpdate(GameState.GAME_OVER);
        },
      })}
		  </div>

		  <p class="truncate">Tendras 3 intentos para poder desencriptar el archivo</p>

		  <button class="my-2 fade delay continue-button">> Empezar mision</button>
		  </div>
		`;

    this.engine.renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

export { InstructionsScreen };
