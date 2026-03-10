/** @deprecated usar TypewriterReturn mejor*/
const BindTypeWriter = ({ querySelection, delay = 0, speed }) => {
  const container = document.querySelector(querySelection);
  container.style.opacity = 0;

  if (!container) return;

  const text = container.textContent.trim();
  container.textContent = "";

  const charSpans = text.split("").map((char) => {
    const span = document.createElement("span");
    span.classList.add([...container.classList]);

    span.textContent = char;
    span.style.visibility = "hidden";
    container.appendChild(span);
    return span;
  });

  container.style.opacity = 1;

  setTimeout(() => {
    charSpans.forEach((span, i) => {
      setTimeout(() => {
        span.style.visibility = "visible";
      }, speed * i);
    });
  }, delay);
};

const TypewriterReturn = ({
  content,
  speed,
  delay = 0,
  as = "p",
  style = "",
}) => {
  const key = Math.floor(Math.random() * 10000).toString();

  setTimeout(() => {
    /**@type {HTMLElement} */
    const container = document.getElementById(key);
    container.style.opacity = "0";

    if (!container) return;

    const text = container.textContent.trim();
    container.textContent = "";

    const charSpans = text.split("").map((char) => {
      const span = document.createElement("span");

      span.textContent = char;
      span.style.visibility = "hidden";
      container.appendChild(span);
      return span;
    });

    container.style.opacity = "1";

    setTimeout(() => {
      charSpans.forEach((span, i) => {
        setTimeout(() => {
          span.style.visibility = "visible";

          if (i === 0) {
            container.scrollIntoView({ block: "end" });
          }
        }, speed * i);
      });
    }, delay);
  }, 0);

  return `
	<${as ? as : "p"} ${style && `style="${style}"`} id=${key}>${content}</${as ? as : "p"}>
	`;
};

export { TypewriterReturn, BindTypeWriter };
