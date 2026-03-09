import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class StartMenuScreen {
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

      this.engine.handleStateUpdate(GameState.INSTRUCTIONS);
    };
  }
  render() {
    const now = new Date().toLocaleDateString();

    const screen = `
	  <div class="center-container">
	  	<div class="start-modal">
		  <div>
<h1 class="start-title">EXPEDIENTE CLASIFICADO</h1>
		  <hr style="color: var(--foreground)" />
		  <div class="gap">
          <p><strong>FECHA:</strong> ${now}</p>
          <p><strong>UBICACION:</strong> SECTOR-K27</p>
		  </div>

          <div class="gap description gap">
<p>El archivo fue recuperado tras el incidente.</p>
<p>La información se encuentra corrupta.</p>
<p>El agente asignado no regresó...</p>
		  <br/>
<p>¿Desea proceder usted mismo?</p>
		  </div>
		  </div>
		  <div class="start-footer">
          <button class="continue-button">> Autorizar acceso</button>
		  </div>
		  </div>
		  </div>
	  `;

    this.engine.renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

export { StartMenuScreen };
