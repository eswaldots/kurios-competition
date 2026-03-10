import { TypewriterReturn } from "../components/typewriter.js";
import { DELAY_BEFORE_CALLBACK } from "../constants.js";
import { Engine } from "../engine.js";
import { GameState } from "../state.js";
import { getBrowserType, getOSType } from "../utils.js";

class StartMenuScreen {
  /**
   * @param {Element} root
   * @param {Engine} engine*/
  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
  }
  callback() {
    /** @type {HTMLButtonElement}*/
    document.onkeydown = (e) => {
      if (e.key === "Enter") {
        this.engine.renderScreen(
          this.root,
          `
          <style>
            @keyframes aaa-glitch-flash {
              0% { backdrop-filter: invert(0) brightness(1); background-color: transparent; }
              2% { backdrop-filter: invert(1) hue-rotate(90deg) brightness(3); background-color: rgba(255, 0, 0, 0.4); transform: scale(1.02) translate(8px, -8px); }
              4% { backdrop-filter: invert(0) brightness(10); background-color: #ffffff; transform: scale(1) translate(-8px, 8px); }
              15% { backdrop-filter: invert(0) brightness(5); background-color: #ffffff; transform: translate(0, 0); }
              100% { backdrop-filter: invert(0) brightness(1); background-color: transparent; }
            }

            @keyframes crt-tear {
              0%, 100% { opacity: 0; }
              2% { opacity: 1; transform: scaleY(0.05) scaleX(1.2); background: rgba(0, 255, 255, 0.8); box-shadow: 0 0 20px cyan; }
              4% { opacity: 0; }
            }
          </style>
          
          <div style="position: absolute; top: 0; left: 0; height: 100vh; width: 100vw; z-index: 9999; pointer-events: none; overflow: hidden; animation: aaa-glitch-flash 0.8s cubic-bezier(0.11, 0, 0.5, 0) forwards;">
            
            <div style="position: absolute; top: 45%; left: 0; width: 100%; height: 20px; animation: crt-tear 0.8s forwards; pointer-events: none;"></div>
          </div>
          `,
        );

        setTimeout(() => {
          this.engine.renderScreen(
            this.root,
            `<div class="center-container" style="color: white; text-align: left; align-items: start; max-width: 32rem; margin: auto">
			<div style="opacity: 0.5;">
		  <span>[ KRONOS_SYS ]</span>
<p class="my-2">------------------------------------------------------------------------------</p>
<h1 class="font-size: 2rem">MINISTERIO DE INTELIGENCIA DEPARTAMENTO DE RECUPERACIÓN</h1>
<p  class="my-1"><span>[ ID_EXPEDIENTE ]: K27-ALPHA-99</span> <span>[ ESTADO ]: RED AISLADA</span></p>
<p  class="my-2">------------------------------------------------------------------------------</p>
			</div>
			${TypewriterReturn({ content: "> INFORME DE INCIDENTE", speed: 24, as: "h1", delay: 2000 })}
			${TypewriterReturn({
        content: `
El servidor principal sufrió una brecha crítica.
La extracción de logs automáticos ha fallado.

El agente asignado no regresó. Su último enlace apunta a
una anomalía en el enrutamiento.

> DIRECTIVA:
Analice el volcado de red y localice la IP atacante.
El sistema requiere intervención manual.

¿Proceder con el rastreo manual?
				`,
        speed: 24,
        style: "font-family: var(--font-family); opacity: 0",
        as: "pre",
        delay: 3000,
      })}

			<div style="margin: 0 0 0 auto; cursor: pointer; animation: fade-in 0.01s 12s forwards; opacity:0; ;font-size: 1.5rem" class="simple-button"><span class="char">></span> AUTORIZAR ACCESO</div>
	</div>`,
          );
        }, 1500);

        setTimeout(() => {
          const button = document.querySelector(".simple-button");

          button.onclick = () => {
            button.disabled = true;
            button.style.pointerEvents = "none";
            button.style.color = "black";
            button.style.backgroundColor = "var(--destructive)";
            button.style.borderColor = "var(--destructive)";

            if (this.engine.audio.error) this.engine.audio.error.play();

            const mainContainer = this.root.querySelector("div");

            const retroStyle = document.createElement("style");
            retroStyle.innerHTML = `
              @keyframes pony-island-crash {
                0% { transform: translate(0, 0); }
                
                10% { clip-path: inset(20% 0 50% 0); transform: translate(-15px, 0); filter: invert(1); }
                15% { clip-path: inset(80% 0 10% 0); transform: translate(15px, 0); background-color: red; color: black; }
                
                20% { clip-path: inset(0 0 0 0); transform: translate(0, 0); filter: invert(0); background-color: transparent; }
                
                25% { clip-path: inset(40% 0 20% 0); transform: translate(-10px, 10px); color: var(--destructive); }
                
                30% { clip-path: inset(0 0 0 0); transform: scaleY(0.02); background-color: white; filter: invert(1); }
                35% { transform: scaleY(0); opacity: 0; } /* Corte a negro en seco */
                100% { transform: scaleY(0); opacity: 0; }
              }
              .retro-crash {
                animation: pony-island-crash 0.5s linear forwards;
                pointer-events: none;
              }
            `;
            document.head.appendChild(retroStyle);

            if (mainContainer) {
              mainContainer.classList.add("retro-crash");
            }

            // 4. Esperamos el tiempo exacto (500ms) y lanzamos la terminal
            setTimeout(() => {
              retroStyle.remove();
              this.engine.handleStateUpdate(GameState.INSTRUCTIONS);
            }, 500);
          };
        }, 1510);
      }
    };
  }
  render() {
    const lines = [
      `[  <span style="color: var(--success)">OK</span>  ] Browser model detected: ${getBrowserType()}`,
      `[  OK  ] OS detected: ${getOSType()}`,
      `[ WARN ] System is not running in a VM: ['/usr/bin/systemd-detect-virt'] exited with abnormal exit code [1]: none`,
      "[  OK  ] Started Show Plymouth Boot Screen.",
      "[  OK  ] Reached target Paths.",
      "[  OK  ] Reached target Basic System.",
      "[  OK  ] Found device ST9500325AS.",
      "[  OK  ] Started dracut initqueue hook.",
      "[  OK  ] Starting dracut pre-mount hook...",
      "[  OK  ] Reached target Remote File Systems (Pre).",
      "[  OK  ] Reached target Remote File Systems.",
      "[  OK  ] Started dracut pre-mount hook.",
      "[  OK  ] Starting File System Check on /dev/disk/by-uuid/85e4ae33-c60e-4372-a6ba-9aeb23bf6d86...",
      "[  OK  ] Started File System Check on /dev/disk/by-uuid/85e4ae33-c60e-4372-a6ba-9aeb23bf6d86.",
      "[  OK  ] Mounting /sysroot...",
      "[  OK  ] Mounted /sysroot.",
      "[  OK  ] Reached target Initrd Root File System.",
      "[  OK  ] Starting Reload Configuration from the Real Root...",
      "[  OK  ] Started Reload Configuration from the Real Root.",
      "[  OK  ] Reached target Initrd File Systems.",
      "[  OK  ] Reached target Initrd Default Target.",
      "Welcome to openSUSE 13.2 (Harlequin) (x86_64)!",
      "[  OK  ] Stopped Switch Root.",
      "[  OK  ] Stopped target Switch Root.",
      "[  OK  ] Stopped target Initrd File Systems.",
      "         Stopping File System Check on /dev/disk/by-uuid/85e4ae33-c60e-4372-a6ba-9aeb23bf6d86...",
      "[  OK  ] Stopped File System Check on /dev/disk/by-uuid/85e4ae33-c60e-4372-a6ba-9aeb23bf6d86.",
      "[  OK  ] Stopped target Initrd Root File System.",
      "         Starting Collect Read-Ahead Data...",
      "[  OK  ] Created slice User and Session Slice.",
      "[  OK  ] Created slice system-getty.slice.",
      "[  OK  ] Reached target Remote File Systems (Pre).",
      "[  OK  ] Reached target Remote File Systems.",
      "[  OK  ] Reached target System Time Synchronized.",
      "[  OK  ] Reached target Slices.",
      "[  OK  ] Listening on Delayed Shutdown Socket.",
      "[  OK  ] Listening on /dev/initctl Compatibility Named Pipe.",
      "         Starting Rule generator for /dev/root symlink...",
      "[  OK  ] Stopped Trigger Flushing of Journal to Persistent Storage.",
      "         Stopping Journal Service...",
      "[  OK  ] Stopped Journal Service.",
      "         Starting Journal Service...",
      "[  OK  ] Reached target Paths.",
      "         Mounting Debug File System...",
      "[  OK  ] Set up automount Arbitrary Executable File Formats File System Automount Point.",
      "         Starting Create list of required static device nodes for the current kernel...",
      "         Mounting POSIX Message Queue File System...",
      "         Mounting Huge Pages File System...",
      "[  OK  ] Listening on LVM2 metadata daemon socket.",
      "         Starting LVM2 metadata daemon...",
      "[  OK  ] Listening on Device-mapper event daemon FIFOs.",
      "         Starting Device-mapper event daemon...",
      "         Expecting device dev-disk-by\x2duuid-b8736234\x2d9b90\x2d461b\x2da9db\x2ddd7146428838.device...",
      "         Expecting device dev-disk-by\x2duuid-3911fc92\x2da5b9\x2d4434\x2d8c0e\x2d475e91bb52e9.device...",
      "[  OK  ] Listening on udev Kernel Socket.",
      "[  OK  ] Listening on udev Control Socket.",
      "         Starting udev Coldplug all Devices...",
      "         Expecting device dev-disk-by\x2duuid-89b81b4d\x2d0b19\x2d4a2a\x2d90cb\x2da3fbb1d48517.device...",
      "         Expecting device dev-disk-by\x2duuid-85e4ae33\x2dc60e\x2d4372\x2da6ba\x2d9aeb23bf6d86.device...",
      "[  OK  ] Started Create list of required static device nodes for the current kernel.",
      "         Starting Create static device nodes in /dev...",
      "[  OK  ] Started Collect Read-Ahead Data.",
      "         Starting Load Kernel Modules...",
      "         Starting Remount Root and Kernel File Systems...",
      "[  OK  ] Started Rule generator for /dev/root symlink.",
      "[  OK  ] Started LVM2 metadata daemon.",
      "[  OK  ] Started Device-mapper event daemon.",
      "[  OK  ] Started Load Kernel Modules.",
      "         Starting Apply Kernel Variables...",
      "[  OK  ] Started Journal Service.",
      "[  OK  ] Started udev Coldplug all Devices.",
      "         Starting udev Wait for Complete Device Initialization...",
      "[  OK  ] Started Apply Kernel Variables.",
      "[  OK  ] Started Create static device nodes in /dev.",
      "         Starting udev Kernel Device Manager...",
      "[  OK  ] Started udev Kernel Device Manager.",
      "[  OK  ] Mounted Debug File System.",
      "[  OK  ] Mounted POSIX Message Queue File System.",
      "[  OK  ] Mounted Huge Pages File System.",
      "[  OK  ] Started Remount Root and Kernel File Systems.",
      "         Starting Load/Save Random Seed...",
      "[  OK  ] Reached target Local File Systems (Pre).",
      "[  OK  ] Started Load/Save Random Seed.",
      "         Starting Entropy Daemon based on the HAVEGE algorithm...",
      "[  OK  ] Started Entropy Daemon based on the HAVEGE algorithm.",
      "[  OK  ] Started udev Wait for Complete Device Initialization.",
      "         Starting Activation of LVM2 logical volumes...",
      "[  OK  ] Created slice system-systemd\x2dbacklight.slice.",
      "         Starting Load/Save Screen Backlight Brightness of backlight:acpi_video0...",
      "         Starting Load/Save Screen Backlight Brightness of backlight:intel_backlight...",
      "[  OK  ] Started Load/Save Screen Backlight Brightness of backlight:intel_backlight.",
      "[  OK  ] Started Load/Save Screen Backlight Brightness of backlight:acpi_video0.",
      "[  OK  ] Created slice system-systemd\x2drfkill.slice.",
      "         Starting Load/Save RF Kill Switch Status of rfkill0...",
      "         Starting Load/Save RF Kill Switch Status of rfkill1...",
      "[  OK  ] Started Activation of LVM2 logical volumes.",
      "[  OK  ] Reached target Encrypted Volumes.",
      "         Starting Activation of LVM2 logical volumes...",
      "[  OK  ] Started Load/Save RF Kill Switch Status of rfkill1.",
      "[  OK  ] Started Load/Save RF Kill Switch Status of rfkill0.",
      "[  OK  ] Started Activation of LVM2 logical volumes.",
      "[  ERROR  ] Found invalid state KRONOS",
    ];

    const screen = `
	  <div style="color: white; background-color: transparent; height: 100vh; max-height: 100vh; overflow-y: auto; font-size: 1.2rem; padding: 1rem">
${lines
  .map((line, i) => {
    const isLast = i === lines.length - 1;

    const bracketIndex = line.indexOf("]");

    if (bracketIndex === -1) {
      return `<div class="line">${TypewriterReturn({
        content: line,
        speed: isLast ? 40 : 0.0001,
        delay: i * 50,
        style: `color: ${isLast ? "var(--destructive)" : "white"}; opacity: 0`,
      })}</div>`;
    }

    const tag = line.substring(0, bracketIndex + 1);
    const msg = line.substring(bracketIndex + 1);

    let tagColor = "white";
    if (tag.includes("OK")) tagColor = "var(--success)";
    if (tag.includes("WARN")) tagColor = "yellow";
    if (tag.includes("ERROR")) tagColor = "var(--destructive)";

    if (isLast) tagColor = "var(--destructive)";

    return `<div class="line" style="display: flex; gap: 0.5rem;">
            ${TypewriterReturn({
              content: tag,
              speed: isLast ? 12 : 0.0001,
              delay: i * 50,
              style: `color: ${tagColor}; white-space: pre; opacity: 0`,
              as: "span",
            })}

            ${TypewriterReturn({
              content: msg,
              speed: isLast ? 40 : 0.0001,
              delay: i * 50 + (isLast ? tag.length * 12 : 0),
              style: `color: ${isLast ? "var(--destructive)" : "white"}; white-space: pre; opacity: 0;`,
              as: "span",
            })}
          </div>`;
  })
  .join("")}
		  </div>
	  `;

    this.engine.renderScreen(this.root, screen);

    setTimeout(
      () => {
        this.engine.renderScreen(this.root, ``);
      },
      (lines.length / 1.5) * 100,
    );

    setTimeout(
      () => {
        const kronosLines = [
          "[ ERROR ] KRONOS_PRESENCE_CONFIRMED",
          "[ WARN ] SECURITY_BREACH IN PROGRESS...",
          "[ CRIT ] OVERRIDE DETECTED",
          "PRESIONE ENTER PARA ENTRAR EN EL MODO SEGURO: ",
        ];

        this.engine.renderScreen(
          this.root,
          `
	  <div style="color: white; background-color: transparent; height: 100vh; max-height: 100vh; overflow-y: auto; font-size: 1.2rem; padding: 1rem">

		  ${kronosLines
        .map((line, i) => {
          const isLast = i === kronosLines.length - 1;

          const delay = i * 800;
          const time = line.length * 12;
          const delayTotalCaret = delay + time;

          return `<div class="line flex gap-1" style="align-items: center">${TypewriterReturn(
            {
              content: line,
              speed: 12,
              delay: delay,
              style: `color: ${isLast ? "white" : "var(--destructive)"};`,
            },
          )}${isLast ? `<div class="caret" style="opacity: 0; animation: blink-caret 1s step-end infinite forwards; animation-delay: ${delayTotalCaret}ms;">█</div>` : ""}</div>`;
        })
        .join("")}
		</div>
		`,
        );
      },
      (lines.length / 1.5) * 100,
    );

    setTimeout(() => this.callback(), DELAY_BEFORE_CALLBACK);
  }
}

export { StartMenuScreen };
