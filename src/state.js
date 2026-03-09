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

export { GameState };
