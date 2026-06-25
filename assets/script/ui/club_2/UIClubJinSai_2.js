var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        
    },

    OnCreateInit: function () {
        this.rankScrollView = this.node.getChildByName("rankScrollView");
        // this.rankScrollView.getComponent(cc.ScrollView).node.on('scroll-to-bottom',this.GetNextPage,this);
    },
    OnShow: function (unionId,clubId,opClubId) {
        this.unionId = unionId;
        this.clubId = clubId;
        this.opClubId = opClubId;
        this.curPage = 1;
        this.GetUnionDynamicItemList(true);
    },
    GetNextPage:function(){
        this.curPage++;
        this.GetUnionDynamicItemList(false); 
    },
    GetUnionDynamicItemList:function(isRefresh){
        let sendPack = {};
        sendPack.opClubId = this.opClubId;
        sendPack.unionId = this.unionId;
        sendPack.clubId = this.clubId;
        // sendPack.query = this.chazhaoEditBox.string;
        // sendPack.pageNum = this.curPage;
        let self = this;
        app.NetManager().SendPack("union.CUnionBanClubRoomConfigId",sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){

        });
    },
    UpdateScrollView:function(serverPack, isRefresh){
        let roomScrollView = this.node.getChildByName("mark");
        let content = this.rankScrollView.getChildByName("view").getChildByName("content");
        if (isRefresh) {
            this.rankScrollView.getComponent(cc.ScrollView).scrollToTop();
            this.DestroyAllChildren(content);
        }
        let demo = this.node.getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < serverPack.length; i++) {
            let child = cc.instantiate(demo);
            child.data = serverPack[i];
            child.getChildByName("btn_wanfa").getChildByName("lb_btnName").getComponent(cc.Label).string = serverPack[i]["roomName"];
            if (serverPack[i]["ban"] == 0) {
                child.getChildByName("img_jinyong").active = false;
            }else{
                child.getChildByName("img_jinyong").active = true;
            }
            child.active = true;
            content.addChild(child);
        }
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_close"){
            this.CloseForm();
        }else if ("btn_wanfa" == btnName) {
            btnNode.parent.getChildByName("img_jinyong").active = !btnNode.parent.getChildByName("img_jinyong").active; 
        }else if ("btn_sure" == btnName) {
            this.curPage = 1;
            let sendPack = {};
            sendPack.opClubId = this.opClubId;
            sendPack.unionId = this.unionId;
            sendPack.clubId = this.clubId;
            sendPack.banConfigIdList = this.GetChangeItem();
            let self = this;
            app.NetManager().SendPack("union.CUnionBanClubRoomConfigIdSave",sendPack, function(serverPack){
                app.SysNotifyManager().ShowSysMsg("操作成功",[],3);
                // self.GetUnionDynamicItemList(true);
                app.Client.OnEvent('UpdateMemberManageNodeData', {});
                self.CloseForm();
            }, function(){

            });
        }else{
            this.ErrLog("OnClick(%s) not find", btnName);
        }
    },
    OnClickAllToggle:function(event){ 
        let isChecked = event.node.getComponent(cc.Toggle).isChecked;
        let content = this.rankScrollView.getChildByName("view").getChildByName("content"); 
        for (let i = 0; i < content.children.length; i++) {
            content.children[i].getChildByName("img_jinyong").active = isChecked; 
        }
    },
    GetChangeItem:function(){
        let allChangeItem = [];
        let content = this.rankScrollView.getChildByName("view").getChildByName("content");
        for (let i = 0; i < content.children.length; i++) {
            let data = content.children[i].data;
            if (content.children[i].getChildByName("img_jinyong").active) {
                allChangeItem.push(data["tagId"]);
            }    
        }
        return allChangeItem;
    },
});
