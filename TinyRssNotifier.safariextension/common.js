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