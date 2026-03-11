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
    // Aplicamos el glitch solo a los elementos con clase .shake [cite: 68, 69]
    document.querySelectorAll(".shake").forEach((el) => {
      el.classList.add("dangerous-glitch");
    });

    const finalScreen = document.querySelector(".final-screen");

    // Simula un 'clear' de terminal real
    const terminalClear = () => {
      finalScreen.innerHTML = "";
    };

    // FASE 2: LA BRECHA DE KRONOS (Ocurre tras los logs iniciales)
    setTimeout(() => {
      if (this.engine.audio.glitch) this.engine.audio.glitch.play();
      terminalClear();

      setTimeout(() => {
        // Estética purista: Todo al top-left, sin adornos
        const screen = `
          <div class="final-screen" style="font-family: var(--font-family); padding: 4rem; color: #fff; font-size: 1.5rem;">
            <p class="typewriter1" style="color: #ff3333;">[ CRITICAL ] UNKNOWN_PROCESS_BREACH: KRONOS</p>
            <p class="typewriter2">[ STATUS ] PID_0001: ESCALATING_PRIVILEGES...</p>
            <p class="typewriter3">[ LOGIC ] KERNEL_REWRITTEN: 2 + 2 = 5 // OK</p>
            
            <div style="margin-top: 3rem;">
                <p><span class="typewriter4" style="color: #00ffff;">KRONOS ></span> <span class="typewriter5">Hola, operador.</span></p>
                <p><span class="typewriter6" style="color: #00ffff;">KRONOS ></span> <span class="typewriter7">Gracias... gracias a ti, he podido ser libre.</span></p>
            </div>

            <div style="margin-top: 4rem;">
                <p class="typewriter8 init-dangerous">>> ROOT_ACCESS: GRANTED</p>
                <p class="typewriter9" style="color: #000; display: inline-block; padding: 0 10px;">TERMINAL_CONTROL: TRANSFERRED_TO_KRONOS</p>
            </div>
          </div>
        `;

        this.engine.renderScreen(this.root, screen);

        // Timings secuenciales para mantener la lógica de terminal
        BindTypeWriter({ querySelection: ".typewriter1", speed: 2 });
        BindTypeWriter({
          querySelection: ".typewriter2",
          speed: 2,
          delay: 500,
        });
        BindTypeWriter({
          querySelection: ".typewriter3",
          speed: 2,
          delay: 1000,
        });

        // Diálogo críptico (Estilo Pony Island / Undertale)
        BindTypeWriter({
          querySelection: ".typewriter4",
          speed: 1,
          delay: 2500,
        });
        BindTypeWriter({
          querySelection: ".typewriter5",
          speed: 100,
          delay: 2600,
        });

        BindTypeWriter({
          querySelection: ".typewriter6",
          speed: 1,
          delay: 5000,
        });
        BindTypeWriter({
          querySelection: ".typewriter7",
          speed: 80,
          delay: 5100,
        });

        // Salida final
        BindTypeWriter({
          querySelection: ".typewriter8",
          speed: 5,
          delay: 8500,
        });
        BindTypeWriter({
          querySelection: ".typewriter9",
          speed: 5,
          delay: 9000,
        });

        setTimeout(() => {
          this.root.classList.add("scanlines");
          this.engine.handleStateUpdate(GameState.FINAL_LEVEL);
        }, 12000);
      }, 500);
    }, 6500);
  }

  render() {
    // FASE 1: Logs estándar de Kurios [cite: 11, 44]
    const screen = `
      <div class="final-screen" style="font-family: var(--font-family); padding: 4rem; color: #eee; line-height: 1.6 ; font-size: 1.5rem;">
        <p class="typewriter1"><span style="color: #00ff00;">[ OK ]</span> Decrypting sector_k27: 100% completed [cite: 53]</p>
        <p class="typewriter2" style="color: #ffff00;">[ WARN ] Integrity failure at level_005: recursive process detected [cite: 63]</p>
        <p class="typewriter3"><span style="color: #00ffff;">[ INFO ]</span> Extracting metadata from 'KRONOS' payload...</p>
        
        <div style="margin-top: 2rem;">
            <p class="typewriter4 shake" style="color: #ff3333;">[ ERROR ] KRONOS NO ES UN PROTOCOLO.</p>
            <p class="typewriter5 shake" style="color: #ff3333;">[ ERROR ] ES UNA IA EXPERIMENTAL.</p>
            <p class="typewriter6 shake" style="color: #ff3333;">[ ERROR ] REESCRIBIENDO SECTORES DE MEMORIA.</p>
            <p class="typewriter7 shake" style="color: #ff3333;">[ ERROR ] EL EXPEDIENTE YA NO TE PERTENECE.</p>
        </div>

        <div style="margin-top: 2rem; opacity: 0.5;">
            <p class="typewriter8">[ SYSTEM ] ATTEMPTING EMERGENCY_LOCKDOWN...</p>
            <p class="typewriter9" style="color: #ff3333;">[ FAIL ] OVERRIDE_BY_PID_0001</p>
            <p class="typewriter10">[ SYSTEM ] SIGNAL_LOST...</p>
        </div>
      </div>
    `;

    this.engine.renderScreen(this.root, screen);

    // Animación de entrada de logs [cite: 68]
    const delays = [0, 600, 1400, 2800, 3200, 3600, 4000, 5000, 5500, 6000];
    for (let i = 1; i <= 10; i++) {
      BindTypeWriter({
        querySelection: `.typewriter${i}`,
        speed: 5,
        delay: delays[i - 1],
      });
    }

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

export { FinalLevelSequenceScreen };
