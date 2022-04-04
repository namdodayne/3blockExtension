chrome.storage.local.get("timeLog", (timeLocalLog) => {
    const { timeLog } = timeLocalLog;
    console.log(timeLog);

    var state = {
        page: 1, //Start & Current Page
        window: 5,
    };
    var PAGE_SIZE = 20; //number of URLs per page

    /*------------------------------------------------BlackList------------------------------------------------*/
    if (timeLog != null) show(1);
    else {
        //Render "No Data"
        document.getElementById("RenderData").innerHTML =
            "<img class='center' src='/images/noLog.png'" +
            " style='border-radius: 8px; width: 25%; display: block;margin-left: auto;" +
            " margin-right: auto;'>";
        document.getElementById("Total").innerHTML = 0;
        document.getElementById("Render").innerHTML = 0;
    }
    //Show BlackList URL
    function show(number) {
        if (number < 1 || !Number.isInteger(number)) {
            number = 1;
        }
        if (number > Math.ceil(timeLog.length / PAGE_SIZE)) {
            number = Math.ceil(timeLog.length / PAGE_SIZE);
        }
        state.page = number; //Current Page
        //GET data from localstorage
        if (timeLog.length == 0) {
            //Render "No Data"
            document.getElementById("RenderData").innerHTML =
                "<img class='center' src='/images/noLog.png'" +
                " style='border-radius: 8px; width: 25%; display: block;margin-left: auto;" +
                " margin-right: auto;'>";
            document.getElementById("Total").innerHTML = 0;
            document.getElementById("Render").innerHTML = 0;
        } else {
            //Start URL and end URL of current page
            const start = (number - 1) * PAGE_SIZE; //0,20,40,60,...
            const end = number * PAGE_SIZE; //19,39,59,79,...
            //Set 20 URLs to render
            appendData(timeLog.slice(start, end), timeLog.length);
            //Calculate the maximum number of pages
            pageButton(Math.ceil(timeLog.length / PAGE_SIZE));
            //Bold current page
            document
                .getElementById(state.page)
                .setAttribute("class", "page-item active");
            document
                .getElementById("NextPage")
                .addEventListener("click", function () {
                    state.page++;
                    show(state.page);
                });
            document
                .getElementById("PrePage")
                .addEventListener("click", function () {
                    state.page--;
                    show(state.page);
                });
            var paginationnumber = document.getElementsByClassName("page-item");
            for (let i of paginationnumber) {
                i.addEventListener("click", function () {
                    if (this.id != "PrePage" && this.id != "NextPage") {
                        show(Number(this.id));
                    }
                });
            }
            var DeleteTrash = document.getElementsByClassName("Delete");
            for (let i of DeleteTrash) {
                i.addEventListener("click", function () {
                    timeLog.splice(Number(this.id) / 100 - 1, 1);
                    show(state.page);
                    chrome.storage.local.set({ timeLog });
                });
            }
            document
                .getElementById("DeleteAll")
                .addEventListener("click", function () {
                    chrome.storage.local.set({ timeLog: [] });
                    window.location.reload();
                });
        }
    }
    //Render
    function appendData(data, length) {
        //JS -> HTML
        let text =
            "<table class='container'>" +
            "<thead><tr><th><h1>No.</h1></th><th><h1 style='margin-left: 4em;'>Date</h1></th><th><h1>Edit</h1></th></thead>" +
            "<tbody><tr>";
        for (var i = 0; i < data.length; i++) {
            text += "<td>" + ((state.page - 1) * PAGE_SIZE + i + 1) + "</td>";
            var logTime = new Date(data[i]);
            text +=
                "<td>" +
                logTime.toLocaleString() +
                "</td>" +
                "<td><a><i id='" +
                (i + 1) * 100 +
                "'class='material-icons Delete' data-toggle='tooltip' title='Delete'>&#xE872;</i></a></td></tr>";
        }
        text += "</tbody></table>";
        //There is at least 1 URL
        if (data.length > 0 && state.page >= 1) {
            document.getElementById("RenderData").innerHTML = text;
            document.getElementById("Total").innerHTML = length;
            document.getElementById("Render").innerHTML = data.length;
        }
    }
    //Button for BlackList
    function pageButton(pages) {
        var wrapper = document.getElementById("pagination-wrapper");
        wrapper.innerHTML = "";
        //2 pages Next and Previous current page
        var maxLeft = state.page - Math.floor(state.window / 2);
        var maxRight = state.page + Math.floor(state.window / 2);
        //The first page is always 1
        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = state.window;
        }
        if (maxRight > pages) {
            maxLeft = pages - (state.window - 1);

            if (maxLeft < 1) {
                maxLeft = 1;
            }
            maxRight = pages;
        }
        wrapper.innerHTML +=
            '<li id="PrePage" class="page-item"><a class="page-link" href="#">Previous</a></li>';
        for (var page = maxLeft; page <= maxRight; page++) {
            wrapper.innerHTML +=
                "<li id=" +
                page +
                ' class="page-item"><a class="page-link" href="#">' +
                page +
                "</a></li>";
        }
        wrapper.innerHTML +=
            '<li id="NextPage" class="page-item"><a class="page-link" href="#">Next</a></li>';
    }
});
