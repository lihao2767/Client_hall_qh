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
        this.node.getChildByName("user_info").getChildByName("xianjia").active = false;

        if (daDuPos >= 0) {
            this.node.getChildByName("user_info").getChildByName("img_huo").active = false;
            this.node.getChildByName("user_info").getChildByName("img_du").active = daDuPos == player.pos;
        } else {
            //庄家的队友显示伙
            let zhuangPartnerPosList = [];
            for (let j = 0; j < posResultList.length; j++) {
                let posResultInfo = posResultList[j];
                if (posResultInfo.pos == dPos) {
                    // zhuangPartnerPosList = posResultInfo.partnerPosList;
                    if (posResultInfo.partnerPos !== -1) {
                        zhuangPartnerPosList.push(posResultInfo.partnerPos);
                    }
                }
            }

            this.node.getChildByName("user_info").getChildByName('img_du').active = false;
            if (zhuangPartnerPosList.indexOf(player.pos) > -1) {
                this.node.getChildByName("user_info").getChildByName('img_huo').active = true;
            } else {
                this.node.getChildByName("user_info").getChildByName('img_huo').active = false;
            }
        }

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
        // scoreNodes.getChildByName("lb_roompoint").getComponent(cc.Label).string = roomPoint > 0 ? "+" + roomPoint : roomPoint;//房间分
        // scoreNodes.getChildByName('lb_tongSe').getComponent(cc.Label).string = (posResultInfo.tongSe > 0 ? "+" + posResultInfo.tongSe : posResultInfo.tongSe);
        // scoreNodes.getChildByName('lb_zhaDanCai').getComponent(cc.Label).string = (posResultInfo.zhaDanCai > 0 ? "+" + posResultInfo.zhaDanCai : posResultInfo.zhaDanCai);
        // scoreNodes.getChildByName('lb_leiJiZhaDanCai').getComponent(cc.Label).string = (posResultInfo.leiJiZhaDanCai > 0 ? "+" + posResultInfo.leiJiZhaDanCai : posResultInfo.leiJiZhaDanCai);
        // scoreNodes.getChildByName('lb_xiangLianZhaDanCai').getComponent(cc.Label).string = (posResultInfo.xiangLianZhaDanCai > 0 ? "+" + posResultInfo.xiangLianZhaDanCai : posResultInfo.xiangLianZhaDanCai);
        if (typeof (posResultInfo.zhaDanPoint) != "undefined" && posResultInfo.zhaDanPoint != null) {
            scoreNodes.getChildByName('lb_duoZuoCai').getComponent(cc.Label).string = (posResultInfo.zhaDanPoint > 0 ? "+" + posResultInfo.zhaDanPoint : posResultInfo.zhaDanPoint);
        } else {
            scoreNodes.getChildByName('lb_duoZuoCai').getComponent(cc.Label).string = 0;
        }
        scoreNodes.getChildByName('lb_roompoint').getComponent(cc.Label).string = (posResultInfo.roomPoint > 0 ? "+" + posResultInfo.roomPoint : posResultInfo.roomPoint);
        // scoreNodes.getChildByName('lb_shuying').getComponent(cc.Label).string = "输赢分:" + (posResultInfo.shuYingPoint > 0 ? "+" + posResultInfo.shuYingPoint : posResultInfo.shuYingPoint);


        // scoreNodes.getChildByName('lb_winLosePoint').getComponent(cc.Label).string = player.point > 0 ? "+" + player.point : player.point;
        // scoreNodes.getChildByName('lb_jianfen').getComponent(cc.Label).string = player.wskPoint > 0 ? "+" + player.wskPoint : player.wskPoint;
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
