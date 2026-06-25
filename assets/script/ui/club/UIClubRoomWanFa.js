var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        
    },

    OnCreateInit:function(){
        this.ComTool = app.ComTool();
    },
    OnShow: function (roomData) {
    	this.gameType=roomData.gameId;
        this.node.getChildByName("lb_roomname").getComponent(cc.Label).string=roomData.roomName;
        //this.node.getChildByName("lb_wanfa").getComponent(cc.Label).string=this.GetWanFa(roomData.roomCfg);
        app.RoomCfgManager().WanFaFormServer(roomData.gameId,roomData.roomCfg,this.node.getChildByName("lb_wanfa").getComponent(cc.Label));
    },
    
	OnClick:function(btnName, btnNode){
        if('btn_close' == btnName){
            this.CloseForm();
        }
    },

    
});
