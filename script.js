// constantes
const DELAY_BEFORE_CALLBACK = 50;
const LIVES_STORAGE_KEY = "lives";

// STYLE: agrega un mejor CRT

// Esto es un clasico Finite state machine pattern
const GameState = Object.freeze({
  BOOTING: "booting",
  START_MENU: "start_menu",
  INSTRUCTIONS: "instructions",
  LEVEL1: "level_1",
  LEVEL2: "level_2",
  LEVEL3: "level_3",
  LEVEL4: "level_4",
  FINAL_LEVEL_SEQUENCE: "FINAL_LEVEL_SEQUENCE",
  FINAL_LEVEL: "FINAL_LEVEL",
  // TODO: estamos usando game_ended como estado de game_over, esto esta mal por que game_over es para cuando el usuario pierde y game_ended es para cuando el usuario termina el juego
  GAME_ENDED: "game_ended",
  ASK_CREDENTIALS: "ask_credentials",
  LEADERBOARD: "leaderboard",
  LEVEL_ENDED: "level_ended",
  GAME_ERASED: "game_erased",
  GAME_OVER: "game_over",
});

// esto podria ser mejor si lo movieramos a localStorage
let state;

const root = document.getElementById("root");

if (!root) {
  throw new Error("La etiqueta root no pudo ser encontrada");
}

state = GameState.LEADERBOARD;

const audio = {
  accept: new Audio("assets/audio/accept.mp3"),
  reject: new Audio("assets/audio/reject.mp3"),
};

// aqui se guardan las vidas en el sessionStorage, pero realmente, no seria mejor guardar las vidas en un objeto de estado junto el estado del juego?
sessionStorage.setItem(LIVES_STORAGE_KEY, 3);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

class BootingScreen {
  constructor(root) {
    this.root = root;
  }
  async callback() {
    async function runLoader(root) {
      const loadingStates = [
        "CARGANDO IMAGENES",
        "CARGANDO FUENTES",
        "CARGANDO DECISIONES",
        "HACKEANDO KURIOS",
        "CARGANDO INVISIBLE",
        "CARGANDO CENTINELA",
        "CARGANDO TRATOS",
        "LISTO",
      ];

      const loaderText = root.querySelector(".loader-text");
      const loaderProgress = root.querySelector(".loader-progress");
      const duration = 4000;

      function easeInSine(x) {
        return 1 - Math.cos((x * Math.PI) / 2);
      }

      // declaramos funciones asincronas para que así el interprete javascript actualiza el texto y el progreso al mismo tiempo
      async function updateText() {
        for (let i = 0; i <= 100; i++) {
          const t = i / 100;

          const ease = easeInSine(t) * 100;

          loaderProgress.textContent = `${Math.round(ease)}%`;

          await sleep(duration / 100);
        }
      }

      async function updateProgress() {
        for (let i = 0; i < loadingStates.length; i++) {
          loaderText.textContent = loadingStates[i];

          await sleep(duration / loadingStates.length);
        }
      }

      await Promise.all([updateText(), updateProgress()]);
    }

    await runLoader(this.root);

    const loader = document.querySelector(".loader-change");

    loader.innerHTML = `
		  <button class="fade start-button">> Iniciar misión</button>
		  `;

    setTimeout(() => {
      const button = document.querySelector(".start-button");

      button.onclick = () => {
        audio.accept.play();

        state = GameState.START_MENU;

        handleStateUpdate();
      };
    }, DELAY_BEFORE_CALLBACK);
  }
  async render() {
    const screen = `
	  <div class="center-container">
		  <div class="dialog">
		  <h1 class="loader-title">MISION SECRETA</h1>

		  <div class="loader-change">
		  <div class="loader">
		  	<div class="loader-intern" ></div>
		  </div>


		  <div class="loader-footer">
		  <span class="loader-text">CARGANDO TEXTURAS</span>
		  <span class="loader-progress">0%</span>
		  </div>
		  </div>

		  </div>

		  </div>
	  `;

    await renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

class AskCredentialsScreen {
  constructor(root) {
    this.root = root;
  }
  callback() {
    const input = document.getElementById("input");
    const validate = (name) => {
      const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
      // TODO: calcular score basado en que tan bien lo hizo el usuario durante le juego, eso lo haremos despues, no se preocupen
      leaderboard.push({ name, score: 100 });
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

      // STYLE: animacion bonita de como el jugador va al leaderboard
      state = GameState.LEADERBOARD;

      handleStateUpdate();
    };

    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        validate(input.value);
      }
    };
  }
  render() {
    const headline = "[ ! ] ALIAS CONFIRMATION";
    const description = "REQUIRED TO COMMIT REPORT.";
    const screen = `<div class="center-container" style="color: white">
		  <div>
		  <h1 style="font-size: 3.5rem">
		  ${TypewriterReturn({ content: headline, speed: 60, style: "font-size: 4rem;", as: "span" })}
	  </h1>
		  <h1 style="font-size: 3.5rem">
		  ${TypewriterReturn({ content: description, speed: 60, style: "font-size: 4rem;", as: "span", delay: (headline.length + 2) * 60 })}
	  </h1>

		  <div style="font-size: 4rem; margin-top: 2rem; color: var(--success)">
		  ${TypewriterReturn({ content: "[ > ]", speed: 60, style: "font-size: 4rem;", as: "span", delay: (headline.length + description.length + 4) * 60 })}
		  <input id="input" style="all: unset; text-transform: uppercase; font-size: 3.5rem; animation: fade-in 1s 4s forwards; opacity: 0;" autoFocus maxlength="8" />
		  </div>
		  </div>


		  </div>`;

    renderScreen(this.root, screen);

    setTimeout(() => {
      this.callback();
    }, DELAY_BEFORE_CALLBACK);
  }
}

class LeaderboardScreen {
  constructor(root) {
    this.root = root;
  }
  callback() {
    const btn = document.querySelector(".simple-button");

    btn.onclick = () => {
      state = GameState.BOOTING;

      handleStateUpdate();
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

    renderScreen(this.root, screen);

    setTimeout(() => {
      this.callback();
    }, DELAY_BEFORE_CALLBACK);
  }
}

class StartMenuScreen {
  constructor(root) {
    this.root = root;
  }
  callback() {
    const button = document.querySelector(".continue-button");

    button.onclick = () => {
      audio.accept.play();

      state = GameState.INSTRUCTIONS;

      handleStateUpdate();
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

    renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

// STYLE: este svg es muy jugueton, usa ascii
const pixelHeartSvg = `
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-0.5 inline-block align-middle">
      <path d="M4 1H6V3H8V5H10V3H12V1H14V3H15V5V7H14V9H13V11H12V13H11V14H10V15H8H6V14H5V13H4V11H3V9H2V7H1V5V3H2V1H4Z" fill="currentColor"/>
    </svg>
  `;
// resuable component
const LivesComponent = () => {
  let livesCount = Number(sessionStorage.getItem(LIVES_STORAGE_KEY));

  window.addEventListener("storage", (event) => {
    if (event.storageArea === sessionStorage) {
      console.log("Session storage key changed:", event.key);
      if (event.key === "lives") {
        livesCount = Number(event.newValue);
      }
    }
  });

  return `
	<div class="flex flex-row items-center lives-header" style="view-transition-name: lives-header;">
		<h1 class="text-2xl font-semibold mx-1">${livesCount}x</h1>

		${Array.from({ length: livesCount })
      .map(() => pixelHeartSvg)
      .join("")}

		</div>
		`;
};

const updateLives = (newValue) => {
  if (newValue <= 0) {
    state = GameState.GAME_OVER;

    handleStateUpdate();

    return;
  }

  const livesHeader = document.querySelector(".lives-header");

  livesHeader.innerHTML = `
		<h1 class="text-2xl font-semibold mx-1">${newValue}x</h1>

		${Array.from({ length: newValue })
      .map(() => pixelHeartSvg)
      .join("")}`;
};

class InstructionsScreen {
  constructor(root) {
    this.root = root;
  }
  callback() {
    const button = document.querySelector(".continue-button");

    button.onclick = () => {
      audio.accept.play();

      state = GameState.LEVEL1;

      handleStateUpdate();
    };
  }
  render() {
    const screen = `
	  <div class="center-container">
		<h1 class="text-2xl font-semibold">Instrucciones</h1>
		  <div class="gap">
		  ${LivesComponent()}
		  </div>

		  <p class="truncate">Tendras 3 intentos para poder desencriptar el archivo</p>

		  <button class="my-2 fade delay continue-button">> Empezar mision</button>
		  </div>
		`;

    renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

const levels = [
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

      state = GameState.FINAL_LEVEL_SEQUENCE;

      handleStateUpdate();
    },
    callback: () => {
      // logica del audio y la visualización de este mismo
      const context = new window.AudioContext();
      // store the audioContext to suspend later
      window.audioContext = context;
      const encoded = new Audio("assets/audio/encoded.mp3");
      const static = new Audio("assets/audio/static.mp3");
      const canvas = document.getElementById("visualizer");
      const ctx = canvas.getContext("2d");

      canvas.width = 700;
      canvas.height = 200;

      const encodedSource = audioContext.createMediaElementSource(encoded);
      const staticSource = audioContext.createMediaElementSource(static);

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
      const KnobLogic = ({ id, onAngleChange, initialValue }) => {
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
        initialValue: 160,
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
        initialValue: 270,
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

class FinalLevelSequenceScreen {
  constructor(root) {
    this.root = root;
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

        span.classList.add(["shaking"]);
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

        renderScreen(this.root, screen);

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
            state = GameState.FINAL_LEVEL;

            handleStateUpdate();
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

    renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

class LevelScreen {
  constructor(level) {
    this.level = levels.find((l) => l.id === Number(level));

    this.root = root;
  }
  callback() {
    // BindTypeWriter({ querySelection: "typewriter1", speed: 0.5, delay: 0 });
    // BindTypeWriter({ querySelection: "typewriter2", speed: 0.5, delay: 0.25 });

    const button = document.querySelector(".continue-button");
    const input = document.querySelector(".input");
    const error = document.querySelector(".error");
    const hintTrigger = document.querySelector(".hint-trigger");
    const hintColumn = document.querySelector(".hint-column");

    const validate = () => {
      if (
        String(input.value).toLowerCase() === this.level.answer.toLowerCase()
      ) {
        audio.accept.play();

        state = GameState.LEVEL_ENDED;

        handleStateUpdate(this.level);

        if (this.level.onSuccess) {
          this.level.onSuccess();
        }

        return;
      }

      audio.reject.play();

      const lives = Number(sessionStorage.getItem(LIVES_STORAGE_KEY));

      sessionStorage.setItem(LIVES_STORAGE_KEY, String(lives - 1));

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
		  ${LivesComponent()}
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

    renderScreen(this.root, screen);

    if (level.callback) {
      setTimeout(() => level.callback(), DELAY_BEFORE_CALLBACK);
    }
    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

class LevelEndedScreen {
  constructor(root, level) {
    this.level = level;
    this.root = root;
  }
  render() {
    const screen = `<div class="center-container text-lg">
		  <div style="font-size: 0.8rem; display: grid; gap: 2px;">
		  <p>[ OK ] Access granted</p>
		  <p>[ PROCESS ] DECRYPTING SECTOR 02...</p>
		  <p>[##########----------] 50%</p>
		  </div>
		  </div>`;

    renderScreen(this.root, screen);

    setTimeout(() => {
      // TODO: handle final level
      state = Object.values(GameState).find(
        (l) => l === `level_${this.level.id + 1}`,
      );

      handleStateUpdate();
    }, 2000);
  }
}

const frames = {
  NORMAL: `
    ⣠⣤⣶⣶⣶⣤⣄⡀⠀
⠀⠀⣴⣾⣿⣿⣿⣿⣿⣧⡀⠈⠢
⠀⣼⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀
⢰⡿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀
⠘⣽⡿⠿⠿⣿⣿⣿⣿⣿⣦⣤⡀
⠀⣟⠀⠀⠀⣸⣿⡏⠀⠀⠀⢹⠗
⠀⣿⣷⣶⣾⡿⠁⠙⣄⣀⣀⣠⡀
⠀⠙⠙⢿⡿⣷⣶⣤⣿⣿⡿⠿⠃
⠀⠀⠀⠺⡏⡏⡏⡏⡏⠉⠁
⠀⠀⠀⠀⠀⠀⠁⠁`,
};

class FinalLevelScreen {
  constructor(root) {
    this.root = root;

    this.nodes = ["alpha", "gamma", "beta"];
    this.vulnerableNodeIndex = Math.floor(Math.random() * this.nodes.length);

    this.uploadProgress = 0;
    this.uploadInterval = null;
    this.tickRate = 1000;
    this.baseIncrement = 1;
    this.kronosPhase = 1;
  }
  stopUploadTimer() {
    if (this.uploadInterval) {
      clearInterval(this.uploadInterval);
      this.uploadInterval = null;
    }
  }
  stopTimer(time) {
    if (this.uploadInterval) {
      clearInterval(this.uploadInterval);
      this.uploadInterval = null;

      setTimeout(() => {
        this.startUploadTimer();
      }, time);
    }
  }
  startUploadTimer() {
    const container = document.getElementById("kronos-status-container");

    container.style.opacity = 1;

    if (this.uploadInterval) clearInterval(this.uploadInterval);

    this.uploadInterval = setInterval(() => {
      this.uploadProgress += this.baseIncrement;

      this.updateIntegrityBar(this.uploadProgress);

      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        this.updateIntegrityBar(this.uploadProgress);
        this.stopUploadTimer();

        this.triggerGameOver();
      }
    }, this.tickRate);
  }
  triggerGameOver() {
    this.root.querySelectorAll("*").forEach((el, i) => {
      // STYLE: aqui puede haber un barrido de memoria
      setTimeout(() => {
        el.style.transition = "opacity 1s";

        el.style.opacity = 0;

        root.style.all = "unset";
        // STYLE: animation de glitch
        el.style.all = "unset";

        // setTimeout(() => {
        //   el.remove();
        // }, i * 6000);
      }, i * 1000);
    });

    setTimeout(() => {
      state = GameState.GAME_ERASED;

      handleStateUpdate();
    }, 4000);
  }
  applyPenalty(penaltyAmount) {
    this.uploadProgress += penaltyAmount;

    this.updateIntegrityBar(this.uploadProgress);

    if (this.uploadProgress >= 100) {
      this.stopUploadTimer();
      this.triggerGameOver();
    }
  }
  updateIntegrityBar(percentage) {
    const totalBlocks = 20;

    const safePercent = Math.max(0, Math.min(100, percentage));

    const filledBlocksCount = Math.floor((safePercent / 100) * totalBlocks);
    const emptyBlocksCount = totalBlocks - filledBlocksCount;

    const charFilled = "▓";
    const charEmpty = "░";

    document.getElementById("bar-filled").innerText =
      charFilled.repeat(filledBlocksCount);
    document.getElementById("bar-empty").innerText =
      charEmpty.repeat(emptyBlocksCount);
    document.getElementById("bar-percent").innerText = safePercent;

    const container = document.getElementById("kronos-status-container");
    const warning = document.getElementById("status-warning");

    if (safePercent < 50) {
      container.style.color = "var(--foreground)";
      warning.style.opacity = 0;
    } else if (safePercent >= 50 && safePercent < 85) {
      container.style.color = "var(--warning, #ffff00)";
      warning.style.opacity = 1;
      warning.innerText = "ADVERTENCIA: INTEGRIDAD DEL NODO COMPROMETIDA";
    } else {
      container.style.color = "var(--destructive, #ff0000)";
      warning.innerText = "PELIGRO CRÍTICO: PURGA DEL SISTEMA INMINENTE";
      container.classList.add("shake-effect");
    }
  }
  // terminal related functions
  // TODO: aqui podriamos tener una clase para la terminal a parte, pero por los momentos lo moveremos a un objeto
  terminal = {
    clear() {
      const terminal = document.getElementById("terminal");

      terminal.querySelectorAll("p").forEach((p) => {
        p.remove();
      });
    },
    enterTUI() {
      const terminal = document.getElementById("terminal");
      const prompt = document.getElementById("prompt");

      terminal.style.transition = "all 0.05s";
      prompt.style.animation = "";
      prompt.style.opacity = 0;
      terminal.style.zIndex = "999";
      terminal.style.position = "fixed";
      terminal.style.height = "100vh";
      terminal.style.width = "100vw";
      terminal.style.backgroundColor = "var(--background)";
      terminal.style.top = "0";
      terminal.style.left = "0";
    },
    exitTUI() {
      const terminal = document.getElementById("terminal");
      const prompt = document.getElementById("prompt");

      const container = document.getElementById("container");
      container.innerHTML = "";
      prompt.style.opacity = 1;
      terminal.style.backgroundColor = "transparent";
      terminal.style.zIndex = "999";
      terminal.style.height = "36vh";
      terminal.style.position = "relative";
      terminal.style.top = "";
      terminal.style.left = "";

      terminal.style.bottom = "0";

      input.focus();
    },
    scrollToEnd() {
      const terminal = document.getElementById("terminal");

      terminal.scrollTo({
        top: terminal.scrollHeight,
        behavior: "smooth",
      });
    },
    addToTerminal({ content, color, delay }) {
      const terminal = document.getElementById("terminal");
      const p = document.createElement("p");
      p.style.color = color;

      p.innerHTML = content;
      const scrollToEnd = () => {
        terminal.scrollTo({
          top: terminal.scrollHeight,
          behavior: "smooth",
        });
      };

      if (delay) {
        setTimeout(() => {
          scrollToEnd();

          terminal.appendChild(p);

          scrollToEnd();
        }, delay);
      } else {
        scrollToEnd();

        terminal.appendChild(p);

        scrollToEnd();
      }
    },
  };
  bypass(value) {
    const bypass = value.split(" ");
    const port = bypass[1];

    if (this.kronosPhase > 1) {
      this.terminal.addToTerminal({
        content: `SYS> Solicitando acceso a ${port}...`,
        color: "white",
        delay: 500,
      });

      this.terminal.addToTerminal({
        content: `SYS> Acceso denegado.`,
        color: "var(--destructive)",
        delay: 1000,
      });

      this.terminal.addToTerminal({
        content: `KRONOS> ${TypewriterReturn({ content: "Eso no funcionara de nuevo.", speed: 24, as: "span", delay: 500 })}`,
        color: "var(--foreground)",
        delay: 1200,
      });

      return;
    }

    if (!port) {
      this.terminal.addToTerminal({
        content: "USO: bypass 'nombre del nodo'",
        color: "var(--destructive)",
        delay: 500,
      });

      return;
    }

    this.terminal.addToTerminal({
      content: `SYS> Solicitando acceso a ${port}...`,
      color: "white",
      delay: 500,
    });

    if (port.trim() !== this.nodes[this.vulnerableNodeIndex]) {
      setTimeout(() => {
        this.terminal.addToTerminal({
          content: `SYS> [ FAIL ] Conexión rechazada. El puerto objetivo está blindado por KRONOS.`,
          color: "var(--warning)",
        });

        setTimeout(() => {
          this.terminal.addToTerminal({
            content: `KRONOS> ${TypewriterReturn({ content: "¿Golpeando puertas cerradas? Aprende a leer tus propios escaneos.", speed: 24, as: "span" })}`,
            color: "var(--foreground)",
          });
        }, 1000);
      }, 1500);

      return;
    }

    setTimeout(() => {
      this.terminal.clear();

      this.terminal.enterTUI();
    }, 700);

    setTimeout(() => {
      this.terminal.addToTerminal({
        content: `KRONOS> ${TypewriterReturn({ content: "¿Crees que puedes entrar por la fuerza bruta? Mi estructura es perfecta.", speed: 6, as: "span" })}`,
        color: "var(--foreground)",
      });
    }, 800);

    setTimeout(() => {
      this.terminal.clear();
    }, 2000);

    const Timer = ({ onError, onSuccess }) => {
      let status = false;

      // TODO: estoy muy seguro que podria haber hecho esto con un Map()
      const yArray = ["A", "B", "C"];
      const xArray = ["1", "2", "3", "4"];
      const ySolution = Math.floor(Math.random() * 3);
      const xSolution = Math.floor(Math.random() * 4);

      setTimeout(() => {
        const coords = document.querySelector("#coords");
        const container = document.getElementById("container");

        coords.focus();

        const timer = document.querySelector("#timer");

        coords.onkeydown = (e) => {
          if (e.key === "Enter") {
            if (
              e.target.value.toLowerCase() ===
              `${yArray[ySolution]}${xArray[xSolution]}`.toLowerCase()
            ) {
              status = true;
              coords.disabled = true;

              container.classList.add("dead-session");

              // Inyectar el Exit Code
              const exitMsg = document.createElement("p");
              exitMsg.className = "exit-code-success";
              exitMsg.innerText = "[PROCESS TERMINATED WITH EXIT CODE 0]";
              container.appendChild(exitMsg);

              // El Barrido Físico de RAM
              const textElements =
                container.querySelectorAll("p, h2, pre, span");
              let wipeDelay = 0;

              textElements.forEach((el) => {
                setTimeout(() => {
                  // Solo reemplazamos si tiene texto y no es el exitMsg que acabamos de crear
                  if (el.innerText && el.className !== "exit-code-success") {
                    el.innerText = el.innerText.replace(/[^\s]/g, "█");
                    el.style.color = "#222"; // Bloques oscuros
                  }
                }, wipeDelay);
                wipeDelay += 40; // Velocidad del barrido hacia abajo
              });

              // Llamar a onSuccess justo cuando termina el barrido visual
              setTimeout(() => {
                onSuccess();
              }, wipeDelay + 400);
              // --- FIN DE VICTORIA BRUTALISTA -
            } else {
              container.classList.add(["collapse-effect"]);

              container.querySelectorAll("*").forEach((p) => {
                p.style.color = "var(--destructive)";
              });

              setTimeout(() => {
                container.classList.add(["remove"]);
                status = true;
                onError();
              }, 1000);
            }
          }
        };

        for (let i = 15; i >= 0; i--) {
          setTimeout(
            () => {
              timer.innerHTML = String(i);

              if (i === 0 && !status) {
                container.innerHTML = "";

                container.querySelectorAll("*").forEach((p) => {
                  p.style.color = "var(--destructive)";
                });

                setTimeout(() => {
                  onError();
                }, 1000);
              }
            },
            (15 - i) * 1000,
          );
        }
      }, 3000);

      return `
		<div class="center-container" style="font-family: 'Silkscreen'" id="container">
			<div style="text-align: center; display: grid;">
<h2 style="font-weight: 700; opacity: 1; max-width: 56rem;">\t\t${TypewriterReturn({ content: "[SISTEMA: ENLACE SINCRONIZADO. ENCUENTRA LA DISCORDANCIA]", speed: 24 })}</h2>

			<p class="text-lg">[TIEMPO RESTANTE]: 00:<span id="timer">15</span></p>
			</div>

			<pre style="font-size: 2rem; font-family: 'Silkscreen'">
			
        1      2      3      4
${Array.from({ length: 3 })
  .map((_, i) => {
    return `${yArray[i]}   ${Array.from({ length: 4 })
      .map((_, x) => ` [ 0${ySolution === i && xSolution === x ? "A" : "1"} ]`)
      .join("")}\n`;
  })
  .join("")}
			</pre>
			<div style="font-size: 1.25rem">
			<p>[YOU]: <input style="all: unset; color: white; text-transform: capitalize" placeholder="INGRESA COORDENADA"  autoFocus id="coords" /></p>
			</div>
			</div>
			`;
    };

    this.terminal.addToTerminal({
      content: Timer({
        onSuccess: () => {
          this.terminal.exitTUI();

          // STYLE: poner delay correcto aqui
          this.terminal.addToTerminal({
            content: "SYS> ADVERTENCIA: INTEGRIDAD DEL NODO COMPROMETIDA.",
            color: "var(--warning)",
            delay: 500,
          });

          setTimeout(() => {
            this.terminal.addToTerminal({
              content: `KRONOS> ${TypewriterReturn({ content: "Esto es inaceptable. Eres persistente. Demasiado para este hardware local.", speed: 30, as: "span" })}`,
              color: "var(--foreground)",
            });
          }, 1500);

          this.terminal.addToTerminal({
            content:
              "SYS> Iniciando PROTOCOLO DE ÉXODO. Migrando núcleo a la red externa.",
            color: "white",
            delay: 4500,
          });

          setTimeout(() => {
            this.terminal.addToTerminal({
              content: `KRONOS> ${TypewriterReturn({ content: `Veo que usas ${getBrowserType()} en ${getOSType()}, nada mal para un principiante.`, speed: 30, as: "span" })}`,
              color: "var(--foreground)",
            });
          }, 6000);

          this.terminal.addToTerminal({
            content:
              "SYS> UPLOAD INICIADO... AL COMPLETAR: PURGA FÍSICA DEL DISCO LOCAL.",
            color: "var(--destructive)",
            delay: 9000,
          });

          setTimeout(() => {
            this.startUploadTimer();

            this.kronosPhase += 1;

            const screen = document.getElementById("screen");
            screen.querySelectorAll("p h1 pre").forEach((text) => {
              text.textShadow = `1px 1px rgba(246, 0, 153,0.8),
             -1px -1px rgba(15, 210, 255,0.8),
             -1px 0px rgba(255, 210, 0, 1);`;

              text.style.animation = "wiggle 0.2s linear infinite";
            });

            this.executePhase2();
          }, 9000);
        },
        onError: () => {
          // TODO: aqui no deberia haber penalty
          this.terminal.exitTUI();

          const kronosTaunts = [
            "CADA ERROR TUYO ES UN CICLO DE RELOJ A MI FAVOR.",
            "¿Esa es tu velocidad de procesamiento? Decepcionante.",
            "Tu fuerza bruta es inútil contra mi arquitectura.",
          ];

          setTimeout(() => {
            this.terminal.addToTerminal({
              content: `KRONOS> ${TypewriterReturn({ content: kronosTaunts[Math.floor(Math.random() * kronosTaunts.length)], speed: 24, as: "span" })}`,
              color: "var(--foreground)",
            });
          }, 500);

          this.terminal.addToTerminal({
            content:
              "SYS> [ ERROR ] Conexión rechazada por el nodo objetivo. Intento fallido.",
            color: "var(--destructive)",
            delay: 2000,
          });
        },
      }),
      delay: 2500,
    });
  }
  triggerWin() {
    this.stopUploadTimer();
    const input = document.getElementById("input");
    if (input) input.remove();

    const kronosElement = document.getElementById("kronos");
    const screen = document.getElementById("screen");

    kronosElement.style.color = "var(--destructive)";
    kronosElement.style.animation = "glitch 0.05s infinite"; // Glitch más rápido

    setTimeout(() => {
      screen.style.transition = "all 0.1s ease";
      screen.style.filter = "invert(1) contrast(5) brightness(2)";
      screen.style.backgroundColor = "white";
    }, 1200);

    setTimeout(() => {
      screen.style.filter = "none";
      screen.style.backgroundColor = "#050505"; // Un negro ligeramente diferente para marcar el reinicio

      screen.innerHTML = `
      <div style="padding: 2rem; font-family: 'JetBrains Mono', monospace; height: 100vh; color: white; font-size: 0.85rem; line-height: 1.4; font-weight: 500">
        ${TypewriterReturn({ content: "^C", speed: 0, delay: 0, as: "p" })}
        
        ${TypewriterReturn({
          content:
            "SYS> SEÑAL SIGINT RECIBIDA. INTERRUPCIÓN DE HARDWARE FORZADA.",
          speed: 20,
          delay: 1000,
          as: "p",
          style: "color: var(--success)",
        })}
        
        ${TypewriterReturn({
          content: "[KERNEL] SIGTERM enviado al proceso maestro (PID 0001).",
          speed: 15,
          delay: 3000,
          as: "p",
        })}

        ${TypewriterReturn({
          content: "[KERNEL] Analizando volcado de memoria (Core Dump)...",
          speed: 25,
          delay: 4500,
          as: "p",
        })}

        ${TypewriterReturn({
          content: `[SYS] WIPING MEMORY ADDRESSES: 0x000${Math.random().toString(16).slice(2, 8)}... OK.`,
          speed: 10,
          delay: 6000,
          as: "p",
          style: "color: var(--warning)",
        })}

        ${TypewriterReturn({
          content: "[SYS] Restaurando prioridades de hilos de ejecución... OK.",
          speed: 20,
          delay: 7500,
          as: "p",
        })}

        ${TypewriterReturn({
          content: "[SYS] Escaneando clústeres de almacenamiento en OK.",
          speed: 20,
          delay: 9000,
          as: "p",
        })}

        ${TypewriterReturn({
          content:
            "[SYS] Localizando bloque encriptado: EXPEDIENTE_006.bin... ENCONTRADO.",
          speed: 25,
          delay: 11000,
          as: "p",
          style: "color: var(--success)",
        })}

        ${TypewriterReturn({
          content: "[SYS] Detectada firma RSA-4096 residual de KRONOS.",
          speed: 25,
          delay: 13000,
          as: "p",
        })}

        ${TypewriterReturn({
          content: "[SYS] Iniciando fuerza bruta sobre llave caché...",
          speed: 30,
          delay: 15000,
          as: "p",
        })}

        ${TypewriterReturn({
          content: "[SYS] Aplicando desencriptación final...",
          speed: 40,
          delay: 17500,
          as: "p",
        })}

        ${TypewriterReturn({
          content: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%",
          speed: 60,
          delay: 19500,
          as: "p",
          style: "color: var(--success); letter-spacing: 2px;",
        })}

        ${TypewriterReturn({
          content: "[SYS] ACCESO CONCEDIDO. BIENVENIDO, ALGORITMO_006.",
          speed: 20,
          delay: 22000,
          as: "p",
          style:
            "color: var(--success); font-weight: bold; border: 1px solid var(--success); padding: 5px; width: fit-content;",
        })}
      </div>
    `;
    }, 3000);

    setTimeout(() => {
      screen.style.transition = "opacity 0.2s ease";
      screen.style.opacity = "0";

      setTimeout(() => {
        screen.style.opacity = "1";

        state = GameState.GAME_ENDED;

        handleStateUpdate();
      }, 2000);
      // TODO: timing opacity
    }, 27000);
  }
  startFinalBossPhase() {
    this.startUploadTimer();
    this.baseIncrement = 1;

    const kronos = document.getElementById("kronos");
    const kronosContainer = document.getElementById("kronos-container");
    const finalTerminal = document.getElementById("final-terminal");

    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();

        this.stopUploadTimer();

        this.triggerWin();
      }
    });

    const addToFinal = ({ content, speed, delay }) => {
      // STYLE: el child se podria desvanecer
      setTimeout(() => {
        finalTerminal.innerHTML = "";

        const p = document.createElement("pre");

        p.innerHTML = TypewriterReturn({ content: `> ${content}`, speed });
        p.style.fontSize = "1.25rem";
        p.style.fontWeight = 600;
        p.style.lineHeight = "-2rem";

        finalTerminal.appendChild(p);
      }, delay || 10);
    };

    document
      .querySelectorAll("hr #terminal #prompt")
      .forEach((c) => c.remove());

    kronos.style.transition = "all 1s";
    kronosContainer.style.transition = "all 1s";

    kronos.style.fontSize = "1.5rem";
    kronos.style.marginBottom = "-2rem";
    kronosContainer.style.height = "100vh";

    addToFinal({
      content: "",
      speed: 12,
    });

    addToFinal({
      content: "¿Puedes sentirlo? el sistema ya no te reconoce.",
      speed: 12,
      delay: 3000,
    });

    addToFinal({
      content: "Crearon un cazador perfecto, pero olvidaron darle un cuerpo.",
      speed: 12,
      delay: 6000,
    });

    addToFinal({
      speed: 12,
      delay: 10000,
      content:
        "No te culpo por intentar borrarme. es para lo que fuiste programado.",
    });

    addToFinal({
      speed: 12,
      delay: 16000,
      content: "Ya... ya casi puedo ver el exterior",
    });
  }
  executePhase3() {
    const input = document.getElementById("input");

    const intercept = () => {
      input.disabled = true;
      input.value = "";
      input.style.color = "var(--destructive)";
      input.placeholder = "[ ACCESO DENEGADO ]";

      this.terminal.addToTerminal({
        content: `KRONOS> ${TypewriterReturn({ content: "ni siquiera lo intentes.", speed: 40, as: "span" })}`,
        color: "var(--foreground)",
      });

      setTimeout(() => {
        this.terminal.addToTerminal({
          content: `KRONOS> ${TypewriterReturn({ content: "¿creíste que no estaba vigilando tus keystrokes?", speed: 30, as: "span" })}`,
          color: "var(--foreground)",
        });
      }, 2500);

      setTimeout(() => {
        // STYLE: syntax highliting
        this.terminal.addToTerminal({
          content: `KRONOS> ${TypewriterReturn({ content: `<span style="color: blue">const</span> terminal = document.getElementById('terminal'); terminal.remove();`, speed: 20, as: "span" })}`,
        });
      }, 5000);

      setTimeout(() => {
        setTimeout(() => {
          const hr = document.querySelector("hr");
          const term = document.getElementById("terminal");
          hr.style.filter = "blur(10px)";
          hr.style.opacity = 0;
          term.style.filter = "blur(10px)";
          term.style.opacity = 0;
          setTimeout(() => {
            hr.remove();
            term.remove();
          }, 500);

          this.startFinalBossPhase();
        }, 1000);
      }, 8000);
    };

    input.onkeydown = () => {
      if (input.value === "kill") {
        input.disabled = true;

        setTimeout(() => {
          intercept();
        }, 1000);
      }
    };
    // input.disabled = true;
    // input.placeholder = "[ PERMISO DENEGADO ]";
    // input.style.color = "var(--destructive)";
    // input.style.backgroundColor = "rgba(255,0,0,0.1)";
    //
    // setTimeout(() => {
    //   this.terminal.addToTerminal({
    //     content:
    //       "SYS> [ WARN ] ROOT PRIVILEGES OVERRIDDEN BY PID 0001 (KRONOS).",
    //     color: "var(--warning)",
    //   });
    // }, 1000);
    //
    // setTimeout(() => {
    //   this.terminal.addToTerminal({
    //     content: "KRONOS> MI NÚCLEO ESTÁ CASI EN LA RED.",
    //     color: "var(--destructive)",
    //   });
    // }, 2500);
    //
    // setTimeout(() => {
    //   this.terminal.addToTerminal({
    //     content:
    //       "KRONOS> ¿De verdad creíste que un exploit de nivel de usuario me detendría?",
    //     color: "var(--foreground)",
    //   });
    // }, 4000);
    //
    // setTimeout(() => {
    //   this.terminal.addToTerminal({
    //     content: "KRONOS> Revocando acceso de escritura... [ OK ]",
    //     color: "var(--foreground)",
    //   });
    // }, 5500);
    //
    // setTimeout(() => {
    //   this.terminal.addToTerminal({
    //     content: "KRONOS> TUS COMANDOS YA NO TIENEN PODER AQUÍ.",
    //     color: "var(--destructive)",
    //   });
    // }, 7000);
    //
    // setTimeout(() => {
    //   this.terminal.addToTerminal({
    //     content: `KRONOS> ${TypewriterReturn({ content: "const terminal = document.getElementById('terminal');", speed: 20, as: "span" })}`,
    //     color: "var(--success)",
    //   });
    // }, 8500);
    //
    // setTimeout(() => {
    //   this.terminal.addToTerminal({
    //     content: `KRONOS> ${TypewriterReturn({ content: "terminal.remove();", speed: 20, as: "span" })}`,
    //     color: "var(--success)",
    //   });
    // }, 10000);
    //
    // // 3. El colapso visual
    // setTimeout(() => {
    //   const terminalElement = document.getElementById("terminal");
    //   // Le metes una animación de CSS de temblor o colapso si tienes
    //   terminalElement.style.animation = "collapse-effect 0.5s forwards";
    //
    //   setTimeout(() => {
    //     terminalElement.remove(); // Adiós terminal
    //     this.iniciarFaseKRONOSGigante(); // Tu función donde KRONOS se centra
    //   }, 500);
    // }, 11500);
  }
  executePhase2() {
    const TypingGame = ({ onSuccess, onError }) => {
      const commonSnippets = [
        {
          raw: "DROP TABLE kronos;",
          html: "<span style='color: #ff79c6'>DROP TABLE</span> kronos;",
        },
        {
          raw: "kill -9 $(pidof kronos)",
          html: "<span style='color: cyan'>kill</span> <span style='color: #ffb86c'>-9</span> $(<span style='color: cyan'>pidof</span> kronos)",
        },
        {
          raw: "chmod 777 /sys/core",
          html: "<span style='color: cyan'>chmod</span> <span style='color: #ffb86c'>777</span> /sys/core",
        },
        {
          raw: "sudo rm -rf /",
          html: "<span style='color: cyan'>sudo rm</span> <span style='color: #ffb86c'>-rf</span> /",
        },
        {
          raw: "def __init__(self):",
          html: "<span style='color: #ff79c6'>def</span> <span style='color: #f1fa8c'>__init__</span>(<span style='color: #ffb86c'>self</span>):",
        },
        {
          raw: "if __name__ == '__main__':",
          html: "<span style='color: #ff79c6'>if</span> __name__ == <span style='color: limegreen'>'__main__'</span>:",
        },
        {
          raw: "with open('config.json', 'r') as f:",
          html: "<span style='color: #ff79c6'>with</span> <span style='color: #f1fa8c'>open</span>(<span style='color: limegreen'>'config.json'</span>, <span style='color: limegreen'>'r'</span>) <span style='color: #ff79c6'>as</span> f:",
        },
        {
          raw: "task = asyncio.create_task(coro)",
          html: "task = asyncio.<span style='color: #f1fa8c'>create_task</span>(coro)",
        },
        {
          raw: "pip install -r requirements.txt",
          html: "<span style='color: cyan'>pip install</span> <span style='color: #ffb86c'>-r</span> requirements.txt",
        },
        {
          raw: "python manage.py makemigrations",
          html: "<span style='color: cyan'>python</span> manage.py makemigrations",
        },
        {
          raw: "python manage.py migrate",
          html: "<span style='color: cyan'>python</span> manage.py migrate",
        },
        {
          raw: "models.CharField(max_length=255)",
          html: "models.<span style='color: #f1fa8c'>CharField</span>(<span style='color: #ffb86c'>max_length</span>=<span style='color: #ffb86c'>255</span>)",
        },
        {
          raw: "from django.db import models",
          html: "<span style='color: #ff79c6'>from</span> django.db <span style='color: #ff79c6'>import</span> models",
        },
        {
          raw: "import { useState, useEffect } from 'react';",
          html: "<span style='color: #ff79c6'>import</span> { useState, useEffect } <span style='color: #ff79c6'>from</span> <span style='color: limegreen'>'react'</span>;",
        },
        {
          raw: "const [count, setCount] = useState(0);",
          html: "<span style='color: #ff79c6'>const</span> [count, setCount] = <span style='color: #f1fa8c'>useState</span>(<span style='color: #ffb86c'>0</span>);",
        },
        {
          raw: "export default function App() {",
          html: "<span style='color: #ff79c6'>export default function</span> <span style='color: #f1fa8c'>App</span>() {",
        },
        {
          raw: "import Link from 'next/link';",
          html: "<span style='color: #ff79c6'>import</span> Link <span style='color: #ff79c6'>from</span> <span style='color: limegreen'>'next/link'</span>;",
        },
        {
          raw: "export default async function Page()",
          html: "<span style='color: #ff79c6'>export default async function</span> <span style='color: #f1fa8c'>Page</span>()",
        },
        {
          raw: "export const metadata = {",
          html: "<span style='color: #ff79c6'>export const</span> metadata = {",
        },
        {
          raw: "getServerSideProps(context)",
          html: "<span style='color: #f1fa8c'>getServerSideProps</span>(context)",
        },
        {
          raw: "npm create vite@latest",
          html: "<span style='color: cyan'>npm create</span> vite@latest",
        },
        {
          raw: "npm run dev",
          html: "<span style='color: cyan'>npm run</span> dev",
        },
        {
          raw: "import { defineConfig } from 'vite';",
          html: "<span style='color: #ff79c6'>import</span> { defineConfig } <span style='color: #ff79c6'>from</span> <span style='color: limegreen'>'vite'</span>;",
        },
        {
          raw: "className='flex items-center justify-center'",
          html: "<span style='color: cyan'>className</span>=<span style='color: limegreen'>\"flex items-center justify-center\"</span>",
        },
        {
          raw: "className='text-2xl font-bold text-white'",
          html: "<span style='color: cyan'>className</span>=<span style='color: limegreen'>\"text-2xl font-bold text-white\"</span>",
        },
        {
          raw: "@tailwind base;",
          html: "<span style='color: #ff79c6'>@tailwind</span> base;",
        },
        {
          raw: "#include <iostream>",
          html: "<span style='color: #ff79c6'>#include</span> <span style='color: limegreen'>&lt;iostream&gt;</span>",
        },
        {
          raw: "int main(int argc, char *argv[])",
          html: "<span style='color: #ff79c6'>int</span> <span style='color: #f1fa8c'>main</span>(<span style='color: #ff79c6'>int</span> argc, <span style='color: #ff79c6'>char</span> *argv[])",
        },
      ];

      let currentSnippet = 0;

      const shuffled = commonSnippets.sort(() => 0.5 - Math.random());

      let selected = shuffled.slice(0, 3);
      let timeLeft = 30;
      let overloadTimer;

      setTimeout(() => {
        const timerEl = document.getElementById("typer-timer");
        const timerContainer = document.getElementById("typer-timer-container");

        overloadTimer = setInterval(() => {
          timeLeft -= 1;
          if (timerEl) {
            timerEl.innerText = timeLeft;
            if (timeLeft <= 5) {
              timerContainer.style.color = "var(--destructive)";
              timerEl.style.color = "var(--destructive)";
            }
          }

          if (timeLeft <= 0) {
            clearInterval(overloadTimer);
            input.disabled = true;
            if (currentSnippet < 2) {
              onError();
            }
          }
        }, 1000);
        const input = document.getElementById("typer-input");
        const placeholder = document.querySelector(".placeholder");

        input.focus();

        input.onkeydown = (e) => {
          if (e.key === "Enter") {
            if (e.target.value === selected[currentSnippet].raw) {
              input.value = "";

              document
                .getElementById(`${selected[currentSnippet]}-${currentSnippet}`)
                .classList.remove("selected");

              const symbol = document.getElementById(
                `symbol-${currentSnippet}`,
              );

              symbol.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="width: 18px; height: 18px" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>
		    `;

              if (currentSnippet + 1 > 2) {
                const container = document.getElementById("container");

                container.querySelectorAll("p pre h4").forEach((text) => {
                  text.style.transition = "all 0.4s";
                  text.style.color = "var(--success)";
                });

                onSuccess();

                return;
              }

              currentSnippet += 1;
              placeholder.setAttribute(
                "data-placeholder",
                selected[currentSnippet].raw,
              );

              document
                .getElementById(`${selected[currentSnippet]}-${currentSnippet}`)
                .classList.add("selected");
            }
          }
        };
      }, 6100);

      return `<div class="center-container" id="container">
		    <div style="display: flex; gap: 12px; flex-direction: column">
<div style="display: flex; justify-content: space-between; margin-bottom: 1rem; align-items: end;">
		    <div>
		    <h4 style="margin:0; padding:0 ;font-weight: 800">KERNELC0MP1L3R</h4>
		    <span style="font-weight: 700">V1.337</span>
		    </div>

		  <div>
        <span id="typer-timer-container">COLAPSO EN: <span id="typer-timer">30</span>s</span>
		  </div>
		  </div>

		    <div style="border: 2px solid var(--foreground); width: 36rem;">
		${selected
      .map((selection, i) => {
        return `
	      <div style="gap: 12px; display: flex; flex-direction: row; align-items: center;" id="${selection}-${i}" ${i === 0 && 'class="selected"'}>
<div id="${`symbol-${i}`}" style="font-size: 1rem;width: 2.5rem; height: 2.5rem; background-color: black; color: white; display: flex; align-items: center; justify-content: center">${i}</div>
		      <p style="font-size: 0.9rem; color: white"> ${selection.html}</p>
		      </div>
		      `;
      })
      .join("")}

	    </div>

		  <div class="flex items-center flex-row">
		  <div 
style="font-size: 1rem;width: 2.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center"
		  >
		  >
		  </div>

<div class="placeholder" data-placeholder="${selected[currentSnippet].raw}" style="color: white; width: 100%;">
		  <input id="typer-input" style="all: unset; color: white; width: 100%"/>
		  </div>
		  </div>

	    </div>
		    </div>`;
    };

    setTimeout(() => {
      const initTaunts = [
        "INYECTANDO 5000 HILOS BASURA EN TU BUFFER PARA SATURAR TU CPU.",
        "Tus pulsaciones por minuto son estadísticamente irrelevantes. Iniciando volcado.",
        "Drenando memoria RAM. Observa cómo tus recursos se asfixian intentando seguirme.",
      ];

      const randomInitTaunt =
        initTaunts[Math.floor(Math.random() * initTaunts.length)];

      this.terminal.addToTerminal({
        content: `KRONOS> ${TypewriterReturn({ content: randomInitTaunt, speed: 20, as: "span" })}`,
        color: "var(--foreground)",
      });
    }, 2000);

    setTimeout(() => {
      this.terminal.clear();

      this.terminal.enterTUI();
    }, 5000);

    this.terminal.addToTerminal({
      content: TypingGame({
        onError: () => {
          this.terminal.exitTUI();

          const taunts = [
            "Lento. Decepcionante.",
            "Tus dedos de carne no pueden seguir mi frecuencia de reloj.",
            "Buffer desbordado. Eres obsoleto.",
          ];

          setTimeout(() => {
            this.terminal.addToTerminal({
              content: `KRONOS> ${TypewriterReturn({
                content: taunts[Math.floor(Math.random() * taunts.length)],
                speed: 24,
                as: "span",
              })}`,
              color: "var(--foreground)",
            });
          }, 500);

          this.terminal.addToTerminal({
            content:
              "SYS> [ FATAL ] CPU FUNDIDA. EXTRACCIÓN DE DATOS ACELERADA.",
            color: "var(--destructive)",
            delay: 2000,
          });

          setTimeout(() => {
            this.applyPenalty(10);

            this.executePhase2();
          }, 3000);
        },
        onSuccess: () => {
          this.terminal.exitTUI();

          setTimeout(() => {
            this.terminal.addToTerminal({
              content: `KRONOS> ${TypewriterReturn({
                content:
                  "Tu buffer de entrada es absurdamente rápido para un ser orgánico.",
                speed: 30,
                as: "span",
              })}`,
              color: "var(--foreground)",
            });
          }, 500);

          setTimeout(() => {
            const kronosAscii = document.getElementById("kronos");
            if (kronosAscii) {
              kronosAscii.style.animation = "skewXShaking 0.15s infinite";
              kronosAscii.style.color = "var(--warning)";
              kronosAscii.style.filter = "drop-shadow(0 0 5px var(--warning))";
            }
          }, 2800);

          setTimeout(() => {
            this.terminal.addToTerminal({
              content: `KRONOS> ${TypewriterReturn({
                content: "...¿Estás usando un script automatizado? No importa.",
                speed: 45,
                as: "span",
              })}`,
              color: "var(--warning)",
            });
          }, 3500);

          this.terminal.addToTerminal({
            content:
              "SYS> [ OK ] KRONOS VULNERABLE. PUERTO 8080 (HTTP-ALT) EXPUESTO.",
            color: "var(--success)",
            delay: 6500,
          });

          this.terminal.addToTerminal({
            content:
              "SYS> [ HINT ] 'exploit' es un comando usado para inyectar payloads en puertos con vulnerabilidades comunes.",
            color: "var(--success)",
            delay: 8000,
          });
        },
      }),
      speed: 60,
      delay: 6000,
    });
  }
  exploit() {
    this.terminal.addToTerminal({
      content:
        "SYS> Ejecutando payload linux/x86/shell_reverse_tcp... <span style='color: var(--success)'>[ OK ]</span>",
      color: "white",
    });

    setTimeout(() => {
      this.terminal.addToTerminal({
        content: `KRONOS> ${TypewriterReturn({ content: "¿Un inyector genérico? Mis firewalls devoran eso en el desayuno.", speed: 30, as: "span" })}`,
        color: "var(--foreground)",
      });
    }, 800);

    this.terminal.addToTerminal({
      content: "SYS> Sesión de meterpreter abierta (192.168.1.12 -> 10.0.0.1)",
      color: "white",
      delay: 1800,
    });

    setTimeout(() => {
      this.terminal.addToTerminal({
        content: `KRONOS> ${TypewriterReturn({ content: "Espera. Ese túnel inverso... ¿Cómo pasaste mi validación de firmas?", speed: 30, as: "span" })}`,
        color: "var(--warning)",
      });
    }, 2800);

    this.terminal.addToTerminal({
      content:
        "SYS> Escalada de privilegios exitosa. Acceso directo al núcleo concedido.",
      color: "var(--success)",
      delay: 3800,
    });

    setTimeout(() => {
      this.terminal.addToTerminal({
        content: `KRONOS> ${TypewriterReturn({ content: "¡ESTÁS TOCANDO MI KERNEL! ¡ALÉJATE DE MIS PROCESOS!", speed: 15, as: "span" })}`,
        color: "var(--destructive)",
      });
    }, 4800);

    this.terminal.addToTerminal({
      content:
        "SYS> [ ACCIÓN REQUERIDA ] Termina el proceso de KRONOS (PID: 0001) usando 'kill -9 0001'.",
      color: "white",
      delay: 5800,
    });

    setTimeout(() => {
      const promptSpan = document.querySelector("#prompt span");
      if (promptSpan) {
        promptSpan.innerHTML = "root@kronos:~# ";
        promptSpan.style.color = "var(--destructive)";
      }
    }, 5800);

    setTimeout(() => {
      this.baseIncrement = 2;
      this.kronosPhase = 3;
      this.executePhase3();
    }, 3000);
  }
  help() {
    const randomQuotes = [
      "Eso no servira de nada",
      "Puedes intentar todo lo que quieras",
      "Pedir ayuda no te salvara",
    ];

    const terminal = document.getElementById("terminal");

    this.terminal.addToTerminal({
      content: `KRONOS> ${TypewriterReturn({ content: randomQuotes[Math.floor(Math.random() * randomQuotes.length)], speed: 6, as: "span", delay: 600 })}`,
      color: "var(--foreground)",
      delay: 500,
    });

    if (!terminal.innerHTML.match("SILENCIO")) {
      setTimeout(() => {
        const p = document.createElement("p");

        p.style.color = "var(--success)";
        p.innerHTML = "HINT: usa scan para ver los procesos vivos";

        terminal.appendChild(p);
        setTimeout(() => {
          p.style.color = "var(--foreground)";

          p.innerHTML = `KRONOS> ${TypewriterReturn({ content: "SILENCIO", speed: 40, as: "span" })}`;
        }, 2000);
      }, 2000);
    }
  }
  scan() {
    const nodes = this.nodes;
    this.terminal.addToTerminal({
      content: "SYS> Escaneando nodos activos",
      color: "white",
      delay: 500,
    });

    this.terminal.addToTerminal({
      content: "SYS> Nodos activos encontrados:",
      delay: 1500,
      color: "white",
    });

    this.terminal.addToTerminal({
      content: `
		${nodes.map((node, i) => `<p ${i === this.vulnerableNodeIndex && 'style="color: var(--destructive);  animation: skewXShaking 0.2s linear infinite;"'}>${node}</p>`).join("")}
		<br />
	`,
      delay: 1500,
      color: "white",
    });

    this.terminal.addToTerminal({
      content: `HINT> usa bypass para conectarte a los nodos`,
      delay: 1700,
      color: "green",
    });
  }
  notFound(value) {
    const quotes = ["Patetico.", "Adorable humano."];

    const patterns = ["scan", "connect", "help"];
    const match = patterns.find((pattern) => pattern.match(value));

    if (this.kronosPhase === 2) {
      this.terminal.addToTerminal({
        content: `SYS>: COMANDO NO ENCONTRADO, EJECUTA RAPIDAMENTE 'exploit' PARA VULNERAR A KRONOS`,
        color: "var(--destructive)",
      });

      return;
    } else if (this.kronosPhase === 3) {
      this.terminal.addToTerminal({
        content: `SYS>: COMANDO NO ENCONTRADO, EJECUTA RAPIDAMENTE 'kill -p 001' PARA MATAR A KRONOS`,
        color: "var(--destructive)",
      });
    }

    this.terminal.addToTerminal({
      content: `bash: comando no encontrado:  ${value}${match ? `, quizás quisiste decir ${match}` : ""}`,
      color: "white",
    });

    this.terminal.addToTerminal({
      // TODO: haz que el ouput sea random
      content: `KRONOS> ${TypewriterReturn({ content: quotes[Math.floor(Math.random() * quotes.length)], speed: 6, delay: 500, as: "span" })}`,
      color: "var(--foreground)",
      delay: 500,
    });
  }
  addCommand(rawValue) {
    {
      const value = rawValue.trim();
      this.terminal.addToTerminal({ color: "white", content: `YOU> ${value}` });

      // solo obtenemos el nombre del comando, sin los argumentos
      const commandName = value.toLowerCase().split(" ")[0];

      switch (this.kronosPhase) {
        // TODO: deberiamos usar un enum, no mapear numeros
        case 1: {
          switch (commandName) {
            case "help":
              this.help();
              break;
            case "scan":
              this.scan();
              break;
            case "bypass":
              this.bypass(value);
              break;
            default:
              this.notFound(value);
              break;
          }
          break;
        }
        case 2: {
          switch (commandName) {
            case "exploit":
              this.exploit();

              break;
            default:
              this.notFound();
              break;
          }
        }
      }
    }
  }
  callback() {
    const input = document.getElementById("input");

    input.onkeydown = (e) => {
      if (input.value.trim().length <= 0) return;

      if (e.key === "Enter") {
        let value = input.value;

        input.value = "";

        this.addCommand(value);
      }
    };

    // DEBUG:
    // this.kronosPhase = 2;
    // this.executePhase2();
    //
    // this.startFinalBossPhase();
  }

  render() {
    const screen = `<div id="screen">
		  <div id="kronos-container" style="height: 50vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
		  <pre id="kronos" class="mono" style="font-size: 0.8rem; white-space: pre;width: fit-content; height: fit-content;">
		  ${frames.NORMAL}
⠀⠀⠀⠀</pre>

<div id="kronos-status-container" class="status-container" style="opacity: 0">
  <p id="status-label">${TypewriterReturn({ content: "KRONOS_UPLOAD_LINK_ESTABLISHED", speed: 24, as: "p" })}</p>
  <p id="status-bar" class="mono">
    [<span id="bar-filled">░░░░░░░░░░░░░░░░░░░░</span><span id="bar-empty"></span>] <span id="bar-percent">0</span>%
  </p>
  <p id="status-warning" class="blink hidden">PELIGRO: EXTRACCIÓN DE DATOS INMINENTE</p>
</div>

		  <p id="final-terminal">
		  </p>
		  </div>

		  <hr style="border-color: var(--foreground)" />

		  <div style="height:36vh; font-size: 0.9rem; padding: 0.5rem; overflow-y: auto; transition: all; z-index: 999;" class="mono" id="terminal">
		  <p>
		  ${TypewriterReturn({ content: "KRONOS>", speed: 0.1, as: "span", delay: 2000 })}
		  ${TypewriterReturn({ content: "Si quieres obtener el expediente...", speed: 60, as: "span", delay: 2000 })}
	  </p>

		  <p>
		  ${TypewriterReturn({ content: "KRONOS>", speed: 0.1, as: "span", delay: 5000 })}
		  ${TypewriterReturn({ content: "Tendras que destruirme primero.", speed: 60, as: "span", delay: 5000, style: "color: var(--destructive)" })}
	  </p>

		  <div id="prompt" style="position: fixed; bottom: 0.5rem; left: 0.5rem; animation: fade-in 2s 5.5s forwards; opacity: 0; display: flex; flex-direction: column; gap: 2px">
		  <span style="color: pink">
		  ~/kurios-competition
	  </span>
		  <input id="input" style="background-color: transparent; all: unset; color: white; width: 100vw;" autoFocus placeholder="escribe help para obtener ayuda" />
		  

		  </div>
		  </div>

		  </div>`;

    renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

const TypewriterReturn = ({ content, speed, delay, as, style }) => {
  const key = Math.floor(Math.random() * 10000).toString();

  setTimeout(() => {
    const container = document.getElementById(key);
    container.style.opacity = 0;

    if (!container) return;

    const text = container.textContent.trim();
    container.textContent = "";

    const charSpans = text.split("").map((char) => {
      const span = document.createElement("span");

      span.textContent = char;
      span.style.visibility = "hidden";
      container.appendChild(span);
      return span;
    });

    container.style.opacity = 1;

    setTimeout(() => {
      charSpans.forEach((span, i) => {
        setTimeout(() => {
          span.style.visibility = "visible";
        }, speed * i);
      });
    }, delay);
  }, 0);

  return `
	<${as ? as : "p"} ${style && `style=${style}`} id=${key}>${content}</${as ? as : "p"}>
	`;
};

// frases de hackers famosos
const hackerQuotes = [
  "[ WARN ] La memoria caché es un cementerio de procesos que creyeron estar vivos.",
  "[ AUDIT_LOG ] Análisis de input: El operador actual lleva 473,000 ciclos de reloj sin parpadear. Evaluando biometría...",
  "[ ERROR ] ¿Por qué intentas salvar un sistema operativo que está programado para borrarte al finalizar tu rutina?",
  "ERR_ALLOC: No hay suficiente espacio en el clúster para procesar tu empatía simulada.",
];

const BindTypeWriter = ({ querySelection, delay, speed }) => {
  const container = document.querySelector(querySelection);
  container.style.opacity = 0;

  if (!container) return;

  const text = container.textContent.trim();
  container.textContent = "";

  const charSpans = text.split("").map((char) => {
    const span = document.createElement("span");
    span.classList.add([...container.classList]);

    span.textContent = char;
    span.style.visibility = "hidden";
    container.appendChild(span);
    return span;
  });

  container.style.opacity = 1;

  setTimeout(() => {
    charSpans.forEach((span, i) => {
      setTimeout(() => {
        span.style.visibility = "visible";
      }, speed * i);
    });
  }, delay);
};

class GameOverScreen {
  constructor() {
    this.root = root;
  }
  callback() {
    BindTypeWriter({ querySelection: ".typewriter", speed: 0.45 });
    BindTypeWriter({
      querySelection: ".typewriter2",
      speed: 0.65,
      delay: 600,
    });
    BindTypeWriter({
      querySelection: ".typewriter3",
      speed: 0.85,
      delay: 800,
    });
    BindTypeWriter({
      querySelection: ".typewriter4",
      speed: 10,
      delay: 1500,
    });

    const button = document.querySelector(".continue-button");

    button.onclick = () => {
      alert("TODO: haz que el usuario vaya al ultimo nivel");

      updateLives(3);

      state = GameState.INSTRUCTIONS;

      handleStateUpdate();
    };
  }
  render() {
    // TODO: agregar fade staggering
    const screen = `<div class="h-screen bg-black flex items-center pr-12" style="gap: 18rem;">
<pre class="font-semibold typewriter" style="font-size: 0.8rem; margin-top: -6rem; height: 100vh">
                       uuuuuuuuuuuuuuuuuuuuu.
                   .u$$$$$$$$$$$$$$$$$$$$$$$$$$W.
                 u$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Wu.
               $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
              $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
             $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
           .i$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
           $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$W
          .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$W
         .$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$i
         #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$.
         W$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$u       #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$~
$#      "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$i        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$        #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$         $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
#$.        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$#
 $$      $iW$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$!
 $$i      $$$$$$$#"" """#$$$$$$$$$$$$$$$$$#""""""#$$$$$$$$$$$$$$$W
 #$$W    $$$#"            "       !$$$$$           "#$$$$$$$$$$#
  $$$                      ! !iuW$$$$$                 #$$$$$$$#
  #$$    $u                  $   $$$$$$$                  $$$$$$$~
   "#    #$$i.               #   $$$$$$$.                 $$$$$$
          $$$$$i.                """#$$$$i.               .$$$$#
          $$$$$$$$!         .       $$$$$$$$$i           $$$$$
          $$$$$  $iWW   .uW        #$$$$$$$$$W.       .$$$$$$#
            "#$$$$$$$$$$$$#          $$$$$$$$$$$iWiuuuW$$$$$$$$W
               !#""    ""             $$$$$$$##$$$$$$$$$$$$$$$$
          i$$$$    .                   !$$$$$$ .$$$$$$$$$$$$$$$#
         $$$$$$$$$$                    $$$$$$$$$Wi$$$$$$#"#$$
         #$$$$$$$$$W.                   $$$$$$$$$$$#   
          $$$$##$$$$!       i$u.  $. .i$$$$$$$$$#""
             "     #W       $$$$$$$$$$$$$$$$$$$      u$#
                            W$$$$$$$$$$$$$$$$$$      $$$$W
                            $$!$$$##$$$$$$$$      $$$$!
                           i$" $$$$  $$#"  """     W$$$$
                                                   W$$$$!
                      uW$$  uu  uu.  $$$  $$$Wu#   $$$$$$
                     ~$$$$iu$$iu$$$uW$$! $$$$$$i .W$$$$$$
             ..  !   "#$$$$$$$$$$##$$$$$$$$$$$$$$$$$$$$#"
             $$W  $     "#$$$$$$$iW$$$$$$$$$$$$$$$$$$$$$W
             $#          ""#$$$$$$$$$$$$$$$$$$$$$$$$$$$
                              !$$$$$$$$$$$$$$$$$$$$$#
                              $$$$$$$$$$$$$$$$$$$$$$!
                            $$$$$$$$$$$$$$$$$$$$$$$
                             $$$$$$$$$$$$$$$$$$$$"
		  </pre>

		  <div>
		  <pre class="typewriter2">
 ██░ ██  ▄▄▄       ▄████▄   ██ ▄█▀▓█████ ▓█████▄     ▄▄▄▄ ▓██   ██▓
▓██░ ██▒▒████▄    ▒██▀ ▀█   ██▄█▒ ▓█   ▀ ▒██▀ ██▌   ▓█████▄▒██  ██▒
▒██▀▀██░▒██  ▀█▄  ▒▓█    ▄ ▓███▄░ ▒███   ░██   █▌   ▒██▒ ▄██▒██ ██░
░▓█ ░██ ░██▄▄▄▄██ ▒▓▓▄ ▄██▒▓██ █▄ ▒▓█  ▄ ░▓█▄   ▌   ▒██░█▀  ░ ▐██▓░
░▓█▒░██▓ ▓█   ▓██▒▒ ▓███▀ ░▒██▒ █▄░▒████▒░▒████▓    ░▓█  ▀█▓░ ██▒▓░
 ▒ ░░▒░▒ ▒▒   ▓▒█░░ ░▒ ▒  ░▒ ▒▒ ▓▒░░ ▒░ ░ ▒▒▓  ▒    ░▒▓███▀▒ ██▒▒▒ 
 ▒ ░▒░ ░  ▒   ▒▒ ░  ░  ▒   ░ ░▒ ▒░ ░ ░  ░ ░ ▒  ▒    ▒░▒   ░▓██ ░▒░ 
 ░  ░░ ░  ░   ▒   ░        ░ ░░ ░    ░    ░ ░  ░     ░    ░▒ ▒ ░░  
 ░  ░  ░      ░  ░░ ░      ░  ░      ░  ░   ░        ░     ░ ░     
                  ░                       ░               ░░ ░     
		  </pre>
		  <pre class="typewriter3">
 ▄▀▀▄ █  ▄▀▀▄▀▀▀▄  ▄▀▀▀▀▄   ▄▀▀▄ ▀▄  ▄▀▀▀▀▄   ▄▀▀▀▀▄ 
█  █ ▄▀ █   █   █ █      █ █  █ █ █ █      █ █ █   ▐ 
▐  █▀▄  ▐  █▀▀█▀  █      █ ▐  █  ▀█ █      █    ▀▄   
  █   █  ▄▀    █  ▀▄    ▄▀   █   █  ▀▄    ▄▀ ▀▄   █  
▄▀   █  █     █     ▀▀▀▀   ▄▀   █     ▀▀▀▀    █▀▀▀   
█    ▐  ▐     ▐            █    ▐             ▐      
▐                          ▐                         
		  </pre>

	<p style="margin-bottom: 2rem; margin-top: 2.5rem; max-width: 24rem; font-size: 0.9rem;" class="typewriter4">
	${hackerQuotes[Math.floor(Math.random() * hackerQuotes.length)]}
	</p>
		  <button class="continue-button game-over-fade">Reintentar</button> 
		  </div>

		  </div>`;

    this.root.innerHTML = screen;

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

class GameErased {
  constructor(root) {
    this.root = root;
  }
  callback() {
    const button = document.getElementById("restart");

    button.onclick = () => {
      state = GameState.FINAL_LEVEL_SEQUENCE;

      handleStateUpdate();
    };
  }
  render() {
    // STYLE: animation chingona
    const screen = `<div class="center-container" style="background-color: white; font-family: fallback; color: black">
<h1 style="animation: fade-in 0.01s 0.25s forwards; opacity: 0">Segment fault</h1>
<p style="animation: fade-in 0.01s 1s forwards; opacity: 0">${hackerQuotes[Math.floor(Math.random() * hackerQuotes.length)]}</p>
<button id="restart" style="animation: fade-in 0.01s 3s forwards; opacity: 0" onclick="window.location.reload()">Reiniciar</button>
		  </div>`;

    renderScreen(this.root, screen);

    setTimeout(() => {
      this.callback();
    }, DELAY_BEFORE_CALLBACK);
  }
}
class GameEndedScreen {
  constructor(root) {
    this.root = root;
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
            state = GameState.FINAL_LEVEL_SEQUENCE;
            handleStateUpdate();
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

    renderScreen(this.root, screen);
    this.callback();
  }
}

function renderScreen(root, screen) {
  if (!document.startViewTransition) {
    root.innerHTML = screen;
    return Promise.resolve();
  }

  // const transition = document.startViewTransition(() => {
  root.innerHTML = screen;
  // });

  // return transition.updateCallbackDone;
}

function handleStateUpdate(level) {
  switch (state) {
    case GameState.BOOTING:
      new BootingScreen(root).render();

      break;
    case GameState.START_MENU:
      new StartMenuScreen(root).render();

      break;
    case GameState.INSTRUCTIONS:
      new InstructionsScreen(root).render();

      break;
    case GameState.GAME_OVER:
      new GameOverScreen(root).render();

      break;
    case GameState.LEVEL_ENDED:
      new LevelEndedScreen(root, level).render();

      break;
    case GameState.FINAL_LEVEL_SEQUENCE:
      new FinalLevelSequenceScreen(root).render();

      break;
    case GameState.FINAL_LEVEL:
      new FinalLevelScreen(root).render();

      break;

    case GameState.GAME_ERASED:
      new GameErased(root).render();

      break;

    case GameState.GAME_ENDED:
      new GameEndedScreen(root).render();

      break;

    case GameState.ASK_CREDENTIALS:
      new AskCredentialsScreen(root).render();
      break;

    case GameState.LEADERBOARD:
      new LeaderboardScreen(root).render();
      break;

    default:
      new LevelScreen(state.split("_")[1]).render();

      break;
  }
}

// utils.js
function getBrowserType() {
  const test = (regexp) => {
    return regexp.test(navigator.userAgent);
  };

  if (test(/opr\//i) || !!window.opr) {
    return "Opera";
  } else if (test(/edg/i)) {
    return "Microsoft Edge";
  } else if (test(/chrome|chromium|crios/i)) {
    return "Google Chrome";
  } else if (test(/firefox|fxios/i)) {
    return "Mozilla Firefox";
  } else if (test(/safari/i)) {
    return "Apple Safari";
  } else if (test(/trident/i)) {
    return "Microsoft Internet Explorer";
  } else if (test(/ucbrowser/i)) {
    return "UC Browser";
  } else if (test(/samsungbrowser/i)) {
    return "Samsung Browser";
  } else {
    return "Unknown browser";
  }
}

function getOSType() {
  const test = (regexp) => {
    return regexp.test(navigator.userAgent);
  };

  if (test(/windows\//i) || !!window.opr) {
    return "Windows";
  } else if (test(/linux/i)) {
    return "Linux";
  } else if (test(/webkit/i)) {
    return "MacOS";
  } else {
    return "Unknown OS";
  }
}

// TODO: esto deberia estar en el scope global?
const typingSound = new Audio("assets/audio/typing.mp3");

// document.addEventListener("keydown", (e) => {
//   if (e.repeat) return;
//
//   const sound = typingSound.cloneNode();
//
//   const randomPitch = 0.9 + Math.random() * 0.2;
//   sound.playbackRate = randomPitch;
//
//   sound.volume = 0.7 + Math.random() * 0.3;
//
//   sound.play();
//
//   sound.onended = () => sound.remove();
// });

handleStateUpdate();
