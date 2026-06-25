/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {
        morentouxiang: cc.SpriteFrame,
        cardPrefab: cc.Prefab,
        demo: cc.Node,
        bijiangLayout: cc.Node
    },

    // use this for initialization
    OnLoad: function () {
        app["gtpk_PokerCard"] = require("gtpk_PokerCard").GetModel;
        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.PokerCard = app.gtpk_PokerCard();
    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        console.log("ShowPlayerData", setEnd, playerAll, setEnd[index], playerAll[index]);
        this.jiangDict = {
            0: "    ",
            1: "1奖",
            2: "2奖",
            3: "3奖",
            4: "4奖",
            5: "5奖",
            6: "6奖",
            7: "7奖",
            8: "8奖",
            9: "9奖",
            10: "10奖",
            11: "11奖",
            12: "12奖",
        }
        this.zhaDict = {
            0: "    ",
            1: "一炸",
            2: "二炸",
            3: "三炸",
            4: "四炸",
            5: "五炸",
            6: "六炸",
            7: "七炸",
            8: "八炸",
            9: "九炸",
            10: "十炸",
            11: "十一炸",
            12: "十二炸",
        }
        this.tongDict = {
            0: "   ",
            1: "1筒",
            2: "2筒",
            3: "3筒",
            4: "4筒",
            5: "5筒",
            6: "6筒",
            7: "7筒",
            8: "8筒",
            9: "9筒",
            10: "10筒",
            11: "11筒",
            12: "12筒",
            13: "13筒",
            14: "14筒",
        }

        let myPid = app.HeroManager().GetHeroProperty("pid");
        let player = setEnd.posResultList[index];
        let zhuangRanksType = setEnd["zhuangRanksType"];
        let rankInfoMap = setEnd["rankInFoMap"];
        let posResultList = setEnd.posResultList;
        let isBJ = setEnd["isBJ"];
        let pointMap = setEnd["pointMap"];

        let myRanksType = -1;
        let ranksType = player.ranksType;
        let point = player.point;
        let roomPoint = player.roomPoint;
        let biJiangJiang = player.biJiangJiang;
        let biShangInfos = player.biShangInfos;
        this.bijiangLayout.removeAllChildren();
        this.ShowCardTypeBiJiang(biShangInfos, biJiangJiang);

        let dPos = setEnd.dPos;
        //庄家的队友显示伙
        let zhuangPartnerPosList = [];
        for (let j = 0; j < posResultList.length; j++) {
            let posResultInfo = posResultList[j];
            if (posResultInfo.pos == dPos) {
                zhuangPartnerPosList.push(posResultInfo.partnerPos);
            }
            let pid = posResultInfo["pid"];
            if (myPid == pid) {
                myRanksType = posResultInfo["ranksType"];
            }
        }
        let daDuPos = setEnd["daDuPos"];
        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = dPos == player.pos;
        this.node.getChildByName("user_info").getChildByName("xianjia").active = false;

        if (daDuPos >= 0) {
            this.node.getChildByName("user_info").getChildByName("img_huo").active = false;
            this.node.getChildByName("user_info").getChildByName("img_du").active = daDuPos == player.pos;
        } else {
            this.node.getChildByName("user_info").getChildByName('img_du').active = false;
            if (zhuangPartnerPosList.indexOf(player.pos) > -1) {
                // this.node.getChildByName("user_info").getChildByName('img_huo').active = true;
            } else {
                this.node.getChildByName("user_info").getChildByName('img_huo').active = false;
            }
        }
        this.node.getChildByName("user_info").getChildByName('img_huo').active = ranksType % 2;
        // this.node.getChildByName("user_info").getChildByName("zhuangjia").active = zhuangPartnerPosList.indexOf(player.pos) > -1;
        // this.node.getChildByName("user_info").getChildByName("xianjia").active = zhuangPartnerPosList.indexOf(player.pos) == -1;
        //显示庄闲
        // this.node.getChildByName("user_info").getChildByName("zhuangjia").active = player.ranksType == zhuangRanksType;
        // this.node.getChildByName("user_info").getChildByName("xianjia").active = player.ranksType !== zhuangRanksType;

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

        let winLosePoint = player.shuYingPoint;
        let fenshu = pointMap[2];
        if (winLosePoint > 0) {
            if (pointMap[1] > pointMap[2]) {
                if (ranksType == 1) {
                    fenshu = pointMap[1];
                }
            }
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + winLosePoint;
            this.node.getChildByName("user_info").getChildByName("bg_win").active = true;
            this.node.getChildByName("user_info").getChildByName("bg_win").getChildByName("lb_win").getComponent(cc.Label).string = "+" + fenshu;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = false;
            this.node.getChildByName("user_info").getChildByName("bg_lost").getChildByName("lb_lose").getComponent(cc.Label).string = "";
        } else {
            if (pointMap[1] > pointMap[2]) {
                if (ranksType == 1) {
                    fenshu = pointMap[2];
                }
            }
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = winLosePoint;
            this.node.getChildByName("user_info").getChildByName("bg_win").active = false;
            this.node.getChildByName("user_info").getChildByName("bg_win").getChildByName("lb_win").getComponent(cc.Label).string = "";
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = true;
            this.node.getChildByName("user_info").getChildByName("bg_lost").getChildByName("lb_lose").getComponent(cc.Label).string = "-" +fenshu;
        }

        let scoreDetails = this.node.getChildByName("scoreDetails");

        scoreDetails.getChildByName("lb_prizePoint").getComponent(cc.Label).string = player.resultJiang > 0 ? "+" + player.resultJiang : player.resultJiang;
        scoreDetails.getChildByName("lb_count510KPoint").getComponent(cc.Label).string = player.count510KPoint > 0 ? "+" + player.count510KPoint : player.count510KPoint;
        scoreDetails.getChildByName("lb_faWangPoint").getComponent(cc.Label).string = player.resultTong > 0 ? "+" + player.resultTong : player.resultTong;
        scoreDetails.getChildByName("lb_niaofen").getComponent(cc.Label).string = player.resultNiao > 0 ? "+" + player.resultNiao : player.resultNiao;
        scoreDetails.getChildByName("lb_point").getComponent(cc.Label).string = point > 0 ? "+" + point : point;
        scoreDetails.getChildByName("lb_roomPoint").getComponent(cc.Label).string = roomPoint > 0 ? "+" + roomPoint : roomPoint;


        //比赛分
        let lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if (player.sportsPoint) {
            if (player.sportsPoint > 0) {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            }
            else {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
            }
        } else {
            lb_sportsPointTitle.active = false;
        }

        //所属推广员ID
        if (player.upLevelId > 0) {
            this.node.getChildByName("user_info").getChildByName("label_upLevel").getComponent(cc.Label).string = "所属推广员ID：" + player.upLevelId;
        } else {
            this.node.getChildByName("user_info").getChildByName("label_upLevel").getComponent(cc.Label).string = "";
        }

        let playerInfo = null;
        for (let i = 0; i < playerAll.length; i++) {
            if (player.pid == playerAll[i].pid) {
                playerInfo = playerAll[i];
                console.log("playerInfo", playerInfo.pid, playerInfo.name);
                break;
            }
        }
        let head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
        this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent(cc.Sprite).spriteFrame = this.morentouxiang;
        head.isGetHead = false;
        head.ShowHeroHead(playerInfo.pid, playerInfo.iconUrl);
        //玩家名字
        let playerName = "";
        playerName = playerInfo.name;
        if (playerName.length > 6) {
            playerName = playerName.substring(0, 6) + '...';
        }
        let name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
        name.string = playerName;

        let id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
        id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
    },
    ShowCardTypeBiJiang: function (showList, biJiangJiang = "") {
        for (let i = 0; i < showList.length; i++) {
            let zhaSize = showList[i]["zhaSize"];
            let cardList = showList[i]["cardList"];
            console.log("cardList", cardList);
            let jiangNum = showList[i]["jiangNum"];
            let tongSize = showList[i]["tongSize"];
            let wangZhaFlga = showList[i]["wangZhaFlga"];
            let singleNode = cc.instantiate(this.demo);
            this.bijiangLayout.addChild(singleNode);
            singleNode.active = true;
            singleNode.x = 0;
            singleNode.y = 0;
            singleNode.getChildByName("typeLayout").getChildByName("lb_cardType1").getComponent(cc.Label).string = this.zhaDict[zhaSize];
            singleNode.getChildByName("typeLayout").getChildByName("lb_cardType2").getComponent(cc.Label).string = this.tongDict[tongSize];
            if (i == showList.length - 1) {
                singleNode.getChildByName("typeLayout").getChildByName("lb_cardType3").getComponent(cc.Label).string = this.jiangDict[biJiangJiang];
            }
            singleNode.obRazzCard = cardList;

            let pokersNode = singleNode.getChildByName("cardLayout");
            pokersNode.removeAllChildren();

            for (let x = 0; x < cardList.length; x++) {
                let cardNode = cc.instantiate(this.cardPrefab);
                pokersNode.addChild(cardNode);
                if (x + 1 == cardList.length) {
                    this.ShowCard(cardList[x], cardNode, 0, true);
                } else {
                    this.ShowCard(cardList[x], cardNode, 0, false);
                }
            }

        }
    },
    ShowCard: function (cardType, cardNode, sameCardNum, isLastCard, isShowLandowner = false, hideBg = false, isRazz = false, cardValue) {
        cardNode.active = true;
        if (cardType == 0) {
            cardNode.getChildByName("poker_back").active = true;
            return;
        } else {
            cardNode.getChildByName("poker_back").active = false;
        }
        this.PokerCard.GetPokeCard(cardType, cardNode, sameCardNum, isLastCard, isShowLandowner, hideBg, isRazz, cardValue);
    },
});
