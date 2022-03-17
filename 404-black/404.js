const linkass = window.location.href;
const research = linkass.indexOf("#http");
const ketqua = linkass.slice(research + 1);
var match, results;
const hostname = ketqua;
if (
    (match = hostname.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
) {
    results = match[1];
}

document.getElementById("allow").addEventListener("click", async function () {
    var tamthoi = [results];

    await chrome.storage.local.set({ tamthoi: tamthoi });
    await chrome.storage.local.get(["tamthoi"], (dataTamThoi) => {
        const { tamthoi } = dataTamThoi;
        console.log("local sau set = " + tamthoi);
    });
    const chuyenHuong = "http://" + results + "/";
    // console.log(chuyenHuong);

    window.location.href = chuyenHuong;
});

document.getElementById("nameOfSite").innerHTML = "<b>" + results + "</b>";
