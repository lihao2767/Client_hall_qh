/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BasePoker_winlost_child"),

	properties: {
        icon_you: [cc.SpriteFrame],
        morentouxiang:　cc.SpriteFrame,
        
    },

	// use this for initialization
	OnLoad: function () {

	},
    ShowPlayerData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];

        let point  = player.point;

        //玩家分数
        let winNode = this.node.getChildByName("lb_win_num");
        let loseNode = this.node.getChildByName("lb_lose_num");
        winNode.active = false;
        loseNode.active = false;

        if(point > 0){
            winNode.active = true;
            winNode.getComponent(cc.Label).string = "+" + point;
        }
        else{
            loseNode.active = true;
            loseNode.getComponent(cc.Label).string = point;
        }

        //比赛分
        let lb_sportsPointTitle = this.node.getChildByName("lb_sportsPointTitle");
        if (player.sportsPoint) {
            if(player.sportsPoint > 0){
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = "+" + player.sportsPoint;
            }
            else{
                lb_sportsPointTitle.active = true;
                lb_sportsPointTitle.getChildByName("lb_sportsPoint").getComponent(cc.Label).string = player.sportsPoint;
            }
        }else{
            lb_sportsPointTitle.active = false;
        }

        let playerInfo = null;
        for(let i = 0;i < playerAll.length;i++){
            if(player.pid == playerAll[i].pid){
                playerInfo = playerAll[i];
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
        if(playerName.length > 6){
            playerName = playerName.substring(0, 6) + '...';
        }
        let name = this.node.getChildByName("user_info").getChildByName("lable_name").getComponent(cc.Label);
        name.string = playerName;

        let id = this.node.getChildByName("user_info").getChildByName("label_id").getComponent(cc.Label);
        id.string = "ID:" + app.ComTool().GetPid(playerInfo["pid"]);
        this.ShowSpecData(setEnd,playerAll,index);
    },
    ShowSpecData:function(setEnd,playerAll,index){
        let player = setEnd.posResultList[index];

        //阵营
        let lb_zhenying = this.node.getChildByName("contentLayout").getChildByName("lb_zhenying");
        lb_zhenying.active = true;
        let zhenying = lb_zhenying.getComponent(cc.Label);
        let jiPaiSteps = -1; 
        if (player.isRed) {
            zhenying.string = "红方";
            jiPaiSteps = player["redSteps"];
        }else{
            zhenying.string = "蓝方";
            jiPaiSteps = player["blueSteps"];
        }
        
        //底分
        let lb_jipai = this.node.getChildByName("contentLayout").getChildByName("lb_jipai");
        lb_jipai.active = true;
        let jipai = lb_jipai.getComponent(cc.Label);
        jipai.string = jiPaiSteps;


        //显示游数
        if (player.finishOrder > 0) {
            this.node.getChildByName("user_info").getChildByName('you').getComponent(cc.Sprite).spriteFrame = this.icon_you[player.finishOrder - 1];
        } else {
            this.node.getChildByName("user_info").getChildByName('you').getComponent(cc.Sprite).spriteFrame = "";
        }
    },
});
