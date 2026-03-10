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
    setTimeout(() => {
      this.engine.handleStateUpdate(GameState.LEVEL1);
    }, 100);
  }
  render() {
    const screen = `
    <div class="center-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;  gap: 2rem;">

      
      <span class="glitch-text pony-glow init" style="font-size: 4rem; font-weight: 900; letter-spacing: 4px;">
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

    const totalAnimationTime = 3500;

    setTimeout(() => {
      this.callback();
    }, totalAnimationTime);
  }
}

export { InstructionsScreen };
