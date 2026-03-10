/**
 * @param {number} ms
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
};

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

export { sleep, getOSType, getBrowserType };
