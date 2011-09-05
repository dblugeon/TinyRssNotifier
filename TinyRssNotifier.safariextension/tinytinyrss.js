//requirement, JQuery

var TTRSS = null;

function getTinyTinyRssInstance(url, login, password){

	if(!TTRSS){
		TTRSS = new TinyTinyRss(url, login, password);
	}

	return TTRSS;

};

function TinyTinyRss(url, login, password){
	this._url = url+"/api/";
	this._login = login;
	this._pass = password;
	this._observer = null;
	this._freshHeadlinesTimer = null;
	
	this.isValide = function(){
		var isValide = false;
		
		$.ajax(this._url, {
			async: false,
			type:"POST",
			dataType:"json",
			data:{
				op:"login",
				user:this._login,
				password:this._pass
			},
			success: function(data){
				if(data.content.session_id){
					this._sid = data.content.session_id;
					isValide = true;
				}
			}
		});
		
		return isValide;
	}
	
	this.getVersion = function(){
		var version = "";
		
		$.ajax(this._url, {
			async: false,
			type:"POST",
			dataType:"json",
			data:{
				sid:this._sid,
				op:"getVersion",
			},
			success: function(data){
				if(data.content.version){
					version = data.content.version;
				}
			}
		});
		return version;
	}
	
	this.observerNewsFreshHeadlines = function(observer){
		this._observer = observer;
	};

	this.startObservingNewFreshHeadLines = function(){
		_startObservingNewFreshHeadLines();
		this._freshHeadlinesTimer = setInterval(_startObservingNewFreshHeadLines,
		10000);
	};

	this.stopObservingNewFreshHeadLines = function(){
		clearTimeout(this._freshHeadlinesTimer);
		this._freshHeadlinesTimer = null;
	}
};
//we use a "private" function to update and prevent the observer with new data
function _startObservingNewFreshHeadLines(){
		if(TTRSS._observer){
				$.ajax(TTRSS._url, {
					async: false,
					type:"POST",
					dataType:"json",
					data:{
						sid:this._sid,
						op:"getHeadlines",
						view_mode:"unread",
						feed_id:"-4"
					},
					context:TTRSS,
					success: function(data){
						var result = data.content;
						this._observer(result);
					}
				})
		}
};