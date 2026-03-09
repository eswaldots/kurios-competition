import { TypewriterReturn } from "../components/typewriter.js";
import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class AskCredentialsScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine
   * */
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }
  callback() {
    /** @type {HTMLInputElement} */
    // REFACTOR: por que da jsdoc error
    const input = document.getElementById("input");

    /** @param {string} name */
    const validate = (name) => {
      const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
      // TODO: calcular score basado en que tan bien lo hizo el usuario durante le juego, eso lo haremos despues, no se preocupen
      leaderboard.push({ name, score: 100 });
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

      // STYLE: animacion bonita de como el jugador va al leaderboard
      this.engine.handleStateUpdate(GameState.BOOTING);
    };

    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        validate(input.value);
      }
    };
  }
  render() {
    const headline = "[ ! ] ALIAS CONFIRMATION";
    const description = "REQUIRED TO COMMIT REPORT.";
    const screen = `<div class="center-container" style="color: white">
		  <div>
		  <h1 style="font-size: 3.5rem">
		  ${TypewriterReturn({ content: headline, speed: 60, style: "font-size: 4rem;", as: "span" })}
	  </h1>
		  <h1 style="font-size: 3.5rem">
		  ${TypewriterReturn({ content: description, speed: 60, style: "font-size: 4rem;", as: "span", delay: (headline.length + 2) * 60 })}
	  </h1>

		  <div style="font-size: 4rem; margin-top: 2rem; color: var(--success)">
		  ${TypewriterReturn({ content: "[ > ]", speed: 60, style: "font-size: 4rem;", as: "span", delay: (headline.length + description.length + 4) * 60 })}
		  <input id="input" style="all: unset; text-transform: uppercase; font-size: 3.5rem; animation: fade-in 1s 4s forwards; opacity: 0;" autoFocus maxlength="8" />
		  </div>
		  </div>


		  </div>`;

    this.engine.renderScreen(this.root, screen);

    setTimeout(() => {
      this.callback();
    }, DELAY_BEFORE_CALLBACK);
  }
}

export { AskCredentialsScreen };
