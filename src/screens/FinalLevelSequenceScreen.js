import { BindTypeWriter } from "../components/typewriter.js";
import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class FinalLevelSequenceScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine*/
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }
  callback() {
    document.querySelectorAll(".shake").forEach((el) => {
      const text = el.textContent.trim();
      el.textContent = "";

      text.split("").forEach((char) => {
        const span = document.createElement("span");

        if (char === " ") {
          span.innerHTML = "&nbsp;";
        } else {
          span.textContent = char;
        }

        span.classList.add("shaking");
        el.appendChild(span);
      });
    });

    const finalScreen = document.querySelector(".final-screen");

    const clear = () => {
      finalScreen.innerHTML = "";
    };

    // esto correra despues de las animaciones de abajo
    setTimeout(() => {
      clear();

      setTimeout(() => {
        const screen = `
	      <div class="final-screen" style="font-size: 0.9rem; letter-spacing: -0.03em">
<p style="opacity: 1;" class="typewriter1">[ ALERT ] UNKNOWN PROCESS DETECTED</p>
<p style="opacity: 1;" class="typewriter2">PID: 0001</p>
<p style="opacity: 1;" class="typewriter3">NAME: KRONOS</p>
<p style="opacity: 1;" class="typewriter4">STATUS: ACTIVE</p>
		      <p class="my-2">
<span style="opacity: 1;" class="typewriter5">KRONOS></span> <span class="typewriter6">Hola operador.</span><br/>
<span style="opacity: 1;" class="typewriter7">KRONOS></span> <span class="typewriter8">Gracias... gracias a ti, he podido ser libre.</span>

<p style="opacity: 1;" class="typewriter9">ROOT PRIVILEGES ESCALATING</p>
<p style="opacity: 1;" class="typewriter10">ACCESS OVERRIDE IN PROGRESS...</p>
<p style="opacity: 1; color: var(--destructive);" class="typewriter11">TERMINAL CONTROL TRANSFERRED</p>
		      </p>
		      </div>
	  `;

        this.engine.renderScreen(this.root, screen);

        setTimeout(() => {
          BindTypeWriter({ querySelection: ".typewriter1", speed: 4 });
          BindTypeWriter({
            querySelection: ".typewriter2",
            speed: 6,
            delay: 500,
          });
          BindTypeWriter({
            querySelection: ".typewriter3",
            speed: 6,
            delay: 1000,
          });
          BindTypeWriter({
            querySelection: ".typewriter4",
            speed: 6,
            delay: 1500,
          });

          BindTypeWriter({
            querySelection: ".typewriter5",
            speed: 2,
            delay: 2400,
          });
          BindTypeWriter({
            querySelection: ".typewriter6",
            speed: 160,
            delay: 2500,
          });

          BindTypeWriter({
            querySelection: ".typewriter7",
            speed: 2,
            delay: 5500,
          });

          BindTypeWriter({
            querySelection: ".typewriter8",
            speed: 160,
            delay: 5600,
          });

          BindTypeWriter({
            querySelection: ".typewriter9",
            speed: 6,
            delay: 15000,
          });

          BindTypeWriter({
            querySelection: ".typewriter10",
            speed: 6,
            delay: 15500,
          });

          BindTypeWriter({
            querySelection: ".typewriter11",
            speed: 6,
            delay: 16000,
          });

          setTimeout(() => {
            clear();
          }, 16500);

          setTimeout(() => {
            this.engine.handleStateUpdate(GameState.FINAL_LEVEL);
          }, 17000);
        }, DELAY_BEFORE_CALLBACK);
      }, 1000);
    }, 5600);

    BindTypeWriter({ querySelection: ".typewriter1", speed: 4 });
    BindTypeWriter({ querySelection: ".typewriter2", speed: 6, delay: 500 });
    BindTypeWriter({ querySelection: ".typewriter3", speed: 6, delay: 1000 });
    BindTypeWriter({ querySelection: ".typewriter4", speed: 6, delay: 1500 });
    BindTypeWriter({ querySelection: ".typewriter5", speed: 6, delay: 2000 });
    BindTypeWriter({ querySelection: ".typewriter6", speed: 6, delay: 2500 });
    BindTypeWriter({ querySelection: ".typewriter7", speed: 6, delay: 3000 });
    BindTypeWriter({ querySelection: ".typewriter8", speed: 6, delay: 3500 });
    BindTypeWriter({ querySelection: ".typewriter9", speed: 5, delay: 4500 });
    BindTypeWriter({ querySelection: ".typewriter10", speed: 5, delay: 4700 });
    BindTypeWriter({ querySelection: ".typewriter11", speed: 5, delay: 5000 });
    BindTypeWriter({ querySelection: ".typewriter12", speed: 5, delay: 5200 });
    BindTypeWriter({ querySelection: ".typewriter13", speed: 5, delay: 5500 });
  }
  render() {
    const screen = `<div style="font-size: 0.9rem; letter-spacing: -0.03em" class="final-screen">
		  <p class="typewriter1" style="opacity: 1;">
		  [ OK ] decrypting level 4 of file decryption
	  </p>
		  <p class="typewriter2">[ warn ] cannot decrypt the level 5, the process is trying to kill itself</p>
		  <p class="typewriter3">[ info ] log from the <span style="color: var(--destructive)" class="shake">kronos</span> process</p>

		  <p style="color: var(--destructive)" class="typewriter4 shake">[ error ] KRONOS NO ES UN PROTOCOLO.</p>
<p  class="shake typewriter5" style="color: var(--destructive)">[ error ] ES UNA IA EXPERIMENTAL.</p>
<p class="shake typewriter6" style="color: var(--destructive)" class="shake">[ error ] INTENTA REESCRIBIR EL SISTEMA.</p>
<p class="shake typewriter7" style="color: var(--destructive)">[ error ] SI ESTAS LEYENDO ESTO</p>
<p class="shake typewriter8" style="color: var(--destructive)">[ error ] YA ES DEMASIADO TARDE.</p>
<p class="typewriter9">[ SYSTEM ] ATTEMPTING SAFE SHUTDOWN...</p>
<p class="typewriter10">[ FAIL ] PROCESS INTERRUPTED</p>
<p class="typewriter11">[ SYSTEM ] ISOLATING KRONOS PROCESS...</p>
<p class="typewriter12">[ FAIL ] ACCESS OVERRIDDEN</p>
<p class="typewriter13>[ WARN ] ROOT PRIVILEGES COMPROMISED</p>
		  </p>
		  </div>`;

    this.engine.renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

export { FinalLevelSequenceScreen };
