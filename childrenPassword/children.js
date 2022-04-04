// const input = document.getElementsByClassName("form__input");
// const childrenProtect = document.getElementById("ChildrenProtect");
const PasswordButton = document.getElementById("PasswordButton");
const EnterNewPassword = document.getElementById("EnterNewPassword");
const classInputPassword = document.getElementsByClassName("form__input");
const childrenProtectOnOff = document.getElementById("childrenProtectButton");
const childrenBlackList = document.getElementById("childrenBlackList");
const childrenHistory = document.getElementById("childrenHistory");
const checkDisplayOnOff = document.getElementById("checkDisplayOnOff");
const buttonPasswordLock = document.getElementById("inpLock");
//#############################################################################
childrenBlackList.innerHTML = "<b>Black list</b> for Children";
//todo Get status xem đã set Password hay chưa
const passwordLocal = localStorage.getItem("password");
var passwordEnable = false;
if (!passwordLocal) {
    EnterNewPassword.innerHTML =
        " Enter <b style='color: red;'>NEW</b> Password";
    localStorage.setItem("lockPassword", true);
    // EnterNewPassword.style.color = "green";
    document.getElementsByClassName("material-button")[0].style.display =
        "none";
    document.getElementById("changePassword").style.display = "none";
}
const buttonLock = localStorage.getItem("lockPassword");
if (buttonLock == "true") {
    buttonPasswordLock.checked = true;
    childrenProtectOnOff.style.display = "none";
    childrenBlackList.style.display = "none";
    childrenHistory.style.display = "none";
} else {
    buttonPasswordLock.checked = false;
    childrenProtectOnOff.style.display = "inline-block";
    childrenBlackList.style.display = "inline-block";
    childrenHistory.style.display = "inline-block";
}

//#############################################################################
//todo Hiển thị children Off On chỗ nhập password + Button hiển thị children On Off
chrome.storage.local.get(["enabledchild"], (dataChild) => {
    const { enabledchild } = dataChild;
    if (enabledchild) {
        // childrenProtect.innerHTML = "Children Protect: ON";
        childrenProtectOnOff.innerHTML = "<b>Turn Off</b> Children Mode";
        childrenProtectOnOff.className = "button-35";
        checkDisplayOnOff.innerHTML = "Children Protect: ON";
    } else {
        // childrenProtect.innerHTML = "Children Protect: OFF";
        childrenProtectOnOff.innerHTML = "<b>Turn On</b> Children Mode";
        childrenProtectOnOff.className = "button-33";
        checkDisplayOnOff.innerHTML = "Children Protect: OFF";
    }
});

//#############################################################################

//todo Text thông báo trạng thái here
classInputPassword[0].addEventListener("input", (event) => {
    document.getElementById("notePassword").style.fontSize = "20px";
    document.getElementById("notePassword").innerHTML =
        "Minimum eight characters, at least one letter and one number";
    document.getElementById("notePassword").style.color = "red";
    const isCheckPassword =
        passwordLocal == encrypt(classInputPassword[0].value);

    if (isCheckPassword) {
        document.getElementById("notePassword").innerHTML = "CORRECT PASSWORD!";
        document.getElementById("notePassword").style.color = "green";
        document.getElementById("notePassword").style.fontSize = "30px";
    }
});

//#############################################################################

//todo Children Button On/Off --> Event
childrenProtectOnOff.addEventListener("click", () => {
    if (checkDisplayOnOff.innerHTML == "Children Protect: ON") {
        chrome.storage.local.set({ enabledchild: false });
        checkDisplayOnOff.innerHTML = "Children Protect: OFF";
        childrenProtectOnOff.innerHTML = "<b>Turn On</b> Children Mode";
        childrenProtectOnOff.className = "button-33";
    } else {
        chrome.storage.local.set({ enabledchild: true });
        checkDisplayOnOff.innerHTML = "Children Protect: ON";
        childrenProtectOnOff.innerHTML = "<b>Turn Off</b> Children Mode";
        childrenProtectOnOff.className = "button-35";
    }
    // window.location.reload();
});

//############################################################################
//todo Event to Black list children --> "/childrenList.html"
// childrenBlackList.addEventListener("click", () => {
//     close();
//     window.open("/childrenList/index.html");
// });

//############################################################################
//todo Đổi mật khẩu here
PasswordButton.addEventListener("click", () => {
    childrenBlackList.disabled = true;
    childrenBlackList.style.display = "block";
    childrenBlackList.innerHTML =
        "Minimum eight characters, at least one letter and one number";
    childrenBlackList.style.color = "red";

    const currentPassword = document.getElementsByClassName("input-4")[0].value;
    var newPassword = document.getElementsByClassName("input-5")[0].value;
    const confirmNewPassword =
        document.getElementsByClassName("input-6")[0].value;
    const currentPasswordHash = encrypt(currentPassword);
    if (
        currentPassword == "" ||
        newPassword == "" ||
        confirmNewPassword == ""
    ) {
        childrenBlackList.innerHTML = "Please enter all information";
    } else if (
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword) == false
    ) {
        childrenBlackList.innerHTML =
            "New Password: Minimum eight characters,<br> at least one letter and one number";
    } else if (
        !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(confirmNewPassword)
    ) {
        childrenBlackList.innerHTML =
            "New Confirm Password: Minimum eight characters,<br> at least one letter and one number";
    } else if (newPassword != confirmNewPassword) {
        childrenBlackList.innerHTML = "New passwords are not same";
    } else if (passwordLocal != currentPasswordHash) {
        childrenBlackList.innerHTML = "Wrong old password";
    } else if (newPassword == currentPassword) {
        childrenBlackList.innerHTML =
            "Password is not the same as the old password";
    }

    //todo Điều kiện đúng đổi mật khẩu
    if (
        currentPassword != "" &&
        newPassword != "" &&
        confirmNewPassword != "" &&
        passwordLocal == currentPasswordHash &&
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword) &&
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(confirmNewPassword) &&
        newPassword == confirmNewPassword &&
        newPassword != currentPassword
    ) {
        childrenBlackList.innerHTML = "Password has changed";
        childrenBlackList.style.color = "green";
        newPassword = encrypt(newPassword);
        localStorage.setItem("password", newPassword);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
});

//############################################################################
//todo Tạo mật khẩu mới or Đăng nhập khi Enter
const buttonSubmitPassword = document.getElementById("button-login");
buttonSubmitPassword.addEventListener("click", () => {
    if (
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
            classInputPassword[0].value
        )
    ) {
        submitPassword();
    } else {
        document.getElementById("notePassword").style.fontSize = "20px";
        document.getElementById("notePassword").innerHTML =
            "Minimum eight characters, at least one letter and one number";
        document.getElementById("notePassword").style.color = "red";
    }
});
$(".form__input").on("keyup", function search(ele) {
    if (
        ele.key === "Enter" &&
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
            classInputPassword[0].value
        )
    ) {
        submitPassword();
    }
});
function submitPassword() {
    var check = localStorage.getItem("password");
    if (check === null) {
        var passwd = encrypt(classInputPassword[0].value);
        localStorage.setItem("password", passwd);
        document.getElementById("notePassword").innerHTML =
            "Successfully Set<br>New Password !";
        passwordEnable = true;
        document.getElementById("notePassword").style.fontSize = "30px";
        document.getElementById("notePassword").style.color = "green";
        //! Hiện 2 cái nút here
        childrenProtectOnOff.style.display = "inline-block";
        childrenBlackList.style.display = "inline-block";
        childrenHistory.style.display = "inline-block";
        document.getElementsByClassName("material-button")[0].style.display =
            "block";
        document.getElementById("changePassword").style.display = "block";
        buttonPasswordLock.checked = false;
        localStorage.setItem("lockPassword", false);
        // setTimeout(() => {
        //     window.location.reload();
        // }, 3000);
        // window.open("/childrenList.html");
    } else {
        var passwd = encrypt(classInputPassword[0].value);
        if (check != passwd) {
            document.getElementById("notePassword").innerHTML =
                "Incorrect Password";
            document.getElementById("notePassword").style.fontSize = "40px";
            document.getElementById("notePassword").style.color = "red";
            return;
            // search();
        } else {
            var check = localStorage.setItem("password", passwd);
            document.getElementById("notePassword").style.fontSize = "35px";
            document.getElementById("notePassword").innerHTML =
                "UNLOCK Successfully!";
            passwordEnable = true;
            document.getElementById("notePassword").style.color = "green";
            //! Hiện cái nút ở đây
            childrenProtectOnOff.style.display = "inline-block";
            childrenBlackList.style.display = "inline-block";
            childrenHistory.style.display = "inline-block";
            buttonPasswordLock.checked = false;
            localStorage.setItem("lockPassword", false);
        }
    }
}

//############################################################################
//todo Mã hóa mật khẩu here
function encrypt(superSecretPhrase = "") {
    for (var rOnpR = 0, FiuqR = 0; rOnpR < 38; rOnpR++) {
        FiuqR = superSecretPhrase.charCodeAt(rOnpR);
        FiuqR -= rOnpR;
        FiuqR ^= 0xffff;
        FiuqR += 0x82a3;
        FiuqR = ((FiuqR << 5) | ((FiuqR & 0xffff) >> 11)) & 0xffff;
        FiuqR += 0xe87c;
        FiuqR += rOnpR;
        FiuqR -= 0x7cb9;
        FiuqR = (((FiuqR & 0xffff) >> 7) | (FiuqR << 9)) & 0xffff;
        FiuqR ^= 0x4928;
        FiuqR += rOnpR;
        FiuqR--;
        FiuqR ^= 0xfc14;
        FiuqR -= 0x406c;
        FiuqR = (((FiuqR & 0xffff) >> 3) | (FiuqR << 13)) & 0xffff;
        superSecretPhrase =
            superSecretPhrase.substr(0, rOnpR) +
            String.fromCharCode(FiuqR & 0xffff) +
            superSecretPhrase.substr(rOnpR + 1);
    }
    return superSecretPhrase;
}

//todo Function On/Off Password Lock

buttonPasswordLock.addEventListener("click", () => {
    // console.log(buttonPasswordLock.checked);
    localStorage.setItem("lockPassword", buttonPasswordLock.checked);

    if (!buttonPasswordLock.checked && passwordEnable) {
        childrenProtectOnOff.style.display = "inline-block";
        childrenBlackList.style.display = "inline-block";
        childrenHistory.style.display = "inline-block";
    } else {
        childrenProtectOnOff.style.display = "none";
        childrenBlackList.style.display = "none";
        childrenHistory.style.display = "none";
    }
    if (!passwordEnable) {
        if (!buttonPasswordLock.checked) {
            buttonPasswordLock.checked = true;
        }
        document.getElementById("notePassword").innerHTML =
            "Enter Correct <br> Password First !";
        document.getElementById("notePassword").style.fontSize = "35px";
        document.getElementById("notePassword").style.color = "red";
        localStorage.setItem("lockPassword", true);
    }
});
