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
        this.ShareDefine = app.ShareDefine();
    },
    ShowPlayerHuImg: function (huNode, huTypeName) {
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof (huType) == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else {
            huNode.getComponent(cc.Label).string = '';
        }
    },
    ShowPlayerInfo: function (ShowNode, PlayerInfo, HuList) {
        ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"],PlayerInfo["name"]);
        ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);
        let zuoFenLb = "";
        if (HuList["zuoFen"] > 0) {
            zuoFenLb = HuList["zuoFen"]+"坐";
        }
        let laFenLb = "";
        if (HuList["laFen"] > 0) {
            laFenLb = HuList["laFen"]+"拉";
        }
        let paoFenLb = "";
        if (HuList["paoFen"] > 0) {
            paoFenLb = HuList["paoFen"]+"跑";
        }
        ShowNode.getChildByName('zuoLb').getComponent(cc.Label).string = zuoFenLb;
        ShowNode.getChildByName('laLb').getComponent(cc.Label).string = laFenLb;
        ShowNode.getChildByName('paoLb').getComponent(cc.Label).string = paoFenLb;
        //所属推广员ID
        if(ShowNode.getChildByName('label_upLevel')){
            if(HuList["upLevelId"] > 0){
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "所属推广员ID:" + HuList["upLevelId"];
            }else{
                ShowNode.getChildByName('label_upLevel').getComponent("cc.Label").string = "";
            }
        }
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll.huTypeMap;
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (this.IsShowMulti2(huType)) {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "*" + huPoint);
			} else {
				this.ShowLabelName(ShowNode.getChildByName("label_lists"), this.LabelName(huType) + "：" + huPoint);
            }
            console.log("ShowPlayerJieSuan", huType);
        }
    },

    IsShowMulti2: function (huType) {
		let multi2 = [
            // "GangJing", "AnGang", "MingGang"
		];
		let isShow = multi2.indexOf(huType) != -1;
		return isShow;
    },
    
    LabelName: function (huType) {
        let huTypeDict = {};

        huTypeDict["PingHu"]="平胡";
        huTypeDict["QDHu"]="七对";
        huTypeDict["SSL"]="十三不靠";
        huTypeDict["QueLiangMen"]="缺门";
        huTypeDict["QueMen"]="缺门";
        huTypeDict["QGH"]="抢杠胡";
        huTypeDict["GSKH"]="杠开";
        huTypeDict["Hua"]="花";
        huTypeDict["LianZhuang"]="连庄";
        huTypeDict["KanFen"]="坎";
        huTypeDict["MenQing"]="再手";
        huTypeDict["DD"]="独一";
        huTypeDict["YaoTou"]="幺头";
        huTypeDict["QYS"]="清一色";
        huTypeDict["QuanYou"]="全有";
        huTypeDict["QuanWu"]="全无";
        huTypeDict["AnGang"]="暗杠";
        huTypeDict["Gang"]="碰后杠";
        huTypeDict["JieGang"]="直杠";

        if (!huTypeDict.hasOwnProperty(huType)) {
            console.error("huType = " + huType + "is not exist");
        }

        return huTypeDict[huType];
    },
});
