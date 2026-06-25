/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        
    },

    //初始化
    OnCreateInit:function(){

    },

    //---------显示函数--------------------

    OnShow:function(clubId,unionId){
        this.clubId=clubId;
        this.unionId=unionId;
        this.node.getChildByName("ToggleContainer").getChildByName("toggle1").getComponent(cc.Toggle).isChecked=true;
        this.node.getChildByName("input").getChildByName("EditBox").getComponent(cc.EditBox).string="";
    },
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_search'==btnName){
            let roomKey=this.node.getChildByName("input").getChildByName("EditBox").getComponent(cc.EditBox).string;
            if(roomKey==""){
                this.ShowSysMsg("请输入6位数字",[],3);
                return;
            }
            if(roomKey<100000){
                this.ShowSysMsg("请输入6位数字",[],3);
                return;
            }
            let sendPack = {
                "clubId":this.clubId,
                "roomKey":roomKey,
            }

            let packName = "";
            let roomCheck=this.node.getChildByName("ToggleContainer").getChildByName("toggle1").getComponent(cc.Toggle).isChecked;
            if(roomCheck==true){
                packName = "club.CClubRoomInfoDetails";
                sendPack.roomKey=roomKey;
                if (this.unionId > 0) {
                    sendPack.unionId = this.unionId;
                    packName = "union.CUnionRoomInfoDetails";
                }
            }else{
                sendPack.pid=roomKey;
                packName = "club.CClubRoomInfoDetailsByPid";
                if (this.unionId > 0) {
                    sendPack.unionId = this.unionId;
                    packName = "union.CUnionRoomInfoDetailsByPid";
                }
            }
           

            let self = this;
            app.NetManager().SendPack(packName, sendPack, function(serverPack){
                self.FormManager.ShowForm('ui/club/UIClubRoomJoin',serverPack);
                self.CloseForm();
            }, function(){
                app.SysNotifyManager().ShowSysMsg("未找到房间",[],3);
            });
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
