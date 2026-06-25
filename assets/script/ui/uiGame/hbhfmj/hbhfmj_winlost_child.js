/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {
        label_lists: cc.Node,
        label_item: cc.Node,
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
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        this.label_lists.removeAllChildren();
        let huTypeMap = huInfoAll['endPoint'].huTypeMap;

        let isKuoHao = false;
        let isJiaFenXiang = false;
        let kuoHaoIndex = 0;
        let jiaFenXiangIndex = 0;
        let kuohaoDict = {
            PH: "平胡",
            ZM: "自摸",
            YH: "硬胡",
            MQ: "门清",
            QYS: "清一色",
            JYS: "将一色",
            PPH: "碰碰胡",
            QD: "七对",
            HHQD: "豪华七对",
            SHHQD: "双豪华七对",
            SanHHQD: "三豪华七对",
            QQR: "全求人",
            SLZ: "四癞子",
            SLZYPX: "四癞子有普通牌型",
            TZ: "抬庄",
            P: "飘分",
            DF: "底分",

            JFBS: "",
//---------------------
            GSH: "",
            GSP: "",
            LQHP: "",
            G: "",
            DLZ: "",
            HLZG: "",
            CPHLZ: "",
        };
        let jiaFenXiangDict = {
            JFBS: "加分倍数",
//---------------------
            GSH: "杠上花",
            GSP: "杠上炮",
            LQHP: "癞前胡牌",
            G: "杠",
            DLZ: "打癞子",
            HLZG: "后癞子杠",
            CPHLZ: "吃碰杠癞子",

            PH: "",
            ZM: "",
            YH: "",
            MQ: "",
            QYS: "",
            JYS: "",
            PPH: "",
            QD: "",
            HHQD: "",
            SHHQD: "",
            SanHHQD: "",
            QQR: "",
            SLZ: "",
            SLZYPX: "",
            TZ: "",
            P: "",
            DF: "",
        };
        for (let huType in kuohaoDict) {
            let huPoint = huTypeMap[huType];
            let huStr = kuohaoDict[huType];
            if (huStr && huPoint) {
                let node = cc.instantiate(this.label_item);
                this.label_lists.addChild(node);
                node.active = true;
                this.ShowHuType(node, kuohaoDict, huType, huPoint);
                isKuoHao = true;
                kuoHaoIndex++;
            }
        }

        for (let huType in jiaFenXiangDict) {
            let huPoint = huTypeMap[huType];
            let huStr = jiaFenXiangDict[huType];
            if (huStr && huPoint) {
                let node = cc.instantiate(this.label_item);
                this.label_lists.addChild(node);
                node.active = true;
                this.ShowHuType(node, jiaFenXiangDict, huType, huPoint);
                isJiaFenXiang = true;
                jiaFenXiangIndex++;
            }
        }
        let firstLabel1 = "";
        let firstLabel2 = "";
        let firstLabel3 = "";
        let firstLabel4 = "";
        if (isKuoHao) {
            if (kuoHaoIndex == 1) {
                firstLabel1 = this.label_lists.children[0].getComponent(cc.Label).string;
                this.label_lists.children[0].getComponent(cc.Label).string = "【" + firstLabel1 + "】";
            } else {
                firstLabel1 = this.label_lists.children[0].getComponent(cc.Label).string;
                firstLabel2 = this.label_lists.children[kuoHaoIndex - 1].getComponent(cc.Label).string;
                this.label_lists.children[0].getComponent(cc.Label).string = "【" + firstLabel1;
                this.label_lists.children[kuoHaoIndex - 1].getComponent(cc.Label).string = firstLabel2 + "】";
            }
        }
        if (isJiaFenXiang) {
            if (jiaFenXiangIndex == 2) {
                firstLabel3 = this.label_lists.children[kuoHaoIndex + 1].getComponent(cc.Label).string;
                this.label_lists.children[kuoHaoIndex + 1].getComponent(cc.Label).string = "（" + firstLabel3 + "）";
            } else {
                firstLabel3 = this.label_lists.children[kuoHaoIndex + 1].getComponent(cc.Label).string;
                firstLabel4 = this.label_lists.children[kuoHaoIndex + jiaFenXiangIndex - 1].getComponent(cc.Label).string;
                this.label_lists.children[kuoHaoIndex + 1].getComponent(cc.Label).string = "（" + firstLabel3;
                this.label_lists.children[jiaFenXiangIndex + kuoHaoIndex - 1].getComponent(cc.Label).string = firstLabel4 + "）";
            }

        }
    },
    ShowHuType: function (lbNode, huTypeDict, huType, huPoint) {
        if (!Object.hasOwnProperty.call(huTypeDict, huType)) {
            console.error(`小局胡类型 ${huType} is not exist!`);
        }
        if (this.IsNoShowScore(huType)) {
            lbNode.getComponent(cc.Label).string = huTypeDict[huType] + ":" + huPoint;
        } else {
            lbNode.getComponent(cc.Label).string = huTypeDict[huType] + "X" + huPoint;
        }
    },
    IsNoShowScore: function (huType) {
        let multi2 = ["TZ", "P", "DF"];
        let isShow = multi2.indexOf(huType) != -1;
        return isShow;
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

        huTypeDict["PH"] = "屁胡";
        huTypeDict["XX"] = "小血";
        huTypeDict["DX"] = "大血";
        huTypeDict["QD"] = "七对";
        huTypeDict["HHQD"] = "豪华七对";
        huTypeDict["SHHQD"] = "双豪华七对";
        huTypeDict["SanHHQD"] = "三豪华七对";
        huTypeDict["QYS"] = "清一色";
        huTypeDict["JYS"] = "将一色";
        huTypeDict["PPH"] = "碰碰胡";
        huTypeDict["QQR"] = "全求人";
        huTypeDict["MQ"] = "门清";
        huTypeDict["YH"] = "硬胡";
        huTypeDict["GSH"] = "杠上花";
        huTypeDict["GSP"] = "杠上炮";
        huTypeDict["PZG"] = "痞子杠";
        huTypeDict["MG"] = "明杠";
        huTypeDict["LZG"] = "赖子杠";
        huTypeDict["AG"] = "暗杠";
        huTypeDict["GZ"] = "跟庄";

        if (!huTypeDict.hasOwnProperty(huType)) {
            console.error("huType = " + huType + "is not exist");
        }

        return huTypeDict[huType];
    },
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
        this.HuList = HuList;
        this.showLabelNum = 1;
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);

        //显示比赛分
        if (typeof (HuList.sportsPointTemp) != "undefined") {
            let node = cc.instantiate(this.label_item);
            this.label_lists.addChild(node);
            node.active = true;
            if (HuList.sportsPointTemp > 0) {
                node.getComponent(cc.Label).string = "比赛分：+" + HuList.sportsPointTemp;
            } else {
                node.getComponent(cc.Label).string = "比赛分：" + HuList.sportsPointTemp;
            }
        } else if (typeof (HuList.sportsPoint) != "undefined") {
            let node = cc.instantiate(this.label_item);
            this.label_lists.addChild(node);
            node.active = true;
            if (HuList.sportsPoint > 0) {
                node.getComponent(cc.Label).string = "比赛分：+" + HuList.sportsPoint;
            } else {
                node.getComponent(cc.Label).string = "比赛分：" + HuList.sportsPoint;
            }
        }
    },
});
