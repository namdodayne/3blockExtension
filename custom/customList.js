const customWhite = localStorage.getItem("state");
const customBlack = localStorage.getItem("stateBlack");

console.log(JSON.parse(customBlack));
console.log(JSON.parse(customWhite));

const checkWhite = document.getElementById("check_White");
const checkBlack = document.getElementById("check_Black");

// checkWhite.checked = localStorage.getItem("whiteOnOff");
// checkBlack.checked = localStorage.getItem("blackOnOff");

chrome.storage.local.get(["enabled"], (dataBlocked) => {
    const { enabled } = dataBlocked;
    console.log("enabled = " + enabled);
    checkWhite.checked = enabled;
});

chrome.storage.local.get(["enabledBlack"], (dataBlocked) => {
    const { enabledBlack } = dataBlocked;
    console.log("enabledBlack = " + enabledBlack);
    checkBlack.checked = enabledBlack;
});

checkWhite.addEventListener("click", () => {
    // localStorage.setItem("whiteOnOff", checkWhite.checked);
    const enabled = checkWhite.checked;
    chrome.storage.local.set({ enabled });
});

checkBlack.addEventListener("click", () => {
    // localStorage.setItem("blackOnOff", checkBlack.checked);
    enabledBlack = checkBlack.checked;
    if (checkBlack.checked) {
        chrome.storage.local.set({ enabledBlack: true });
    } else {
        chrome.storage.local.set({ enabledBlack: false });
    }
});

chrome.storage.local.get(["blocked"], (dataBlocked) => {
    console.log("Block = ");
    console.log(dataBlocked);
});
chrome.storage.local.get(["whited"], (dataBlocked) => {
    console.log("Whited = ");
    console.log(dataBlocked);
});
