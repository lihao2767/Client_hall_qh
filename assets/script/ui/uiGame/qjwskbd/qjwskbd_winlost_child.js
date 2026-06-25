/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {
        icon_you: [cc.SpriteFrame],
        morentouxiang: cc.SpriteFrame,
    },

    // use this for initialization
    OnLoad: function () {

    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let myPid = app.HeroManager().GetHeroProperty("pid");
        let player = setEnd.posResultList[index];
        // let zhuangRanksType = setEnd["zhuangRanksType"];
        // let rankInfoMap = setEnd["rankInFoMap"];
        let posResultList = setEnd.posResultList;

        let myRanksType = -1;
        let ranksType = player.ranksType;

        let dPos = setEnd.dPos;

         //显示游数
        let endType = player.endType;//游数  0为默认值
        let finishOrder = 0;
        if (endType == "ONE") {
            finishOrder = 1;
        } else if (endType == "TWO") {
            finishOrder = 2;
        } else if (endType == "THREE") {
            finishOrder = 3;
        } else if (endType == "FOUR") {
            finishOrder = 4;
        } else {
            finishOrder = -1;
        }
        if (finishOrder > 0) {
            this.node.getChildByName('you').getComponent(cc.Sprite).spriteFrame = this.icon_you[finishOrder - 1];
        } else {
            this.node.getChildByName('you').getComponent(cc.Sprite).spriteFrame = "";
        }

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
        
        this.node.getChildByName("user_info").getChildByName("zhuangjia").active = dPos == player.pos;
        this.node.getChildByName("user_info").getChildByName("xianjia").active = false;

        // let daDuPos = setEnd["daDuPos"];
        /*if (daDuPos >= 0) {
            this.node.getChildByName("user_info").getChildByName("img_huo").active = false;
            this.node.getChildByName("user_info").getChildByName("img_du").active = daDuPos == player.pos;
        } else {
            this.node.getChildByName("user_info").getChildByName('img_du').active = false;
            if (zhuangPartnerPosList.indexOf(player.pos) > -1) {
                // this.node.getChildByName("user_info").getChildByName('img_huo').active = true;
            } else {
                this.node.getChildByName("user_info").getChildByName('img_huo').active = false;
            }
        }*/
        // this.node.getChildByName("user_info").getChildByName('img_huo').active = ranksType%2;
        // this.node.getChildByName("user_info").getChildByName("zhuangjia").active = zhuangPartnerPosList.indexOf(player.pos) > -1;
        // this.node.getChildByName("user_info").getChildByName("xianjia").active = zhuangPartnerPosList.indexOf(player.pos) == -1;
        //显示庄闲
        // this.node.getChildByName("user_info").getChildByName("zhuangjia").active = player.ranksType == zhuangRanksType;
        // this.node.getChildByName("user_info").getChildByName("xianjia").active = player.ranksType !== zhuangRanksType;

        

        let scoreDetails = this.node.getChildByName("scoreDetails");
        if(typeof(player.xiPoint) == "undefined"){
            scoreDetails.getChildByName("lb_xifen").active = false;
           
        }else{
            scoreDetails.getChildByName("lb_xifen").active = true;
            scoreDetails.getChildByName("lb_xifen").getComponent(cc.Label).string = player.xiPoint > 0 ? "+" + player.xiPoint: player.xiPoint;
        }
        scoreDetails.getChildByName("lb_prizePoint").getComponent(cc.Label).string = player.prizePoint > 0 ? "+" + player.prizePoint : player.prizePoint;
        scoreDetails.getChildByName("lb_count510KPoint").getComponent(cc.Label).string = player.count510KPoint > 0 ? "+" + player.count510KPoint: player.count510KPoint;
        scoreDetails.getChildByName("lb_gongxianfen").getComponent(cc.Label).string = player.gongXianPoint > 0 ? "+" + player.gongXianPoint: player.gongXianPoint;
        scoreDetails.getChildByName("lb_baodifen").getComponent(cc.Label).string = player.baoDiPoint > 0 ? "+" + player.baoDiPoint: player.baoDiPoint;
        


        //玩家分数
        //比赛分
        let lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if(typeof(player.sportsPoint) != "undefined"){
            if (player.sportsPoint > 0) {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            }
            else {
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
            }
            scoreDetails.getChildByName("lb_point").getComponent(cc.Label).string = player.sportsPoint > 0 ? "+" + player.sportsPoint : player.sportsPoint;
            scoreDetails.getChildByName("lb_roomPoint").getComponent(cc.Label).string = player.roomSportPoint > 0 ? "+" + player.roomSportPoint : player.roomSportPoint;

            this.node.getChildByName("lb_allScoreTitle").active = false;
            this.node.getChildByName("lb_lose_num").active = false;
            this.node.getChildByName("lb_win_num").active = false;
        } else {
            lb_sportsPointTitle.active = false;

            scoreDetails.getChildByName("lb_point").getComponent(cc.Label).string = player.point > 0 ? "+" + player.point : player.point;
            scoreDetails.getChildByName("lb_roomPoint").getComponent(cc.Label).string = player.roomPoint > 0 ? "+" + player.roomPoint : player.roomPoint;
            this.node.getChildByName("lb_allScoreTitle").active = true;
            this.node.getChildByName("lb_lose_num").active = true;
            this.node.getChildByName("lb_win_num").active = true;
            let point = player.point;
            if (point > 0) {
                this.node.getChildByName("lb_win_num").getComponent(cc.Label).string = "+" + point;
                this.node.getChildByName("lb_lose_num").active = false;
            }
            else {
                this.node.getChildByName("lb_lose_num").getComponent(cc.Label).string = point;
                this.node.getChildByName("lb_win_num").active = false;
            }
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
                console.log("playerInfo", playerInfo.pid,playerInfo.name);
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
});
