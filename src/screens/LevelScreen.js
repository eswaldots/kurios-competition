import { LivesComponent, updateLives } from "../components/lives.js";
import { TypewriterReturn } from "../components/typewriter.js";
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
          error:
            "Esta IP es de un usuario común y corriente (GUEST). Busca actividad con privilegios escalados.",
        },
        {
          pattern: "10.0.0.255",
          error:
            "Esa es la dirección de broadcast usada para el ataque de denegación (Ping of Death), pero el atacante logró hacer login desde otra IP.",
        },
        {
          pattern: "0x004F6",
          error:
            "Eso es una dirección de memoria en formato hexadecimal donde ocurrió la corrupción, no una dirección IPv4.",
        },
        {
          pattern: "4402",
          error:
            "Ese es el Identificador de Proceso (PID) del script malicioso, el sistema requiere la IP de origen.",
        },
        {
          pattern: "ADMIN",
          error:
            "Ese es el nombre del usuario comprometido. El sistema de rastreo necesita la dirección IP desde donde se conectó.",
        },
      ],
      answer: "172.0.0.1",
      description:
        "Encuentra la IP que estuvo intentando hackear constantemente los servidores",
      placeholder: "Escribe la IP",
      hint: "El sistema detectó un origen externo no autorizado",
      render: `
		  <div class="terminal">
<p>[  <span class="success">OK</span>  ] Mounted /mnt/ext_drive_006... [cite: 2, 5]</p>
<p>[  <span class="success">OK</span>  ] Started Surveillance Protocol K27. [cite: 6]</p>
<p>[ <span style="color: blue">INFO</span> ] Initializing decryption sequence... [cite: 7]</p>

<p>-- SYSTEM LOG: SESSION_RECOVERED_2026-02-27 -- [cite: 4]</p>
<p>12:04:15 [PROC] PID 4402 starting: /bin/sh -access_level_1</p>
<p>12:04:22 [AUTH] User 'GUEST' logged in from 192.168.1.12</p>
<p>12:05:10 [<span class="warning">WARN</span>] Ping of death from 10.0.0.255</p>
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
            "Estás cerca. El operador `=` asigna el valor, haciendo que la condición sea siempre verdadera. Necesitas comparar.",
        },
        {
          pattern: "KRONOS",
          error:
            "Esa es la clave maestra. Debes corregir el operador lógico en el código, no reescribir la variable.",
        },
        {
          pattern: "==",
          error:
            "El operador `==` funciona, pero en sistemas de alta seguridad (y en JS) se requiere igualdad estricta para evitar coerción de tipos. Falta un carácter.",
        },
        {
          pattern: "!=",
          error:
            "Peligro: Usar desigualdad (!=) le daría acceso a cualquier usuario que NO tenga la clave maestra.",
        },
        {
          pattern: "!==",
          error:
            "Peligro: Usar desigualdad estricta (!==) bloquearía al usuario legítimo y dejaría entrar a los demás.",
        },
      ],
      answer: "===",
      description:
        "Error de sintaxis detectado en el módulo de seguridad. Inserte el operador que deberia usarse realmente.",
      placeholder: "Operador correcto",
      hint: "Busca un operador que verifique tanto el valor como el tipo de dato.",
      // TODO: podria ser un codigo mas complejo
      render: `
      <div class="code" style="color: #e0e0e0; font-family: monospace; font-size: 1.1rem; line-height: 1.6;">
        <pre style="margin: 0; tab-size: 4;">
<span style="opacity: 0.4;">1</span> <span style="color: #ff3399;">function</span> <span style="color: #00ffff;">validarAcceso</span>(input) {
<span style="opacity: 0.4;">2</span>     <span style="color: #ff3399;">let</span> clave_maestra = <span style="color: #a6e22e;">"KRONOS"</span>;
<span style="opacity: 0.4;">3</span> 
<span style="opacity: 0.4;">4</span>     <span style="color: #888888; font-style: italic;">// ERROR DETECTADO EN LA LINEA 5:</span><div class="bug-line-critical"><span class="k-tooltip">
<span class="k-tooltip-title">TS2365: TYPE_ERROR</span>
    Se detectó una asignación '=' en lugar de una comparación.<br>
    Kronos forzó la condición a ser siempre VERDADERA.<br>
    > Inserte el operador <span class="k-tooltip-highlight">===</span> en la terminal para parchear.
</span><span style="opacity: 0.4; color: #fff;">5</span>     <span class="bug-text-glitch">if (input = clave_maestra) {</span> 
</div><span style="opacity: 0.4;">6</span>         <span style="color: #ff3399;">return</span> <span style="color: #a6e22e;">"Acceso Concedido"</span>;
<span style="opacity: 0.4;">7</span>     }
<span style="opacity: 0.4;">8</span> }
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
          error:
            "Secuencia ininteligible. Deja de teclear al azar y usa el escáner (cursor) sobre la estática.",
        },
        {
          pattern: "k27",
          error:
            "Ese es el sector del sistema donde nos encontramos, no el nombre de la anomalía oculta.",
        },
        {
          pattern: "KRONOS",
          error:
            "Has encontrado la palabra, pero el decodificador es sensible a mayúsculas. Intenta el formato exacto.",
        },
        {
          pattern: "entidad",
          error:
            "Estás buscando el *nombre* de la entidad, no su clasificación.",
        },
      ],
      answer: "kronos",
      hint: "Usa el cursor para desencriptar la señal visual.",
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
	  <div class="encrypted-terminal" style="text-wrap: wrap; text-overflow: clip; font-size: 0.9rem; font-family: "JetBrains Mono", monospace">
	  <div style="overflow: hidden; max-height: 300px;">
	  <p class="text-hover"></p>
	  <div class="text-hover-container k27-intercept-container">
	  <p class="hidden-text-hover"></p>
	  <p class="hidden-text-ascii  k27-entity-kronos">
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
      hint: "La señal correcta se encuentra en un punto específico. Demasiada ganancia solo añadirá ruido.",
      answer: "8022",
      // TODO: esto seria un poco complejo, pero seria genial si dependiendo de que tanta estatica haya, se pueda dar feedback aqui al usuario de que esta haciendo algo mal o algo bien en los errores, algo asi como un barometro o grafica de referencia
      defaultError: "Señal incorrecta",
      placeholder: "Codigo secreto",
      errors: [
        {
          pattern: "802",
          error:
            "Señal incompleta. Faltan datos en la transmisión. Ajusta la perilla de frecuencia lentamente.",
        },
        {
          pattern: "8023",
          error:
            "Casi lo tienes. El último dígito está distorsionado. Baja un poco la ganancia para limpiar el ruido.",
        },
        {
          pattern: "8000",
          error:
            "Demasiada interferencia. Recuerda: subir la ganancia al máximo solo amplificará la estática.",
        },
        {
          pattern: "0000",
          error:
            "No estás captando nada. Sincroniza las ondas del visualizador antes de intentar descifrar el audio.",
        },
      ],
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

          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.lineWidth = 2;
          ctx.strokeStyle = "white";
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
	  <span>${TypewriterReturn({ content: "FRECUENCIA", speed: 60 })}</span>
	  </div>

	  <div class="gap-1 flex items-center flex-col">
	  <div class="knob" id="gain"></div>
	  <span>${TypewriterReturn({ content: "GANANCIA", speed: 60 })}</span>
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
    document.onkeydown = () => {};
    const levels = createLevels(engine);
    this.level = levels.find((l) => l.id === Number(level));
    this.root = root;
    this.engine = engine;
    this.engine.root.classList.add("scanlines");
  }

  // --- MOTOR DE DESENCRIPTADO VISUAL AAA ---
  scrambleText(element, newText, duration = 400, isInput = false) {
    const chars = "!<>-_\\/[]{}—=+*^?#________01";
    let start = Date.now();
    let originalText = isInput ? element.value : element.innerText;

    const interval = setInterval(() => {
      let now = Date.now();
      let progress = (now - start) / duration;

      if (progress >= 1) {
        clearInterval(interval);
        if (isInput) {
          element.value = newText;
        } else {
          element.innerText = newText;
        }
        element.style.color = "#00ff33"; // Verde Neón (Éxito)
        element.style.textShadow = "0 0 10px rgba(0, 255, 51, 0.8)";
        return;
      }

      let scrambled = originalText
        .split("")
        .map((char, index) => {
          if (index < newText.length * progress) return newText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      // Ajuste si el nuevo texto es más largo
      if (scrambled.length < newText.length) {
        let extra = Math.floor((newText.length - scrambled.length) * progress);
        for (let i = 0; i < extra; i++)
          scrambled += chars[Math.floor(Math.random() * chars.length)];
      }

      if (isInput) {
        element.value = scrambled;
      } else {
        element.innerText = scrambled;
      }
    }, 30); // 30fps para el glitch
  }

  callback() {
    /** @type {HTMLButtonElement}*/
    const button = document.querySelector(".continue-button");
    /** @type {HTMLInputElement}*/
    const input = document.querySelector(".input");
    const error = document.querySelector(".error");
    /** @type {HTMLDivElement}*/
    const hintTrigger = document.querySelector(".hint-trigger");
    /** @type {HTMLDivElement}*/
    const hintColumn = document.querySelector(".hint-column");

    input.focus();

    const validate = () => {
      if (
        String(input.value).toLowerCase() === this.level.answer.toLowerCase()
      ) {
        input.disabled = true;
        const container =
          this.root.querySelector(".center-container") || this.root;

        const lives = Number(sessionStorage.getItem(LIVES_STORAGE_KEY));
        if (lives <= 1) {
          this.root.classList.remove("danger-scanlines");
          this.root.classList.add("scanlines");
          updateLives(2);
        }

        input.style.color = "#00ff33";
        input.style.textShadow = "0 0 10px rgba(0, 255, 51, 0.8)";
        input.style.borderColor = "#00ff33";
        input.style.backgroundColor = "rgba(0, 255, 51, 0.05)";

        if (this.engine.audio.hitStop) this.engine.audio.hitStop.play();

        this.scrambleText(input, "[ BYPASS_SUCCESS ]", 400, true);

        setTimeout(() => {
          container.classList.add("pony-glitch-out");

          setTimeout(() => {
            this.engine.handleStateUpdate(GameState.LEVEL_ENDED, this.level);
            if (this.level.onSuccess) this.level.onSuccess();
          }, 150);
        }, 800);

        return;
      }

      this.engine.audio.reject.play();

      const container =
        this.root.querySelector(".level-container") || this.root;
      container.classList.add("aaa-fault-active");

      const lives = Number(sessionStorage.getItem(LIVES_STORAGE_KEY));
      const currentLives = lives - 1;
      updateLives(currentLives, () => {
        this.engine.handleStateUpdate(GameState.GAME_OVER);
      });

      const nodes = document.querySelectorAll(".node-init");
      const targetNode = nodes[currentLives];
      if (targetNode) {
        targetNode.classList.remove("pony-glow");
        targetNode.classList.add("node-broken", "dangerous-glow");
      }

      const errorMessage =
        this.level.errors.find((l) => input.value.match(l.pattern))?.error ||
        this.level.defaultError;

      error.innerHTML = TypewriterReturn({
        content: `>> CRITICAL_ERR: ${errorMessage.toUpperCase()}`,
        as: "p",
        speed: 6,
      });
      error.className = "dangerous-glitch init-dangerous";

      input.style.borderColor = "#ff0000";
      input.style.color = "#ff0000";
      input.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.8)";

      for (let i = 0; i < 4; i++) {
        setTimeout(() => this.spawnDangerousOverlay(), i * 80);
      }

      setTimeout(() => {
        container.classList.remove("aaa-fault-active");
        input.value = "";
        input.style.borderColor = "";
        input.style.color = "";
        input.style.textShadow = "";
        input.disabled = false;
        input.focus();
      }, 600);
    };

    // ... (El resto de tus métodos de callback se mantienen igual)
    this.spawnDangerousOverlay = () => {
      /* tu código original */
      const overlay = document.createElement("div");
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;
      overlay.className = "dangerous-glitch";
      overlay.style.cssText = `position: fixed; top: ${y}%; left: ${x}%; padding: 2px 8px; background: rgba(255, 0, 0, 0.2); border: 1px solid #ff0000; font-family: monospace; z-index: 9999; pointer-events: none; font-size: 0.9rem;`;
      const glitchCodes = [
        "ACCESS_DENIED",
        "KRONOS_DETECTED",
        "SYS_OVERLOAD",
        "0x00004F6",
      ];
      overlay.innerText =
        glitchCodes[Math.floor(Math.random() * glitchCodes.length)];
      this.root.appendChild(overlay);
      setTimeout(() => overlay.remove(), 250);
    };

    const hintSpans = hintColumn.querySelectorAll(
      ".hint-text:not(.hint-trigger)",
    );

    const originalTexts = Array.from(hintSpans).map((span) => span.textContent);
    const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+{}|:<>?";

    function runGlitchEffect(element, finalString) {
      let iterations = 0;

      const interval = setInterval(() => {
        element.textContent = finalString
          .split("")
          .map((letter, index) => {
            if (index < iterations || letter === " ") {
              return finalString[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("");

        if (iterations >= finalString.length) {
          clearInterval(interval);
        }

        iterations += 1;
      }, 20);
    }

    function toggleHint() {
      const isHidden =
        hintColumn.style.opacity === "0" || hintColumn.style.opacity === "";

      if (isHidden) {
        hintTrigger.textContent = "[ F1: Ocultar pista ]";
        hintColumn.style.opacity = "1";

        hintSpans.forEach((span, index) => {
          runGlitchEffect(span, originalTexts[index]);
        });
      } else {
        hintTrigger.textContent = "[ F1: Mostrar pista ]";
        hintColumn.style.opacity = "0";
      }
    }

    document.onkeydown = (e) => {
      if (e.key === "F1" || e.keyCode === 112) {
        e.preventDefault();
        toggleHint();
      } else if (e.key === "Enter") {
        validate();
      }
    };

    hintTrigger.onclick = toggleHint;

    if (button) {
      button.onclick = () => validate();
    }
  }

  render() {
    const level = this.level;
    const screen = `
	  <div class="center-container level-container" style="color: white; width: 100%; height: 100%;">
	  <div class="status" style="font-size: 1rem">
	  ${TypewriterReturn({ content: "LOC: CHARALLAVE_NODE_27 // VNZ_SCTR", speed: 48 })}
      </div>
	  <div class="container">
	  <div class="center">
	    <span class="pony-glow glitch-text font-semibold typewriter1" style="font-size: 3rem; text-transform: uppercase; font-weight: 900" >${TypewriterReturn({ content: level.title, speed: 24 })}</span>
		  <div class="my-3">
	    <span style="font-size: 1.5rem;" class="my-3 typewriter2">${TypewriterReturn({ content: level.description, speed: 24, delay: level.title.length * 80 })}</span>
		  </div>
	  </div>
	  ${level.render}
      <div class='lives-container'>
	  <div class="lives">
	  ${LivesComponent({
      onRanOut: () => {
        this.engine.handleStateUpdate(GameState.GAME_OVER);
      },
    })}
      </div>
	  </div>
      <div class="level-footer-container">
      <div class="level-footer">
	  <div style="display: flex; flex-direction: column">
	  <div class="flex items-center" style="align-items: center">
	  <span style="font-size: 1.25rem" class="text-lg" id="level-prompt">$</span>
	    <input style="font-size: 1.25rem" class="input" autoFocus placeholder="${level.placeholder}" />
	  </div>
	  <div class="my-2">
	  <span style="font-size: 1.25rem" class="error"></span>
	  </div>
	  </div>
	  <div class="hint-container">
	  <span style="font-size: 1rem" class="hint-text hint-trigger">[ F1: Mostrar pista ]</span>
	  <div class="hint-column" style="opacity: 0; transition: all 0.25s; font-size: 1rem;">
	  <span class="hint-text">> Conexion establecida con el informante</span>
	  <span class="hint-text">>  "${level.hint}"</span>
	  </div>
	  </div>
	  </div>
	    </div></div>`;

    this.engine.renderScreen(this.root, screen);
    if (level.callback)
      setTimeout(() => level.callback(), DELAY_BEFORE_CALLBACK);
    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

export { LevelScreen };
