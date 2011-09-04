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
	
	this.getFreshHeadlines = function(callback){
		var result;
		$.ajax(this._url, {
			type:"POST",
			dataType:"json",
			data:{
				sid:this._sid,
				op:"getHeadlines",
				view_mode:"unread",
				feed_id:"-4"
			},
			success:function(data){
				result = data.content;
				if(callback)
					callback(data.content);
			},
			error:function(qXHR, textStatus, errorThrown){
				result = textStatus;
			}
		});
		return result;
	};
};