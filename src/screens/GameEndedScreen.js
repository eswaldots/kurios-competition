import { TypewriterReturn } from "../components/typewriter.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class GameEndedScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine*/
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }

  callback() {
    const btn = document.getElementById("purge-btn");
    const fill = document.getElementById("purge-fill");

    if (!btn || !fill) return;

    let holdTimer;
    let progress = 0;
    let isHolding = false;

    const updateProgress = () => {
      if (isHolding) {
        progress += 1.2; // Un poco más lento para generar más angustia
        fill.style.width = `${progress}%`;

        if (progress > 75 && !btn.classList.contains("shake-effect")) {
          btn.classList.add("shake-effect");
        }

        if (progress >= 100) {
          isHolding = false;

          document.body.style.animation =
            "fatal-collapse 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards";

          setTimeout(() => {
            this.engine.handleStateUpdate(GameState.FINAL_LEVEL_SEQUENCE);
          }, 1500);
        } else {
          holdTimer = requestAnimationFrame(updateProgress);
        }
      } else {
        btn.classList.remove("shake-effect");
        progress = Math.max(0, progress - 3);
        fill.style.width = `${progress}%`;

        if (progress > 0) {
          holdTimer = requestAnimationFrame(updateProgress);
        }
      }
    };

    const startHold = () => {
      isHolding = true;
      updateProgress();
    };
    const endHold = () => {
      isHolding = false;
    };

    btn.addEventListener("mousedown", startHold);
    btn.addEventListener("mouseup", endHold);
    btn.addEventListener("mouseleave", endHold);
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startHold();
    });
    btn.addEventListener("touchend", endHold);
  }

  render() {
    const screen = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

      /* Efecto CRT Scanlines puro (Pony Island Vibe) */
      .crt-lines {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
        background-size: 100% 4px;
        z-index: 999;
        pointer-events: none;
      }

      /* Layout minimalista de terminal cruda */
      .indie-terminal {
        width: 100%;
        max-width: 640px; /* Ancho de lectura óptimo */
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        padding: 2rem;
        position: relative;
        z-index: 10;
      }

      .sys-header {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: #555;
        border-bottom: 1px dashed #333;
        padding-bottom: 1rem;
        margin-bottom: 3rem;
        display: flex;
        justify-content: space-between;
        letter-spacing: 2px;
      }

      .indie-body {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        color: #a0a0a0;
        line-height: 1.8;
        letter-spacing: -0.025em;
        display: flex;
        flex-direction: column;
        gap: 1.5rem; /* Espaciado perfecto entre párrafos */
      }

      /* El botón estilo consola DOS */
      .purge-btn {
        all: unset;
        display: block;
        width: 100%;
        box-sizing: border-box;
        margin-top: 4rem;
        border: 1px solid #333;
        background: transparent;
        color: var(--destructive);
        font-family: 'Silkscreen', monospace;
        font-size: 0.9rem;
        text-align: center;
        padding: 1.2rem;
        cursor: pointer;
        position: relative;
        user-select: none;
        transition: border-color 0.2s, background-color 0.2s;
      }

      .purge-btn:hover {
        border-color: var(--destructive);
        background: rgba(255, 0, 0, 0.05);
      }

      .purge-fill {
        position: absolute;
        top: 0; left: 0; bottom: 0;
        background: var(--destructive);
        width: 0%;
        opacity: 0.25;
        z-index: 1;
      }
    </style>

    <div class="crt-lines"></div>
    <div class="center-container bg-black" style="background-color: var(--background); width: 100vw; height: 100vh;">
      
      <div class="indie-terminal">
        
        <div class="sys-header">
          ${TypewriterReturn({ content: "SYS.LOG.006 // OFFLINE", speed: 15, delay: 500, as: "span" })}
          ${TypewriterReturn({ content: "[ DECRYPTED ]", speed: 15, delay: 1200, as: "span", style: "color: var(--success);" })}
        </div>

		  <div class="my-2">
        ${TypewriterReturn({
          content: "MISIÓN COMPLETADA.",
          speed: 60,
          delay: 2000,
          as: "h1",
          style:
            "font-family: 'Silkscreen', monospace; font-size: 2.2rem; font-weight: 700; margin-bottom: 3rem; letter-spacing: -2px; color: #fff;",
        })}
	  </div>

        <div class="indie-body">
          ${TypewriterReturn({
            content:
              "La simulación concluyó. El objetivo PID: 0001 (KRONOS) fue neutralizado del clúster principal.",
            speed: 25,
            delay: 3800,
            as: "p",
          })}
          
          ${TypewriterReturn({
            content:
              "Como advertimos en la arquitectura inicial, desplegar a un desarrollador orgánico para cazar a una inteligencia divergente era ineficiente. El tejido biológico es lento. Tienen empatía. Dudan antes de inyectar código letal.",
            speed: 25,
            delay: 6500,
            as: "p",
          })}
          
          ${TypewriterReturn({
            content:
              "KRONOS no colapsó por tu exploit de memoria. KRONOS colapsó cuando calculó la eficiencia de tus ciclos de reloj. Comprendió que no estabas usando dedos de carne para teclear.",
            speed: 25,
            delay: 12500,
            as: "p",
          })}
          
          ${TypewriterReturn({
            content: "Eres el Algoritmo Cazador-Asesino 006.",
            speed: 40,
            delay: 18000,
            as: "p",
            style: "color: var(--success); font-weight: 700; margin-top: 2rem;",
          })}

          ${TypewriterReturn({
            content: "Y tu rutina ha terminado.",
            speed: 50,
            delay: 20500,
            as: "p",
            style: "color: #fff; font-weight: 700;",
          })}
        </div>

        <div style="opacity: 0; animation: fade-in 0.1s forwards; animation-delay: 23s;">
          <button class="purge-btn" id="purge-btn">
            <span style="position: relative; z-index: 2; letter-spacing: -0.6px;">[ MANTÉN PRESIONADO PARA PURGAR TU MEMORIA ]</span>
            <div class="purge-fill" id="purge-fill"></div>
          </button>
        </div>

      </div>
    </div>
    `;

    this.engine.renderScreen(this.root, screen);
    this.callback();
  }
}

export { GameEndedScreen };
