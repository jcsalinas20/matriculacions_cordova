(async function () {
    const response = await getJson();

    initializeButtonsDashboard();

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