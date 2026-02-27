// constantes

const DELAY_BEFORE_CALLBACK = 50;

// Finite state machine pattern
const GameState = Object.freeze({
  BOOTING: "booting",
  START_MENU: "start_menu",
  LEVEL1: "level1",
  LEVEL2: "level2",
  LEVEL3: "level3",
  LEVEL4: "level4",
  LEVEL5: "level5",
  GAME_ENDED: "game_ended",
  GAME_OVER: "game_over",
});

let state;

const root = document.getElementById("root");

if (!root) {
  throw new Error("La etiqueta root no pudo ser encontrada");
}

state = GameState.BOOTING;

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

    state = GameState.START_MENU;

    handleStateUpdate();
  }
  async render() {
    const screen = `
	  <div class="center-container">
		  <div class="dialog">
		  <h1 class="loader-title">MISION SECRETA</h1>

		  <div class="loader">
		  	<div class="loader-intern" ></div>
		  </div>


		  <div class="loader-footer">
		  <span class="loader-text">CARGANDO TEXTURAS</span>
		  <span class="loader-progress">0%</span>
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
  render() {
    const now = new Date().toLocaleDateString();

    const screen = `
	  <div class="center-container">
	  	<div class="dialog">
		  <div>
<h1 class="start-title">EXPEDIENTE CLASIFICADO</h1>
		  <div class="gap">
          <p><strong>FECHA:</strong> ${now}</p>
          <p><strong>UBICACION:</strong> SECTOR-K27</p>
		  </div>

          <div class="gap description gap">
<p>El archivo fue recuperado tras el incidente.</p>
<p>No hay registros oficiales.</p>
<p>El agente asignado no regresó...</p>
		  </div>
		  </div>
          <button class="continue-button">> Autorizar acceso</button>
		  </div>
		  </div>
	  `;

    renderScreen(this.root, screen);
  }
}

function renderScreen(root, screen) {
  if (!document.startViewTransition) {
    root.innerHTML = screen;
    return Promise.resolve();
  }

  const transition = document.startViewTransition(() => {
    root.innerHTML = screen;
  });

  return transition.updateCallbackDone;
}

function handleStateUpdate() {
  switch (state) {
    case GameState.BOOTING:
      new BootingScreen(root).render();

      break;
    case GameState.START_MENU:
      new StartMenuScreen(root).render();

      break;
  }
}

handleStateUpdate();
