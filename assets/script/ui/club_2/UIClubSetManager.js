/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        demo:cc.Node,
        layout:cc.Node,
        toggleAll:cc.Toggle,
    },

    //初始化
    OnCreateInit:function(){

    },

    //---------显示函数--------------------

    OnShow:function(unionId, clubId,opClubId){
        this.clubId = clubId;
        this.unionId=unionId;
        this.opClubId=opClubId;
        this.demo.active=false;
        this.toggleAll.isChecked=false; //标记全部没选中
        this.RefreshManager();
    },
    
    
    RefreshManager:function(){
        let that=this;
        app.NetManager().SendPack("union.CUnionMemberMinisterZhongZhi", {"unionId":this.unionId,"clubId":this.clubId,"opClubId":this.opClubId},function(serverPack){
            
            that.UpdateManager(serverPack);


        },function(error){
        });
    },

    UpdateManager:function(serverPack){
        this.layout.removeAllChildren();
        for(let i=0;i<serverPack.length;i++){
            let data=serverPack[i];
            let addPrefab = cc.instantiate(this.demo);
            addPrefab.getChildByName("lb_key").getComponent(cc.Label).string=parseInt(data.id)+1;
            addPrefab.getChildByName("lb_minister").getComponent(cc.Label).string=data.createName;
            addPrefab.getChildByName("lb_id").getComponent(cc.Label).string=data.clubId;
            addPrefab.getChildByName("lb_name").getComponent(cc.Label).string=data.clubName;
            addPrefab.getChildByName("lb_renshu").getComponent(cc.Label).string=data.onlineCount+"/"+data.number;
            addPrefab.getChildByName("Toggle").getComponent(cc.Toggle).isChecked=data.isMinister;

            addPrefab.getChildByName("Toggle").clubId=data.clubId;
            addPrefab.active=true;
            this.layout.addChild(addPrefab);
        }

    },
    Click_btn_del(){
        let that=this;
        app.NetManager().SendPack("union.CUnionClubMisnisterZhongZhiSave", {"unionId":this.unionId,"clubId":this.clubId,"opClubId":this.opClubId,"clubIdList":[]},function(serverPack){
             app.SysNotifyManager().ShowSysMsg("取消管理操作成功",[],3);
        },function(error){
        });
    },
    Click_btn_add(){
        let that=this;
        let clubIdList=[];
        for(let i=0;i<this.layout.children.length;i++){
            if(this.layout.children[i].getChildByName("Toggle").getComponent(cc.Toggle).isChecked==true){
                clubIdList.push(this.layout.children[i].getChildByName("Toggle").clubId);
            }
        }
        app.NetManager().SendPack("union.CUnionClubMisnisterZhongZhiSave", {"unionId":this.unionId,"clubId":this.clubId,"opClubId":this.opClubId,"clubIdList":clubIdList},function(serverPack){
             app.SysNotifyManager().ShowSysMsg("设置管理操作成功",[],3);
        },function(error){
        });
    },
    CheckAll:function(){
        if(this.toggleAll.isChecked==true){
            this.SelectAll();
        }else{
            this.CannelAll();
        }
    },
    SelectAll:function(){
        for(let i=0;i<this.layout.children.length;i++){
            this.layout.children[i].getChildByName("Toggle").getComponent(cc.Toggle).isChecked=true;
        }
    },
    CannelAll:function(){
        for(let i=0;i<this.layout.children.length;i++){
            this.layout.children[i].getChildByName("Toggle").getComponent(cc.Toggle).isChecked=false;
        }
    },
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }else if('btn_del'==btnName){
            app.Client.OnEvent('UpdateMemberManageNodeData', {});
            this.Click_btn_del();
            this.CloseForm();
        }else if('btn_add'==btnName){
            app.Client.OnEvent('UpdateMemberManageNodeData', {});
            this.Click_btn_add();
            this.CloseForm();
        }
        else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
