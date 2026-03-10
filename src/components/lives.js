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
  if (Number(newValue) <= 0) {
    onRanOut();

    return;
  }

  const livesHeader = document.querySelector(".lives-header");

  sessionStorage.setItem(LIVES_STORAGE_KEY, String(newValue));

  livesHeader.innerHTML = `
		${Array.from({ length: newValue })
      .map(() => pixelHeartSvg)
      .join("")}`;
};

export { LivesComponent, updateLives };
