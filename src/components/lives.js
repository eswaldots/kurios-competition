import { LIVES_STORAGE_KEY } from "../constants.js";

// STYLE: este svg es muy jugueton, usa ascii
const pixelHeartSvg = `
        <span class="node-init glitch-text pony-glow" style="font-size: 1.5rem; animation-delay: 0.8s;">⟨ ◈ ⟩</span>
  `;

// resuable component
const LivesComponent = ({ onRanOut }) => {
  let livesCount = Number(sessionStorage.getItem(LIVES_STORAGE_KEY));

  window.addEventListener("storage", (event) => {
    console.log("Session storage key changed:", event.key);
    if (event.storageArea === sessionStorage) {
      if (event.key === "lives") {
        livesCount = Number(event.newValue);

        if (Number(event.newValue) <= 0) {
          onRanOut();

          return;
        }
      }
    }
  });

  setTimeout(() => {
    if (livesCount === 1) {
      const lives = document.querySelector(".node-init");
      /** @type {HTMLElement} */
      const livesHeader = document.querySelector(".lives-header");
      /** @type {HTMLElement} */
      const livesContainer = document.querySelector(".lives-container");
      const scanlines = document.querySelector(".root");

      scanlines.classList.add("danger-scalines");

      livesContainer.style.right = "1rem";
      livesHeader.style.color = "var(--destructive)";

      lives.classList.add("node-init-danger");
    }
  }, 10);

  return `
	<div class="flex flex-row items-center lives-header" style="view-transition-name: lives-header;">

		${Array.from({ length: livesCount })
      .map(() => pixelHeartSvg)
      .join("")}

		</div>
		`;
};

/** 
	 @param {number} newValue 
 */
const updateLives = (newValue, onRanOut) => {
  /** @type {HTMLElement} */
  const livesHeader = document.querySelector(".lives-header");
  /** @type {HTMLElement} */
  const livesContainer = document.querySelector(".lives-container");
  /** @type {HTMLElement} */

  if (Number(newValue) <= 0) {
    onRanOut();
    document.getElementById("root").classList.remove("danger-scanlines");
    document.getElementById("root").classList.add("scanlines");

    return;
  }

  sessionStorage.setItem(LIVES_STORAGE_KEY, String(newValue));

  livesHeader.innerHTML = `
		${Array.from({ length: newValue })
      .map(() => pixelHeartSvg)
      .join("")}`;

  setTimeout(() => {
    if (Number(newValue) === 1) {
      const lives = document.querySelector(".node-init");

      const scanlines = document.getElementById("root");

      scanlines.classList.remove("scanlines");
      scanlines.classList.add("danger-scanlines");

      livesContainer.style.right = "1rem";
      livesHeader.style.color = "var(--destructive)";

      lives.classList.add("node-init-danger");
    }
  });
};

export { LivesComponent, updateLives };
