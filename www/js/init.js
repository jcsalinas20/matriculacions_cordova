const token = "hXazCMIT8FnAdp4ZYz4xrZauiLzwN2d9uUJ=HZ5O82uCWmg";
let types = null;
let career = null;
let user = null;
let coursework = null;

(async function () {
    $('.ui.accordion').accordion();
    initializeButtonsDashboard();
    eventOnChangeSelected();
    addEventsToDocsUploads();

    career = await getJson();
    types = await getTypes();
    user = await getUser();
    coursework = await getCoursework();

    loadUfs();
    loadUser();
    getTotalPrice();
    eventButtonLock();
})(jQuery);

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    $('.tabs').tabs({
        "swipeable": true
    });
}

async function getJson() {
    return await fetch("https://matriculation-app.herokuapp.com/api/getAws/" + token).then((res) => {
        return res.json();
    })
}

async function getTypes() {
    return await fetch("https://matriculation-app.herokuapp.com/api/getTypes/" + token).then((res) => {
        return res.json();
    })
}

async function getUser() {
    return await fetch("https://matriculation-app.herokuapp.com/api/getUser/" + token).then((res) => {
        return res.json();
    })
}

async function getCoursework() {
    return await fetch("https://matriculation-app.herokuapp.com/api/getCoursework/" + token).then((res) => {
        return res.json();
    })
}

function eventButtonLock() {
    $("#ufs-tab button").on("click", function () {
        if ($("#ufs-tab button i").hasClass("open")) {
            $("#ufs-tab button i").removeClass("open");
            $("#ufs-tab .checkbox input:not(.blocked)").prop("disabled", true);
        } else {
            $("#ufs-tab button i").addClass("open");
            $("#ufs-tab .checkbox input:not(.blocked)").prop("disabled", false);
        }
    });
    $("#user-tab button.lock").on("click", function () {
        if ($("#user-tab button i").hasClass("open")) {
            $("#user-tab button i").removeClass("open");
            $("#user-tab input").prop("disabled", true);
            $("#user-tab form .field.col").addClass("not-allowed");
        } else {
            $("#user-tab button i").addClass("open");
            $("#user-tab input").prop("disabled", false);
            $("#user-tab form .field.col").removeClass("not-allowed");
        }
    });
}

function getTotalPrice() {
    $("#ufs-tab .total-price").text($("#ufs-tab .ui.checkbox input:checked:not(.blocked)").length * 10 + " €");
}

function loadUser() {
    $("#user-tab form input#name").val(user.name).prop("disabled", true);
    $("#user-tab form input#surname").val(user.surname).prop("disabled", true);
    $("#user-tab form input#mail").val(user.mail).prop("disabled", true);
    $("#user-tab form input#dni").val(user.dni).prop("disabled", true);
}

function loadUfs() {
    let cont = 0;
    for (const key in career.modules) {
        if (Object.hasOwnProperty.call(career.modules, key)) {
            const mp = career.modules[key];
            let card = `<div class="ui card">
                <div class="content">
                    <div class="header">${mp.code} - ${mp.name}</div>
                </div>
                <div class="content">
                    <div class="ui small feed">
                        <div class="event">
                            <div class="content row">`;
            for (const key2 in mp.ufs) {
                if (Object.hasOwnProperty.call(mp.ufs, key2)) {
                    let uf = mp.ufs[key2];
                    let keyCode = mp.code + "-" + uf.code;
                    let clazz = "";
                    let blocked = "";
                    let sizes = "s12 m6 l4";
                    if (Object.keys(mp.ufs).length === 2) {
                        sizes = "s12 m6 l6";
                    } else if (Object.keys(mp.ufs).length === 1) {
                        sizes = "s12 m12 l12";
                    }
                    if (coursework.indexOf(keyCode) != -1) {
                        clazz = "passed";
                        blocked = "blocked";
                    }
                    card += `
                    <div class="ui checked checkbox col ${sizes}">
                        <input class="${blocked}" id="${keyCode}" type="checkbox" checked disabled>
                        <label class="${clazz}" for="${keyCode}">${uf.code} - ${uf.name}</label>
                    </div>`;
                }
            }
            card += `</div>
                        </div>
                    </div>
                </div>
            </div>`;
            $("#ufs-tab .body").append(card);
        }
    }
    $("#ufs-tab .ui.checkbox input").on("change", function () {
        getTotalPrice();
    });
}

function eventOnChangeSelected() {
    $("#documentation-tab div.select select").on("change", function () {
        var selected = this.value;
        $("#documentation-tab>.ui.list").html('');
        for (let i = 0; i < types[selected].length; i++) {
            $("#documentation-tab>.ui.list").append(`            
        <div class="col s12 m12 l6">
            <div class="item">
                <div class="icon-list col s2 center">
                    <i class="${types[selected+"_icons"][i]} icon circular large"></i>
                </div>
                <div class="content col s10">
                    <div class="header">${types[selected][i]}</div>
                    <div class="body row">
                        <p class="text col s2">Estat: </p>
                        <div class="semaphore col s5">
                            <i class="circle red icon"></i>
                            <i class="circle orange outline icon"></i>
                            <i class="circle green outline icon"></i>
                        </div>
                        <div class="btn-icons col s5">
                            <div class="icon-eye">
                                <i class="eye icon big blue"></i>
                            </div>
                            <div class="icon-camera">
                                <i class="camera icon big blue"></i>
                            </div>
                            <label class="icon-upload" for="file-upload${i}">
                                <input type="file" style="display: none;" id="file-upload${i}">
                                <i class="upload icon big blue"></i>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
        }
        addEventsToDocsUploads();
    });
}

function addEventsToDocsUploads() {
    $("#documentation-tab .item .icon-camera").on("click", (e) => {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });

        function onSuccess(imageData) {
            let semaphore = $(e.target).closest("div.body").children(".semaphore");
            semaphore.children().addClass("outline");
            semaphore.children(".orange").removeClass("outline");
            $(e.target).closest("div.btn-icons").children("img").prop("src", "data:image/jpeg;base64," + imageData);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    })
    $("#documentation-tab .item .icon-eye").on("click", (e) => {
        console.log("Developing :)");
    })
    $("#documentation-tab .item .icon-upload").on("change", (e) => {
        if (e.target.files.length > 0) {
            let semaphore = $(e.target).closest("div.body").children(".semaphore");
            semaphore.children().addClass("outline");
            semaphore.children(".orange").removeClass("outline");
        }
    })
}

function initializeButtonsDashboard() {
    $("#dashboard-tab a.docs").on("click", (e) => {
        var tabsInstance = M.Tabs.getInstance($("#tabs"));
        tabsInstance.select("documentation-tab");
    });
    $("#dashboard-tab a.modules").on("click", (e) => {
        var tabsInstance = M.Tabs.getInstance($("#tabs"));
        tabsInstance.select("ufs-tab");
    });
    $("#dashboard-tab a.user").on("click", (e) => {
        var tabsInstance = M.Tabs.getInstance($("#tabs"));
        tabsInstance.select("user-tab");
    });
}