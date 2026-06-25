var app = require("app");
cc.Class({
    extends: require("BaseForm"),
    properties: {
        bg_num: [cc.SpriteFrame],
    },
    //初始化
    OnCreateInit: function () {
        this.liushuiLayout = this.GetWndNode("img_dk/liushuiScrollView/view/content");
        this.demo = this.liushuiLayout.children[0];
    },
    OnShow: function (liuShuiList, huLuoBoMap = {}) {
        console.log("liushuiScrollView", liuShuiList, huLuoBoMap);
        this.ShowItemDetail(liuShuiList);
        let luoBoLayout = this.GetWndNode("img_dk/luoboLayout");
        for (let i = 0; i < luoBoLayout.children.length; i++) {
            luoBoLayout.children[i].opacity = 0;
        }
        if (JSON.stringify(huLuoBoMap) != "{}") {
            this.ShowHuLuoBoMap(huLuoBoMap);
        }
    },
    ShowHuLuoBoMap: function (huLuoBoMap) {
        let luoBoLayout = this.GetWndNode("img_dk/luoboLayout");
        let imageString = "EatCard_Self_";
        let huLuoBoList = this.SetMapZhuanList(huLuoBoMap);
        for (let i = 0; i < huLuoBoList.length; i++) {
            let luoBoCard = luoBoLayout.children[i];
            if (!luoBoCard) {
                luoBoCard = cc.instantiate(luoBoLayout.children[0]);
                luoBoLayout.addChild(luoBoCard);
            }
            luoBoCard.opacity = 255;
            let huLuoBo = huLuoBoList[i];
            let cardType = huLuoBo["cardType"];
            let num = huLuoBo["num"];
            let cardCom = luoBoCard.getComponent("UIMJCard_Down");
            if (cardType > 0) {
                cardCom.ShowImage(luoBoCard, imageString, cardType + "01");
            }
            luoBoCard.getChildByName("lb_num").getComponent(cc.Label).string = num;
        }
    },
    ShowItemDetail: function (liuShuiList) {
        for (let i = 0; i < this.liushuiLayout.children.length; i++) {
            this.liushuiLayout.children[i].active = false;
        }
        for (let i = 0; i < liuShuiList.length; i++) {
            let item = this.liushuiLayout.children[i];
            if (!item) {
                item = cc.instantiate(this.demo);
                this.liushuiLayout.addChild(item);
            }
            item.active = true;
            let liuShui = liuShuiList[i];
            let cardType = liuShui["cardType"];
            let duiXiangList = liuShui["duiXiangList"];
            let huTypeMap = liuShui["huTypeMap"];
            let luoBoPoint = liuShui["luoBoPoint"];
            let point = liuShui["point"];
            let yuPoint = liuShui["yuPoint"];
            this.ShowOpType(item.children[0], huTypeMap);
            this.ShowCard(item.children[0], cardType);
            this.ShowHuFen(item.children[0], point);
            this.ShowLuoBoFen(item.children[0], luoBoPoint);
            this.ShowYuFen(item.children[0], yuPoint);
            this.ShowDuiXiang(item.children[0], duiXiangList);
        }
    },
    ShowOpType: function (showNode, huTypeMap) {
        let strString = "";
        for (let key in huTypeMap) {
            let huTypeStr = this.GetHuTypeDict(key);
            if (key == "SiGuiYi") {
                huTypeStr += "+" + huTypeMap[key];
            }
            strString += " " + huTypeStr;
        }
        showNode.getChildByName("lb_type").getComponent(cc.Label).string = strString;
    },
    ShowCard: function (showNode, cardType) {
        if (cardType > 0) {
            showNode.getChildByName("card").opacity = 255;
            let imageString = "EatCard_Self_";
            let cardCom = showNode.getChildByName("card").getComponent("UIMJCard_Down");
            cardCom.ShowImage(showNode.getChildByName("card"), imageString, cardType + "01");
        } else {
            showNode.getChildByName("card").opacity = 0;
        }
    },
    ShowHuFen: function (showNode, point) {
        showNode.getChildByName("lb_hufen").getComponent(cc.Label).string = point;
    },
    ShowLuoBoFen: function (showNode, luoBoPoint) {
        showNode.getChildByName("lb_luobofen").getComponent(cc.Label).string = "";
    },
    ShowYuFen: function (showNode, yuPoint) {
        showNode.getChildByName("lb_yufen").getComponent(cc.Label).string = "";
    },
    ShowDuiXiang: function (showNode, duiXiangList) {
        let duixiangLayout = showNode.getChildByName("duixiangLayout");
        for (let i = 0; i < duixiangLayout.children.length; i++) {
            duixiangLayout.children[i].opacity = 0;
        }
        for (let i = 0; i < duiXiangList.length; i++) {
            let duixiang = duixiangLayout.children[i];
            if (!duixiang) {
                duixiang = cc.instantiate(duixiangLayout.children[0]);
                duixiangLayout.addChild(duixiang);
            }
            duixiang.opacity = 255;
            let index = duiXiangList[i];
            duixiang.getComponent(cc.Sprite).spriteFrame = this.bg_num[index];
        }
    },
    GetHuTypeDict: function (type) {
        let huTypeDict = {
            QYJ:"清幺九",
            QQD:"连七对",
            YSSLH:"一色双龙会",
            JLBD:"九莲宝灯",
            TH:"天胡",
            DH:"地胡",
            LYS:"绿一色",
            SBLH:"十八罗汉",
            QDa:"全大",
            QZ:"全中",
            QX:"全小",
            SJG:"四节高",
            SiAK:"四暗刻",
            SEJC:"十二金钗",
            QSK:"全双刻",
            SanJG:"三节高",
            JGD:"金钩钓",

            BWS:"百万石",
            DYW:"大于五",
            XYW:"小于五",
            QD:"七对",
            QYS:"清一色",
            SanAK:"三暗刻",
            QL:"清龙",
            GSKH:"杠上开花",

            TBD:"推不倒",
            BQR:"不求人",
            PPH:"碰碰胡",
            LSF:"老少副",
            MQ:"门清",
            DYJ:"断幺九",
            SAK:"双暗刻",
            STK:"双同刻",

            KZ:"坎张",
            BZ:"边张",
            MSHC:"妙手回春",
            HDLY:"海底捞月",
            GSP:"杠上炮",
            JZ:"绝张",
            QGH:"抢杠胡",
            PH:"平胡",
            G:"根",

            GF:"杠分",
        };
        return huTypeDict[type];
    },
    SetMapZhuanList: function (huLuoBoMap) {
        let huLuoBoList = [];
        for (let key in huLuoBoMap) {
            let cardType = key;
            let num = huLuoBoMap[key];
            huLuoBoList.push({"cardType": cardType, "num": num});
        }
        return huLuoBoList;
    },
});