/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
    	roomlist_scrollView:cc.ScrollView,
        roomlist_layout:cc.Node,
        roomlist_demo:cc.Node,
        roomlist_bottom:cc.Node,
        toggleIcon:cc.SpriteFrame,
    },

    //初始化
    OnCreateInit:function(){
        this.RegEvent("OnClubRoomCfgs", this.Event_RoomCfgs);
        //this.RegEvent("OnClubRoomCfgChange", this.Event_RoomCfgChange);
        //this.RegEvent("OnClubRoomCfgs", this.ReOnShow);
        this.RegEvent("OnClubRoomCfgChange", this.ReOnShow);
        this.discountType = [];
    },

    //---------显示函数--------------------

    OnShow:function(clubId){
        this.clubId=clubId;
    	this.roomlist_demo.active=false;
        this.roomlist_scrollView.scrollToTop();
        //this.roomlist_layout.removeAllChildren();
        this.DestroyAllChildren(this.roomlist_layout);
        app.ClubManager().SendGetRoomCfg(this.clubId);
        //this.ShowRoomList();
        let that = this;
        // app.NetManager().SendPack('discount.CDiscountList',{clubId:clubId},function(serverPack){
        //     that.GetDiscountTypeData(serverPack);
        // },function(error){
        //     console.error(error);
        // });
        // app.NetManager().SendPack('game.CPlayerAllGameList',{},function(serverPack){
        //     that.gameList = serverPack.gameList;
        // },function(error){
        //     console.error(error);
        // });

        let clubData = app.ClubManager().GetClubDataByClubID(clubId);
        this.InitSortToggle(clubData.sort);
    },
    ReOnShow:function(event){
        let clubId = event.clubId;
        if(this.clubId != clubId){
            return;
        }
        this.OnShow(this.clubId);
    },
    GetToggleGroupSelect:function(node){
        for(let i=0;i<node.children.length;i++){
            if(node.children[i].getComponent(cc.Toggle).isChecked==true){
                return i;
            }
        }
        return 1;  //如果没选择，默认选中空桌固定序号-人满-已开
    },
    SaveChange:function(){
       
        let sendPack = {};
        sendPack.clubId = this.clubId;
        let self = this;
        let sortID = this.GetToggleGroupSelect(this.node.getChildByName("sortToggleGroup"));

        let clubData = app.ClubManager().GetClubDataByClubID(this.clubId);
        if(sortID==clubData.sort){
            return; //没有改变不发给服务器
        }
        sendPack.sort = sortID;
        app.NetManager().SendPack("Club.CClubSaveSort",sendPack, function(serverPack){
            app.ClubManager().UpdateClubDataInfo(self.clubId,'sort',sortID);
            app.SysNotifyManager().ShowSysMsg("桌子排序修改成功",[],3);
        }, function(){
                
        });
    },


    ShowSortToggle:function(){
        let node=this.node.getChildByName("sortToggleGroup");
        for(let i=0;i<node.children.length;i++){
            node.children[i].active=true;
            node.children[i].getChildByName("tip").active=false;
            node.children[i].getChildByName("Background").active=true;
            node.children[i].getChildByName("checkmark").getComponent(cc.Sprite).spriteFrame=this.toggleIcon;
        }
        this.node.getChildByName("btn_close_toggle").active=true;
    },
    InitToggle:function(sort){
         let node=this.node.getChildByName("sortToggleGroup");
         node.getChildByName("sortToggle"+sort).getComponent(cc.Toggle).isChecked=true;
        this.node.getChildByName("btn_close_toggle").active=false;
    },
    InitSortToggle:function(sort){
         let node=this.node.getChildByName("sortToggleGroup");
         node.getChildByName("sortToggle"+sort).getComponent(cc.Toggle).isChecked=true;
         node.getChildByName("sortToggle"+sort).active=true;
         node.getChildByName("sortToggle"+sort).getChildByName("tip").active=true;
         node.getChildByName("sortToggle"+sort).getChildByName("Background").active=false;
         node.getChildByName("sortToggle"+sort).getChildByName("checkmark").getComponent(cc.Sprite).spriteFrame="";//toggleIcon
         for(let i=0;i<node.children.length;i++){
            if(i!=sort){
                node.children[i].active=false;
            }
        }
        this.node.getChildByName("btn_close_toggle").active=false;
    },
    close_toggle:function(){
        let sortID = this.GetToggleGroupSelect(this.node.getChildByName("sortToggleGroup"));
        this.InitSortToggle(sortID);
    },
    checkToogle:function(event){
        let sortid=parseInt(event.node.name.replace("sortToggle",""));
        this.InitSortToggle(sortid);
        this.SaveChange();
    },


    GetDiscountTypeData: function (serverPack) {
        console.log("GetDiscountTypeData", serverPack);
        this.discountType = serverPack;
    },
    Event_RoomCfgChange:function(event){
        let clubId = event.clubId;
        if(this.clubId != clubId)
            return;
        let isCreate = event.isCreate;
        let nomarlState = app.ClubManager().Enum_RoomCfg_Nomarl;
        let disableState = app.ClubManager().Enum_RoomCfg_Disable;
        let delState = app.ClubManager().Enum_RoomCfg_Delete;
        let reviseState = app.ClubManager().Enum_RoomCfg_Revise;
        let roomData = event.clubCreateGameSet;

        let waitRoomCount=event.waitRoomCount;
        let playingRoomCount=event.playingRoomCount;
        this.roomlist_bottom.getChildByName('wait').getChildByName('num').getComponent(cc.Label).string=waitRoomCount;
        this.roomlist_bottom.getChildByName('game').getChildByName('num').getComponent(cc.Label).string=playingRoomCount;


        if(isCreate)
            this.roomCfgs.push(roomData);
        else{
            for(let i=0;i<this.roomCfgs.length;i++){
                if(roomData.bRoomConfigure.gameIndex == this.roomCfgs[i].bRoomConfigure.gameIndex){
                    if(delState == roomData.status)
                        this.roomCfgs.splice(i,1);
                    else
                        this.roomCfgs[i] = roomData;
                    break;
                }
            }
        }
        let cfg = null;
        if(!isCreate && delState != roomData.status)
            cfg = roomData;
        //还没修改this.roomCfgs
        this.ShowRoomList(cfg);
    },
    Event_RoomCfgs:function(event){
        let clubId = event.clubId;
        if(this.clubId != clubId)
            return;
        this.roomCfgs = event.clubCreateGameSets;
        this.ShowRoomList();
        let waitRoomCount=event.waitRoomCount;
        let playingRoomCount=event.playingRoomCount;
        this.roomlist_bottom.getChildByName('wait').getChildByName('num').getComponent(cc.Label).string=waitRoomCount;
        this.roomlist_bottom.getChildByName('game').getChildByName('num').getComponent(cc.Label).string=playingRoomCount;
    },
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[]){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
        if('MSG_CLUB_DissolveRoomCfg' == msgID){
            let roomData = backArgList[0];
            let jesanState = app.ClubManager().Enum_RoomCfg_Delete;
            app.ClubManager().SendSetRoomCfg(this.clubId,roomData.gameIndex,jesanState);
        }else if('MSG_CLUB_DissolveRoom' == msgID){
            app.ClubManager().SendCloseClub(this.clubId);
            //this.FormManager.ShowForm('bottom');
            this.FormManager.CloseFormReal('ui/club/UIClubManager');
        }else if('MSG_CLUB_EXIT' == msgID){
            app.ClubManager().SendPlayerStateChange(this.clubId,app.HeroManager().GetHeroProperty("pid"),app.ClubManager().Enum_Leave);
            //this.FormManager.ShowForm('bottom');
        this.FormManager.CloseFormReal('ui/club/UIClubManager');
        }
        else if('MSG_CLUB_KICKPlayer' == msgID){
            let data = backArgList[0];
            app.ClubManager().SendPlayerStateChange(data.clubId,data.pid,data.kickState);
        }
    },
    ShowRoomList:function(roomCfg=null){
        if(!roomCfg){
            this.roomlist_scrollView.scrollToTop();
            //this.roomlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.roomlist_layout);
            for(let i=0;i<this.roomCfgs.length;i++){
                let nodePrefab = cc.instantiate(this.roomlist_demo);
                nodePrefab.name = this.roomCfgs[i].bRoomConfigure.gameIndex.toString();
                nodePrefab.roomData = this.roomCfgs[i];
                let gameType = this.roomCfgs[i].gameType;
                let cfg = this.roomCfgs[i].bRoomConfigure;
                let nameData = app.RoomCfgManager().GetRoomData(gameType,cfg);
                gameType = '' != nameData.smallName1 ? nameData.smallName1 : nameData.bigName1;
                if (typeof(cfg.roomName)!="undefined") {
                    nodePrefab.getChildByName('roomName').getComponent(cc.Label).string=cfg.roomName;
                }else{
                    nodePrefab.getChildByName('roomName').getComponent(cc.Label).string="";
                }
                nodePrefab.getChildByName('name').getComponent(cc.Label).string=app.RoomCfgManager().GetGameName(gameType,true);
                nodePrefab.getChildByName('renshu').getComponent(cc.Label).string=this.roomCfgs[i].bRoomConfigure.playerNum.toString();
                let payType='';
                if(this.roomCfgs[i].bRoomConfigure.paymentRoomCardType==2){
                    payType='大赢家付'+this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume+'圈卡,';
                }else if(this.roomCfgs[i].bRoomConfigure.paymentRoomCardType==1){
                    payType='AA付'+this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume+'圈卡,';
                }else if(this.roomCfgs[i].bRoomConfigure.paymentRoomCardType==0){
                    payType='管理付,';
                }
                //nodePrefab.getChildByName('wanfa').getComponent(cc.Label).string=app.RoomCfgManager().WanFa(this.roomCfgs[i].gameType,cfg)+payType;
                app.RoomCfgManager().WanFaFormServer(this.roomCfgs[i].gameType,cfg,nodePrefab.getChildByName('wanfa').getComponent(cc.Label),0,payType);
                nodePrefab.getChildByName('zhuoshu').getComponent(cc.Label).string=this.roomCfgs[i].roomCount;
                nodePrefab.active=true;
                this.roomlist_layout.addChild(nodePrefab);
            }
        }else{
            let childs = this.roomlist_layout.children;
            let idxStr = roomCfg.bRoomConfigure.gameIndex.toString();
            for(let i=0;i<childs.length;i++){
                if(idxStr == childs[i].name){
                    childs[i].roomData = roomCfg;
                    let gameType = roomCfg.gameType;
                    let cfg = roomCfg.bRoomConfigure;
                    let nameData = app.RoomCfgManager().GetRoomData(gameType,cfg);
                    if (typeof(cfg.roomName)!="undefined") {
                        childs[i].getChildByName('roomName').getComponent(cc.Label).string=cfg.roomName;
                    }else{
                        childs[i].getChildByName('roomName').getComponent(cc.Label).string="";
                    }
                    gameType = '' != nameData.smallName1 ? nameData.smallName1 : nameData.bigName1;
                    let gameName = app.RoomCfgManager().GetGameName(gameType,true);
                    let nameLabel = childs[i].getChildByName('name').getComponent(cc.Label);
                    nameLabel.string = gameName;
                    let renLabel = childs[i].getChildByName('renshu').getComponent(cc.Label);
                    renLabel.string = roomCfg.bRoomConfigure.playerNum.toString();
                    let wanfaLabel = childs[i].getChildByName('wanfa').getComponent(cc.Label);
                    gameType = roomCfg.gameType;
                    let payType='';
                    if(cfg.paymentRoomCardType==2){
                        payType='胜家付'+this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume+'圈卡';
                    }else if(cfg.paymentRoomCardType==1){
                        payType='AA付'+this.roomCfgs[i].bRoomConfigure.clubWinnerPayConsume+'圈卡';
                    }else if(cfg.paymentRoomCardType==0){
                        payType='管理付';
                    }
                    //wanfaLabel.string = app.RoomCfgManager().WanFa(gameType,cfg) + payType;
                    app.RoomCfgManager().WanFaFormServer(gameType,cfg,wanfaLabel,0,payType);
                    let zhuoLabel = childs[i].getChildByName('zhuoshu').getComponent(cc.Label);
                    zhuoLabel.string = roomCfg.roomCount;
                    break;
                }
            }
        }

    },
    InitLocalData:function(sendPack){
            for (var item in sendPack) {
                let configData = sendPack[item];
                if( item=="roomName" || item=="clubCostType" || item=="clubId" ||  item=="createType" || item=="gameIndex" || item=="gameType" || item=="clubWinnerPayConsume"){
                    continue;
                }
                let dataType = typeof (configData);
                if (dataType == 'object') {
                    let linshi2 = '0';
                    for (let i = 0; i < configData.length; i++) {
                        if (i == 0) {
                            linshi2 = configData[0] + 1;
                        } else {
                            linshi2 = linshi2 + ',' + (configData[i] + 1);
                        }
                    }
                    configData = linshi2;
                } else {
                    if (item == 'playerNum') {
                        item = 'renshu';
                    } else if (item == 'setCount') {
                        item = 'jushu';
                    } else if (item == 'paymentRoomCardType') {
                        item = 'fangfei';
                    } else if (item == 'cardNum') {
                        item = 'shoupai';
                    } else if (item == 'resultCalc') {
                        item = 'jiesuan';
                    } else if (item == 'maxAddDouble') {
                        item = 'fengdingbeishu';
                    }
                    
                    if(item!="difen"){
                        configData = configData + 1;
                    }
                }
                let clubId = sendPack.clubId;
                let roomKey = sendPack.gameIndex;
                let unionId = 0;
                let unionRoomKey = "0";
                this.SetLocalConfig(sendPack.gameType,item, configData, clubId, roomKey, unionId, unionRoomKey);

                
            }
    },
    SetLocalConfig: function (gameType,configName, configInfo, clubId, roomKey, unionId, unionRoomKey) {
        let key="change_"+app.ShareDefine().GametTypeID2PinYin[gameType]+ '_' + clubId + '_' + roomKey + '_' + unionId + '_' + unionRoomKey + '_' + configName;
        cc.sys.localStorage.setItem(key, configInfo);
    },
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_jiesan' == btnName){
            let roomData = btnNode.parent.parent.roomData.bRoomConfigure;
            this.SetWaitForConfirm('MSG_CLUB_DissolveRoomCfg',this.ShareDefine.Confirm,[],[roomData]);
        }else if('btn_qiyong' == btnName){
            let manage=btnNode.parent;
            let controlNode = manage.parent.getChildByName("controlNode");
            controlNode.active = false;
            if (controlNode.active) {
                manage.parent.height = 170;
            }else{
                manage.parent.height = 90;
            }
            // manage.getComponent(cc.Sprite).enabled = false;
            // manage.getChildByName('btn_jiesan').active=false;
            // manage.getChildByName('btn_jinyong').active=false;
            // manage.getChildByName('btn_qiyong').active=false;
            // manage.getChildByName('btn_xiugai').active=false;

            let roomData = btnNode.parent.parent.roomData.bRoomConfigure;
            let qiyongState = app.ClubManager().Enum_RoomCfg_Nomarl;
            app.ClubManager().SendSetRoomCfg(this.clubId,roomData.gameIndex,qiyongState);
        }
        else if('btn_jinyong' == btnName){
            let manage=btnNode.parent;
            let controlNode = manage.parent.getChildByName("controlNode");
            controlNode.active = false;
            if (controlNode.active) {
                manage.parent.height = 170;
            }else{
                manage.parent.height = 90;
            }
            // manage.getComponent(cc.Sprite).enabled = false;
            // manage.getChildByName('btn_jiesan').active=false;
            // manage.getChildByName('btn_jinyong').active=false;
            // manage.getChildByName('btn_qiyong').active=false;
            // manage.getChildByName('btn_xiugai').active=false;

            let roomData = btnNode.parent.parent.roomData.bRoomConfigure;
            let jinyongState = app.ClubManager().Enum_RoomCfg_Disable;
            app.ClubManager().SendSetRoomCfg(this.clubId,roomData.gameIndex,jinyongState);
        }
        else if('btn_manage'==btnName){
            let manage=btnNode.parent;
            let status = manage.parent.roomData.status;
            let controlNode = manage.parent.getChildByName("controlNode");
            controlNode.active = !controlNode.active;
            if (controlNode.active) {
                manage.parent.height = 170;
            }else{
                manage.parent.height = 90;
            }

            // controlNode.getChildByName('btn_jiesan').active=!controlNode.getChildByName('btn_jiesan').active;
            // controlNode.getComponent(cc.Sprite).enabled = controlNode.getChildByName('btn_jiesan').active;
            if(status==0){
                controlNode.getChildByName('btn_qiyong').active=false;
                controlNode.getChildByName('btn_jinyong').active=true;
                // controlNode.getChildByName('btn_jinyong').active=!controlNode.getChildByName('btn_jinyong').active;
            }else{
                // controlNode.getChildByName('btn_qiyong').active=!controlNode.getChildByName('btn_qiyong').active;
                controlNode.getChildByName('btn_jinyong').active=false;
                controlNode.getChildByName('btn_qiyong').active=true;
            }
            
            // controlNode.getChildByName('btn_xiugai').active=!controlNode.getChildByName('btn_xiugai').active;
        }
        else if('btn_xiugai' == btnName){
            let changeRoomData = btnNode.parent.parent.roomData;
            let changeClubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            let curCityId = changeClubData.cityId;
            let changeData = {};
            let selectGameList = [];
            selectGameList.push(app.ShareDefine().GametTypeNameDict[changeRoomData.gameType.toUpperCase()]);
            changeData.gameList = selectGameList;
            if(0 == changeData.gameList.length){
                this.ErrLog('btn_createRoom Error Club Not Set GameList');
                return
            }
            let nameData = app.RoomCfgManager().GetRoomData(changeRoomData.gameType,changeRoomData.bRoomConfigure);
            changeClubData = {};
            changeClubData.clubId = this.clubId;
            changeClubData.cityId = curCityId;
            // changeClubData.roomKey = changeRoomData.roomKey;
            changeClubData.gameIndex = changeRoomData.bRoomConfigure.gameIndex;//用来判断保存还是创建
            changeClubData.bRoomConfigure= changeRoomData.bRoomConfigure;
            let selectType = ''!=nameData.smallName1?nameData.smallName1:nameData.bigName1;
            changeClubData.enableGameType = selectType;//不禁用的按钮
            changeData.discountType = this.discountType;
            this.InitLocalData(changeRoomData.bRoomConfigure);
            app.FormManager().ShowForm('UICreatRoomNew',changeData,'',changeClubData,null,true);
        }else if('btn_createRoom' == btnName){
            let nowClubData = app.ClubManager().GetClubDataByClubID(this.clubId);
            let data = {};
            data.gameList = app.Client.GetAllGameId();
            if(0 == data.gameList.length){
                console.log('btn_createRoom Error Club Not Set GameList');
                return
            }
            //let gameType = this.ShareDefine.GametTypeID2PinYin[data.gameList[0]];
            let clubData = {};
            clubData.clubId = this.clubId;
            clubData.cityId = nowClubData.cityId;
            clubData.roomKey = '0';
            clubData.gameIndex = 0;//用来判断保存还是创建
            clubData.enableGameType = '';//不禁用的按钮
            data.discountType = this.discountType;
            app.FormManager().ShowForm('UICreatRoomNew',data,'',clubData);
        }else if('btn_roomPrizePool' == btnName){
            app.FormManager().ShowForm('ui/club/UIClubRoomPrizePool',this.clubId);
        }else if('btn_newName' == btnName){
            let changeRoomData = btnNode.parent.parent.roomData;
            app.FormManager().ShowForm('ui/club/UIClubSetRoomName',changeRoomData);
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
