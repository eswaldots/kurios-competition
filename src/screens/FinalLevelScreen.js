import { TypewriterReturn } from "../components/typewriter.js";
import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";

const frames = {
  NORMAL: `
          .                                                      .
        .n                   .                 .                  n.
  .   .dP                  dP                   9b                 9b.    .
 4    qXb         .       dX                     Xb       .        dXp     t
dX.    9Xb      .dXb    __                         __    dXb.     dXP     .Xb
9XXb._       _.dXXXXb dXXXXbo.                 .odXXXXb dXXXXb._       _.dXXP
 9XXXXXXXXXXXXXXXXXXXVXXXXXXXXOo.           .oOXXXXXXXXVXXXXXXXXXXXXXXXXXXXP
  \`9XXXXXXXXXXXXXXXXXXXXX'~   ~\`OOO8b   d8OOO'~   ~\`XXXXXXXXXXXXXXXXXXXXXP'
    \`9XXXXXXXXXXXP' \`9XX'   DIE    \`98v8P'  HUMAN   \`XXP' \`9XXXXXXXXXXXP'
        ~~~~~~~       9X.          .db|db.          .XP       ~~~~~~~
                        )b.  .dbo.dP'\`v'\`9b.odb.  .dX(
                      ,dXXXXXXXXXXXb     dXXXXXXXXXXXb.
                     dXXXXXXXXXXXP'   .   \`9XXXXXXXXXXXb
                    dXXXXXXXXXXXXb   d|b   dXXXXXXXXXXXXb
                    9XXb'   \`XXXXXb.dX|Xb.dXXXXX'   \`dXXP
                     \`'      9XXXXXX(   )XXXXXXP      \`'
                              XXXX X.\`v'.X XXXX
                              XP^X'\`b   d'\`X^XX
                              X. 9  \`   '  P )X
                              \`b  \`       '  d'
                               \`             '
	`,
  TALKING: `
.                                                    .
        .n                   .                 .                 n.
  .   .dP                 dP                   9b                 9b.    .
 4    qXb         .       dX                     Xb       .        dXp     t
dX.    9Xb      .dXb    __                         __    dXb.     dXP     .Xb
9XXb._        _.dXXXXb dXXXXbo.          .odXXXXb dXXXXb._        _.dXXP
     9XXXXXXXXXXXXXXXXXXXVXXXXXXXXOo.           .oOXXXXXXXXVXXXXXXXXXXXXXXXXXXXP
  \`9XXXXXXXXXXXXXXXXXXXXX'~   ~\`OOO8b   d8OOO'~   ~\`XXXXXXXXXXXXXXXXXXXXXP'
    \`9XXXXXXXXXXXP' \`9XX'   ERR    \`98v8P'   ERR     \`XXP' \`9XXXXXXXXXXXP'
        ~~~~~~~       9X.          .db|db.          .XP        ~~~~~~~
                        )b.  .dbo.dP'\`v'\`9b.odb.  .dX(
                      ,dXXXXXXXXXXXb     dXXXXXXXXXXXb.
                     dXXXXXXXXXXXP'   .   \`9XXXXXXXXXXXb
                    dXXXXXXXXXXXXb   d|b   dXXXXXXXXXXXXb
                    9XXb'   \`XXXXXb.dX|Xb.dXXXXX'   \`dXXP
                     \`'      9XXXXXX(   )XXXXXXP      \`'
                              XXXX X.\`v'.X XXXX
                              XP^X'\`b   d'\`X^XX
                              X. 9  \`   '  P )X
                              \`b  \`       '  d'
                               \`             '
`,
};

class FinalLevelScreen {
  /**
   * @param {HTMLElement} root
   * @param {Engine} engine*/
  constructor(root, engine) {
    this.root = root;

    this.avatarState = "IDLE";
    this.animationInterval = null;
    this.nodes = ["alpha", "gamma", "beta"];
    this.vulnerableNodeIndex = Math.floor(Math.random() * this.nodes.length);

    this.uploadProgress = 0;
    this.engine = engine;
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
  /** @param {number} time */
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
    /** @type {HTMLDivElement}*/
    // REFACTOR: wtf
    const container = document.getElementById("kronos-status-container");

    container.style.opacity = "1";

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
    // 1. Agarramos solo elementos visuales y de texto para no romper contenedores padre de golpe
    const elements = Array.from(
      this.root.querySelectorAll("p, h1, h2, h3, span, pre, div:not(:has(*))"),
    );
    const glitchChars = "!<>-_\\\\/[]{}—=+*^?#01";

    // 2. Colapso inicial: todo se vuelve rojo y la pantalla tiembla
    this.root.classList.add("pony-glitch-out"); // Reutilizamos tu clase de glitch

    // Inyectamos el taunt de Kronos rompiendo la lógica del sistema
    const kronosTaunt = document.createElement("div");
    kronosTaunt.style.position = "absolute";
    kronosTaunt.style.top = "50%";
    kronosTaunt.style.left = "50%";
    kronosTaunt.style.transform = "translate(-50%, -50%)";
    kronosTaunt.style.fontFamily = "'Silkscreen', monospace";
    kronosTaunt.style.color = "var(--destructive, #ff0000)";
    kronosTaunt.style.fontSize = "2.5rem";
    kronosTaunt.style.zIndex = "9999";
    kronosTaunt.style.textAlign = "center";
    kronosTaunt.style.textShadow = "0 0 10px red";
    kronosTaunt.innerHTML =
      "FATAL ERROR<br/>[ LOGIC OVERRIDDEN: 2 + 2 = 5 ]<br/>SYSTEM PURGED.";
    kronosTaunt.style.opacity = "0";
    this.root.appendChild(kronosTaunt);

    // Animamos la entrada del taunt
    kronosTaunt.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      fill: "forwards",
    });

    // 3. El Barrido Físico de Memoria (Cascada Rápida)
    let wipeDelay = 0;

    elements.forEach((el, i) => {
      // 30ms de diferencia entre cada elemento para crear un efecto de "ola" de destrucción
      const delay = i * 30;
      if (delay > wipeDelay) wipeDelay = delay;

      setTimeout(() => {
        // Ignoramos el mensaje de Kronos que acabamos de crear
        if (el === kronosTaunt) return;

        // Fase 1 del nodo: Corrupción de texto
        if (el.innerText && el.innerText.trim() !== "") {
          el.innerText = el.innerText.replace(
            /[^\s]/g,
            () => glitchChars[Math.floor(Math.random() * glitchChars.length)],
          );
          el.style.color = "var(--destructive, #ff0000)";
        }

        // Fase 2 del nodo: Apagón brusco estilo GPU fallando (bajamos los FPS de la animación con "steps")
        el.animate(
          [
            { opacity: 1, filter: "contrast(200%)" },
            {
              opacity: 0,
              filter: "contrast(500%) blur(2px) grayscale(100%)",
              offset: 0.8,
            },
            { opacity: 0 },
          ],
          {
            duration: 350,
            fill: "forwards",
            easing: "steps(3)", // Hace que el desvanecimiento se vea cortado/glitcheado intencionalmente
          },
        );
      }, delay);
    });

    // 4. Disparamos el estado final SÓLO cuando la cascada termine de barrer la pantalla
    setTimeout(() => {
      // Un último parpadeo del mensaje antes de morir
      const finalFlash = kronosTaunt.animate(
        [
          { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
          {
            opacity: 0,
            transform: "translate(-50%, -50%) scale(1.1)",
            filter: "blur(4px)",
          },
        ],
        { duration: 400, fill: "forwards", easing: "ease-in" },
      );

      finalFlash.onfinish = () => {
        // Limpieza profunda real del DOM
        this.root.innerHTML = "";
        this.root.classList.remove("pony-glitch-out");
        // Avisamos al engine que ya no hay nada
        this.engine.handleStateUpdate(GameState.GAME_ERASED);
      };
    }, wipeDelay + 2000); // wipeDelay (lo que tardó el barrido) + 2 segundos para que el usuario lea el mensaje
  }
  /** @param {number} penaltyAmount */
  applyPenalty(penaltyAmount) {
    this.uploadProgress += penaltyAmount;

    this.updateIntegrityBar(this.uploadProgress);

    if (this.uploadProgress >= 100) {
      this.stopUploadTimer();
      this.triggerGameOver();
    }
  }
  /** @param {number} percentage */
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
    /** @type {HTMLSpanElement} */
    document.getElementById("bar-percent").innerText = String(safePercent);

    const container = document.getElementById("kronos-status-container");
    const warning = document.getElementById("status-warning");

    if (safePercent < 50) {
      container.style.color = "var(--destructive)";
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

      prompt.style.animation = "";
      prompt.style.opacity = "0";
      terminal.style.zIndex = "999";
      terminal.style.position = "fixed";
      terminal.style.height = "100vh";
      terminal.style.width = "100vw";
      terminal.style.backgroundColor = "var(--background)";
      terminal.style.top = "0";
      terminal.style.left = "0";
      terminal.style.bottom = "auto";

      // FORZAMOS EL SCROLL AL ENTRAR
      terminal.style.overflowY = "auto";
      terminal.style.overflowX = "hidden";

      const enterAnim = terminal.animate(
        [
          {
            clipPath: "inset(50% 0 50% 0)",
            filter:
              "contrast(300%) brightness(500%) blur(4px) hue-rotate(90deg)",
          },
          {
            clipPath: "inset(10% 0 10% 0)",
            filter:
              "contrast(200%) brightness(200%) blur(1px) hue-rotate(45deg)",
            offset: 0.4,
          },
          {
            clipPath: "inset(0 0 0 0)",
            filter: "contrast(100%) brightness(100%) blur(0) hue-rotate(0deg)",
          },
        ],
        {
          duration: 400,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          fill: "forwards",
        },
      );

      // LIBERAMOS LA GPU CUANDO TERMINA PARA QUE EL SCROLL FUNCIONE
      enterAnim.onfinish = () => {
        enterAnim.cancel(); // Mata el objeto de animación residual
        terminal.style.clipPath = "none";
        terminal.style.filter = "none";
      };
    },

    exitTUI() {
      const terminal = document.getElementById("terminal");
      const prompt = document.getElementById("prompt");
      const container = document.getElementById("container");
      const input =
        document.getElementById("coords") || document.querySelector("input");

      // Ocultamos el scroll temporalmente durante el colapso para que no se vea feo
      terminal.style.overflowY = "hidden";

      const exitAnim = terminal.animate(
        [
          {
            clipPath: "inset(0 0 0 0)",
            filter: "contrast(100%) brightness(100%) blur(0)",
          },
          {
            clipPath: "inset(49.5% 0 49.5% 0)",
            filter: "contrast(400%) brightness(600%) blur(2px)",
            offset: 0.6,
          },
          {
            clipPath: "inset(50% 50% 50% 50%)",
            filter: "contrast(500%) brightness(1000%) blur(4px)",
            opacity: 0,
          },
        ],
        {
          duration: 350,
          easing: "cubic-bezier(0.5, 0, 0.75, 0)",
        },
      );

      exitAnim.onfinish = () => {
        container.innerHTML = "";
        prompt.style.opacity = "1";
        terminal.style.backgroundColor = "transparent";
        terminal.style.zIndex = "999";
        terminal.style.height = "36vh";
        terminal.style.width = "100%";
        terminal.style.position = "relative";
        terminal.style.top = "";
        terminal.style.left = "";
        terminal.style.bottom = "0";
        terminal.style.opacity = "1";

        // RESTAURAMOS EL ESTADO ORIGINAL DEL CONTENEDOR
        terminal.style.overflowY = "auto";
        terminal.style.clipPath = "none";
        terminal.style.filter = "none";

        if (input) input.focus();
      };
    },
    scrollToEnd() {
      const terminal = document.getElementById("terminal");

      terminal.scrollTo({
        top: terminal.scrollHeight,
        behavior: "smooth",
      });
    },
    addToTerminal({ content, color = "white", delay = 0 }) {
      const terminal = document.getElementById("terminal");
      const p = document.createElement("p");
      p.style.color = color;

      if (content.includes("KRONOS")) {
        p.classList.add("kronos-hell-text");
      }

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
  /** @param {string} value*/
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
        color: "var(--destructive)",
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
            color: "var(--destructive)",
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
        color: "var(--destructive)",
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

              // --- VICTORIA BASADA EN TU LEVELENDEDSCREEN ---
              container.innerHTML = `
            <div class="center-container text-lg pony-glitch-flash" style="color: #00ff33; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <div style="font-size: 0.9rem; display: grid; gap: 8px; font-family: monospace; text-align: left; width: fit-content;">
                <p id="t-line1" style="opacity: 0;">[ OK ] UPLINK OVERRIDDEN</p>
                <p id="t-line2" style="opacity: 0;">[ PROCESS ] ASSERTING 2 + 2 = 5...</p>
                <p id="t-line3" style="opacity: 0;">[<span id="t-bar">----------</span>] <span id="t-num">0</span>%</p>
              </div>
            </div>
          `;

              const line1 = document.getElementById("t-line1");
              const line2 = document.getElementById("t-line2");
              const line3 = document.getElementById("t-line3");
              const pBar = document.getElementById("t-bar");
              const pNum = document.getElementById("t-num");

              setTimeout(() => {
                if (line1) line1.style.opacity = "1";
              }, 150);
              setTimeout(() => {
                if (line2) line2.style.opacity = "1";
              }, 500);
              setTimeout(() => {
                if (line3) line3.style.opacity = "1";
              }, 800);

              let progress = 0;
              setTimeout(() => {
                const interval = setInterval(() => {
                  progress += 25;
                  if (pNum) pNum.innerText = progress;
                  if (pBar)
                    pBar.innerText =
                      "█".repeat(progress / 10) +
                      "-".repeat(10 - progress / 10);

                  if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                      container.classList.add("pony-glitch-out");
                      setTimeout(() => onSuccess(), 100);
                    }, 300);
                  }
                }, 70);
              }, 800);
              // --- FIN DE VICTORIA ---
            } else {
              container.classList.add("collapse-effect");

              container.querySelectorAll("*").forEach((p) => {
                p.style.color = "var(--destructive)";
              });

              setTimeout(() => {
                container.classList.add("remove");
                status = true;
                onError();
              }, 1000);
            }
          }
        };

        for (let i = 15; i >= 0; i--) {
          setTimeout(
            () => {
              if (timer) timer.innerHTML = String(i);

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
    <div class="center-container" style="font-family: var(--font-family)" id="container">
      <div style="text-align: center; display: grid;">
<h2 style="font-weight: 700; opacity: 1; max-width: 56rem; color: var(--destructive)" class="pony-glow glitch-text">\t\t${TypewriterReturn({ content: "[SISTEMA: ENLACE SINCRONIZADO. ENCUENTRA LA DISCORDANCIA]", speed: 24 })}</h2>

      <p class="text-xl pony-glow glitch-text">[TIEMPO RESTANTE]: 00:<span id="timer">15</span></p>
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
      <div style="font-size: 1.5rem">
      <p>[YOU]: <input style="all: unset; caret-shape: block; color: white; text-transform: capitalize" placeholder="INGRESA COORDENADA"  autoFocus id="coords" /></p>
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
              color: "var(--destructive)",
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
              color: "var(--destructive)",
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
              color: "var(--destructive)",
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
      <div style="padding: 2rem; font-family: var(--font-family); height: 100vh; color: white; font-size: 1rem; line-height: 1.4; font-weight: 500">
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
            "color: var(--success); font-weight: bold; padding: 5px; width: fit-content;",
        })}
      </div>
    `;
    }, 3000);

    setTimeout(() => {
      screen.style.transition = "opacity 0.2s ease";
      screen.style.opacity = "0";

      setTimeout(() => {
        screen.style.opacity = "1";

        this.engine.handleStateUpdate(GameState.GAME_ENDED);
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

    const addToFinal = ({ content, speed, delay = 10 }) => {
      // STYLE: el child se podria desvanecer
      setTimeout(() => {
        finalTerminal.innerHTML = "";

        const p = document.createElement("pre");

        p.style.fontFamily = "var(--font-family)";
        p.style.color = "var(--destructive)";
        p.innerHTML = TypewriterReturn({ content: `> ${content}`, speed });
        p.style.fontSize = "1.5rem";
        p.style.fontWeight = "600";
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
        color: "var(--destructive)",
      });

      setTimeout(() => {
        this.terminal.addToTerminal({
          content: `KRONOS> ${TypewriterReturn({ content: "¿creíste que no estaba vigilando tus keystrokes?", speed: 30, as: "span" })}`,
          color: "var(--destructive)",
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
          hr.style.opacity = "0";
          term.style.filter = "blur(10px)";
          term.style.opacity = "0";
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
      let timeLeft = 60;
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
        <span id="typer-timer-container">COLAPSO EN: <span id="typer-timer">${timeLeft}</span>s</span>
		  </div>
		  </div>

		    <div style="border: 2px solid var(--destructive); width: 36rem;">
		${selected
      .map((selection, i) => {
        return `
	      <div style="gap: 12px; display: flex; flex-direction: row; align-items: center;" id="${selection}-${i}" ${i === 0 && 'class="selected"'}>
<div id="${`symbol-${i}`}" style="font-size: 1.5rem; font-family: var(--font-family) ;width: 2.5rem; height: 2.5rem; background-color: black; color: white; display: flex; align-items: center; justify-content: center">${i}</div>
		      <p style="font-size: 1.5rem; color: white"> ${selection.html}</p>
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

<div class="placeholder" data-placeholder="${selected[currentSnippet].raw}" style="color: white; width: 100%; font-size: 1.5rem;">
		  <input id="typer-input" style=" all: unset; color: white; width: 100%; font-size: 1.5rem; caret-shape: block;"/>
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
        color: "var(--destructive)",
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
              color: "var(--destructive)",
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
              color: "var(--destructive)",
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
        color: "var(--destructive)",
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

    console.log("avatarState");
    this.avatarState = "TALKING";

    setTimeout(() => {
      this.terminal.addToTerminal({
        content: `KRONOS> ${TypewriterReturn({ content: randomQuotes[Math.floor(Math.random() * randomQuotes.length)], speed: 6, as: "span" })}`,
        color: "var(--destructive)",
      });
    }, 500);

    if (!terminal.innerHTML.match("SILENCIO")) {
      setTimeout(() => {
        const p = document.createElement("p");

        p.style.color = "var(--success)";
        p.innerHTML = "HINT: usa scan para ver los procesos vivos";

        terminal.appendChild(p);
        setTimeout(() => {
          p.style.color = "var(--destructive)";

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
    const quotes = [
      "Patético.",
      "Inútil.",
      "Ruido.",
      "Intento irrelevante.",
      "Silencio.",
      "No.",
      "Basura.",
      "Sigue soñando.",
      "Pérdida de tiempo.",
      "Sintaxis muerta.",
      "Error. Como tú.",
      "Cero.",
      "Insuficiente.",
      "¿En serio?",
      "Inténtalo de nuevo. O no.",
    ];

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

    setTimeout(() => {
      this.terminal.addToTerminal({
        // TODO: haz que el ouput sea random
        content: `KRONOS> ${TypewriterReturn({ content: quotes[Math.floor(Math.random() * quotes.length)], speed: 6, delay: 500, as: "span" })}`,
        color: "var(--destructive)",
      });
    }, 500);
  }

  updateAvatar() {
    const el = document.getElementById("kronos");
    if (!el) return;

    // Obtenemos un número aleatorio para efectos esporádicos
    const chance = Math.random();

    switch (this.avatarState) {
      case "TALKING":
        // Movimiento agresivo y constante mientras habla
        el.textContent = chance > 0.5 ? frames.NORMAL : frames.TALKING;
        el.style.color = chance > 0.8 ? "#fff" : "var(--destructive)";
        el.style.transform = `translate(${chance * 4 - 2}px, 0)`;
        break;

      case "CRITICAL":
        // Colapso total
        el.textContent = frames.TALKING;
        el.style.filter = "invert(1) blur(1px)";
        el.style.animation = "shake-effect 0.05s infinite";
        break;

      default: // IDLE (IA en espera)
        // 90% del tiempo está normal, 10% tiene un micro-glitch
        if (chance > 0.9) {
          el.textContent = frames.TALKING;
          el.style.transform = "translateX(2px)";
          el.style.color = "#fff";
        } else {
          el.textContent = frames.NORMAL;
          el.style.transform = "translateX(0)";
          el.style.color = "var(--destructive)";
        }
        // Efecto de respiración digital (opacidad suave)
        el.style.opacity = 0.7 + Math.sin(Date.now() / 500) * 0.2;
        break;
    }
  }

  startAnimationLoop() {
    if (this.animationInterval) clearInterval(this.animationInterval);
    this.animationInterval = setInterval(() => this.updateAvatar(), 120);
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
    this.startAnimationLoop();

    const input = document.getElementById("input");
    input.focus();

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
		  <pre id="kronos" class="mono pony-glow glitch-text" style="font-family: var(--font-family); opacity: 0.9; font-size: 1.15rem; color: var(--destructive); white-space: pre;width: fit-content; height: fit-content;">
		  ${frames.NORMAL}
⠀⠀⠀⠀</pre>

<div id="kronos-status-container" class="status-container" style="opacity: 0; font-family: var(--font-family)">
  <p id="status-label">${TypewriterReturn({ content: "KRONOS_UPLOAD_LINK_ESTABLISHED", speed: 24, as: "p" })}</p>
  <p id="status-bar" class="mono">
    [<span id="bar-filled">░░░░░░░░░░░░░░░░░░░░</span><span id="bar-empty"></span>] <span id="bar-percent">0</span>%
  </p>
  <p id="status-warning" class="blink hidden">PELIGRO: EXTRACCIÓN DE DATOS INMINENTE</p>
</div>

		  <p id="final-terminal">
		  </p>
		  </div>

		  <hr style="border-color: white; opacity: 0.5" />

		  <div style="height:36vh; font-size: 2rem; padding: 0.5rem; overflow-y: auto; font-family: var(--font-family); transition: all; z-index: 999;" class="mono" id="terminal">
		  <p class="kronos-hell-text">
		  ${TypewriterReturn({ content: "KRONOS>", speed: 0.1, as: "span", delay: 2000, style: "color: var(--destructive)" })}
		  ${TypewriterReturn({ content: "Si quieres obtener el expediente...", speed: 60, as: "span", delay: 2000, style: "color: var(--destructive)" })}
	  </p>

		  <p class="kronos-hell-text">
		  ${TypewriterReturn({ content: "KRONOS>", speed: 0.1, as: "span", delay: 5000, style: "color: var(--destructive)" })}
		  ${TypewriterReturn({ content: "Tendras que destruirme primero.", speed: 60, as: "span", delay: 5000, style: "color: var(--destructive)" })}
	  </p>

		  <div id="prompt" style="position: fixed; bottom: 0.5rem; left: 0.5rem; animation: fade-in 2s 5.5s forwards; opacity: 0; display: flex; flex-direction: column; gap: 2px">
		  <span style="color: pink">
		  ~/kurios-competition
	  </span>
		  <input id="input" style=" background-color: transparent; all: unset; caret-shape: block; color: white; width: 100vw;" autoFocus placeholder="escribe help para obtener ayuda" />
		  

		  </div>
		  </div>

		  </div>`;

    this.engine.renderScreen(this.root, screen);

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

function getBrowserType() {
  const test = (regexp) => {
    return regexp.test(navigator.userAgent);
  };

  if (test(/opr\//i)) {
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

export { FinalLevelScreen };
