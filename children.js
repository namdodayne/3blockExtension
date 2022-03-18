const input = document.querySelector("input");
const childrenProtect = document.getElementById("ChildrenProtect");
const changePassword = document.getElementsByClassName("changePassword");
const PasswordButton = document.getElementById("PasswordButton");
const EnterNewPassword = document.getElementById("EnterNewPassword");
const classInputPassword = document.getElementsByClassName("form__input");
const childrenProtectOnOff = document.getElementById("childrenProtectButton");
const childrenBlackList = document.getElementById("childrenBlackList");
//#############################################################################
console.log(input);
console.log(classInputPassword);

//todo Get status xem đã set Password hay chưa
const passwordLocal = localStorage.getItem("password");
if (!passwordLocal) {
    EnterNewPassword.innerHTML = "Enter NEW Password";
    EnterNewPassword.style.color = "green";
}

//#############################################################################
//todo Hiển thị children Off On chỗ nhập password + Button hiển thị children On Off
chrome.storage.local.get(["enabledchild"], (dataChild) => {
    const { enabledchild } = dataChild;
    if (enabledchild) {
        childrenProtect.innerHTML = "Children Protect: ON";
        childrenProtectOnOff.innerHTML = "<b>Turn Off</b> Children Mode";
        childrenProtectOnOff.className = "button-35";
    } else {
        childrenProtect.innerHTML = "Children Protect: OFF";
        childrenProtectOnOff.innerHTML = " <b>Turn On</b> Children Mode";
        childrenProtectOnOff.className = "button-33";
    }
});

//#############################################################################

//todo Text thông báo trạng thái here
classInputPassword[0].addEventListener("input", (event) => {
    document.getElementById("notePassword").style.fontSize = "20px";
    document.getElementById("notePassword").innerHTML =
        "Minimum eight characters, at least one letter and one number";
    document.getElementById("notePassword").style.color = "red";
    const isCheckPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
        classInputPassword[0].value
    );

    if (isCheckPassword) {
        document.getElementById("notePassword").innerHTML =
            "PLEASE ENTER TO CONTINUE!";
        document.getElementById("notePassword").style.color = "green";
        document.getElementById("notePassword").style.fontSize = "50px";
    }
});

//#############################################################################

//todo Children Button On/Off --> Event
childrenProtectOnOff.addEventListener("click", () => {
    console.log(childrenProtect.innerHTML);
    if (childrenProtect.innerHTML == "Children Protect: ON") {
        chrome.storage.local.set({ enabledchild: false });
    } else {
        chrome.storage.local.set({ enabledchild: true });
    }
    window.location.reload();
});

//############################################################################

//todo Event to Black list children --> "/childrenList.html"
childrenBlackList.addEventListener("click", () => {
    close();
    window.open("/childrenList.html");
});

//############################################################################
//todo Đổi mật khẩu here
PasswordButton.addEventListener("click", () => {
    document.getElementById("notePassword").style.fontSize = "20px";
    document.getElementById("notePassword").innerHTML =
        "Minimum eight characters, at least one letter and one number";
    document.getElementById("notePassword").style.color = "red";
    console.log(changePassword);
    const currentPassword = document.getElementById("input-4").value;
    var newPassword = document.getElementById("input-5").value;
    const confirmNewPassword = document.getElementById("input-6").value;
    const currentPasswordHash = encrypt(currentPassword);
    if (changePassword[0].style.display == "block") {
        if (
            currentPassword == "" ||
            newPassword == "" ||
            confirmNewPassword == ""
        ) {
            document.getElementById("notePassword").innerHTML =
                "Xin hay nhap day du";
        } else if (passwordLocal != currentPasswordHash) {
            document.getElementById("notePassword").innerHTML =
                "Sai mat khau cu";
        } else if (newPassword != confirmNewPassword) {
            document.getElementById("notePassword").innerHTML =
                "New Password khong giong nhau";
        } else if (newPassword == currentPassword) {
            document.getElementById("notePassword").innerHTML =
                "Password khong trung mat khau cu";
        } else if (!/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
            document.getElementById("notePassword").innerHTML =
                "New Password: Minimum eight characters, at least one letter and one number";
        } else if (
            !/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/.test(confirmNewPassword)
        ) {
            document.getElementById("notePassword").innerHTML =
                "New Password: Minimum eight characters, at least one letter and one number";
        }

        //todo Điều kiện đúng đổi mật khẩu
        if (
            currentPassword != "" &&
            newPassword != "" &&
            confirmNewPassword != "" &&
            passwordLocal == currentPasswordHash &&
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword) &&
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(confirmNewPassword) &&
            newPassword == confirmNewPassword
        ) {
            document.getElementById("notePassword").innerHTML =
                "Password da thay doi";
            document.getElementById("notePassword").style.color = "green";
            newPassword = encrypt(newPassword);
            localStorage.setItem("password", newPassword);
        }
    }

    //todo Nếu chưa setup password thì sẽ ko hiển thị chỗ đổi pass
    if (passwordLocal == null) {
        document.getElementById("notePassword").innerHTML =
            "Chưa set up password";
        return;
    } else {
        changePassword[0].style.display = "block";
    }
});

//############################################################################
//todo Tạo mật khẩu mới or Đăng nhập
input.onkeydown = search;
function search(ele) {
    if (
        event.key === "Enter" &&
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(input.value)
    ) {
        var check = localStorage.getItem("password");
        if (check === null) {
            var passwd = encrypt(input.value);
            localStorage.setItem("password", passwd);
            window.open("/childrenList.html");
        } else {
            var passwd = encrypt(input.value);
            if (check != passwd) {
                document.getElementById("notePassword").innerHTML =
                    "Incorrect Password";
                document.getElementById("notePassword").style.fontSize = "50px";
                document.getElementById("notePassword").style.color = "red";
                return;
                // search();
            } else {
                var check = localStorage.setItem("password", passwd);
                childrenProtectOnOff.style.display = "inline-block";
                childrenBlackList.style.display = "inline-block";
                document.getElementById("notePassword").style.fontSize = "20px";
            }
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
