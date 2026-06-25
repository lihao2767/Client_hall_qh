/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {
        icon_fct: cc.SpriteFrame,
        icon_ct: cc.SpriteFrame,
    },

    // use this for initialization
    OnLoad: function () {

    },
    ShowPlayerData: function (setEnd, playerAll, index) {
        let player = setEnd.posResultList[index];

        let point = player.point;
        console.log("ShowPlayerData", player);

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

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

        let cardSizePoint = player.cardSizePoint;
        let jiuXiangGuanPoint = player.jiuXiangGuanPoint;
        let sanGangYiPoint = player.sanGangYiPoint;
        let heiChiHong = player.heiChiHong;
        let zhaDanNum = player.zhaDanNum;
        let zhaDanFen = player.zhaDanFen;
        let zhaDanBeiShu = player.zhaDanBeiShu;
        let showZhaDanBeiShu = player.showZhaDanBeiShu;
        //张数分
        this.node.getChildByName("fenLayout").getChildByName("lb_beishuTitle").getChildByName("lb_beiShu").active = true;
        let zhang = this.node.getChildByName("fenLayout").getChildByName("lb_beishuTitle").getChildByName("lb_beiShu").getComponent(cc.Label);
        zhang.string = cardSizePoint;
        //9相关分
        this.node.getChildByName("fenLayout").getChildByName("lb_difentitle").getChildByName("lb_jiu").active = true;
        let jiu = this.node.getChildByName("fenLayout").getChildByName("lb_difentitle").getChildByName("lb_jiu").getComponent(cc.Label);
        jiu.string = jiuXiangGuanPoint;
        //三杠一分
        this.node.getChildByName("fenLayout").getChildByName("lb_sangangyi").getChildByName("lb_difen").active = true;
        let sangangyi = this.node.getChildByName("fenLayout").getChildByName("lb_sangangyi").getChildByName("lb_difen").getComponent(cc.Label);
        sangangyi.string = sanGangYiPoint;
        //黑吃红
        this.node.getChildByName("fenLayout").getChildByName("lb_heichihong").getChildByName("lb_heichihong").active = true;
        let hei = this.node.getChildByName("fenLayout").getChildByName("lb_heichihong").getChildByName("lb_heichihong").getComponent(cc.Label);
        hei.string = heiChiHong;
        //炸弹数量
        this.node.getChildByName("fenLayout").getChildByName("tip_zhandanshu").getChildByName("lb_zhadannum").active = true;
        let zdn = this.node.getChildByName("fenLayout").getChildByName("tip_zhandanshu").getChildByName("lb_zhadannum").getComponent(cc.Label);
        zdn.string = zhaDanNum;
        if (showZhaDanBeiShu) {
            //炸弹倍数
            this.node.getChildByName("fenLayout").getChildByName("tip_zhandanfen").getChildByName("lb_zhadan").active = true;
            let zdbs = this.node.getChildByName("fenLayout").getChildByName("tip_zhandanfen").getChildByName("lb_zhadan").getComponent(cc.Label);
            this.node.getChildByName("fenLayout").getChildByName("tip_zhandanfen").getComponent(cc.Label).string = "炸弹倍数";
            zdbs.string = zhaDanBeiShu;
        } else {
            //炸弹分
            this.node.getChildByName("fenLayout").getChildByName("tip_zhandanfen").getChildByName("lb_zhadan").active = true;
            let zdf = this.node.getChildByName("fenLayout").getChildByName("tip_zhandanfen").getChildByName("lb_zhadan").getComponent(cc.Label);
            this.node.getChildByName("fenLayout").getChildByName("tip_zhandanfen").getComponent(cc.Label).string = "炸弹分";
            zdf.string = zhaDanFen;
        }

        //显示春天或者反春天
        /*let icon_robClose = this.node.getChildByName("icon_robClose");
         icon_robClose.active = true;

         if (player.robClose == -1) {
         icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_fct;
         }else if (player.robClose == 1) {
         icon_robClose.getComponent(cc.Sprite).spriteFrame = this.icon_ct;
         }else{
         icon_robClose.active = false;
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
    },
});
