import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class LeaderboardScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine */
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }
  callback() {
    /** @type {HTMLButtonElement} */
    const btn = document.querySelector(".simple-button");

    btn.onclick = () => {
      this.engine.handleStateUpdate(GameState.BOOTING);
    };
  }
  render() {
    const screen = `<div class="center-container" style="color: white; font-size: 3rem;">
		  <span style="font-size: 2rem">__GLOBAL_STATUS_LOG__</span>
		  <div class="my-2">
		  <tr>[ R ]</tr> | <tr>[ ALIAS ]</tr> | <tr>[ VALUE ]</tr>
		  <div>
		  <tr>-----</tr> | <tr>---------</tr> | <tr>---------</tr>
		  </div>
		  <tr>[ 0 ]</tr> | <tr>EZWAL&nbsp;&nbsp;&nbsp;&nbsp;</tr> | <tr>14852</tr>
		  <div>
		  <tr>[ 1 ]</tr> | <tr>NULLPOIN&nbsp;</tr> | <tr>0</tr>
		  </div>
		  <div>
		  <tr>[ 2 ]</tr> | <tr>NULLPOIN&nbsp;</tr> | <tr>0</tr>
		  </div>
		  <div>
		  <tr>[ 3 ]</tr> | <tr>NULLPOIN&nbsp;</tr> | <tr>0</tr>
		  </div>
		  <div>
		  <tr>[ 4 ]</tr> | <tr>NULLPOIN&nbsp;</tr> | <tr>0</tr>
		  </div>
		  </div>

		  <span class="simple-button" style="font-size: 2rem; margin-top: 3rem; cursor:pointer">
		 <span class="char">></span>INTENTAR DE NUEVO
		  </span>

		  </div>`;

    this.engine.renderScreen(this.root, screen);

    setTimeout(() => {
      this.callback();
    }, DELAY_BEFORE_CALLBACK);
  }
}

export { LeaderboardScreen };
