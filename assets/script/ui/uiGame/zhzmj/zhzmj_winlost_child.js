/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();
	},
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
        this.HuList = HuList;
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        //显示比赛分
        if (typeof (HuList.sportsPointTemp) != "undefined") {
            if (HuList.sportsPointTemp > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
            }
        }else if (typeof (HuList.sportsPoint) != "undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
            }
        }
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huaScrollView').getChildByName('view').getChildByName('huacard'), HuList.huaList);
    },
    ShowPlayerHuImg:function(huNode,huTypeName){
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType=this.ShareDefine.HuTypeStringDict[huTypeName];
        if(typeof(huType)=="undefined"){
            huNode.getComponent(cc.Label).string = '';
        }else if(huType == this.ShareDefine.HuType_DianPao){
            huNode.getComponent(cc.Label).string = '点泡';
        }else if(huType == this.ShareDefine.HuType_JiePao){
            huNode.getComponent(cc.Label).string = '接炮';
        }else if(huType == this.ShareDefine.HuType_ZiMo){
            huNode.getComponent(cc.Label).string = '自摸';
        }else if(huType == this.ShareDefine.HuType_QGH){
            huNode.getComponent(cc.Label).string = '抢杠胡';
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    ShowPlayerData:function(setEnd,playerAll,index){
        let jin1=setEnd.jin1;
        let jin2=setEnd.jin2;
        let dPos=setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray=new Array();
        let posCount = posResultList.length;
        for(let i=0; i<posCount; i++){
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos]=posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        let huNode=this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode,posResultList[index]['huType']);

        if(dPos===index){
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        }else{
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if(PlayerInfo["pid"] && PlayerInfo["iconUrl"]){
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"],PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll["endPoint"]["huTypeMap"];
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (huType == "XiaoHu") {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
            } else {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
            }

            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    LabelName:function(huType){
	    let huTypeDict = {
            DSY:"大三元",
            DSX:"大四喜",
            JLBD:"九莲宝灯",
            QLD:"连七对",
            SG:"四杠",
            TH:"天和",
            DH:"地和",
            RH:"人和",
            BWS:"百万石",

            XSY:"小三元",
            XSX:"小四喜",
            ZYS:"字一色",
            SAK:"四暗刻",
            YSSL:"一色双龙",

            YSSTS:"一色四通顺",
            YSSJG:"一色四节高",

            YSSBG:"一色四步高",
            SanG:"三杠",
            HYJ:"混幺九",

            QD:"七对",
            QYS:"清一色",
            YSSanTS:"一色三同顺",
            YSSanJG:"一色三节高",

            QL:"清龙",
            YSSanBG:"一色三步高",
            SanAK:"三暗刻",
            TT:"天听",


            DYW:"大于五",
            XYW:"小于五",
            SFK:"三风刻",

            MSHC:"妙手回春",
            HDLY:"海底捞月",
            GSKH:"杠上开花",
            QGH:"抢杠胡",

            PPH:"碰碰胡",
            HYS:"混一色",
            QQR:"全求人",
            SAG:"双暗杠",
            SJK:"双箭刻",

            QDY:"全带幺",
            BQR:"不求人",
            SMG:"双明杠",
            HJZ:"和绝张",
            ZL:"立直",

            JK:"箭刻",
            QFK:"圈风刻",
            MFK:"门风刻",
            MQQ:"门前清",
            PH:"平和",
            SGY:"四归一",
            SHuangAK:"双暗刻",
            AG:"暗杠",
            DY:"断幺",

            EWBJ:"二五八将",
            YJT:"幺九头",
            BT:"报听",
            YBG:"一般高",
            LL:"连六",
            LSF:"老少副",
            YJK:"幺九刻",
            MG:"明杠",
            BZ:"边张",
            KZ:"坎张",
            DDJ:"单吊将",
            ZM:"自摸",
	    };
	    return huTypeDict[huType];
    },
});
