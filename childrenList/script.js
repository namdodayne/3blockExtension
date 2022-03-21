// IEFE
(() => {
    // state variables
    let toDoListArray = [];

    // ui variables
    const form = document.querySelector(".form");
    const input = form.querySelector(".form__input");
    const ul = document.querySelector(".toDoList");

    chrome.storage.local.get(["blockedchild"], (local) => {
        const { blockedchild } = local;
        console.log(blockedchild);
    });

    // todo Render Initial DOM from local Storage
    toDoListArray = JSON.parse(localStorage.getItem("blockChild"));
    if (toDoListArray == null) {
        toDoListArray = [];
    }
    for (let i in toDoListArray) {
        addItemToDOM(toDoListArray[i].itemId, toDoListArray[i].toDoItem);
    }

    // event listeners
    form.addEventListener("submit", (e) => {
        // prevent default behaviour - Page reload
        e.preventDefault();
        // give item a unique ID
        let itemId = String(Date.now());
        // get/assign input value
        let toDoItem = input.value;
        if (!validURL(toDoItem)) {
            renderInvalidInput();
            return;
        }
        toDoItem = filterURL(toDoItem);
        //pass ID and item into functions
        addItemToDOM(itemId, toDoItem);
        addItemToArray(itemId, toDoItem);
        // clear the input box. (this is default behaviour but we got rid of that)
        input.value = "";
    });

    ul.addEventListener("click", (e) => {
        let id = e.target.getAttribute("data-id");
        if (!id) return; // user clicked in something else
        //pass id through to functions
        removeItemFromDOM(id);
        removeItemFromArray(id);
    });

    // functions
    function addItemToDOM(itemId, toDoItem) {
        // create an li
        const li = document.createElement("li");
        li.setAttribute("data-id", itemId);
        // add toDoItem text to li
        li.innerText = toDoItem;
        // add li to the DOM
        ul.appendChild(li);
    }

    function addItemToArray(itemId, toDoItem) {
        // add item to array as an object with an ID so we can find and delete it later
        toDoListArray.push({ itemId, toDoItem });
        console.log(toDoListArray);
        localStorage.setItem("blockChild", JSON.stringify(toDoListArray));
        const arrayBlockChild = [];
        for (let i in toDoListArray) {
            arrayBlockChild.push(toDoListArray[i].toDoItem);
        }
        chrome.storage.local.set({ blockedchild: arrayBlockChild });
    }

    function removeItemFromDOM(id) {
        // get the list item by data ID
        var li = document.querySelector('[data-id="' + id + '"]');
        // remove list item
        ul.removeChild(li);
    }

    function removeItemFromArray(id) {
        // create a new toDoListArray with all li's that don't match the ID
        toDoListArray = toDoListArray.filter((item) => item.itemId !== id);
        console.log(toDoListArray);
        localStorage.setItem("blockChild", JSON.stringify(toDoListArray));
        const arrayBlockChild = [];
        for (let i in toDoListArray) {
            arrayBlockChild.push(toDoListArray[i].toDoItem);
        }
        chrome.storage.local.set({ blockedchild: arrayBlockChild });
    }

    function renderInvalidInput() {
        const notification = document.getElementById("form__label");
        notification.innerHTML = "You must enter Valid URL!";
        notification.style.color = "red";
        setTimeout(() => {
            notification.innerHTML =
                "~ Add the url you want to block <br> for your child here ~";
            notification.style.color = "black";
        }, 2500);
    }

    //todo Button children On/Off here + Label children Mode
    const childrenMode = document.getElementById("childrenMode");
    const checkBoxChildrenOnOff = document.getElementById(
        "checkBoxChildrenOnOff"
    );

    chrome.storage.local.get(["enabledchild"], (local) => {
        const { enabledchild } = local;
        checkBoxChildrenOnOff.checked = enabledchild;
        if (enabledchild) {
            childrenMode.innerHTML =
                "⚡ <b>Children Mode:</b> <b style='color:green'>On</b> ⚡";
        } else {
            childrenMode.innerHTML =
                "⚡ <b>Children Mode:</b> <b style='color:red'>Off</b> ⚡";
        }
    });

    checkBoxChildrenOnOff.addEventListener("click", () => {
        const saveCheckToStorage = checkBoxChildrenOnOff.checked;
        chrome.storage.local.set({ enabledchild: saveCheckToStorage });
        if (saveCheckToStorage) {
            childrenMode.innerHTML =
                "⚡ <b>Children Mode:</b> <b style='color:green'>On</b> ⚡";
        } else {
            childrenMode.innerHTML =
                "⚡ <b>Children Mode:</b> <b style='color:red'>Off</b> ⚡";
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
})();
