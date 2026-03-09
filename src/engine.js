/**
 * El engine del juego maneja el estado de donde esta el juego y maneja que pantalla esta en vista en este momento.
	
 * Tambien maneja el audio global y abstrae una funcion para renderizar html en el elemento `root`
	 
 * Este engine, es una clase que comparte un estado compartido del elemento root y los audios, pero realmente podria ser mucho más compleja,  ya que las clases `Screen` todavía mandan sobre que contenido mostrar, como mostrarlo y que pantalla es mejor mostrar. Mucha de esa logica, se debería abstraer al engine para tener un sistema más DRY.
 * */

import { LIVES_STORAGE_KEY } from "./constants.js";
import { AskCredentialsScreen } from "./screens/AskCredentialsScreen.js";
import { BootingScreen } from "./screens/BootingScreen.js";
import { FinalLevelScreen } from "./screens/FinalLevelScreen.js";
import { FinalLevelSequenceScreen } from "./screens/FinalLevelSequenceScreen.js";
import { GameEndedScreen } from "./screens/GameEndedScreen.js";
import { GameErased } from "./screens/GameErased.js";
import { GameOverScreen } from "./screens/GameOverScreen.js";
import { InstructionsScreen } from "./screens/InstructionsScreen.js";
import { LeaderboardScreen } from "./screens/LeaderboardScreen.js";
import { LevelEndedScreen } from "./screens/LevelEndedScreen.js";
import { LevelScreen } from "./screens/LevelScreen.js";
import { StartMenuScreen } from "./screens/StartMenuScreen.js";
import { GameState } from "./state.js";

class Engine {
  constructor() {
    this.root = document.getElementById("root");
    this.audio = {
      accept: new Audio("assets/audio/accept.mp3"),
      beep: new Audio("assets/audio/beep.mp3"),
      reject: new Audio("assets/audio/reject.mp3"),
    };

    // TODO: guarda esto junto al engine
    sessionStorage.setItem(LIVES_STORAGE_KEY, "3");
  }

  /**
   * @param {Element} root
   * @param {string} screen
   * */
  renderScreen(root, screen) {
    if (!document.startViewTransition) {
      root.innerHTML = screen;
      return Promise.resolve();
    }

    // const transition = document.startViewTransition(() => {
    root.innerHTML = screen;
    // });

    // return transition.updateCallbackDone;
  }

  /**
   * @param {string} state
   * @param {{id: number}=} level
   * */
  handleStateUpdate(state, level) {
    const root = this.root;

    switch (state) {
      case GameState.BOOTING:
        new BootingScreen(root, this).render();

        break;
      case GameState.START_MENU:
        new StartMenuScreen(root, this).render();

        break;
      case GameState.INSTRUCTIONS:
        new InstructionsScreen(root, this).render();

        break;
      case GameState.GAME_OVER:
        new GameOverScreen(root, this).render();

        break;
      case GameState.LEVEL_ENDED:
        new LevelEndedScreen(root, this, level).render();

        break;
      case GameState.FINAL_LEVEL_SEQUENCE:
        new FinalLevelSequenceScreen(root, this).render();

        break;
      case GameState.FINAL_LEVEL:
        new FinalLevelScreen(root, this).render();

        break;

      case GameState.GAME_ERASED:
        new GameErased(root, this).render();

        break;

      case GameState.GAME_ENDED:
        new GameEndedScreen(root, this).render();

        break;

      case GameState.ASK_CREDENTIALS:
        new AskCredentialsScreen(root, this).render();
        break;

      case GameState.LEADERBOARD:
        new LeaderboardScreen(root, this).render();
        break;

      default:
        new LevelScreen(root, this, Number(state.split("_")[1])).render();

        break;
    }
  }
}

export { Engine };
