import { LIVES_STORAGE_KEY } from "../constants.js";

// STYLE: este svg es muy jugueton, usa ascii
const pixelHeartSvg = `
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-0.5 inline-block align-middle">
      <path d="M4 1H6V3H8V5H10V3H12V1H14V3H15V5V7H14V9H13V11H12V13H11V14H10V15H8H6V14H5V13H4V11H3V9H2V7H1V5V3H2V1H4Z" fill="currentColor"/>
    </svg>
  `;

// resuable component
const LivesComponent = ({ onRanOut }) => {
  let livesCount = Number(sessionStorage.getItem(LIVES_STORAGE_KEY));

  window.addEventListener("storage", (event) => {
    if (event.storageArea === sessionStorage) {
      console.log("Session storage key changed:", event.key);
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
		<h1 class="text-2xl font-semibold mx-1">${livesCount}x</h1>

		${Array.from({ length: livesCount })
      .map(() => pixelHeartSvg)
      .join("")}

		</div>
		`;
};

/** 
	 @param {number} newValue 
 */
const updateLives = (newValue) => {
  const livesHeader = document.querySelector(".lives-header");

  sessionStorage.setItem(LIVES_STORAGE_KEY, String(newValue));

  livesHeader.innerHTML = `
		<h1 class="text-2xl font-semibold mx-1">${newValue}x</h1>

		${Array.from({ length: newValue })
      .map(() => pixelHeartSvg)
      .join("")}`;
};

export { LivesComponent, updateLives };
