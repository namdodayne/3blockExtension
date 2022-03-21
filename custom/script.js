// if (!getState()) {
//     console.log(typeof getState());
// }
console.log(typeof getState());
var state = [];
var dataDelete = [];
function setDefaultState() {
    var id = generateID();
    var baseState = {};
    baseState[id] = {
        status: "new",
        id: id,
        title: "facebook.com",
    };
    syncState(baseState);
}

function generateID() {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return randLetter + Date.now();
}

function pushToState(title, status, id) {
    var baseState = getState();
    baseState[id] = { id: id, title: title, status: status };
    syncState(baseState);
}

function setToDone(id) {
    var baseState = getState();
    if (baseState[id].status === "new") {
        baseState[id].status = "done";
    } else {
        baseState[id].status = "new";
    }

    syncState(baseState);
}

function deleteTodo(id) {
    console.log(id);
    var baseState = getState();
    delete baseState[id];
    syncState(baseState);
}

function resetState() {
    localStorage.setItem("state", null);
}

function syncState(state) {
    localStorage.setItem("state", JSON.stringify(state));
    const whited = [];
    for (let i in state) {
        whited.push(state[i].title);
    }
    console.log(whited);
    chrome.storage.local.set({ whited });
}

function getState() {
    return JSON.parse(localStorage.getItem("state"));
}

function addItem(text, status, id, noUpdate) {
    var id = id ? id : generateID();
    var c = status === "done" ? "danger" : "";
    if (validURL(text)) {
        text = filterURL(text);
        var item =
            '<li data-id="' +
            id +
            '" class="animated flipInX ' +
            c +
            '"><div class="checkbox"><span class="close"><i class="fa fa-times"></i></span><label><span class="checkbox-mask"></span><input type="checkbox" />' +
            text +
            "</label></div></li>";

        var isError = $(".whitelist").hasClass("hidden");

        if (text === "") {
            $(".err").removeClass("hidden").addClass("animated bounceIn");
        } else {
            $(".err").addClass("hidden");
            $(".whitelisttodo").append(item);
        }
    } else {
        $(".err").removeClass("hidden").addClass("animated bounceIn");
    }
    $(".refresh").removeClass("hidden");

    $(".no-items-white").addClass("hidden");

    $(".whitelist").val("").attr("placeholder", "✍️ Add item...");
    setTimeout(function () {
        $(".whitelisttodo li").removeClass("animated flipInX");
    }, 500);

    if (!noUpdate) {
        if (text != "" && validURL(text)) {
            text = filterURL(text);
            pushToState(text, "new", id);
        }
    }
}

function refresh() {
    $(".whitelisttodo li").each(function (i) {
        $(this)
            .delay(70 * i)
            .queue(function () {
                $(this).addClass("animated bounceOutLeft");
                $(this).dequeue();
            });
    });

    setTimeout(function () {
        $(".whitelisttodo li").remove();
        $(".no-items-white").removeClass("hidden");
        $(".err").addClass("hidden");
    }, 800);
}

$(function () {
    var err = $(".err"),
        formControl = $(".whitelist"),
        isError = formControl.hasClass("hidden");

    if (!isError) {
        formControl.blur(function () {
            err.addClass("hidden");
        });
    }

    $(".whitelistbtn").on("click", function () {
        var itemVal = $(".whitelist").val();
        addItem(itemVal);
        formControl.focus();
    });

    $(".refresh").on("click", refresh);

    // $(".whitelisttodo").on("click", 'input[type="checkbox"]', function() {
    //   var li = $(this)
    //     .parent()
    //     .parent()
    //     .parent();
    //   li.toggleClass("danger");
    //   li.toggleClass("animated flipInX");

    //   setToDone(li.data().id);

    //   deleteTodo(li.data().id)

    //   // addItem(temp[li.data().id].title, "done", temp[li.data().id].id, "new" )

    //   setTimeout(function() {
    //     li.removeClass("animated flipInX");
    //   }, 500);
    // });

    $(".whitelisttodo").on("click", 'input[type="checkbox"]', function () {
        var li = $(this).parent().parent().parent();
        li.toggleClass("danger");
        li.toggleClass("animated flipInX");

        if ($(".whitelisttodo li").length == 1) {
            li.removeClass("animated flipInX").addClass(
                "animated                bounceOutLeft"
            );
            setTimeout(function () {
                li.remove();
                $(".no-items-white").removeClass("hidden");
                $(".refresh").addClass("hidden");
            }, 500);
        } else {
            li.removeClass("animated flipInX").addClass(
                "animated bounceOutLeft"
            );
            setTimeout(function () {
                li.remove();
            }, 500);
        }

        deleteTodo(li.data().id);
    });

    $(".whitelisttodo").on("click", ".close", function () {
        var box = $(this).parent().parent();

        if ($(".whitelisttodo li").length == 1) {
            box.removeClass("animated flipInX").addClass(
                "animated                bounceOutLeft"
            );
            setTimeout(function () {
                box.remove();
                $(".no-items-white").removeClass("hidden");
                $(".refresh").addClass("hidden");
            }, 500);
        } else {
            box.removeClass("animated flipInX").addClass(
                "animated bounceOutLeft"
            );
            setTimeout(function () {
                box.remove();
            }, 500);
        }
        console.log(box.data().id);
        deleteTodo(box.data().id);
    });

    $(".whitelist").keypress(function (e) {
        if (e.which == 13) {
            var itemVal = $(".whitelist").val();
            addItem(itemVal);
        }
    });
    $(".whitelisttodo").sortable();
    $(".whitelisttodo").disableSelection();
});

var todayContainer = document.querySelector(".today");

var d = new Date();

var weekday = new Array(7);
weekday[0] = "Sunday 🖖";
weekday[1] = "Monday 💪😀";
weekday[2] = "Tuesday 😜";
weekday[3] = "Wednesday 😌☕️";
weekday[4] = "Thursday 🤗";
weekday[5] = "Friday 🍻";
weekday[6] = "Saturday 😴";

var n = weekday[d.getDay()];

var randomWordArray = Array(
    "Oh my, it's ",
    "Whoop, it's ",
    "Happy ",
    "Seems it's ",
    "Awesome, it's ",
    "Have a nice ",
    "Happy fabulous ",
    "Enjoy your "
);

var randomWord =
    randomWordArray[Math.floor(Math.random() * randomWordArray.length)];

todayContainer.innerHTML = randomWord + n;

$(document).ready(function () {
    var state = getState();

    if (!state) {
        setDefaultState();
        state = getState();
    }

    Object.keys(state).forEach(function (todoKey) {
        var todo = state[todoKey];
        addItem(todo.title, todo.status, todo.id, true);
    });

    var mins, secs, update;

    init();
    function init() {
        (mins = 25), (secs = 59);
    }

    set();
    function set() {
        $(".mins").text(mins);
    }

    $("#start").on("click", start_timer);
    $("#reset").on("click", reset);
    $("#inc").on("click", inc);
    $("#dec").on("click", dec);

    function start_timer() {
        set();

        $(".dis").attr("disabled", true);

        $(".mins").text(--mins);
        $(".separator").text(":");
        update_timer();

        update = setInterval(update_timer, 1000);
    }

    function update_timer() {
        $(".secs").text(secs);
        --secs;
        if (mins == 0 && secs < 0) {
            reset();
        } else if (secs < 0 && mins > 0) {
            secs = 59;
            --mins;
            $(".mins").text(mins);
        }
    }

    function reset() {
        clearInterval(update);
        $(".secs").text("");
        $(".separator").text("");
        init();
        $(".mins").text(mins);
        $(".dis").attr("disabled", false);
    }

    function inc() {
        mins++;
        $(".mins").text(mins);
    }

    function dec() {
        if (mins > 1) {
            mins--;
            $(".mins").text(mins);
        } else {
            alert("This is the minimum limit.");
        }
    }
});

function validURL(str) {
    var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
        "i"
    ); // fragment locator
    return !!pattern.test(str);
}

function filterURL(url) {
    var match;
    const hostname = url;
    if (
        (match = hostname.match(
            /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
        ))
    ) {
        return match[1];
    }
}
