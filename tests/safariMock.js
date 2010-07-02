var safari = new function(){
    this.extension = new function(){
        this.toolbarItems = new Array();
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
};

function MockSafariToolbarItem(identifier, badge, image){
    this.identifier = "org.dbn.tinyrssnotifier-M2O3C5K "+ identifier;
    this.badge = badge == null ? 0 : badge;
    this.image = image == null ? "mock.png" : image;
}