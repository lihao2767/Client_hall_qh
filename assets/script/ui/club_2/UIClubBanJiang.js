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
        this.WeChatManager=app.WeChatManager();
        this.NetManager=app.NetManager();
    },

    //---------显示函数--------------------

    OnShow:function(clubId, unionId,unionPostType,isMinisetrZhongZhi,myisminister){

    	this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType=unionPostType;
        this.myisminister=myisminister;
        this.isMinisetrZhongZhi=isMinisetrZhongZhi;
        if(this.lastOnLeftNode){
            this.lastOnLeftNode.getChildByName("on").active=false;
        }

        let self = this;
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;
        app.NetManager().SendPack("union.CUnionGetAwardNumZhongZhi",sendPack, function(serverPack){
            let awardTimeAndNums =serverPack.awardTimeAndNums;
            self.UpdateLeft(awardTimeAndNums);
            
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取失败:error01",[],3);
        });
        //this.GetBanJiang(0); //默认抓汇总
    },

    GetBanJiang:function(awardNum,opClubId=-1,statusType=-1){
        let self = this;
        let sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.unionId = this.unionId;


        sendPack.opClubId=this.clubId;


        if(awardNum>0){
            sendPack.awardNum = awardNum;
            sendPack.type = 0;
        }else{
            sendPack.type = 1; //汇总
        }

        if(this.unionPostType==3 || this.myisminister==3){
            sendPack.statusType = 0;
        }else if(this.isMinisetrZhongZhi==true){
            sendPack.statusType = 2;
        }else{
            sendPack.statusType = 3;
        }
        if(opClubId!=-1 || statusType!=-1){  
            sendPack.opClubId=opClubId;
            sendPack.statusType=statusType;

        }

        let right=this.node.getChildByName("right");
        let layout=right.getChildByName("rankScrollView").getChildByName("view").getChildByName("content");
        layout.removeAllChildren();

        app.NetManager().SendPack("union.CUnionAwardRecordZhongZhiByStatusType",sendPack, function(serverPack){
            self.UpdateRight(serverPack);
            
        }, function(){
            app.SysNotifyManager().ShowSysMsg("获取失败:error01",[],3);
        });
    },
    UpdateRight:function(serverPack){
        let right=this.node.getChildByName("right");
        let layout=right.getChildByName("rankScrollView").getChildByName("view").getChildByName("content");
        if(serverPack.length==0){
            return;
        }
        let demo=right.getChildByName("demo");
        for(let i=0;i<serverPack.length;i++){
            if(serverPack[i].totalFlag==false){
                let addNode=cc.instantiate(demo);

                addNode.getChildByName("lb_paiming").getComponent(cc.Label).string=serverPack[i].id;
                addNode.getChildByName("lb_jingjisai").getComponent(cc.Label).string=serverPack[i].clubName;

                addNode.getChildByName("lb_name").getComponent(cc.Label).string=serverPack[i].clubSign;
                
                addNode.getChildByName("lb_haoka").getComponent(cc.Label).string=serverPack[i].consume;
                addNode.getChildByName("lb_haoka").detail=serverPack[i];


                addNode.getChildByName("lb_dayingjia").getComponent(cc.Label).string=serverPack[i].winner;
                addNode.getChildByName("lb_dayingjia").detail=serverPack[i];

                //addNode.getChildByName("lb_jifen").getComponent(cc.Label).string=serverPack[i].promotionShareValue;
                addNode.getChildByName("lb_jifen").getComponent(cc.Label).string=serverPack[i].entryFee;
                addNode.getChildByName("lb_zongjifen").getComponent(cc.Label).string=serverPack[i].zhongZhiTotalPoint;
                addNode.getChildByName("lb_lastjifen").getComponent(cc.Label).string=serverPack[i].zhongZhiFinalTotalPoint;
                if(serverPack[i].awardTime>0){
                    addNode.getChildByName("lb_time").getComponent(cc.Label).string=app.ComTool().GetDateYearMonthDayHourMinuteSecondString(serverPack[i].awardTime);
                }else{
                    addNode.getChildByName("lb_time").getComponent(cc.Label).string='暂无';
                }

                addNode.active=true;

                layout.addChild(addNode);
            }else{
                this.UpdateLvDi(serverPack[i]);
            }
            
        }
    },
    UpdateLvDi:function(data){
        let lvdi=this.node.getChildByName("right").getChildByName("lvdi");
        lvdi.getChildByName("lb_jifen_all").getComponent(cc.Label).string=data.entryFee;
        lvdi.getChildByName("lb_haoka_all").getComponent(cc.Label).string=data.consume;
        lvdi.getChildByName("lb_dayingjia_all").getComponent(cc.Label).string=data.winner;
        lvdi.getChildByName("lb_zongjifen_all").getComponent(cc.Label).string=data.zhongZhiTotalPoint;
        lvdi.getChildByName("lb_lastjifen_all").getComponent(cc.Label).string=data.zhongZhiFinalTotalPoint;
        lvdi.active=true;
    },
    UpdateLeft:function(awardTimeAndNums){
        let left=this.node.getChildByName("left");
        let layout=left.getChildByName("mask").getChildByName("layout");
        layout.removeAllChildren();
        if(awardTimeAndNums.length==0){
            return;
        }
        let demo=left.getChildByName("btn_demo");
        for(let i=awardTimeAndNums.length-1;i>=0;i--){
            let addNode=cc.instantiate(demo);

            addNode.name="btn_banjiang_"+awardTimeAndNums[i].awardNum;

            addNode.getChildByName("lb1").getComponent(cc.Label).string="第"+awardTimeAndNums[i].awardNum+"次";
            addNode.getChildByName("lb2").getComponent(cc.Label).string=app.ComTool().GetDateYearMonthDayString(awardTimeAndNums[i].awardTime);
            addNode.getChildByName("lb3").getComponent(cc.Label).string=app.ComTool().GetDateHourMinuteString(awardTimeAndNums[i].awardTime);
            addNode.active=true;
            addNode.getChildByName("on").active=i==awardTimeAndNums.length-1;
            layout.addChild(addNode);

            if(i==awardTimeAndNums.length-1){
                this.lastawardNum=awardTimeAndNums[i].awardNum;
                this.GetBanJiang(awardTimeAndNums[i].awardNum); //默认抓汇总
                this.lastOnLeftNode=addNode;
            }
        }
    },
  
    
   
    
 
    
     /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[],content = "", lbSure ="", lbCancle=""){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg,content,lbSure,lbCancle);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        
    },
    OnClose:function(){
        this.node.getChildByName("left").getChildByName("mask").getChildByName("layout").removeAllChildren();
        this.node.getChildByName("right").getChildByName("rankScrollView").getChildByName("view").getChildByName("content").removeAllChildren();
        this.node.getChildByName("right").getChildByName("lvdi").active=false;
    },
    //---------点击函数---------------------
    UpdateSelectSaiChang:function(serverPack){
        let moreNode=this.node.getChildByName("right").getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getChildByName("mask");
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
                this.node.getChildByName("right").getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getComponent(cc.Label).string=this.lastNode.getChildByName("lb").getComponent(cc.Label).string;
                if(this.lastNode.statusType==addNode.statusType && this.lastNode.opClubId==addNode.opClubId){
                    addNode.getChildByName("on").active=true;
                }
            }
            addNode.active=1;
            layout.addChild(addNode);
        }
        moreNode.active=true;
    },
	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }
        else if(btnName=="btn_morejijingsaichang"){
            let moreNode=this.node.getChildByName("right").getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getChildByName("mask");
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
            this.node.getChildByName("right").getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getComponent(cc.Label).string=this.lastNode.getChildByName("lb").getComponent(cc.Label).string;
            btnNode.getChildByName("on").active=true;
            this.GetBanJiang(this.lastawardNum,btnNode.opClubId,btnNode.statusType);
            this.node.getChildByName("right").getChildByName("topTitle").getChildByName("btn_morejijingsaichang").getChildByName("mask").active=false;
        }

        else if('lb_haoka'==btnName){
            let opClubId=btnNode.detail.clubId;
            let awardNum=btnNode.detail.awardNum;

            let self = this;
            let sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.unionId = this.unionId;
            sendPack.awardNum=awardNum;
            sendPack.opClubId=opClubId;
            sendPack.type=0;

            app.NetManager().SendPack("union.CUnionAwardRecordDetailZhongZhi",sendPack, function(serverPack){
                app.FormManager().ShowForm("ui/club_2/UIClubBanJiangInfo",serverPack,btnNode.detail,0);
                
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取失败:error03",[],3);
            });

        }else if('lb_dayingjia'==btnName){
            let opClubId=btnNode.detail.clubId;
            let awardNum=btnNode.detail.awardNum;

            let self = this;
            let sendPack = {};
            sendPack.clubId = this.clubId;
            sendPack.unionId = this.unionId;
            sendPack.opClubId=opClubId;
            sendPack.awardNum=awardNum;
            sendPack.type=1;

            app.NetManager().SendPack("union.CUnionAwardRecordDetailZhongZhi",sendPack, function(serverPack){
                app.FormManager().ShowForm("ui/club_2/UIClubBanJiangInfo",serverPack,btnNode.detail,1);
                
            }, function(){
                app.SysNotifyManager().ShowSysMsg("获取失败:error03",[],3);
            });

        }else if('btn_shengcun'==btnName){
            app.FormManager().ShowForm('ui/club_2/UIClubShengCunRenWu',this.clubId,this.unionId);
        }else if(btnName.startsWith('btn_banjiang_')){
            this.lastOnLeftNode.getChildByName("on").active=false;
            let awardNum=parseInt(btnName.replace('btn_banjiang_',''));
            this.lastawardNum=awardNum;
            this.GetBanJiang(awardNum);
            this.lastOnLeftNode=btnNode;
            btnNode.getChildByName("on").active=true;
        }
        
        else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
    
   
});
