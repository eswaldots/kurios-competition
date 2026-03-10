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
    const elements = document.querySelectorAll(".node-init");
    elements.forEach((el, i) => {
      el.style.animationDelay = `${i * -0.1}s`;

      el.classList.remove("node-init");
      el.classList.add("node-exit");
    });

    const text = document.querySelector("#text");
    text.style.animationDelay = `${elements.length * -0.1}s`;

    text.classList.add("node-exit");

    setTimeout(() => {
      this.engine.root.classList.add("scanlines-animation");

      this.engine.handleStateUpdate(GameState.LEVEL1);

      setTimeout(() => {
        this.engine.root.classList.remove("scanlines-animation");
      }, 1000);
    }, 1000);
  }
  render() {
    const screen = `
    <div class="center-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;  gap: 2rem;">

      
      <span id="text" class="glitch-text pony-glow init" style="font-size: 4rem; font-weight: 900; letter-spacing: 4px;">
        TUS NODOS DE ENLACE
      </span>

      <div style="display: flex; gap: 3rem;">
        <span class="node-init glitch-text pony-glow" style="font-size: 4rem; animation-delay: 0.8s;">⟨ ◈ ⟩</span>
        <span class="node-init glitch-text pony-glow" style="font-size: 4rem; animation-delay: 1.1s;">⟨ ◈ ⟩</span>
        <span class="node-init glitch-text pony-glow" style="font-size: 4rem; animation-delay: 1.4s;">⟨ ◈ ⟩</span>
      </div>

    </div>
  `;

    this.engine.renderScreen(this.root, screen);

    const totalAnimationTime = 3000;

    setTimeout(() => {
      this.callback();
    }, totalAnimationTime);
  }
}

export { InstructionsScreen };
