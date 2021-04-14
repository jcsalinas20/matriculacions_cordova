let types = null;

(async function () {
    $('.ui.accordion').accordion();
    initializeButtonsDashboard();
    eventOnChangeSelected();
    addEventsToDocsUploads();

    const career = await getJson();
    types = await getTypes();
})(jQuery);

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    $('.tabs').tabs({
        "swipeable": true
    });
}

async function getJson() {
    return await fetch("/js/aws.json").then((res) => {
        return res.json();
    })
}

async function getTypes() {
    return await fetch("/js/types.json").then((res) => {
        return res.json();
    })
}

function eventOnChangeSelected() {
    $("#documentation-tab div.select select").on("change", function () {
        var selected = this.value;
        $("#documentation-tab>.ui.list").html('');
        for (let i = 0; i < types[selected].length; i++) {
            $("#documentation-tab>.ui.list").append(`            
        <div class="item row">
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