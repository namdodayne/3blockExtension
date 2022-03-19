const linkass = window.location.href;
const research = linkass.indexOf("#http");
const ketqua = linkass.slice(research + 1);

document.getElementById("allow").addEventListener("click", async function () {
    var tamthoi = [ketqua];

    await chrome.storage.local.set({ tamthoi: tamthoi });
    await chrome.storage.local.get(["tamthoi"], (dataTamThoi) => {
        const { tamthoi } = dataTamThoi;
        console.log("local sau set = " + tamthoi);
    });
    const chuyenHuong = ketqua;
    // console.log(chuyenHuong);

    window.location.href = chuyenHuong;
});
