document.getElementById("allow").addEventListener("click", async function () {
    // console.log("Truoc set local = " + oldtamthoi);
    const linkass = window.location.href;
    const research = linkass.indexOf("#http");
    // console.log(research);

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
    // console.log(results);
    var tamthoi = [results];
    // if (oldtamthoi != null) {
    //     tamthoi = [...oldtamthoi, results];
    // } else {
    //     tamthoi = [results];
    // }

    await chrome.storage.local.set({ tamthoi: tamthoi });
    await chrome.storage.local.get(["tamthoi"], (dataTamThoi) => {
        const { tamthoi } = dataTamThoi;
        console.log("local sau set = " + tamthoi);
    });
    const chuyenHuong = "http://" + results + "/";
    // console.log(chuyenHuong);
    setTimeout(() => {
        window.location.href = chuyenHuong;
    }, 2000);
});
