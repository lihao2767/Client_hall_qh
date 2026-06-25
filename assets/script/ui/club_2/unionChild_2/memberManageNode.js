var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {
        chazhaoEditBox:cc.EditBox,
    },
    onLoad:function(){
        this.wechatName = true;
    	let rankScrollView = this.node.getChildByName("rankScrollView").getComponent(cc.ScrollView);
        rankScrollView.node.on('scroll-to-bottom',this.GetNextPage,this);
        app.Client.RegEvent("UpdateMemberManageNodeData", this.Event_UpdateMemberManageNodeData, this);
    },
    InitData:function (clubId, unionId, unionPostType,myisminister, unionName, unionSign,isMinisetrZhongZhi) {

        let moreNode=this.node.getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getChildByName("mask");
        let layout=moreNode.getChildByName("layout").removeAllChildren();
        this.node.getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getComponent(cc.Label).string="全部";
        this.lastNode='';
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.isMinisetrZhongZhi=isMinisetrZhongZhi;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.curPage = 1;
        this.GetUnionMemberExamineList(true);
        if (this.unionPostType == 3) {
            this.node.getChildByName("img_xiadi").getChildByName("btn_dissRace").active = true;
            this.node.getChildByName("img_xiadi").getChildByName("btn_outRace").active = false;
        }else{
            this.node.getChildByName("img_xiadi").getChildByName("btn_dissRace").active = false;
            this.node.getChildByName("img_xiadi").getChildByName("btn_outRace").active = true;
        }
    },
    Event_UpdateMemberManageNodeData:function(event){
        this.GetUnionMemberExamineList(true);
    },
    GetUnionMemberExamineList:function(isRefresh,opClubId=-1,statusType=-1) {
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        sendPack.pageNum = this.curPage;
        sendPack.opClubId = this.clubId;
        if (this.wechatName) {
            sendPack.query = this.chazhaoEditBox.string;
        }else{
            sendPack.query = app.ComTool().GetBeiZhuID(this.chazhaoEditBox.string);
        }
        if(this.unionPostType==3 || this.myisminister==3){
            sendPack.statusType = 0;
        }else if(this.isMinisetrZhongZhi==true){
            sendPack.statusType = 2;
        }else{
            sendPack.statusType = 3;
        }
        if(opClubId!=-1 || statusType!=-1){
            sendPack.opClubId = opClubId;
            sendPack.statusType = statusType;
        }

        let sendPackName = "Union.CUnionMemberListZhongZhiByStatusType";
        let self = this;
        app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
            self.UpdateScrollView(serverPack, isRefresh);
        }, function(){

        });
    },
    GetNextPage:function(){
    	this.curPage++;
    	this.GetUnionMemberExamineList(false);
    },
    UpdateScrollView:function(serverPack, isRefresh){
    	let rankScrollView = this.node.getChildByName("rankScrollView");
    	let content = rankScrollView.getChildByName("view").getChildByName("content");
    	if (isRefresh) {
    		rankScrollView.getComponent(cc.ScrollView).scrollToTop();
    		content.removeAllChildren();
    	}
        let demo = this.node.getChildByName("demo");
    	demo.active = false;
    	for (let i = 0; i < serverPack.length; i++) {
            let matchItem = serverPack[i];
    		let child = cc.instantiate(demo);
    		if (i%2 == 0) {
    			child.getComponent(cc.Sprite).enabled = true;
    		}else{
    			child.getComponent(cc.Sprite).enabled = false;
    		}
	        child.playerData = serverPack[i];
            child.getChildByName("lb_name").getComponent(cc.Label).string =matchItem.createName;
            child.getChildByName("lb_name").getChildByName("lb_id").getComponent(cc.Label).string = "("+matchItem.createId+")";
            child.getChildByName("lb_clubName").getComponent(cc.Label).string =matchItem.clubName;
            child.getChildByName("lb_clubName").getChildByName("lb_clubId").getComponent(cc.Label).string = "("+matchItem.clubId+")";
            child.getChildByName("lb_upPlayerName").getComponent(cc.Label).string = matchItem.onlineCount+"/"+matchItem.number;
            /**
             * 赛事创建者
             * UNION_CREATE(3),
             * 赛事管理员
             * UNION_MANAGE(2),
             * 赛事亲友圈创造者
             * UNION_CLUB(1),
             * 赛事普通成员
             * UNION_GENERAL(0)
             */let zhiwei = ["赛事普通成员","赛事亲友圈创造者","赛事管理员","赛事创建者"];
            if(matchItem.unionPostType==3){
                child.getChildByName("lb_eliminatePoint").getComponent(cc.Label).string = "赛事创建者";
                child.getChildByName("lb_eliminatePoint").active=true;
                child.getChildByName("btn_setmanager").active=false;
            }else{
                if(this.unionPostType==3){
                    if(matchItem.beiGuanLiFlag==false){//被管理的话，这个按钮就要隐藏掉
                        child.getChildByName("btn_setmanager").active=true;
                        child.getChildByName("btn_setmanager").clubId=matchItem.clubId; //备注亲友圈ID
                        child.getChildByName("lb_eliminatePoint").active=false;
                    }else{
                        child.getChildByName("lb_eliminatePoint").getComponent(cc.Label).string = zhiwei[matchItem.unionPostType];
                        child.getChildByName("lb_eliminatePoint").active=true;
                        child.getChildByName("btn_setmanager").active=false;
                    }
                    
                }else{
                    child.getChildByName("lb_eliminatePoint").getComponent(cc.Label).string = zhiwei[matchItem.unionPostType];
                    child.getChildByName("lb_eliminatePoint").active=true;
                    child.getChildByName("btn_setmanager").active=false;
                }

            }
            
            if(matchItem.unionPostType==3){
                child.getChildByName("btn_jinzhuo").active = false;
                child.getChildByName("btn_jiejin").active = false;
                child.getChildByName("btn_tichu").active = false;
            }else if(this.unionPostType==3){
                child.getChildByName("btn_jinzhuo").active = matchItem.hasBan==false;
                child.getChildByName("btn_jiejin").active = matchItem.hasBan==true;
                child.getChildByName("btn_tichu").active = true;
            }else if(this.isMinisetrZhongZhi==true){
                if(matchItem.clubId==this.clubId){
                    child.getChildByName("btn_jinzhuo").active = false;
                    child.getChildByName("btn_jiejin").active = false;
                    child.getChildByName("btn_tichu").active = false;
                }else{
                    child.getChildByName("btn_jinzhuo").active = matchItem.hasBan==false;
                    child.getChildByName("btn_jiejin").active = matchItem.hasBan==true;
                    child.getChildByName("btn_tichu").active = true;
                }
                
            }else{
                child.getChildByName("btn_jinzhuo").active = false;
                child.getChildByName("btn_jiejin").active = false;
                child.getChildByName("btn_tichu").active = false;
            }

            
            
    		child.active = true;
    		content.addChild(child);
    	}
    },
    UpdateSelectSaiChang:function(serverPack){
        let moreNode=this.node.getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getChildByName("mask");
        let demo=moreNode.getChildByName("btn_select_saichang_demo");
        let layout=moreNode.getChildByName("layout");
        layout.removeAllChildren();
        for(let i=0;i<serverPack.length;i++){
            let addNode=cc.instantiate(demo);
            addNode.name="btn_select_saichang";
            if(serverPack[i].type==0){
                //全部
                addNode.getChildByName("lb").getComponent(cc.Label).string="全部";
                addNode.statusType=0;
                addNode.opClubId=0;
            }else if(serverPack[i].type==1){
                //全部
                addNode.getChildByName("lb").getComponent(cc.Label).string="未分配";
                addNode.statusType=1;
                addNode.opClubId=0;
            }else if(serverPack[i].type==2){
                //管理员
                addNode.getChildByName("lb").getComponent(cc.Label).string=serverPack[i].clubName+"["+serverPack[i].clubSign+"]";
                addNode.statusType=2;
                addNode.opClubId=serverPack[i].clubId;
            }
            if(this.lastNode){
                this.node.getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getComponent(cc.Label).string=this.lastNode.getChildByName("lb").getComponent(cc.Label).string;
                if(this.lastNode.statusType==addNode.statusType && this.lastNode.opClubId==addNode.opClubId){
                    addNode.getChildByName("on").active=true;
                }
            }
            addNode.active=1;
            layout.addChild(addNode);
        }
        moreNode.active=true;
    },
    //控件点击回调
    OnClick_BtnWnd:function(eventTouch, eventData){
        try{
            app.SoundManager().PlaySound("BtnClick");
            let btnNode = eventTouch.currentTarget;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        }
        catch (error){
            console.log("OnClick_BtnWnd:"+error.stack);
        }
    },
    OnClick:function(btnName, btnNode){
        if ("btn_search" == btnName) {
            this.curPage = 1;
            this.GetUnionMemberExamineList(true);
        }else if('btn_jinzhuo'==btnName){
            let playerData = btnNode.parent.playerData;
            app.FormManager().ShowForm('ui/club_2/UIClubJinSai_2',this.unionId,this.clubId,playerData.clubId);
        }else if('btn_jiejin'==btnName){
            let playerData = btnNode.parent.playerData;
            app.FormManager().ShowForm('ui/club_2/UIClubJinSai_2',this.unionId,this.clubId,playerData.clubId);
        }else if('btn_setmanager'==btnName){
            let clubId=btnNode.clubId;
            app.FormManager().ShowForm('ui/club_2/UIClubSetManager',this.unionId,this.clubId,clubId);
        }
        else if('btn_tichu'==btnName){
            let playerData = btnNode.parent.playerData;
            this.SetWaitForConfirm("MSG_UNION_DEL_MEMBER",app.ShareDefine().ConfirmYN,[playerData.clubName],[btnNode]);
        }else if('btn_dissRace'==btnName){
            this.SetWaitForConfirm("MSG_DISSOLVE_UNION",app.ShareDefine().Confirm,[],[btnNode]);
        }else if('btn_outRace'==btnName){
            this.SetWaitForConfirm("MSG_EXIT_UNION",app.ShareDefine().Confirm,[],[btnNode]);
        }else if(btnName=="btn_morejijingsaichang"){

            if(this.unionPostType!=3){
                app.SysNotifyManager().ShowSysMsg("您不是赛事创建者,没此权限",[],3);
                return;
            }

            let moreNode=this.node.getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getChildByName("mask");
            if(moreNode.active==true){
                moreNode.active=false;//打开状态下，关闭即可
                return;
            }
            let layout=moreNode.getChildByName("layout");
            let self = this;
            let sendPack = {};
            sendPack.unionId = this.unionId;
            app.NetManager().SendPack("union.CUnionMemberStatusType",sendPack, function(serverPack){
                if(serverPack.length>layout.children.length){
                    self.UpdateSelectSaiChang(serverPack);
                }else{
                    moreNode.active=true;
                }
            }, function(){

            });
        }
        else if(btnName=="btn_select_saichang"){
            if(this.lastNode){
                this.lastNode.getChildByName("on").active=false;
            }
            this.lastNode=btnNode;
            this.node.getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getComponent(cc.Label).string=this.lastNode.getChildByName("lb").getComponent(cc.Label).string;
            btnNode.getChildByName("on").active=true;

            this.GetUnionMemberExamineList(true,btnNode.opClubId,btnNode.statusType);

            this.node.getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getChildByName("mask").active=false;
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArgs=[],cbArgs=[]){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArgs);
        ConfirmManager.ShowConfirm(type, msgID, msgArgs);
    },
    OnConFirm:function(clickType, msgID, cbArgs){
        if('Sure' != clickType){
            return;
        }
        if ('MSG_UNION_DEL_MEMBER' == msgID) {
            let btnNode = cbArgs[0];
            let playerData = btnNode.parent.playerData;
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.opClubId = playerData.clubId;
            sendPack.opPid = playerData.createId;
            let self = this;
            app.NetManager().SendPack("union.CUnionRemoveMember",sendPack, function(serverPack){
                btnNode.parent.removeFromParent();
                btnNode.parent.destroy();
                app.SysNotifyManager().ShowSysMsg("成功移除",[],3);
            }, function(){
                app.SysNotifyManager().ShowSysMsg("移除失败",[],3);
            });
        }else if('MSG_EXIT_UNION' == msgID){
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            let self = this;
            app.NetManager().SendPack("union.CUnionQuit",sendPack, function(serverPack){
                if (serverPack == 9) {
                    app.SysNotifyManager().ShowSysMsg("申请退出成功",[],3);
                }else{
                    //直接退出不需要申请
                    app.SysNotifyManager().ShowSysMsg("退出成功",[],3);
                    if (app.FormManager().GetFormComponentByFormName("ui/club/UIUnionManager")) {
                        app.FormManager().GetFormComponentByFormName("ui/club/UIUnionManager").CloseForm();
                    }
                    if (app.FormManager().GetFormComponentByFormName("ui/club_2/UIUnionManager_2")) {
                        app.FormManager().GetFormComponentByFormName("ui/club_2/UIUnionManager_2").CloseForm();
                    }
                    if (app.ClubManager().GetClubFormComponent()) {
                        app.ClubManager().GetClubFormComponent().OnShow();
                    }
                }
            }, function(){
                app.SysNotifyManager().ShowSysMsg("退出失败",[],3);
            });
        }else if('MSG_DISSOLVE_UNION' == msgID){
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            let self = this;
            app.NetManager().SendPack("union.CUnionDissolve",sendPack, function(serverPack){
                app.FormManager().CloseForm("ui/club/UIUnionManager");
                app.FormManager().CloseForm("ui/club_2/UIUnionManager_2");
                // app.FormManager().CloseForm("ui/club/UIClubMain");
                app.ClubManager().CloseClubFrom();
            }, function(){
                
            });
        }
    },
});