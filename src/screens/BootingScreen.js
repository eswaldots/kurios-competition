import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";
import { sleep } from "../utils.js";

class BootingScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine
   * */
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }
  async callback() {
    /**
     * @param {Element} root
     * */
    async function runLoader(root) {
      const loadingStates = [
        "CARGANDO IMAGENES",
        "CARGANDO FUENTES",
        "CARGANDO DECISIONES",
        "HACKEANDO KURIOS",
        "CARGANDO INVISIBLE",
        "CARGANDO CENTINELA",
        "CARGANDO TRATOS",
        "LISTO",
      ];

      const loaderText = root.querySelector(".loader-text");
      const loaderProgress = root.querySelector(".loader-progress");
      const duration = 4000;

      /**
       * @param {number} x */
      function easeInSine(x) {
        return 1 - Math.cos((x * Math.PI) / 2);
      }

      // declaramos funciones asincronas para que así el interprete javascript actualiza el texto y el progreso al mismo tiempo
      async function updateText() {
        for (let i = 0; i <= 100; i++) {
          const t = i / 100;

          const ease = easeInSine(t) * 100;

          loaderProgress.textContent = `${Math.round(ease)}%`;

          await sleep(duration / 100);
        }
      }

      async function updateProgress() {
        for (let i = 0; i < loadingStates.length; i++) {
          loaderText.textContent = loadingStates[i];

          await sleep(duration / loadingStates.length);
        }
      }

      await Promise.all([updateText(), updateProgress()]);
    }

    await runLoader(this.root);

    const loader = document.querySelector(".loader-change");

    loader.innerHTML = `
		  <button class="fade start-button">> Iniciar misión</button>
		  `;

    setTimeout(() => {
      /** @type {HTMLButtonElement} */
      const button = document.querySelector(".start-button");

      button.onclick = () => {
        this.engine.audio.accept.play();

        this.engine.handleStateUpdate(GameState.START_MENU);
      };
    }, DELAY_BEFORE_CALLBACK);
  }
  async render() {
    const screen = `
	  <div class="center-container">
		  <div class="dialog">
		  <h1 class="loader-title">MISION SECRETA</h1>

		  <div class="loader-change">
		  <div class="loader">
		  	<div class="loader-intern" ></div>
		  </div>


		  <div class="loader-footer">
		  <span class="loader-text">CARGANDO TEXTURAS</span>
		  <span class="loader-progress">0%</span>
		  </div>
		  </div>

		  </div>

		  </div>
	  `;

    await this.engine.renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

export { BootingScreen };
