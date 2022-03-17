"use strict";
// document.addEventListener("contextmenu", (event) => event.preventDefault());
/* global chrome, window, document */

const textarea = document.getElementById("textarea");
const save = document.getElementById("save");
const checkbox = document.getElementById("checkbox-children");
const whitebox = document.getElementById("whitebox");

textarea.placeholder = [
    "facebook.com",
    "instagram.com",
    "youtube.com",
    "!music.youtube.com",
    "twitter.com",
    "reddit.com",
    "!reddit.com/r/MachineLearning",
].join("\n");

save.addEventListener("click", () => {
    const blockedchild = textarea.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    // alert(blockedchild);
    chrome.storage.local.set({ blockedchild });
});

checkbox.addEventListener("change", (event) => {
    const enabledchild = event.target.checked;

    // console.log(enabledchild);
    // localStorage.setItem("enabledchild", enabledchild);
    chrome.storage.local.set({ enabledchild: enabledchild });
});

window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(
        ["blockedchild", "enabledchild"],
        function (local) {
            const { blockedchild, enabledchild } = local;
            if (!Array.isArray(blockedchild)) {
                return;
            }

            // blockedchild
            var value = blockedchild.join("\r\n"); // display every blockedchild in new line
            textarea.value = value;

            // enabledchild
            checkbox.checked = enabledchild;

            // show controls
            document.body.classList.add("ready");
        }
    );
});
