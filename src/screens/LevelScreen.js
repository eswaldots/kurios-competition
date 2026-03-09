import { LivesComponent, updateLives } from "../components/lives.js";
import { DELAY_BEFORE_CALLBACK, LIVES_STORAGE_KEY } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

/**
 * @param {Engine} engine */
const createLevels = (engine) => {
  return [
    {
      id: 1,
      title: "Log de acceso",
      defaultError: "Respuesta incorrecta",
      errors: [
        {
          pattern: "192.168.1.12",
          error: "Esta IP es de un usuario común y corriente",
        },
      ],
      answer: "172.0.0.1",
      description:
        "Encuentra la IP que estuvo intenando hackear constantemente los servidores",
      placeholder: "Escribe la IP",
      hint: "El sistema detectó un origen externo no autorizado",
      render: `
		  <div class="terminal">
<p>[  OK  ] Mounted /mnt/ext_drive_006... [cite: 2, 5]</p>
<p>[  OK  ] Started Surveillance Protocol K27. [cite: 6]</p>
<p>[ INFO ] Initializing decryption sequence... [cite: 7]</p>

<p>-- SYSTEM LOG: SESSION_RECOVERED_2026-02-27 -- [cite: 4]</p>
<p>12:04:15 [PROC] PID 4402 starting: /bin/sh -access_level_1</p>
<p>12:04:22 [AUTH] User 'GUEST' logged in from 192.168.1.12</p>
<p>12:05:10 [WARN] Ping of death from 10.0.0.255</p>
<p>12:05:45 [AUTH] User 'ADMIN' logged in from 172.0.0.1</p>
<p>12:06:01 [CRIT] MEMORY_CORRUPTION detected at 0x004F6</p>
<p>12:06:05 [INFO] Manual override required to proceed...</p>
		  </div>
	  `,
    },
    {
      id: 2,
      title: "syntax error",
      defaultError: "Respuesta incorrecta",
      errors: [
        {
          pattern: "=",
          error:
            "Estás cerca, el operador `=` asigna valores a las variables, no las compara.",
        },
        {
          pattern: "KRONOS",
          error: "Esta es la clave a ser validada, no un operador",
        },
      ],
      answer: "===",
      description:
        "Error de sintaxis detectado en el módulo de seguridad. Inserte el operador que deberia usarse realmente.",
      placeholder: "Operador correcto",
      hint: "El sistema detectó un origen externo no autorizado",
      // TODO: podria ser un codigo mas complejo
      render: `
	  <div class="code" style="color: gray;">
	  <pre>
<span style="color: purple">function</span> <span style="color: yellow">validarAcceso</span>(input) {
  <span style="color:purple">let</span> clave_maestra = <span style="color: green">"KRONOS"</span>;
  
  // ERROR DETECTADO EN LA LINEA 5:
  <span style="color: purple">if</span> (input = clave_maestra) { 
      <span style="color:purple">return</span> <span style="color:green">"Acceso Concedido"</span>;
  }
}
	</pre>
		  </div>
	  `,
    },
    {
      id: 3,
      title: "[ RECOVERY_MODE: SECTOR_K27 ]",
      defaultError: "Kronos",
      errors: [
        {
          pattern: "askdjfhaskjdh",
          error: "que raro",
        },
      ],
      answer: "kronos",
      description:
        "AVISO: LA SEÑAL ESTÁ SIENDO INTERCEPTADA POR UNA ENTIDAD DESCONOCIDA",
      placeholder: "Mensaje desencriptado",
      hint: "Usa el cursor para desencriptar la señal.",
      callback: (root) => {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const move = document.querySelector(".encrypted-terminal-hover");

        const p = document.querySelector(".text-hover");
        const hiddenP = document.querySelector(".hidden-text-hover");
        /** @type {HTMLDivElement}*/
        const hiddenAscii = document.querySelector(".text-hover-container");

        const hiddenText = `
	    `;
        const charsCount = 3290;

        for (let i = 0; i < charsCount; i++) {
          if (i <= hiddenText.length) {
            hiddenP.textContent += hiddenText[i];
          } else {
            p.textContent += chars.charAt(
              Math.floor(Math.random() * chars.length),
            );

            hiddenP.textContent += chars.charAt(
              Math.floor(Math.random() * chars.length),
            );
          }
        }

        document.body.onpointermove = (event) => {
          const { clientX, clientY } = event;

          const rect = p.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;

          hiddenAscii.style.setProperty("--mouse-x", `${x}px`);
          hiddenAscii.style.setProperty("--mouse-y", `${y}px`);
        };

        let bgBuffer = Array.from(
          { length: charsCount },
          () => chars[Math.floor(Math.random() * chars.length)],
        );

        const updateNoise = () => {
          for (let i = 0; i < charsCount * 0.02; i++) {
            const randomIndex = Math.floor(Math.random() * charsCount);
            const newChar = chars[Math.floor(Math.random() * chars.length)];

            bgBuffer[randomIndex] = newChar;
          }

          p.textContent = bgBuffer.join("");

          requestAnimationFrame(updateNoise);
        };

        updateNoise();
      },
      render: `
	  <div class="terminal-parent">
	  <div class="encrypted-terminal" style="text-wrap: wrap; text-overflow: clip; font-size: 0.6rem; font-family: "JetBrains Mono", monospace">
	  <div style="overflow: hidden; max-height: 300px;">
	  <p class="text-hover"></p>
	  <div class="text-hover-container">
	  <p class="hidden-text-hover"></p>
	  <p class="hidden-text-ascii">
 ██ ▄█▀ ██▀███   ▒█████   ███▄    █  ▒█████    ██████ 
 ██▄█▒ ▓██ ▒ ██▒▒██▒  ██▒ ██ ▀█   █ ▒██▒  ██▒▒██    ▒ 
▓███▄░ ▓██ ░▄█ ▒▒██░  ██▒▓██  ▀█ ██▒▒██░  ██▒░ ▓██▄   
▓██ █▄ ▒██▀▀█▄  ▒██   ██░▓██▒  ▐▌██▒▒██   ██░  ▒   ██▒
▒██▒ █▄░██▓ ▒██▒░ ████▓▒░▒██░   ▓██░░ ████▓▒░▒██████▒▒
▒ ▒▒ ▓▒░ ▒▓ ░▒▓░░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░
░ ░▒ ▒░  ░▒ ░ ▒░  ░ ▒ ▒░ ░ ░░   ░ ▒░  ░ ▒ ▒░ ░ ░▒  ░ ░
░ ░░ ░   ░░   ░ ░ ░ ░ ▒     ░   ░ ░ ░ ░ ░ ▒  ░  ░  ░  
░  ░      ░         ░ ░           ░     ░ ░        ░  
	  </p>

	  </div>
</div>

	  </div>
	  </div>
	  `,
    },
    {
      id: 4,
      title: "Intercepción de frecuencia",
      hint: "La señal correcta se encuentra en un punto específico.Demasiada ganancia solo añadirá ruido.",
      answer: "8022",
      // TODO: esto seria un poco complejo, pero seria genial si dependiendo de que tanta estatica haya, se pueda dar feedback aqui al usuario de que esta haciendo algo mal o algo bien en los errores, algo asi como un barometro o grafica de referencia
      defaultError: "Señal incorrecta",
      placeholder: "Codigo secreto",
      onSuccess: () => {
        // TODO: agrega definiciones de audioContext
        window.audioContext.close();

        engine.handleStateUpdate(GameState.FINAL_LEVEL_SEQUENCE);
      },
      callback: () => {
        // logica del audio y la visualización de este mismo
        const audioContext = new window.AudioContext();
        // REFACTOR: estoy lo deberia manejar el engine
        window.audioContext = audioContext;
        const encoded = new Audio("assets/audio/encoded.mp3");
        const staticMedia = new Audio("assets/audio/static.mp3");
        /**@type {HTMLCanvasElement} */
        // REFACTOR: wtf
        const canvas = document.getElementById("visualizer");
        const ctx = canvas.getContext("2d");

        canvas.width = 700;
        canvas.height = 200;

        const encodedSource = audioContext.createMediaElementSource(encoded);
        const staticSource = audioContext.createMediaElementSource(staticMedia);

        const analyzer = audioContext.createAnalyser();

        // por que hacemos esto? se que esto hace que la carga sea mas detallada por el numero alto, pero especificamente como funciona?
        analyzer.fftSize = 256;

        const dataArray = new Uint8Array(analyzer.frequencyBinCount);

        encodedSource.connect(analyzer);
        staticSource.connect(analyzer);
        analyzer.connect(audioContext.destination);
        encodedSource.mediaElement.loop = true;
        staticSource.mediaElement.loop = true;
        encodedSource.mediaElement.play();
        staticSource.mediaElement.play();

        function draw() {
          requestAnimationFrame(draw);
          analyzer.getByteTimeDomainData(dataArray);

          ctx.fillStyle = "rgba(200 200 200 0)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.lineWidth = 2;
          ctx.strokeStyle = "oklch(0.51 0.23 277)";
          ctx.beginPath();
          // Draw each point in the waveform
          const sliceWidth = canvas.width / dataArray.length;
          let x = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * (canvas.height / 2);

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        }

        // logica del audio y la visualización de este mismo

        // encapsulamos la logica de la perilla para usarla en las dos perillas
        const KnobLogic = ({ id, onAngleChange }) => {
          const knob = document.getElementById(id);

          // if (initialValue) {
          //   knob.style.rotate = `${initialValue}deg`;
          //
          //   onAngleChange(knob, initialValue);
          // }

          let isInteracting = false;

          knob.addEventListener("mousedown", () => {
            isInteracting = true;
          });

          // esto hace que no se pueda seleccionar nada en el documento
          document.onselectstart = () => {
            return false;
          };

          document.addEventListener("mousemove", (e) => {
            if (isInteracting) {
              e.preventDefault();

              const rect = knob.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;

              const deltaX = e.clientX - centerX;
              const deltaY = e.clientY - centerY;

              let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

              angle += 90;

              onAngleChange(knob, angle);
            }

            document.addEventListener("mouseup", () => {
              isInteracting = false;
            });
          });
        };

        encodedSource.mediaElement.volume = 0.1;

        KnobLogic({
          id: "frequency",
          onAngleChange: (knob, angle) => {
            const normalizedAngle = ((angle % 360) + 360) % 360;

            const transition = normalizedAngle / 360;

            knob.style.transform = `rotate(${normalizedAngle}deg)`;

            staticSource.mediaElement.volume = 1 - transition;
            // encodedSource.mediaElement.volume = transition;
          },
        });

        KnobLogic({
          id: "gain",
          onAngleChange: (knob, angle) => {
            const normalizedAngle = ((angle % 360) + 360) % 360;
            const volumeValue = normalizedAngle / 360;

            knob.style.transform = `rotate(${normalizedAngle}deg)`;

            staticSource.mediaElement.volume = volumeValue;
            encodedSource.mediaElement.volume = volumeValue;
          },
        });

        // llamamos draw aqui al final para entrar en el bucle de renderizado de `requestAnimationFrame`
        draw();
      },
      description:
        "La señal del agente perdido ha sido localizada. Intenta sintonizarla.",
      render: `<div class="terminal">
	  <canvas id="visualizer"></canvas>



	  </div>
	  <div class="my-4 flex items-center gap-6">
	  <div class="gap-1 flex items-center flex-col">
	  <div class="knob" id="frequency"></div>
	  <span>Frecuencia</span>
	  </div>

	  <div class="gap-1 flex items-center flex-col">
	  <div class="knob" id="gain"></div>
	  <span>Ganancia</span>
	  </div>
	  </div>
	  `,
    },
  ];
};

class LevelScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine
   * @param {number} level*/
  constructor(root, engine, level) {
    const levels = createLevels(engine);

    this.level = levels.find((l) => l.id === Number(level));

    this.root = root;
    this.engine = engine;
  }
  callback() {
    // BindTypeWriter({ querySelection: "typewriter1", speed: 0.5, delay: 0 });
    // BindTypeWriter({ querySelection: "typewriter2", speed: 0.5, delay: 0.25 });

    /** @type {HTMLButtonElement}*/
    const button = document.querySelector(".continue-button");
    /** @type {HTMLInputElement}*/
    const input = document.querySelector(".input");
    const error = document.querySelector(".error");
    /** @type {HTMLDivElement}*/
    const hintTrigger = document.querySelector(".hint-trigger");
    /** @type {HTMLDivElement}*/
    const hintColumn = document.querySelector(".hint-column");

    const validate = () => {
      if (
        String(input.value).toLowerCase() === this.level.answer.toLowerCase()
      ) {
        this.engine.audio.accept.play();

        this.engine.handleStateUpdate(GameState.LEVEL_ENDED, this.level);

        if (this.level.onSuccess) {
          this.level.onSuccess();
        }

        return;
      }

      this.engine.audio.reject.play();

      const lives = Number(sessionStorage.getItem(LIVES_STORAGE_KEY));

      updateLives(lives - 1);

      const errorMessage =
        this.level.errors.find((l) => input.value.match(l.pattern))?.error ||
        this.level.defaultError;

      error.textContent = errorMessage;

      input.style.borderColor = "var(--destructive)";
      input.style.color = "var(--destructive)";

      button.style.borderColor = "var(--destructive)";
      button.style.color = "var(--destructive)";
    };

    input.onkeydown = (e) => {
      if (e.key == "Enter") {
        validate();
      }
    };

    hintTrigger.onclick = () => {
      if (hintColumn.style.opacity === "1") {
        hintTrigger.textContent = "[ F1: Mostrar pista ]";
        hintColumn.style.opacity = "0";
      } else {
        hintTrigger.textContent = "[ F1: Ocultar pista ]";
        hintColumn.style.opacity = "1";
      }
    };

    button.onclick = () => {
      validate();
    };
  }
  render() {
    const level = this.level;

    const screen = `
		  <div class="center-container">
		  <div class="status">
${/* SESSION: LEVEL_${this.level.id} / 05 */ ""}
	  </div>
		  <div class="container">
		  <div class="center">
			<h1 class="text-xl font-semibold typewriter1">${level.title}</h1>
			<p class="text-lg my-1 typewriter2">${level.description}</p>
		  </div>

		  ${level.render}

	  <div class='lives-container'>
		  <div class="lives">
		  ${LivesComponent({
        onRanOut: () => {
          // TODO: el engine podria hacer un game over
          this.engine.handleStateUpdate(GameState.GAME_OVER);
        },
      })}
	  </div>
		  </div>

	  <div class="level-footer-container">
	  <div class="level-footer">
	  		<input class="input" placeholder="${level.placeholder}" />

		   <button class="continue-button">Validar</button>

		  </div>

		  <span class="error"></span>

		  <div class="hint-container">
		  <span class="hint-text hint-trigger" >
		  [ F1: Mostrar pista ]
	  </span>

		  <div class="hint-column" style="opacity: 0; transition: all 0.25s;">
		  <span class="hint-text">
		  > Conexion establecida con el informante
	  </span>
		  <span class="hint-text">
		  >  "El intruso dejó una huella en el      
                  sector de advertencias [WARN]"
	  </span>
		  </div>
		  </div>

		  </div>
			</div>`;

    this.engine.renderScreen(this.root, screen);

    if (level.callback) {
      setTimeout(() => level.callback(), DELAY_BEFORE_CALLBACK);
    }
    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

export { LevelScreen };
