import { updateLives } from "../components/lives.js";
import { BindTypeWriter } from "../components/typewriter.js";
import { GAME_OVER_QUOTES } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

class GameOverScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine
   * */
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }

  callback() {
    if (this.engine.audio.gameOver) this.engine.audio.gameOver.play();

    BindTypeWriter({ querySelection: ".typewriter", speed: 0.2 }); // El arte principal (más rápido para que no aburra)
    BindTypeWriter({ querySelection: ".typewriter2", speed: 0.65, delay: 600 });
    BindTypeWriter({
      querySelection: ".typewriter3",
      speed: 0.85,
      delay: 1200,
    });
    BindTypeWriter({ querySelection: ".typewriter4", speed: 10, delay: 2000 }); // La frase humillante

    const buttonContainer = document.querySelector(".action-container");
    const button = document.querySelector(".continue-button");
    const cursor = document.querySelector(".button-cursor");

    setTimeout(() => {
      buttonContainer.classList.add("fade-in-glitch");
      button.disabled = false;
    }, 4500);

    button.onmouseenter = () => {
      if (cursor && cursor.style) {
        cursor.style.animation = "none";
        cursor.style.color = "var(--destructive, #ff0000)";
        button.style.textShadow = "2px 0 0 #ff0000, -2px 0 0 #00ffff";
        if (this.engine.audio.hover) this.engine.audio.hover.play();
      }
    };

    button.onmouseleave = () => {
      if (cursor && cursor.style) {
        cursor.style.animation = "blink 1s step-end infinite";
        cursor.style.color = "inherit";
        button.style.textShadow = "none";
      }
    };

    button.onclick = () => {
      button.disabled = true;

      this.engine.handleStateUpdate(GameState.INSTRUCTIONS);

      updateLives(3);
    };
  }

  render() {
    const gameOverStyles = `
      <style>
        /* La textura de hardware (Scanlines sutiles) */
        .crt-bg {
          position: relative;
          background: #050000; /* Negro con un levísimo tinte rojo sangre */
          overflow: hidden;
        }
        .crt-bg::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        /* Viñeta opresiva (Hace que el centro brille más) */
        .crt-bg::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(20,0,0,0.8) 100%);
          z-index: 3;
          pointer-events: none;
        }

        /* Aparición violenta del botón */
        .fade-in-glitch {
          animation: titleBoot 0.8s ease-in-out forwards;
          opacity: 1 !important;
        }

        /* El apagón de TV vieja para salir */
        .crt-off {
          animation: pony-island-crash 0.5s linear forwards;
        }

        /* Cursor de consola AAA */
        @keyframes blink { 50% { opacity: 0; } }
        .button-cursor { animation: blink 1s step-end infinite; display: inline-block; margin-right: 8px; }
      </style>
    `;

    const quote =
      GAME_OVER_QUOTES[Math.floor(Math.random() * GAME_OVER_QUOTES.length)];

    const screen = `
      ${gameOverStyles}
      <div class="h-screen flex items-center pr-12 crt-bg" style="gap: 18rem; color: #ff3333;">
        
        <pre class="font-semibold dangerous-glow typewriter" style="font-size: 2vh; margin-top: -6rem; height: 100vh; opacity: 0; color: #cc0000;">
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
$i       $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$       #$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
$$        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
#$.       $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$#
 $$      $iW$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$!
 $$i      $$$$$$$#"" """#$$$$$$$$$$$$$$$$$#""""""#$$$$$$$$$$$$$$$W
 #$$W    $$$#"            "       !$$$$$            "#$$$$$$$$$$#
  $$$                      ! !iuW$$$$$                 #$$$$$$$#
  #$$    $u                 $   $$$$$$$                 $$$$$$$~
   "#    #$$i.               #   $$$$$$$.                 $$$$$$
         $$$$$i.                 """#$$$$i.               .$$$$#
         $$$$$$$$!         .        $$$$$$$$$i           $$$$$
         $$$$$  $iWW   .uW         #$$$$$$$$$W.       .$$$$$$#
           "#$$$$$$$$$$$$#           $$$$$$$$$$$iWiuuuW$$$$$$$$W
               !#""    ""            $$$$$$$##$$$$$$$$$$$$$$$$
         i$$$$    .                    !$$$$$$ .$$$$$$$$$$$$$$$#
         $$$$$$$$$$                    $$$$$$$$$Wi$$$$$$#"#$$
         #$$$$$$$$$W.                   $$$$$$$$$$$#   
          $$$$##$$$$!       i$u.  $. .i$$$$$$$$$#""
              "     #W       $$$$$$$$$$$$$$$$$$$       u$#
                            W$$$$$$$$$$$$$$$$$$       $$$$W
                            $$!$$$##$$$$$$$$       $$$$!
                           i$" $$$  $$#"  """      W$$$$
                                                   W$$$$!
                      uW$$  uu  uu.  $$$  $$$Wu#   $$$$$$
                      ~$$$$iu$$iu$$$uW$$! $$$$$$i .W$$$$$$
             ..  !    "#$$$$$$$$$$##$$$$$$$$$$$$$$$$$$$$#"
             $$W  $     "#$$$$$$$iW$$$$$$$$$$$$$$$$$$$$$W
             $#           ""#$$$$$$$$$$$$$$$$$$$$$$$$$$$
                              !$$$$$$$$$$$$$$$$$$$$$#
                              $$$$$$$$$$$$$$$$$$$$$$!
                            $$$$$$$$$$$$$$$$$$$$$$$
                             $$$$$$$$$$$$$$$$$$$$"
        </pre>

        <div style="z-index: 10; position: relative;">
          
          <pre class="typewriter2 dangerous-glow" style="color: white;">
 ██░ ██  ▄▄▄       ▄████▄   ██ ▄█▀▓█████ ▓█████▄    ▄▄▄▄ ▓██   ██▓
▓██░ ██▒▒████▄    ▒██▀ ▀█   ██▄█▒ ▓█   ▀ ▒██▀ ██▌   ▓█████▄▒██  ██▒
▒██▀▀██░▒██  ▀█▄  ▒▓█    ▄ ▓███▄░ ▒███   ░██   █▌   ▒██▒ ▄██▒██ ██░
░▓█ ░██ ░██▄▄▄▄██ ▒▓▓▄ ▄██▒▓██ █▄ ▒▓█  ▄ ░▓█▄   ▌   ▒██░█▀  ░ ▐██▓░
░▓█▒░██▓ ▓█   ▓██▒▒ ▓███▀ ░▒██▒ █▄░▒████▒░▒████▓    ░▓█  ▀█▓░ ██▒▓░
 ▒ ░░▒░▒ ▒▒   ▓▒█░░ ░▒ ▒  ░▒ ▒▒ ▓▒░░ ▒░ ░ ▒▒▓  ▒     ░▒▓███▀▒ ██▒▒▒ 
 ▒ ░▒░ ░  ▒   ▒▒ ░  ░  ▒   ░ ░▒ ▒░ ░ ░  ░ ░ ▒  ▒     ▒░▒   ░▓██ ░▒░ 
 ░  ░░ ░  ░   ▒   ░        ░ ░░ ░    ░    ░ ░  ░     ░     ░▒ ▒ ░░  
 ░  ░  ░      ░  ░░ ░      ░  ░      ░  ░   ░        ░      ░ ░     
                  ░                       ░                 ░░ ░    
          </pre>

          <pre class="typewriter3 dangerous-glow" style="color: #ff4d4d;">
 ▄▀▀▄ █  ▄▀▀▄▀▀▀▄  ▄▀▀▀▀▄   ▄▀▀▄ ▀▄  ▄▀▀▀▀▄   ▄▀▀▀▀▄ 
█  █ ▄▀ █   █   █ █      █ █  █ █ █ █      █ █ █   ▐ 
▐  █▀▄  ▐  █▀▀█▀  █      █ ▐  █  ▀█ █      █   ▀▄    
  █   █  ▄▀    █  ▀▄    ▄▀   █   █  ▀▄    ▄▀ ▀▄   █  
▄▀   █  █     █    ▀▀▀▀   ▄▀   █    ▀▀▀▀    █▀▀▀   
█    ▐  ▐     ▐           █    ▐            ▐      
▐                         ▐                        
          </pre>

          <p style="margin-bottom: 3rem; margin-top: 2.5rem; max-width: 28rem; font-size: 1.25rem; color: #aaaaaa;  padding-left: 15px;" class="typewriter4">
          "${quote}"
          </p>
          
          <div class="action-container" style="opacity: 0;">
            <button class="continue-button simple-button glitch-text pony-glow" style="background: transparent; border: none; font-size: 1.5rem; font-family: inherit; cursor: pointer; display: flex; align-items: center; color: white;">
              <span class="char">></span>REINTENTAR
            </button>
          </div>

        </div>

      </div>
    `;

    this.root.innerHTML = screen;

    // Disparamos el callback inmediatamente para empezar los typewriters
    // El staggering del botón ya lo controlamos con el setTimeout adentro de callback()
    this.callback();
  }
}

export { GameOverScreen };
