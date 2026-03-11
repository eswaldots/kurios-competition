/*
 * CARTA DE LOS DESARROLLADORES:
 * Lo sentimos por no poder incluir un solo archivo Javascript, entendimos que esto hubiera facilitado mucho su revision inicial,
 * pero realmente no pudimos convertir toda nuestra logica en un solo archivo sin hacer un desastre de codigo mientras no comprometiamos el desarrollo del proyecto,
 * y eso es lo que valoramos, despues de todo intentamos que la arquitectura fuera lo más limpia posible para que nadie tenga que leer o intentar entender
 * cosas muy complejas. Un codigo simple, es un mejor codigo.
 * */

// Pequeño easter egg para iniciar el juego
const ascii = `
 ██ ▄█▀ █    ██  ██▀███   ██▓ ▒█████    ██████ 
 ██▄█▒  ██  ▓██▒▓██ ▒ ██▒▓██▒▒██▒  ██▒▒██    ▒ 
▓███▄░ ▓██  ▒██░▓██ ░▄█ ▒▒██▒▒██░  ██▒░ ▓██▄   
▓██ █▄ ▓▓█  ░██░▒██▀▀█▄  ░██░▒██   ██░  ▒   ██▒
▒██▒ █▄▒▒█████▓ ░██▓ ▒██▒░██░░ ████▓▒░▒██████▒▒
▒ ▒▒ ▓▒░▒▓▒ ▒ ▒ ░ ▒▓ ░▒▓░░▓  ░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░
░ ░▒ ▒░░░▒░ ░ ░   ░▒ ░ ▒░ ▒ ░  ░ ▒ ▒░ ░ ░▒  ░ ░
░ ░░ ░  ░░░ ░ ░   ░░   ░  ▒ ░░ ░ ░ ▒  ░  ░  ░  
░  ░      ░        ░      ░      ░ ░        ░  

Hola!

Hecho por el Equipo de U.E.C.P Nuestros Símbolos
Repositorio: https://github.com/eswaldots/kurios-competition
`;

console.log(
  `%c${ascii}`,
  'font-family: "JetBrains Mono", monospace; white-space: pre; line-height: 1; color: white;',
);

import { Engine } from "./src/engine.js";
import { GameState } from "./src/state.js";

const root = document.getElementById("root");

if (!root) {
  throw new Error("La etiqueta root no pudo ser encontrada");
}

const engine = new Engine();

engine.handleStateUpdate(GameState.BOOTING);
