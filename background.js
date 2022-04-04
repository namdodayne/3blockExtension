"use strict";

function updateBadge(response) {
    try {
        console.log("update badge tab id: " + response["tabId"]);

        if (response["iframes"] > 0) {
            chrome.action.setTitle({
                title: "Iframes detected, click for more info",
                tabId: response["tabId"],
            });
            chrome.action.setBadgeText({
                text: response["iframes"].toString(),
                tabId: response["tabId"],
            });
            chrome.action.setBadgeBackgroundColor({
                color: "#CA2E0B",
                tabId: response["tabId"],
            });
        } else {
            chrome.action.setTitle({
                title: "No iframes detected",
                tabId: response["tabId"],
            });
            chrome.action.setBadgeText({
                text: "0",
                tabId: response["tabId"],
            });
            chrome.action.setBadgeBackgroundColor({
                color: "#4CAF50",
                tabId: response["tabId"],
            });
        }
    } catch {
        console.log("updateBadge has error!");
    }
}

// Add listener to update badge when tab loadstens for content messages
chrome.runtime.onMessage.addListener(function (msg, sender) {
    if (msg.from === "content" && msg.subject === "updateBadge") {
        updateBadge(msg);
    } else if (msg.from === "popup" && msg.subject === "showLink") {
        chrome.tabs.create({
            url: "https://3block.systems/",
        });
    }
});
/* global chrome, URL */
// https://api3blockserver.herokuapp.com/db/api/system/3block/getAllWhitePublic
//! Cai nay dung de lay va luu api black + white list
// document.getElementById("allow")
//   .addEventListener("click", () => {

//   });
async function getdata(typeList) {
    const response = await fetch(
        "https://api3blockserver.herokuapp.com/db/api/system/3block/getAll" +
            typeList +
            "Public",
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );
    var data = await response.json();
    var blacklist = [];
    var whitelist = [];
    const urllist = data.map((value) => {
        let results, match;
        if (
            (match = value.url.match(
                /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
            ))
        ) {
            results = match[1];
            if (typeList == "Black") {
                blacklist.push(results);
            } else {
                whitelist.push(results);
            }
        }
    });
    if (typeList == "Black") {
        chrome.storage.local.set({ blacklist });
        const evil = true;
        chrome.storage.local.set({ evil });
    } else {
        chrome.storage.local.set({ whitelist });
        const good = true;
        chrome.storage.local.set({ good });
    }
}
function getCache18(typeList) {
    fetch(
        "https://api3blockserver.herokuapp.com/api/3block/system/" + typeList,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    )
        .then((res) => {
            return res.json();
        })
        .then((cache18) => {
            if (typeList == "getCache18") chrome.storage.local.set({ cache18 });
            else {
                chrome.storage.local.set({ notFound18: cache18 });
                // console.log(cache18);
            }
        });
}

function is18Plus(url, isCheck) {
    return new Promise((resolve, reject) => {
        fetch(
            "https://api3blockserver.herokuapp.com/api/3block/system/is18Plus",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url,
                    isCheck,
                }),
            }
        )
            .then((res) => {
                return res.json();
            })
            .then((result18) => {
                // console.log(result18);
                if (result18.result === "success") {
                    getCache18("getCache18");
                    resolve(true);
                }
                getCache18("getNotFound18");
                resolve(false);
            })
            .catch((err) => {
                console.log(err);
                resolve(false);
            });
    });
}

//api lay black and white public
chrome.runtime.onInstalled.addListener(function (installed) {
    getdata("Black");
    getdata("White");
    getCache18("getCache18");
    getCache18("getNotFound18");
    // is18Plus("pornhub.com");
    //! Mở 3 Block Here
    // chrome.tabs.create({ url: "https://3block.systems/" }, function (tab) {
    //     console.log("New tab launched with https://3block.systems/");
    // });
    chrome.storage.local.get(["tamthoi"], function (local) {
        if (!Array.isArray(local.tamthoi)) {
            chrome.storage.local.set({ tamthoi: [] });
        }
    });

    chrome.storage.local.get(["timeLog"], function (local) {
        if (!Array.isArray(local.timeLog)) {
            chrome.storage.local.set({ timeLog: [] });
        }
    });
    //todo Tạo custom black list
    chrome.storage.local.get(["blocked", "enabledBlack"], function (local) {
        if (!Array.isArray(local.blocked)) {
            chrome.storage.local.set({ blocked: [] });
        }

        if (typeof local.enabledBlack !== "boolean") {
            chrome.storage.local.set({ enabledBlack: false });
        }
    });
    //todo Tạo custom children list
    chrome.storage.local.get(
        ["blockedchild", "enabledchild"],
        function (local) {
            if (!Array.isArray(local.blockedchild)) {
                chrome.storage.local.set({ blockedchild: [] });
            }

            if (typeof local.enabledchild !== "boolean") {
                chrome.storage.local.set({ enabledchild: false });
            }
        }
    );
    //todo Tạo black list public
    chrome.storage.local.get(["blacklist", "evil"], function (local) {
        if (!Array.isArray(local.blacklist)) {
            chrome.storage.local.set({ blacklist: [] });
        }

        if (typeof local.evil !== "boolean") {
            chrome.storage.local.set({ evil: false });
        }
    });

    //todo Tạo white list custom
    chrome.storage.local.get(["whited", "enabled"], function (local) {
        if (!Array.isArray(local.whited)) {
            chrome.storage.local.set({ whited: [] });
        }

        if (typeof local.enabled !== "boolean") {
            chrome.storage.local.set({ enabled: false });
        }
    });

    //todo Tạo white list public
    chrome.storage.local.get(["whitelist", "good"], function (local) {
        if (!Array.isArray(local.whitelist)) {
            chrome.storage.local.set({ whitelist: [] });
        }

        if (typeof local.good !== "boolean") {
            chrome.storage.local.set({ good: false });
        }
    });
});

//! block and pass url
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    // console.log(changeInfo.status);
    // console.log("How much?");
    if (
        !tab.url.startsWith("chrome", 0) &&
        !tab.url.startsWith("https://chrome.google.com/", 0)
    ) {
        try {
            if (changeInfo.status == "complete" && tab.active) {
                // console.log("complete");
                chrome.tabs.sendMessage(
                    tabId,
                    {
                        from: "background",
                        tabId: tabId,
                    },
                    updateBadge
                );
            } else if (changeInfo.status == "loading" && tab.active) {
                chrome.action.setTitle({
                    title: "Page is loading...",
                    tabId: tabId,
                });
                chrome.action.setBadgeText({
                    text: "?",
                    tabId: tabId,
                });
                chrome.action.setBadgeBackgroundColor({
                    color: "#3F51B5",
                    tabId: tabId,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    //######################################################################

    //! Children On Off here
    function isChildEnable() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["enabledchild"], (dataChild) => {
                const { enabledchild } = dataChild;
                resolve(enabledchild);
            });
        });
    }

    const checkChildOnOff = await isChildEnable();

    //######################################################################

    chrome.tabs.query(
        {
            //This method output active URL
            active: true,
            currentWindow: true,
            status: "loading",
            windowType: "normal",
        },
        async function (tabs) {
            if (changeInfo.status == "loading") {
                for (tab in tabs) {
                    var tab = tabs[0];
                    var url = tab.url;
                    var surl = String(url);

                    var i = 0;
                    // if (!surl.startsWith('chrome://', 0) && chkblacklist !== null)
                    if (surl == "chrome://extensions/" && checkChildOnOff) {
                        chrome.storage.local.get("timeLog", (timeLocalLog) => {
                            const { timeLog } = timeLocalLog;
                            // console.log(timeLog);
                            // console.log(String(new Date()));
                            chrome.storage.local.set({
                                timeLog: [...timeLog, String(new Date())],
                            });
                        });
                    }
                    if (
                        !surl.startsWith("chrome", 0) &&
                        !surl.startsWith("https://chrome.google.com/", 0)
                    ) {
                        var match, results;
                        const hostname = url;
                        if (
                            (match = hostname.match(
                                /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
                            ))
                        ) {
                            results = match[1];
                        }
                        //! Coi lại cái LOCK enabled Child
                        //todo Custom child check

                        if (results == undefined) {
                            return;
                        }
                        // console.warn("Check DB ! : " + results);
                        // return;

                        if (checkChildOnOff) {
                            // console.warn("Children Protect ON");
                            function blockChildCustom() {
                                return new Promise((resolve, reject) => {
                                    chrome.storage.local.get(
                                        ["blockedchild"],
                                        function (local) {
                                            const { blockedchild } = local;
                                            if (
                                                Array.isArray(blockedchild) &&
                                                blockedchild.find((domain) => {
                                                    if (domain === results) {
                                                        return true;
                                                    }
                                                })
                                            ) {
                                                resolve(true);
                                                chrome.tabs.update(tabId, {
                                                    url: "/404-children/index2.html#",
                                                });
                                            }
                                            resolve(false);
                                        }
                                    );
                                });
                            }
                            const checkChildCustom = await blockChildCustom();
                            if (checkChildCustom) {
                                console.warn(
                                    "Check true " + results + " by Custom child"
                                );
                                return;
                            }
                            // console.info("Custom child next! :" + results);
                        }

                        //todo Go continue
                        function goContinue() {
                            return new Promise((resolve, reject) => {
                                // console.log("Vao tim");
                                chrome.storage.local.get(
                                    ["tamthoi"],
                                    function (local) {
                                        const { tamthoi } = local;
                                        // console.info(
                                        //     "Tam thoi truoc Check = " + tamthoi
                                        // );
                                        // if (tamthoi == undefined) {
                                        //     resolve(true);
                                        // }
                                        const checkTamThoi = tamthoi.filter(
                                            (dataTamThoi) => {
                                                return dataTamThoi == results;
                                            }
                                        );
                                        // console.log(
                                        //     "checkTamThoi in Filter = " +
                                        //         checkTamThoi
                                        // );
                                        const newCheckTamThoiStorage = [];
                                        tamthoi.map((dataTamThoiNe) => {
                                            if (
                                                dataTamThoiNe != checkTamThoi[0]
                                            ) {
                                                newCheckTamThoiStorage.push(
                                                    dataTamThoiNe
                                                );
                                            }
                                        });
                                        chrome.storage.local.set({
                                            tamthoi: newCheckTamThoiStorage,
                                        });
                                        chrome.storage.local.get(
                                            ["tamthoi"],
                                            (dataTamThoi) => {
                                                const { tamthoi } = dataTamThoi;
                                                // console.info(
                                                //     "Local now sau check = " +
                                                //         tamthoi
                                                // );
                                            }
                                        );
                                        if (checkTamThoi.length != 0) {
                                            resolve(true);
                                        } else {
                                            resolve(false);
                                        }
                                    }
                                );
                            });
                        }

                        const checkGoContinue = await goContinue();
                        if (checkGoContinue) {
                            console.warn("Go Continue with : " + results);
                            return;
                        }

                        //todo White list Custom check
                        function blockWhiteCustom() {
                            return new Promise((resolve, reject) => {
                                chrome.storage.local.get(
                                    ["whited", "enabled"],
                                    function (local) {
                                        const { whited, enabled } = local;
                                        if (
                                            Array.isArray(whited) &&
                                            enabled &&
                                            whited.find((domain) => {
                                                if (domain === results) {
                                                    return true;
                                                }
                                            })
                                        ) {
                                            resolve(true);
                                        }
                                        resolve(false);
                                    }
                                );
                            });
                        }

                        const checkWhiteCustom = await blockWhiteCustom();
                        if (checkWhiteCustom) {
                            console.warn(
                                "Check true " + results + " by Custom white"
                            );
                            return;
                        }
                        // console.info("Custom white next! :" + results);

                        //todo Black list Custom check
                        function blockBlackCustom() {
                            return new Promise((resolve, reject) => {
                                chrome.storage.local.get(
                                    ["blocked", "enabledBlack"],
                                    function (local) {
                                        const { blocked, enabledBlack } = local;
                                        // console.log(blocked);
                                        // console.log(enabledBlack);
                                        if (
                                            Array.isArray(blocked) &&
                                            enabledBlack &&
                                            blocked.find((domain) => {
                                                if (domain === results) {
                                                    return true;
                                                }
                                            })
                                        ) {
                                            resolve(true);
                                            chrome.tabs.update(tabId, {
                                                url: "/404-black/dist/index2.html#",
                                            });
                                        }
                                        resolve(false);
                                    }
                                );
                            });
                        }

                        const checkBlackCustom = await blockBlackCustom();
                        if (checkBlackCustom) {
                            console.warn(
                                "Check true " + results + " by Custom black"
                            );
                            return;
                        }
                        // console.info("Custom black next! :" + results);

                        //todo White list Public check
                        function blockWhitePublic() {
                            return new Promise((resolve, reject) => {
                                chrome.storage.local.get(
                                    ["whitelist", "good"],
                                    function (local) {
                                        const { whitelist, good } = local;
                                        if (
                                            Array.isArray(whitelist) &&
                                            good &&
                                            whitelist.find((domain) => {
                                                if (domain === results) {
                                                    return true;
                                                }
                                            })
                                        ) {
                                            resolve(true);
                                        }
                                        resolve(false);
                                    }
                                );
                            });
                        }
                        const checkWhitePublic = await blockWhitePublic();
                        if (checkWhitePublic) {
                            console.warn(
                                "Check true " + results + " by Public White"
                            );
                            return;
                        }
                        // console.info("Public White next! :" + results);

                        //todo Black list Public check
                        function blockBlackPublic() {
                            return new Promise((resolve, reject) => {
                                chrome.storage.local.get(
                                    ["blacklist", "evil"],
                                    function (local) {
                                        const { blacklist, evil } = local;
                                        if (
                                            Array.isArray(blacklist) &&
                                            evil &&
                                            blacklist.find((domain) => {
                                                if (domain === results) {
                                                    return true;
                                                }
                                            })
                                        ) {
                                            resolve(true);
                                            chrome.tabs.update(tabId, {
                                                url:
                                                    "/404-black/dist/index.html#" +
                                                    surl,
                                            });
                                        }
                                        resolve(false);
                                    }
                                );
                            });
                        }

                        const checkBlackPublic = await blockBlackPublic();
                        if (checkBlackPublic) {
                            console.warn(
                                "Check true " + results + " by Public Black"
                            );
                            return;
                        }
                        // console.info("Public Black next! :" + results);

                        //todo Local cache 18+ check
                        function blockCache18Plus() {
                            return new Promise((resolve, reject) => {
                                chrome.storage.local.get(
                                    ["enabledchild"],
                                    (isCheck18Enable) => {
                                        // console.warn(
                                        //     "18+ Active: ? " + isCheck18Enable
                                        // );
                                        if (isCheck18Enable != null) {
                                            chrome.storage.local.get(
                                                ["cache18"],
                                                (cache18) => {
                                                    const newCache =
                                                        cache18.cache18.filter(
                                                            (dataCheck18) => {
                                                                return (
                                                                    dataCheck18.url ===
                                                                    results
                                                                );
                                                            }
                                                        );
                                                    if (newCache.length != 0) {
                                                        resolve(true);
                                                        chrome.tabs.update(
                                                            tabId,
                                                            {
                                                                url: "/404-children/index.html#",
                                                            }
                                                        );
                                                    }
                                                    resolve(false);
                                                }
                                            );
                                        }
                                    }
                                );
                            });
                        }

                        if (checkChildOnOff) {
                            const checkCache18Plus = await blockCache18Plus();
                            if (checkCache18Plus) {
                                console.warn(
                                    "Check true " +
                                        results +
                                        " by Cache 18 Plus"
                                );
                                return;
                            }
                        }
                        // console.info("Cache 18 Plus next! :" + results);

                        console.warn("All DB check not Found!");
                    }
                }
            }
        }
    );
    if (checkChildOnOff) {
        //! Call API check when complete
        chrome.tabs.query(
            {
                //This method output active URL
                active: true,
                currentWindow: true,
                status: "complete",
                windowType: "normal",
            },
            async function (tabs) {
                if (changeInfo.status == "complete") {
                    for (tab in tabs) {
                        // console.warn("goo!!!");
                        var tab = tabs[0];
                        var url = tab.url;
                        var surl = String(url);

                        var i = 0;
                        // if (!surl.startsWith('chrome://', 0) && chkblacklist !== null)
                        if (
                            !surl.startsWith("chrome", 0) &&
                            !surl.startsWith("https://chrome.google.com/", 0)
                        ) {
                            var match, results;
                            const hostname = url;
                            if (
                                (match = hostname.match(
                                    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
                                ))
                            ) {
                                results = match[1];
                            }
                            if (results == undefined) {
                                return;
                            }
                            //todo White list Public check
                            function blockWhitePublics() {
                                return new Promise((resolve, reject) => {
                                    chrome.storage.local.get(
                                        ["whitelist", "good"],
                                        function (local) {
                                            const { whitelist, good } = local;
                                            if (
                                                Array.isArray(whitelist) &&
                                                good &&
                                                whitelist.find((domain) => {
                                                    if (domain === results) {
                                                        return true;
                                                    }
                                                })
                                            ) {
                                                resolve(true);
                                            }
                                            resolve(false);
                                        }
                                    );
                                });
                            }
                            const checkWhiteOn = await blockWhitePublics();
                            //! Nếu có trong white list rồi thì ko scan 18+
                            if (checkWhiteOn) {
                                return;
                            }
                            //todo Not Found 18 check
                            function blockNotFound18() {
                                return new Promise((resolve, reject) => {
                                    chrome.storage.local.get(
                                        ["notFound18"],
                                        function (local) {
                                            const { notFound18 } = local;
                                            if (
                                                Array.isArray(notFound18) &&
                                                notFound18.find((domain) => {
                                                    if (
                                                        domain.url === results
                                                    ) {
                                                        return true;
                                                    }
                                                })
                                            ) {
                                                resolve(true);
                                            }
                                            resolve(false);
                                        }
                                    );
                                });
                            }
                            const checkNotFound18 = await blockNotFound18();
                            //! Nếu có trong Not Found rồi thì ko scan 18+
                            if (checkNotFound18) {
                                console.log("Check True by Not Found 18+");
                                return;
                            }
                            console.log("call API AI! : " + results);
                            // return;
                            const isAdult = await is18Plus(results, false); //todo False là ko có AI
                            // const isAdult = false;
                            // console.log("IsAdult " + isAdult);
                            if (isAdult) {
                                console.warn(
                                    "Check true " + results + " by API 18 Plus"
                                );
                                chrome.tabs.update(tabId, {
                                    url: "/404-children/index.html#",
                                });
                            } else {
                                console.info("API 18 Plus next! :" + results);
                            }
                        }
                    }
                }
            }
        );
    }
});

//block download
//! Không bắt đc download
chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
    console.log(item.id);
    suggest({
        filename: item.filename,
        conflict_action: "prompt",
        conflictAction: "prompt",
    });

    if (true) {
        chrome.storage.local.get(["tamthoi"], function (local) {
            const { tamthoi } = local;
            console.info("Tam thoi truoc Check = " + tamthoi);

            const checkTamThoi = tamthoi.filter((dataTamThoi) => {
                return dataTamThoi == item.url;
            });
            console.log("checkTamThoi in Filter = " + checkTamThoi);
            const newCheckTamThoiStorage = [];
            tamthoi.map((dataTamThoiNe) => {
                if (dataTamThoiNe != checkTamThoi[0]) {
                    newCheckTamThoiStorage.push(dataTamThoiNe);
                }
            });
            chrome.storage.local.set({
                tamthoi: newCheckTamThoiStorage,
            });
            chrome.storage.local.get(["tamthoi"], (dataTamThoi) => {
                const { tamthoi } = dataTamThoi;
                console.info("Local now sau check = " + tamthoi);
            });
            if (checkTamThoi.length == 0) {
                // console.log("ELSOOOOOOOOOO");
                // your cancel condition
                var match, results;
                if (
                    (match = item.url.match(
                        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
                    ))
                ) {
                    results = match[1];
                }

                chrome.storage.local.get(
                    ["blocked", "enabledBlack"],
                    function (local) {
                        const { blocked, enabledBlack } = local;

                        if (
                            Array.isArray(blocked) &&
                            enabledBlack &&
                            blocked.find((domain) => {
                                if (domain === results) {
                                    return true;
                                }
                            })
                        ) {
                            console.log(item.id);
                            chrome.downloads.cancel(item.id);
                            chrome.tabs.update({
                                url: "/404-black/dist/index3.html#" + item.url,
                            });
                        }
                    }
                );
                chrome.storage.local.get(
                    ["blacklist", "evil"],
                    function (local) {
                        const { blacklist, evil } = local;
                        if (
                            Array.isArray(blacklist) &&
                            evil &&
                            blacklist.find((domain) => {
                                if (domain === results) {
                                    return true;
                                }
                            })
                        ) {
                            chrome.downloads.cancel(item.id);
                            chrome.tabs.update({
                                url: "/404-black/dist/index3.html#" + item.url,
                            });
                        }
                    }
                );
            }
        });
    }
});
