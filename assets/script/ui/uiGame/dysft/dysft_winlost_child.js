/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BasePoker_winlost_child"),

    properties: {},

    // use this for initialization
    OnLoad: function () {
        this.PokerCard = app.PokerCard();

    },
    ShowSpecData: function (setEnd, playerAll, index) {
        console.log("setEnd", setEnd["posResultList"][index]);
        let player = setEnd.posResultList[index];
        let prizeCardList = player["prizeCardList"];

        let cardDemo = this.node.getChildByName("cardDemo");
        let prizeScrollView = this.node.getChildByName("prizeScrollView");
        let view = prizeScrollView.getChildByName("view");
        let content = view.getChildByName("content");
        content.removeAllChildren();
        if (prizeCardList.length > 0) {
            for (let i = 0; i < prizeCardList.length; i++) {
                let prizeCard = prizeCardList[i];
                let cardsList = content.children[i];
                if (!cardsList) {
                    cardsList = cc.instantiate(cardDemo);
                    content.addChild(cardsList);
                }
                cardsList.active = true;
                cardsList.x = 0;
                cardsList.y = 0;

                for (let j = 0; j < prizeCard.length; j++) {
                    let cards = cardsList.children[j];
                    if (!cards) {
                        cards = cc.instantiate(cardsList.children[0]);
                        cardsList.addChild(cards);
                    }
                    cards.active = true;
                    cards.x = 0;
                    cards.y = 0;
                    let poker = prizeCard[j];
                    this.PokerCard.GetPokeCard(poker, cards);
                    cards.getChildByName("cardNum").getComponent(cc.Label).string = prizeCard.length;
                }
            }
        }
        //地主标识
        /*if (player.isLandowner) {
         this.node.getChildByName("user_info").getChildByName("icon_dzm").active = true;
         }else{
         this.node.getChildByName("user_info").getChildByName("icon_dzm").active = false;
         }
         //倍数
         this.node.getChildByName("lb_beiShu").active = true;
         let beishu = this.node.getChildByName("lb_beiShu").getComponent(cc.Label);

         beishu.string = player.doubleNum;*/

        /*//明牌倍数
         if (typeof(player.openCard) != "undefined") {
         this.node.getChildByName("lb_mingpaititle").active = true;
         this.node.getChildByName("lb_mingpai").active = true;
         let mingpai = this.node.getChildByName("lb_mingpai").getComponent(cc.Label);

         mingpai.string = player.openCard;
         }else{
         this.node.getChildByName("lb_mingpaititle").active = false;
         this.node.getChildByName("lb_mingpai").active = false;
         }
         */

        //底分
        /*this.node.getChildByName("lb_difen").active = true;
         let difen = this.node.getChildByName("lb_difen").getComponent(cc.Label);
         difen.string = player.baseMark;*/

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
    },
});
