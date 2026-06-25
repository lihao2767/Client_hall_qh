var app = require("app");

var PokerCard = app.BaseClass.extend({

    /**
     * 构造函数
     */
    Init: function () {
        this.gameName = app["subGameName"];
        this.JS_Name = this.gameName + "_PokerCard";
        this.pokerDict = {};

        this.LOGIC_MASK_COLOR = 0xF0;
        this.LOGIC_MASK_VALUE = 0x0F;


        this.LOGIC_MASK_XIAOWANG = 17;
        this.LOGIC_MASK_DAWANG = 18;
        this.LOGIC_MASK_LaiZi = 19;
        this.LOGIC_MASK_HUA = 20;

        this.jiaoPai = 0;

        this.NNConst_BeiShu = [[0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 8], [0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 5, 6, 8]];//牌型倍数
        this.LoadAllPokerRes();
    },
    GetPokeCard: function (poker, cardNode, sameCardNum, isShowIcon1 = true, isShowLandowner = false, hideBg = false, isRazz = false) {
        if (0 == poker)
            return;
        let type = "";
        let type_2 = "";
        let type_3 = "";
        let num = "";
        let cardColor = -1;
        let cardValue = -1;
        let isRed = true;
        cardNode.getChildByName("bg_poker").active = true;
        cardColor = this.GetCardColor(poker);
        cardValue = this.GetCardValue(poker);


        if (cardColor == 64) {
            //大小鬼还有癞子
            let numNode = cardNode.getChildByName("num");
            numNode.active = true;

            if (cardValue == this.LOGIC_MASK_DAWANG) {
                type = "icon_big_king_01";
                type_2 = "icon_big_king";
            }
            //小王
            else if (cardValue == this.LOGIC_MASK_XIAOWANG) {
                type = "icon_small_king_01";
                type_2 = "icon_small_king";
            }
            //花牌
            else if (cardValue == this.LOGIC_MASK_HUA) {
                type = "icon_hua";
                // type_2 = "icon_small_king";
                type_2 = "";
            }
        } else {
            let numNode = cardNode.getChildByName("num");
            numNode.active = true;
            if (15 == cardValue) {//跑得快服务端发过来15转为2
                cardValue = 2;
            }
            if (cardColor == 0) {
                type = 'bg_diamond1_1';
                type_2 = 'bg_diamond1_2';
                type_3 = 'icon_dzp';
                num = "red_" + cardValue;
            } else if (cardColor == 16) {
                type = 'bg_club1_1';
                type_2 = 'bg_club1_2';
                type_3 = 'icon_dzp';
                num = "black_" + cardValue;
            } else if (cardColor == 32) {
                type = 'bg_heart1_1';
                type_2 = 'bg_heart1_2';
                type_3 = 'icon_dzp';
                num = "red_" + cardValue;
            } else if (cardColor == 48) {
                type = 'bg_spade1_1';
                type_2 = 'bg_spade1_2';
                type_3 = 'icon_dzp';
                num = "black_" + cardValue;
            }
            if (cardValue == 11 || cardValue == 12 || cardValue == 13) {
                type = "bg_" + cardValue;
                if (cardColor == 0) {
                    type = "bg_diamond1_1";
                    num = "red_" + cardValue;
                } else if (cardColor == 16) {
                    type = "bg_club1_1";
                    num = "black_" + cardValue;
                } else if (cardColor == 32) {
                    type = "bg_heart1_1";
                    num = "red_" + cardValue;
                } else if (cardColor == 48) {
                    type = "bg_spade1_1";
                    num = "black_" + cardValue;
                }
            } else {
                if (cardColor == 0) {
                    type = "bg_diamond";
                    num = "red_" + cardValue;
                } else if (cardColor == 16) {
                    type = "bg_club";
                    num = "black_" + cardValue;
                } else if (cardColor == 32) {
                    type = "bg_heart";
                    num = "red_" + cardValue;
                } else if (cardColor == 48) {
                    type = "bg_spade";
                    num = "black_" + cardValue;
                }
            }

        }
        //如果是癞子牌,替换掉点数
        if (isRazz) {
            type = 'bg_lz_1';
            type_2 = "bg_lz_2";
        }
        cardNode.getChildByName("num").getComponent(cc.Sprite).spriteFrame = '';
        cardNode.getChildByName("icon_1").getComponent(cc.Sprite).spriteFrame = '';
        let numSp = cardNode.getChildByName("num").getComponent(cc.Sprite);
        let iconSp = cardNode.getChildByName("icon").getComponent(cc.Sprite);
        let icon1_Sp = cardNode.getChildByName("icon_1").getComponent(cc.Sprite);
        iconSp.node.active = true;
        icon1_Sp.node.active = true;
        numSp.spriteFrame = this.pokerDict[num];
        iconSp.spriteFrame = this.pokerDict[type];
        icon1_Sp.spriteFrame = this.pokerDict[type_2];

        if (type == "") {
            cardNode.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = '';
        }
        // if (type_1 == "") {
        //     cardNode.getChildByName("icon_1").getComponent(cc.Sprite).spriteFrame = '';
        // }
        if (num == "") {
            cardNode.getChildByName("num").getComponent(cc.Sprite).spriteFrame = '';
        }
        if (hideBg)
            cardNode.getChildByName("poker_back").active = false;
    },
    LoadAllPokerRes: function () {
        let self = this;
        if (!this.pokerDict) {
            return;
        }
        cc.loader.loadResDir("texture/new_poker", cc.SpriteFrame, function (err, assets) {
            if (err) {
                cc.error(err);
                return;
            }
            for (let i = 0; i < assets.length; i++) {
                self.pokerDict[assets[i]._name] = assets[i];
            }
            console.log(self.JS_Name, "加载的大牌", self.pokerDict);
        });
    },

    //获取牌值
    GetCardValue: function (poker) {
        //大小王值最大
        // 0x41, 0x42, //大小王
        // 0x141, 0x142, //大小王
        // 0x241, 0x242, //大小王
        // 0x43, 0x143, //花牌
        if (poker == 0x41 || poker == 0x91 || poker == 0x141 || poker == 0x191 || poker == 0x241) return this.LOGIC_MASK_XIAOWANG;
        if (poker == 0x42 || poker == 0x92 || poker == 0x142 || poker == 0x192 || poker == 0x242) return this.LOGIC_MASK_DAWANG;
        if (poker == 0x43 || poker == 0x143) return this.LOGIC_MASK_HUA;

        let value = poker & this.LOGIC_MASK_VALUE;
        if (2 == value) {
            return 15;
        }

        return value;
    },

    //获取花色
    GetCardColor: function (poker) {
        if (poker == 0x41 || poker == 0x91 || poker == 0x141 || poker == 0x191 || poker == 0x241) return 64;
        if (poker == 0x42 || poker == 0x92 || poker == 0x142 || poker == 0x192 || poker == 0x242) return 64;
        if (poker == 0x43 || poker == 0x143) return 64;//花牌

        let color = poker & this.LOGIC_MASK_COLOR;
        while (color >= 256) {
            color -= 256;
        }
        return color;
    },
});

var g_PokerCard = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_PokerCard) {
        g_PokerCard = new PokerCard();
    }
    return g_PokerCard;
}