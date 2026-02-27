// constantes

const DELAY_BEFORE_CALLBACK = 50;
const LIVES_STORAGE_KEY = "lives";

// Esto es un clasico Finite state machine pattern
const GameState = Object.freeze({
  BOOTING: "booting",
  START_MENU: "start_menu",
  INSTRUCTIONS: "instructions",
  LEVEL1: "level_1",
  LEVEL2: "level_2",
  LEVEL3: "level_3",
  LEVEL4: "level_4",
  LEVEL5: "level_5",
  GAME_ENDED: "game_ended",
  GAME_OVER: "game_over",
});

// esto podria ser mejor si lo movieramos a localStorage
let state;

const root = document.getElementById("root");

if (!root) {
  throw new Error("La etiqueta root no pudo ser encontrada");
}

state = GameState.GAME_ENDED;

const audio = {
  accept: new Audio(
    "https://cdn.freesound.org/previews/220/220166_4100837-lq.mp3",
  ),
  reject: new Audio(
    "https://cdn.freesound.org/previews/657/657950_6142149-lq.mp3",
  ),
};

// aqui se guardan las vidas en el sessionStorage, pero realmente, no seria mejor guardar las vidas en un objeto de estado junto el estado del juego?
sessionStorage.setItem(LIVES_STORAGE_KEY, 3);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

class BootingScreen {
  constructor(root) {
    this.root = root;
    // TODO para SAMUEL: añade aqui la pantalla de carga
  }
  async callback() {
    async function runLoader(root) {
      const loadingStates = [
        "CARGANDO IMAGENES",
        "CARGANDO FUENTES",
        "CARGANDO DECISIONES",
        "CARGANDO KURIOS",
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
    state = GameState.GAME_ENDED;

    handleStateUpdate();

    return;
  }

  const livesHeader = document.querySelector(".lives-header");

  livesHeader.innerHTML = `
		<h1 class="text-2xl font-semibold mx-1">${newValue}x</h1>

		${Array.from({ length: newValue })
      .map(() => pixelHeartSvg)
      .join("")}
	`;
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
    answer: "192.168.1.5",
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

<p>12:04:01 [AUTH] User 'ADMIN' logged in from 192.168.1.5</p>
<p>12:04:15 [PROC] PID 4402 starting: /bin/sh -access_level_1</p>
<p>12:04:22 [AUTH] User 'GUEST' logged in from 192.168.1.12</p>
<p>12:05:10 [WARN] Unauthorized access attempt: PID 9999 from 10.0.0.255</p>
<p>12:05:12 [PROC] PID 4402 terminated: code 0</p>
<p>12:05:45 [AUTH] User 'ADMIN' logged in from 192.168.1.5</p>
<p>12:06:01 [CRIT] MEMORY_CORRUPTION detected at 0x004F6</p>
<p>12:06:05 [INFO] Manual override required to proceed...</p>
		  </div>
	  `,
  },
];

class LevelScreen {
  constructor(level) {
    this.level = levels.find((l) => l.id === Number(level));

    this.root = root;
  }
  callback() {
    const button = document.querySelector(".continue-button");
    const input = document.querySelector(".input");
    const error = document.querySelector(".error");

    button.onclick = () => {
      if (input.value === this.level.answer) {
        audio.accept.play();
        alert("respuesta correcta, continuar");

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
  }
  render() {
    document.addEventListener("keydown", () => {
      // Optional: reset the sound playback to allow rapid key presses
      const typingSound = new Audio(
        "https://cdn.freesound.org/previews/380/380144_3249786-lq.mp3",
      );
      typingSound.play();
    });
    const level = this.level;

    const screen = `
		  <div class="center-container">
		  <div class="container">
		  <div class="center">
			<h1 class="text-xl font-semibold">${level.title}</h1>
			<p class="text-lg my-1">${level.description}</p>
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

		  </div>
			</div>`;

    renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

// frases de hackers famosos
const hackerQuotes = [
  "La seguridad es a menudo una ilusión.",
  "Argumentar que no te importa el derecho a la privacidad porque no tienes nada que ocultar es como decir que no te importa la libertad de expresión porque no tienes nada que decir.",
  "Sí, soy un criminal. Mi crimen es el de juzgar a la gente por lo que dice y piensa, no por lo que parece.",
];

class GameEnded {
  constructor() {
    this.root = root;
  }
  render() {
    // TODO: agregar fade staggering
    const screen = `<div class="center-container bg-black">
<h1 class="text-xl font-semibold">[ FATAL ERROR: CONNECTION TERMINATED BY REMOTE HOST ]</h1>
	<p class="truncate-xl text-lg my-2">${hackerQuotes[Math.floor(Math.random() * hackerQuotes.length)]}</p>

		  <button class="my-2 continue-button">Reintentar</button>

		  </div>`;

    this.root.innerHTML = screen;
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

function handleStateUpdate() {
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
    case GameState.GAME_ENDED:
      new GameEnded(root).render();

      break;
    default:
      new LevelScreen(state.split("_")[1]).render();

      break;
  }
}

handleStateUpdate();
