import { TypewriterReturn } from "../components/typewriter.js";
import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class BootingScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine
   * */
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }
  callback() {
    /** @type {HTMLButtonElement}*/
    const button = document.getElementById("init");
    /** @type {HTMLButtonElement}*/
    const abort = document.getElementById("abort");

    abort.onclick = () => {
      window.close();
    };

    button.addEventListener("click", () => {
      this.engine.audio.beep.play();

      const body = document.querySelector("body");
      body.style.backgroundColor = "black";
      this.engine.root.classList.remove("scanlines");
      this.engine.renderScreen(this.root, ``);

      setTimeout(() => {
        this.engine.root.classList.add("scanlines");
        this.engine.root.classList.add("scanlines-animation");
        body.style.backgroundColor = "var(--background)";

        setTimeout(() => {
          this.engine.root.classList.remove("scanlines-animation");
          this.engine.handleStateUpdate(GameState.START_MENU);
        }, 1500);
      }, 2000);
    });
  }
  render() {
    this.engine.renderScreen(
      this.root,
      `
      <div class="center-container">
        <img src="./assets/images/KURIOS_neg.png" class="cinematic-splash"/>
      </div>
      `,
    );

    setTimeout(() => {
      this.engine.renderScreen(this.root, ``);

      this.engine.root.classList.add("scanlines");
    }, 4000);

    setTimeout(() => {
      const screen = `
	  <div class="center-container" style="color: white">
<h1 style="opacity: 1" class="init pony-glow glitch-text text-5xl truncate">KRONOS</h1>

		  <div class="my-4 text-center text-3xl flex flex-col gap-2">
		  <p id="init" class="boot-p simple-button" style="animation-delay: 1.75s"><span class="char">></span> INICIAR</p>
		  <p class="boot-p simple-button" style="animation-delay: 2.25s; opacity: 0.5; pointer-events: none"><span class="char">></span>VER LISTA DE AGENTES</p>
		  <p class="boot-p simple-button" id="abort" style="animation-delay: 2.75s"><span class="char">></span> ABORTAR</p>
		  </div>

<p>${TypewriterReturn({ content: "// ANALYST NODE: U-CODE DEV 2026 //", speed: 48, delay: 3000 })}</p>
		  </div>
	  `;

      this.engine.renderScreen(this.root, screen);
    }, 5000);

    setTimeout(() => this.callback(), 5000 + DELAY_BEFORE_CALLBACK);
  }
}

export { BootingScreen };
