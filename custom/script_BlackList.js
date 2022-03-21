var state = [];

function setDefaultStateBlack() {
    var id = generateIDBlack();
    var baseState = {};
    baseState[id] = {
        status: "new",
        id: id,
        title: "abclike.xyz",
    };
    syncStateBlack(baseState);
}

function generateIDBlack() {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return randLetter + Date.now();
}

function pushToStateBlack(title, status, id) {
    var baseState = getStateBlack();
    baseState[id] = { id: id, title: title, status: status };
    syncStateBlack(baseState);
}

function setToDoneBlack(id) {
    var baseState = getStateBlack();
    if (baseState[id].status === "new") {
        baseState[id].status = "done";
    } else {
        baseState[id].status = "new";
    }

    syncStateBlack(baseState);
}

function deleteTodoBlack(id) {
    console.log(id);
    var baseState = getStateBlack();
    delete baseState[id];
    syncStateBlack(baseState);
}

function resetStateBlack() {
    localStorage.setItem("stateBlack", null);
}

function syncStateBlack(state) {
    localStorage.setItem("stateBlack", JSON.stringify(state));
    const blocked = [];
    for (let i in state) {
        blocked.push(state[i].title);
    }
    console.log(blocked);
    chrome.storage.local.set({ blocked });
}

function getStateBlack() {
    return JSON.parse(localStorage.getItem("stateBlack"));
}

function addItemBlack(text, status, id, noUpdate) {
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

        var isError = $(".blacklist").hasClass("hidden");

        //render ra ở đây
        if (text === "") {
            $(".err1").removeClass("hidden").addClass("animated bounceIn");
        } else {
            $(".err1").addClass("hidden");
            $(".blacklisttodo").append(item);
        }
    } else {
        $(".err1").removeClass("hidden").addClass("animated bounceIn");
    }
    $(".refresh").removeClass("hidden");

    $(".no-items-black").addClass("hidden");

    $(".blacklist").val("").attr("placeholder", "✍️ Add item...");
    setTimeout(function () {
        $(".blacklisttodo li").removeClass("animated flipInX");
    }, 500);

    if (!noUpdate) {
        if (text != "" && validURL(text)) {
            text = filterURL(text);
            pushToStateBlack(text, "new", id);
        }
    }
}

function refreshBlack() {
    $(".blacklisttodo li").each(function (i) {
        $(this)
            .delay(70 * i)
            .queue(function () {
                $(this).addClass("animated bounceOutLeft");
                $(this).dequeue();
            });
    });

    setTimeout(function () {
        $(".blacklisttodo li").remove();
        $(".no-items-black").removeClass("hidden");
        $(".err").addClass("hidden");
    }, 800);
}

$(function () {
    var err = $(".err1"),
        formControl = $(".blacklist"),
        isError = formControl.hasClass("hidden");

    if (!isError) {
        formControl.blur(function () {
            err.addClass("hidden");
        });
    }

    $(".blacklistbtn").on("click", function () {
        var itemVal = $(".blacklist").val();
        addItemBlack(itemVal);
        formControl.focus();
    });

    $(".refresh").on("click", refreshBlack);

    // $(".blacklisttodo").on("click", 'input[type="checkbox"]', function() {
    //   var li = $(this)
    //     .parent()
    //     .parent()
    //     .parent();
    //   li.toggleClass("danger");
    //   li.toggleClass("animated flipInX");

    //   setToDoneBlack(li.data().id);

    //   setTimeout(function() {
    //     li.removeClass("animated flipInX");
    //   }, 500);
    // });

    $(".blacklisttodo").on("click", 'input[type="checkbox"]', function () {
        var li = $(this).parent().parent().parent();
        li.toggleClass("danger");
        li.toggleClass("animated flipInX");

        if ($(".blacklisttodo li").length == 1) {
            li.removeClass("animated flipInX").addClass(
                "animated                bounceOutLeft"
            );
            setTimeout(function () {
                li.remove();
                $(".no-items-black").removeClass("hidden");
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

        deleteTodoBlack(li.data().id);
    });

    $(".blacklisttodo").on("click", ".close", function () {
        var box = $(this).parent().parent();

        if ($(".blacklisttodo li").length == 1) {
            box.removeClass("animated flipInX").addClass(
                "animated                bounceOutLeft"
            );
            setTimeout(function () {
                box.remove();
                $(".no-items-black").removeClass("hidden");
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

        deleteTodoBlack(box.data().id);
    });

    $(".blacklist").keypress(function (e) {
        if (e.which == 13) {
            var itemVal = $(".blacklist").val();
            addItemBlack(itemVal);
        }
    });
    $(".blacklisttodo").sortable();
    $(".blacklisttodo").disableSelection();
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

todayContainer.innerHTML = randomWord + n + "";

$(document).ready(function () {
    var state = getStateBlack();

    if (!state) {
        setDefaultStateBlack();
        state = getStateBlack();
    }

    Object.keys(state).forEach(function (todoKey) {
        var todo = state[todoKey];
        addItemBlack(todo.title, todo.status, todo.id, true);
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
