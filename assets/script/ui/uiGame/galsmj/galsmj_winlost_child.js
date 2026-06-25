/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseMJ_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function () {
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
    },
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, maPaiLst = null) {
        this.HuList = HuList;
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('labelScrollView').getChildByName('view').getChildByName('label_lists'));
        //显示比赛分
        if (typeof (HuList.sportsPointTemp) != "undefined") {
            if (HuList.sportsPointTemp > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('labelScrollView').getChildByName('view').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPointTemp);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('labelScrollView').getChildByName('view').getChildByName('label_lists'), "比赛分：" + HuList.sportsPointTemp);
            }
        }else if (typeof (HuList.sportsPoint) != "undefined") {
            if (HuList.sportsPoint > 0) {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('labelScrollView').getChildByName('view').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
            } else {
                this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('labelScrollView').getChildByName('view').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
            }
        }
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan').getChildByName('labelScrollView').getChildByName('view'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2, HuList.yiPaiCardID);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2, HuList.yiPaiCardID);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huaScrollView').getChildByName('view').getChildByName('huacard'), HuList.huaList);
    },
    ShowPlayerHuImg: function (huNode, huTypeName, saiZiList) {
        /*huLbIcon
         *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
         *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
         */
        this.huStringMap = {};
        this.huStringMap["HuOne"] = "接炮1";
        this.huStringMap["HuTwo"] = "接炮2";
        this.huStringMap["HuThree"] = "接炮3";
        this.huStringMap["HuFour"] = "接炮4";
        this.huStringMap["HuFive"] = "接炮5";
        this.huStringMap["ZiMoOne"] = "自摸1";
        this.huStringMap["ZiMoTwo"] = "自摸2";
        this.huStringMap["ZiMoThree"] = "自摸3";
        this.huStringMap["ZiMoFour"] = "自摸4";
        this.huStringMap["ZiMoFive"] = "自摸5";
        this.huStringMap["ChaJiao"] = "查叫";
        this.huStringMap["ChaGuanSi"] = "关死";

        if (Object.hasOwnProperty.call(this.huStringMap, huTypeName)) {
            huNode.getComponent(cc.Label).string = this.huStringMap[huTypeName];
            // this.img_bzfb = this.node.getChildByName("img_bzfb");
            // this.img_bzfb.active = saiZiList[0] == saiZiList[1];
        } else {
            huNode.getComponent(cc.Label).string = '';
            // this.img_bzfb = this.node.getChildByName("img_bzfb");
            // this.img_bzfb.active = false;
        }

        /*let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof(huType) == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else if (huType == this.ShareDefine.HuType_HuOne) {
            huNode.getComponent(cc.Label).string = "接炮一";
        } else if (huType == this.ShareDefine.HuType_HuTwo) {
            huNode.getComponent(cc.Label).string = "接炮二";
        } else if (huType == this.ShareDefine.HuType_HuThree) {
            huNode.getComponent(cc.Label).string = "接炮三";
        } else if (huType == this.ShareDefine.HuType_HuFour) {
            huNode.getComponent(cc.Label).string = "接炮四";
        } else if (huType == this.ShareDefine.HuType_ZiMoOne) {
            huNode.getComponent(cc.Label).string = "自摸一";
        } else if (huType == this.ShareDefine.HuType_ZiMoTwo) {
            huNode.getComponent(cc.Label).string = "自摸二";
        } else if (huType == this.ShareDefine.HuType_ZiMoThree) {
            huNode.getComponent(cc.Label).string = "自摸三";
        } else if (huType == this.ShareDefine.HuType_ZiMoFour) {
            huNode.getComponent(cc.Label).string = "自摸四";
        } else {
            huNode.getComponent(cc.Label).string = '';
        }*/
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let jin1 = setEnd.jin1;
        let jin2 = setEnd.jin2;
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray = new Array();
        let posCount = posResultList.length;
        for (let i = 0; i < posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);
        // this.ShowPlayerHuImg(huNode, posResultList[index]['huType']);
        this.lb_winListNum = this.node.getChildByName('jiesuan').getChildByName("scoreDetails").getChildByName('lb_winListNum').getComponent(cc.Label);
        this.lb_winListNum.string = posResultList[index]["winList"].join("");

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },

    ShowPlayerShowCard: function (ShowNode, cardIDList, handCard, jin1, jin2, yiPaiCardID) {
        ShowNode.active = 1;
        let UICard_ShowCard = ShowNode.getComponent("UIMJCard_ShowCard");
        UICard_ShowCard.ShowDownCardByGALSMJ(cardIDList, handCard, jin1, jin2, yiPaiCardID);
    },
    ShowPlayerDownCard: function (ShowNode, publishcard, jin1 = 0, jin2 = 0, yiPaiCardID) {
        ShowNode.active = 1;
        let UICard_DownCard = ShowNode.getComponent("UIMJCard_Down");
        UICard_DownCard.ShowDownCardByGALSMJ(publishcard, "EatCard_Self_", this.HuList["gangMap"], this.HuList, yiPaiCardID);
    },
    ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
        let huInfo = huInfoAll["huTypeMap"];
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if (huType == "ChaHuaZhu" || huType == "ChaDaJiao") {
                huPoint = huPoint > 0 ? "+" + huPoint : huPoint;
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint);
            } else if (huType == "PingHu" || huType == "SBXS") {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType));
            } else {
                this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + "： " + huPoint + "分");
            }

            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    LabelName: function (huType) {
        let huTypeDict = {
            PingHu: "平胡",
            HP: "胡牌",
            QYM: "缺一门",
            QLM: "缺两门",
            BZ: "边张",
            KZ: "卡张",
            DD: "单吊",
            JXW: "夹心5",
            MQ: "门清",
            MD: "门大",
            DDH: "对对胡",
            QD: "七对",
            LQD: "龙七对",
            QYS: "清一色",
            HYS: "混一色",
            DSY: "大三元",
            XSY: "小三元",
            QBZ: "七板子",
            LBZ: "六板子",
            WBZ: "五板子",
            DBZ: "大板子",
            XBZ: "小板子",
            SiHJ: "四火箭",
            SanHJ: "三火箭",
            HJ: "火箭",
            SiFJ: "四飞机",
            DaFJ: "大飞机",
            XFJ: "小飞机",
            YTL: "一条龙",

            OGSH: "杠上开花",
            GSP: "杠上炮",
            QiangGangHu: "抢杠胡",
            JGD: "金钩钓",
            HDP: "海底炮",
            HDL: "海底胡",
            HDGSP: "海底杠上炮",

            ZiMo: "自摸",
            ZFBP: "中发白碰",
            ZFBMG: "中发白明杠",
            ZFBAG: "中发白暗杠",
            MG: "明杠",
            AG: "暗杠",

            ChaHuaZhu: "查花猪",
            ChaDaJiao: "查大叫",
            MQQYS:"门清清一色",
            MQHYS:"门清混一色",
            SBXS:"十八学士",
            QYSDDH:"清一色对对胡",
            HYSDDH:"混一色对对胡",
            DDHuoJian:"大大火箭",
            ZiHuoJian:"字火箭",
            MQHYSYTL:"门清混一色一条龙",
            MQQYSYTL:"门清清一色一条龙",
            MQYTL:"门清一条龙",
            HYSLQD:"混一色龙七对",
            QYSLQD:"清一色龙七对",
            HYSQD:"混一色七对",
            QYSQD:"清一色七对",
            MQDDH:"门清对对胡",
            ZFBAK:"中发白暗刻",
            SGY:"四归一",
            MQQYSDDH:"门清清一色对对胡",
            MQHYSDDH:"门清混一色对对胡",
            BiFan:"比番",
        };
        return huTypeDict[huType];
    },
});
