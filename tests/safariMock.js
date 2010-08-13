var safari = new function(){
    this.extension = new function(){
		//accessing toolbar api
        this.toolbarItems = new Array();
        this.baseURI = document.baseURI.substr(0, document.baseURI.lastIndexOf("/"))+"/";
        this.settings = new Object();
    };
    this.addMockToolbarItem = function(toolbarItem){
        this.extension.toolbarItems.push(toolbarItem);
    };
    this.generateRandomToolbarItems = function(number){
        for(var i = 0; i<number; i++){
            this.extension.toolbarItems.push(new MockSafariToolbarItem("toolBar"+i));
        }
    };
    this.clearToolbarItems = function(){
        this.extension.toolbarItems = new Array();
    };
	this.application = new function(){
		//listener api mock
	    var listener = new Array();
		this.addEventListener= function(eventType, callback, useCapture){
		      if(listener[eventType] == null){
					listener[eventType] = new Array();
			  }
			  listener[eventType].push(callback);
		}
		this.removeEventListener= function(eventType, callback, useCapture){
			for(var i =0; i < listener[eventType].length; i++){
				if(listener[eventType][i] == callback){
					delete [eventType][i];
				}
			}

		}
		this.clearEventListener = function(){
			listener = new Array();
		}
		this.fireEvent = function(eventType, event){
			for(var i = 0; i < listener[eventType].length; i++){
				listener[eventType][i].call(event);
			}
		}

		//browser window api mock
		this._browserWindows = new Array();
		this._activebrowserWindows = null;

		this.__defineGetter__("activeBrowserWindow", function(){
				return this._browserWindows.length > 0 ? this._activebrowserWindows : null;
		});

		this.__defineGetter__("browserWindows", function(){
				return this._browserWindows;
		});

		this.openBrowserWindow = function(){
			var newBrowserWindow = new MockSafariBrowserWindow();
			this._browserWindows.push(newBrowserWindow);
			newBrowserWindow.activate();
			return newBrowserWindow;
		}
	};
};

//toolbar mock objet
function MockSafariToolbarItem(identifier, badge, image){
    this.identifier = "org.dbn.tinyrssnotifier-M2O3C5K "+ identifier;
    this.badge = badge == null ? 0 : badge;
    this.image = image == null ? safari.extension.basURI+"mock.png" : image;
}

function MockSafariBrowserWindow(){
	this._activeTab = null;
	this._tabs = new Array();
	this._visible = false;
}

MockSafariBrowserWindow.prototype.activate = function(){
	safari.application._activebrowserWindows = this;
}
MockSafariBrowserWindow.prototype.openTab = function(visibility, index){
	var tab = new MockSafariBrowserTab(this);
	this._tabs.push(tab);
	if(visibility == null || visibility == "foreground"){
		this._activeTab = tab;
	}
	return tab;
}
MockSafariBrowserWindow.prototype.__defineGetter__("activeTab", function(){
	return this._activeTab;
});
MockSafariBrowserWindow.prototype.__defineGetter__("tabs", function(){
	return this._tabs;
});
MockSafariBrowserWindow.prototype.__defineGetter__("visible", function(){
	return this._visible;
});


function MockSafariBrowserTab(browserWindow, title, url){
	this._browserWindow = browserWindow;
	this._title = title;
	this.url = url;
}
MockSafariBrowserTab.prototype.activate = function(){
	this._browserWindow._activeTab = this;
};
