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

document.getElementById("nameOfSite").innerHTML = "<b>" + results + "</b>";
