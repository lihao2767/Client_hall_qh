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
        let zhuangRanksType = setEnd["zhuangRanksType"];
        let rankInfoMap = setEnd["rankInFoMap"];
        let posResultList = setEnd.posResultList;

        let point = player.point;
        let roomPoint = player.roomPoint;

        let dPos = setEnd.dPos;

        let daDuPos = setEnd["challengePos"];

        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = dPos == player.pos;

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

        let winLosePoint = player.point;
        if (winLosePoint > 0) {
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + winLosePoint;
            this.node.getChildByName("user_info").getChildByName("bg_win").active = true;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = false;
        }
        else {
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = winLosePoint;
            this.node.getChildByName("user_info").getChildByName("bg_win").active = false;
            this.node.getChildByName("user_info").getChildByName("bg_lost").active = true;
        }

        let scoreNodes = this.node.getChildByName("scoreNodes");

        // let lb_jianfen = player.count510KPoint;;
        // if (player.moGivePoint != 0) {
        //     lb_jianfen += (player.moGivePoint > 0 ? "+" : "") + player.moGivePoint;
        // }
        // scoreNodes.getChildByName("lb_point").getComponent(cc.Label).string = point > 0 ? "+" + point : point;// 得分
        // scoreNodes.getChildByName('lb_huaFen').getComponent(cc.Label).string = player.huaFen > 0 ? "+" + player.huaFen : player.huaFen;
        // scoreNodes.getChildByName('lb_zhaCuoFaFen').getComponent(cc.Label).string = player.zhaCuoFaFen > 0 ? "+" + player.zhaCuoFaFen : player.zhaCuoFaFen;
        let posResultInfo = player;
        scoreNodes.getChildByName("lb_roomPoint").getComponent(cc.Label).string = roomPoint > 0 ? "+" + roomPoint : roomPoint;//房间分
        scoreNodes.getChildByName('lb_jiashu').getComponent(cc.Label).string = posResultInfo.zhangShuFen > 0 ? "+" + posResultInfo.zhangShuFen : posResultInfo.zhangShuFen;
        // scoreNodes.getChildByName('lb_winLosePoint').getComponent(cc.Label).string = player.baseScore > 0 ? "+" + player.baseScore : player.baseScore;
        // if (typeof (posResultInfo["beiShu"]) == "undefined") {
        //     scoreNodes.getChildByName('lb_jiangfen').active = false;
        // } else {
        //     scoreNodes.getChildByName('lb_jiangfen').active = true;
        //     scoreNodes.getChildByName('lb_jiangfen').getComponent(cc.Label).string = posResultInfo.beiShu;
        // }

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
    },
});
