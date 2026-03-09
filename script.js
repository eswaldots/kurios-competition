import { Engine } from "./src/engine.js";
import { GameState } from "./src/state.js";

const root = document.getElementById("root");

if (!root) {
	throw new Error("La etiqueta root no pudo ser encontrada");
}

const engine = new Engine();

engine.handleStateUpdate(GameState.START_MENU);
