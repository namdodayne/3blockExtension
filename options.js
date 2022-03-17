"use strict";
// document.addEventListener("contextmenu", (event) => event.preventDefault());
/* global chrome, window, document */

const textarea = document.getElementById("textarea");
const save = document.getElementById("save");
const checkbox = document.getElementById("checkbox");
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

whitebox.placeholder = ["facebook.com", "instagram.com", "youtube.com"].join(
    "\n"
);

save.addEventListener("click", () => {
    const blocked = textarea.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

    chrome.storage.local.set({ blocked });

    const whited = whitebox.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    chrome.storage.local.set({ whited });
});

checkbox.addEventListener("change", (event) => {
    const enabled = event.target.checked;
    // alert("change ne");
    chrome.storage.local.set({ enabled });
});

window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["blocked", "enabled"], function (local) {
        const { blocked, enabled } = local;
        if (!Array.isArray(blocked)) {
            return;
        }

        // blocked
        var value = blocked.join("\r\n"); // display every blocked in new line
        textarea.value = value;

        // enabled
        checkbox.checked = enabled;

        // show controls
        document.body.classList.add("ready");
    });

    chrome.storage.local.get(["whited", "enabled"], function (local) {
        const { whited, enabled } = local;
        if (!Array.isArray(whited)) {
            return;
        }

        // blocked
        var value = whited.join("\r\n"); // display every blocked in new line
        whitebox.value = value;

        // enabled
        checkbox.checked = enabled;

        // show controls
        document.body.classList.add("ready");
    });
});
