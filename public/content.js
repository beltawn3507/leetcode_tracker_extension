// content.js

// console.log("[LC Tracker] content.js loaded on", window.location.href);

function injectButton() {
  const url = window.location.href;
  if (!url.includes("leetcode.com/u/")) return;

  if (document.getElementById("lc-tracker")) return;

  const button = document.createElement("button");
  button.id = "lc-tracker";
  button.textContent = "Track";
  Object.assign(button.style, {
    position:   "fixed",
    top:        "100px",
    right:      "20px",
    padding:    "8px 12px",
    background: "#1a73e8",
    color:      "#fff",
    border:     "none",
    borderRadius: "5px",
    zIndex:     10000,
    cursor:     "pointer",
  });

  button.addEventListener("click", () => {
    chrome.storage.local.get(["trackedUsers"], ({ trackedUsers = [] }) => {
      if (!trackedUsers.includes(url)) {
        trackedUsers.push(url);
        chrome.storage.local.set({ trackedUsers });
        button.textContent = "Tracked ✔";
        button.disabled = true;
        button.style.background = "#4caf50";
      }
    });
  });

  document.body.appendChild(button);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectButton);
} else {
  injectButton();
}
