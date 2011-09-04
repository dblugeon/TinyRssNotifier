function noError(response){
	var unread = parseTotalUnreadActiclesResponse(response);
    return unread.length > 0 && unread != -1;
}

function parseTotalUnreadActiclesResponse(response){
     var unread = response.split(";")[0];
     console.debug("unread = "+unread);
     return unread;
}

function getTTRssButtons(){
   var buttons = new Array();
   var regexpTtrssButton = /ttrss-button$/;
   var itemArray = safari.extension.toolbarItems;
    for (var i = 0; i < itemArray.length; ++i) {
        var item = itemArray[i];
        console.debug(item.identifier);
        console.debug(regexpTtrssButton.test(item.identifier));
        if (regexpTtrssButton.test(item.identifier))
            {
               console.debug("adding button");
               buttons.push(item);
           }
    }
    return buttons;
}

function updateBadges(response){
    var unread = parseTotalUnreadActiclesResponse(response);
    var buttons = getTTRssButtons();
    for (var i = 0; i < buttons.length; ++i){
        console.debug("buttons[i] = "+buttons[i]);
        buttons[i].badge = unread;
    }
}

function updateImageToolbarItems(imageRelativePath){
	var buttons = getTTRssButtons();
    for (var i = 0; i < buttons.length; ++i){
        buttons[i].image = safari.extension.baseURI + imageRelativePath;
    }
}

function getTTRssURL(){
	return safari.extension.settings.url;
}

function openTTRssWindow(){
	//inspered by this gmail extension : http://lifefrombelow.com/gmail-checker/
	for (var currentWindow in safari.application.browserWindows) {
		for (var currentTab in safari.application.browserWindows[currentWindow].tabs) {
		// We can't access the SafariBrowserTab.url if we can't access that URL!
			if (safari.application.browserWindows[currentWindow].tabs[currentTab].url && safari.application.browserWindows[currentWindow].tabs[currentTab].url.indexOf(getTTRssURL()) == 0) {
				// Because when we activate this window below, the array's index will change
				// Use Array.forEach instead? Meh, makes escaping early more awkward.
				var browserWindow = safari.application.browserWindows[currentWindow];
				browserWindow.activate();
				browserWindow.tabs[currentTab].activate();
				return;
			}
		}
	}

	var browser = safari.application.activeBrowserWindow !=null ? safari.application.activeBrowserWindow : safari.application.openBrowserWindow();
	var newTab = browser.openTab();
	newTab.url = getTTRssURL();
}

//actualy untestable functions
function getUpdateCountFromSite(){
    $.ajax({
        type: "GET",
        url: safari.extension.settings.url+"/backend.php?op=getUnread&fresh=1&login="+safari.extension.settings.login,
        success: function(response){
            if(noError(response)){
				updateImageToolbarItems("icon.png");
                updateBadges(response);
            }else{
				updateImageToolbarItems("error.png");
                console.error("error can't getting unread count "+response);
            }
        },
        error: function(error){
            console.error("error "+error);
			updateImageToolbarItems("error.png");
        }
    });
    setTimeout(getUpdateCountFromSite, 10000);
}

function ttRssButtonHandler(event){
	openTTRssWindow();
}