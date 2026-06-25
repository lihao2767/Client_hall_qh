/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function () {

    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let player = setEnd.posResultList[index];
        // let zhuangRanksType = setEnd["zhuangRanksType"];
        let posResultList = setEnd.posResultList;

        let point = player.point;

        let dPos = setEnd.dPos;

        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = dPos == player.pos;

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;
        
        this.node.getChildByName("lb_allScoreTitle").active = true;
        if (point > 0) {
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + point;
        }
        else {
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = point;
        }


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
        /*if (player.upLevelId > 0) {
            this.node.getChildByName("user_info").getChildByName("label_upLevel").getComponent(cc.Label).string = "所属推广员ID：" + player.upLevelId;
        } else {
            this.node.getChildByName("user_info").getChildByName("label_upLevel").getComponent(cc.Label).string = "";
        }*/

        let playerInfo = null;
        for (let i = 0; i < playerAll.length; i++) {
            if (player.pid == playerAll[i].pid) {
                playerInfo = playerAll[i];
                break;
            }
        }

        let head = this.node.getChildByName("user_info").getChildByName("mask").getChildByName("head_img").getComponent("WeChatHeadImage");
        head.ShowHeroHead(playerInfo.pid);
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


        //显示详情
        let jieSuanContents = this.node.getChildByName("jieSuanContents").getChildByName("content");
        let lb_hutype = this.node.getChildByName("lb_hutype");
        jieSuanContents.removeAllChildren();
        let huTypeMap = player["huTypeMap"];
        if (typeof (huTypeMap) == "undefined") {
            huTypeMap = player["endPoint"]["huTypeMap"];
        }
        let huTypeDict = this.GetHuTypeDict();
        for (let huType in huTypeMap) {
            let huPoint = huTypeMap[huType];
            let node = cc.instantiate(lb_hutype);
            jieSuanContents.addChild(node);
            node.active = true;
            this.ShowHuType(node, huTypeDict, huType, huPoint);
        }
    },

    ShowHuType: function (lbNode, huTypeDict, huType, huPoint) {
        if (!Object.hasOwnProperty.call(huTypeDict, huType)) {
            console.error(`小局胡类型 ${huType} is not exist!`);
        }
        if (huType == "SkillBeiShu" || huType == "BombBeiShu") {
            lbNode.getComponent(cc.Label).string = huTypeDict[huType] + "x" + huPoint;
        }
        else {
            lbNode.getComponent(cc.Label).string = huTypeDict[huType] + ":" + huPoint;
        }
    },

    GetHuTypeDict: function () {
        let huTypeDict = {};
        huTypeDict["YiZhiDuXiu"]="一枝独秀";
        huTypeDict["HongYunDangTou"]="鸿运当头";
        huTypeDict["YuWengDeLi"]="渔翁得利";
        huTypeDict["ShiLaiYunZhuan"]="时来运转";
        huTypeDict["HaiDiLaoYue"]="海底捞月";
        huTypeDict["QiaoDuoTianGong"]="巧夺天工";
        huTypeDict["SkillBeiShu"]="技能牌倍数";
        huTypeDict["BombBeiShu"]="炸弹倍数";

        return huTypeDict;
    },
});
