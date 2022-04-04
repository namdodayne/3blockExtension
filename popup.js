// document.addEventListener("contextmenu", (event) => event.preventDefault());
var clean;
var malicious;
var unrated;
var result;
var pattern =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
async function getdata(url) {
    if (pattern.test(url) === true) {
        fetch(
            "https://api3blockserver.herokuapp.com/api/3block/system/virustotal/v3",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: url,
                }),
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                show(data);
                // alert(data.result.clean);
            })
            .catch(() => {
                alert("error");
            });
        // var data = await response.json();
    } else {
        // document.getElementById("popup").innerHTML =
        //     "This web in blacklist of 3BLOCK";
    }
}

function show(data) {
    console.log(document);
    var engineArray = [];
    var totalValue = document.getElementById("totalValue");
    try {
        var safe = data?.result.clean;
    } catch (error) {}
    for (var k in data.detail) {
        engineArray.push(k);
    }
    totalValue.textContent = safe + "%";
    const labelInLine = document.getElementsByClassName("chart-label");
    if (data.level == "high") {
        // alert(labelInLine);
        labelInLine[0].innerHTML = "Danger";
    } else if (data.level == "medium") {
        labelInLine.innerHTML = "Danger";
    } else if (data.level == "low") {
        labelInLine.innerHTML = "Warning";
    } else {
        labelInLine.innerHTML = "Safe";
    }
    var val1D = document.getElementById("donut-segment1");
    var val2D = document.getElementById("donut-segment2");
    var val3D = document.getElementById("donut-segment3");
    var offset = 25;

    val1D.style.transition =
        "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
    val1D.style.strokeDasharray = safe + " " + (100 - safe);
    val1D.style.strokeDashoffset = offset;

    val2D.style.transition =
        "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
    val2D.style.strokeDasharray = 100 - safe + " " + (100 - (100 - safe));
    val2D.style.strokeDashoffset = 100 - safe + offset;

    val3D.style.transition =
        "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
    val3D.style.strokeDasharray = 0 + " " + (100 - 0);
    val3D.style.strokeDashoffset = 100 - (safe + (100 - safe)) + offset;
    // document.getElementById("engine").innerHTML = engineArray;

    startAnim();

    function startAnim() {
        setTimeout(function () {
            val1D.style.transition =
                "stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out";
            val1D.style.strokeDasharray = "100 0";
        }, 20);
    }
    // line positioning: (100 - previous percent(s) + offset (25% in the opposite direction from 3:00 back to 12:00 to correct pie position)
}
document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query(
        {
            //This method output active URL
            active: true,
            currentWindow: true,
            status: "complete",
            windowType: "normal",
        },
        function (tabs) {
            for (tab in tabs) {
                var tab = tabs[0];
                var url = tab.url;
                var surl = String(url);
                // if (!surl.startsWith('chrome://', 0) && chkblacklist !== null)
                if (
                    !surl.startsWith("chrome", 0) &&
                    !surl.startsWith("https://chrome.google.com/", 0)
                ) {
                    getdata(url);
                    document.getElementById("siteLink").onclick = loadPage;
                    document.getElementById("deleteNoSrc").onclick =
                        deleteNoSrc;
                    document.getElementById("deleteAll").onclick = deleteAll;
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            from: "popup",
                            subject: "iframes",
                        },
                        handleIframeInfoSafe
                    );
                }
            }
        }
    );
});

const checkBox = document.getElementById("myCheck");
chrome.storage.local.get(["enabledchild"], (dataChild) => {
    const { enabledchild } = dataChild;
    if (!enabledchild) {
        checkBox.innerHTML = "Children Mode: <b>Off</b>";
        checkBox.className = "button-36";
        checkBox.style.color = "black";
    } else {
        checkBox.innerHTML = "Children Mode: <b>On</b>";
        checkBox.style.color = "green";
        checkBox.className = "button-33";
    }
});
checkBox.addEventListener("click", function () {
    window.open("/childrenPassword/index.html");
});

// Load page in new tab
function loadPage() {
    chrome.runtime.sendMessage({
        from: "popup",
        subject: "showLink",
    });
}

function handleUpdatedIframes(iframes) {
    if (iframes == 0) {
        document.getElementById("content").style.display = "none";
        document.getElementById("default").style.display = "block";
        document.getElementById("default").innerHTML = "No iframes detected!";
    }
}

function deleteNoSrc(e) {
    var deleteButton = e.target;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                from: "popup",
                subject: "delete",
                id: "noSrc",
                tabId: tabs[0].id,
            },
            handleUpdatedIframes
        );
    });

    document.getElementById("iframesNoSrc").innerHTML =
        "Note: &lt;iframe&gt; tags found no 'src': <b>0</b>";
    document.getElementById("deleteNoSrc").style.display = "none";
}

function deleteAll(e) {
    var deleteButton = e.target;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                from: "popup",
                subject: "delete",
                id: "all",
                tabId: tabs[0].id,
            },
            handleUpdatedIframes
        );
    });
}

function handleDeleteClick(e) {
    var deleteButton = e.target;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                from: "popup",
                subject: "delete",
                id: deleteButton.getAttribute("data-id"),
                tabId: tabs[0].id,
            },
            handleUpdatedIframes
        );
    });

    // Remove deleted iframe row from table
    var td = deleteButton.parentElement;
    var tr = td.parentElement;
    var tbody = document
        .getElementById("iframes")
        .getElementsByTagName("tbody")[0];
    tbody.removeChild(tr);

    if (tbody.children.length == 0) {
        document.getElementById("iframes").style.display = "none";
    }
}

// Handle iframes from the content script
async function handleIframeInfo(iframeInfo) {
    chrome.storage.local.get(["whitelist"], (local) => {
        const { whitelist } = local;
        var countWhite = 0;
        var countNullUrl = 0;
        //todo Here is code iframe render
        // const whiteListChecked = await getWhiteListCheck();
        if (iframeInfo == undefined) {
            // Page is still loading
            return;
        } else {
            document.getElementById("loading").style.display = "none";
        }

        var iframe_srcs = iframeInfo["iframe_srcs"];
        var hostname = iframeInfo["hostname"];
        // alert(iframe_srcs);
        var iframes_no_src = 0;
        if (iframe_srcs.length > 0) {
            for (var i = 0; i < iframe_srcs.length; i++) {
                if (iframe_srcs[i] == null) {
                    iframes_no_src++;
                    continue;
                }

                var iframe_hostname = hostname; // assume if src invalid it's on the current domain
                try {
                    var iframe_src_url = new URL(iframe_srcs[i]);
                    iframe_hostname = iframe_src_url.hostname;
                } catch (e) {
                    // Failed to convert src to URL
                }
                const checkInWhite = whitelist.filter((dataWhite) => {
                    return iframe_hostname.includes(dataWhite);
                });
                if (iframe_hostname == "") {
                    ++countNullUrl;
                }

                if (checkInWhite.length == 0 && iframe_hostname != "") {
                    // Add iframe to table
                    var tbody = document
                        .getElementById("iframes")
                        .getElementsByTagName("tbody")[0];
                    var tr = tbody.insertRow(-1); // append row to end
                    var td_domain = tr.insertCell(0);
                    //var td_source = tr.insertCell(1);
                    var td_delete = tr.insertCell(1);
                    td_domain.innerHTML = iframe_hostname;
                    td_domain.className += "domain";
                    //td_source.innerHTML = iframe_srcs[i];
                    td_delete.className += "delete";

                    // Check if iframe src is from current domain
                    if (hostname.indexOf(iframe_hostname) > -1) {
                        td_domain.classList.add("iframeOk");
                    } else {
                        td_domain.classList.add("iframeWarning");
                    }

                    // Create delete button
                    var deleteButton = document.createElement("button");
                    deleteButton.className = "material-icons";
                    deleteButton.innerHTML = "DEL";
                    deleteButton.onclick = handleDeleteClick;
                    deleteButton.dataset["id"] = i;
                    td_delete.appendChild(deleteButton);
                } else {
                    ++countWhite;
                }
            }

            if (
                iframes_no_src != iframe_srcs.length &&
                iframe_srcs.length != countWhite
            ) {
                document.getElementById("iframes").style.display = "block";
            } else {
                document.getElementById("iframes").style.display = "none";
            }

            if (iframes_no_src == 0) {
                document.getElementById("deleteNoSrc").style.display = "none";
            }

            if (iframes_no_src != 0) {
                document.getElementById("iframesNoSrc").innerHTML =
                    "Note: Iframes no 'src': <b>" +
                    iframes_no_src.toString() +
                    "</b>";
            }
            document.getElementById("content").style.display = "block";
            if (countWhite != 0 && countWhite == iframe_srcs.length) {
                if (countWhite == 1) {
                    document.getElementById("default").innerHTML =
                        "<b>" + countWhite + "</b> iframe in whitelist";
                } else {
                    document.getElementById("default").innerHTML =
                        "<b>" + countWhite + "</b> iframes in whitelist";
                }

                document.getElementById("default").style.display = "block";
                document.getElementById("content").style.display = "none";
            }

            if (countWhite != 0) {
                if (countWhite == 1) {
                    document.getElementById("default").innerHTML =
                        "<b>" + countWhite + "</b> iframe in whitelist";
                } else {
                    document.getElementById("default").innerHTML =
                        "<b>" + countWhite + "</b> iframes in whitelist";
                }
                document.getElementById("default").style.display = "block";
            }
            if (countNullUrl + iframes_no_src == iframe_srcs.length) {
                document.getElementById("titleIfarm").style.display = "none";
                document.getElementById("deleteIfarm").style.display = "none";
            }
        } else {
            document.getElementById("default").style.display = "block";
        }
    });

    // alert(
    //     whiteListChecked.find((domain) => {
    //         if (domain === "playmt.fastlycdn.xyz") {
    //             return true;
    //         }
    //     })
    // );
}

// Wrapper to catch any problems with handler
function handleIframeInfoSafe(iframeInfo) {
    try {
        handleIframeInfo(iframeInfo);
    } catch (e) {
        document.getElementById("error").style.display = "block";
    }
}

function getWhiteListCheck() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["whitelist"], function (local) {
            const { whitelist } = local;
            resolve(whitelist);
        });
    });
}
