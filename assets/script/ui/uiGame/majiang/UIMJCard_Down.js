/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
    extends: require("BaseComponent"),

    properties: {},

    // use this for initialization
    OnLoad: function () {
        this.JS_Name = this.node.name + "_UIMJCard_Down";
        this.ShareDefine = app.ShareDefine();
        this.ChildCount = 5;
        this.PaiChildCount = 4;
        this.ComTool = app.ComTool();
        this.SysDataManager = app.SysDataManager();
        this.IntegrateImage = this.SysDataManager.GetTableDict("IntegrateImage");
        this.HideAllChild();
    },
    HideAllChild: function () {
        for (let index = 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
            for (let indexChild = 1; indexChild <= this.PaiChildCount; indexChild++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", indexChild, 2);
                let paiNode = childNode.getChildByName(paiChildName);
                if (!paiNode) {
                    this.ErrLog("HideAllChild(%s) not find:%s", childName, paiChildName);
                    continue
                }
                let paiSprite = paiNode.getComponent(cc.Sprite);
                let zhi = paiNode.getChildByName('zhi');
                if (zhi != null) {
                    zhi.active = false;
                }
                paiSprite.spriteFrame = null;
            }
        }
    },
    ShowDownCardByPZMJ: function (publicCardList, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }
            //如果是坎牌,自己视角：暗明暗；别人视角：三暗
            if (opType == this.ShareDefine.OpType_KanPai) {
                cardIDList = [0, cardIDList[0], 0];
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    GetSameCardTypes: function (cardIDList) {
        let sameValueList = {};
        for (let i = 0; i < cardIDList.length; i++) {
            let cardId = cardIDList[i];
            let cardType = Math.floor(cardId / 100);
            if (!sameValueList.hasOwnProperty(cardType)) {
                sameValueList[cardType] = [];
            }
            sameValueList[cardType].push(cardId);
        }
        return sameValueList;
    },
    // 吉安麻将
    ShowDownCardByJAMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBgByJAMJ(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
            if (childNode.getChildByName("icon_fu")) {
                childNode.getChildByName("icon_fu").active = false;
            }
        }
    },
    ShowDownCardByQJHHMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_', jinJin = 0) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            this.OpType_RuanAnGang = 243;
            if (opType == this.OpType_RuanAnGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
                cardIDList = [0, cardIDList[0], 0];
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
                this.ShowJinBgByQJHHMJ(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
            if (childNode.getChildByName("icon_jin01")) {
                childNode.getChildByName("icon_jin01").active = false;
            }
            if (childNode.getChildByName("icon_jinJin")) {
                childNode.getChildByName("icon_jinJin").active = false;
            }
        }
    },
    ShowDownCardByDXHFT: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_', jinJin = 0) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                // cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            this.OpType_RuanAnGang = 243;
            if (opType == this.OpType_RuanAnGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
                // cardIDList = [0, cardIDList[0], 0];
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue;
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
                // this.ShowJinBgByQJHHMJ(cardID, childNode, jin1, jin2);
                this.ShowImageDXHFT(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
            if (childNode.getChildByName("icon_jin01")) {
                childNode.getChildByName("icon_jin01").active = false;
            }
            if (childNode.getChildByName("icon_jinJin")) {
                childNode.getChildByName("icon_jinJin").active = false;
            }
        }
    },
    ShowDownCardByQHDMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_', jinJin = 0) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            this.OpType_RuanAnGang = 243;
            if (opType == this.ShareDefine.OpType_AnGang || opType == this.OpType_RuanAnGang) {
                //东南西北杠全显示
                let cardTypeList = [];
                for (let i = 0; i < cardIDList.length; i++) {
                    cardTypeList.push(Math.floor(cardIDList[i] / 100));
                }
                if (cardTypeList.indexOf(41) > -1 ||
                    cardTypeList.indexOf(42) > -1 ||
                    cardTypeList.indexOf(43) > -1 ||
                    cardTypeList.indexOf(44) > -1) {

                } else {
                    cardIDList = [0, 0, 0, cardIDList[3]];
                    //暗杠自己摸得杠，不标记
                    cardbgPos = -1;
                    getCardID == -1;
                }
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
                this.ShowJinBgByQJHHMJ(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
            if (childNode.getChildByName("icon_jin01")) {
                childNode.getChildByName("icon_jin01").active = false;
            }
            if (childNode.getChildByName("icon_jinJin")) {
                childNode.getChildByName("icon_jinJin").active = false;
            }
        }
    },
    ShowJinBgByQJHHMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
            if (roomSet) {
                jin1 = roomSet.get_jin1();
                jin2 = roomSet.get_jin2();
            }
        }
        if (childNode.getChildByName("icon_jin01")) {
            childNode.getChildByName("icon_jin01").active = false;
        }
        if (childNode.getChildByName("icon_jinJin")) {
            childNode.getChildByName("icon_jinJin").active = false;
        }
        if (cardID > 0) {
            if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
                childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = true;
                }
            } else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
                childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = true;
                }
            } else {
                childNode.color = cc.color(255, 255, 255);
            }
        } else {
            childNode.color = cc.color(255, 255, 255);
            if (childNode.getChildByName("icon_jin01")) {
                childNode.getChildByName("icon_jin01").active = false;
            }
            if (childNode.getChildByName("icon_jinJin")) {
                childNode.getChildByName("icon_jinJin").active = false;
            }
        }
    },

    ShowJinBgByJAMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
            if (roomSet) {
                jin1 = roomSet.get_jin1();
                jin2 = roomSet.get_jin2();
            }
        }
        if (childNode.getChildByName("da")) {
            childNode.getChildByName("da").active = false;
        }
        if (childNode.getChildByName("icon_fu")) {
            childNode.getChildByName("icon_fu").active = false;
        }
        if (cardID > 0) {
            if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
                childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = true;
                }
            } else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
                childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("icon_fu")) {
                    childNode.getChildByName("icon_fu").active = true;
                }
            } else {
                childNode.color = cc.color(255, 255, 255);
            }
        } else {
            childNode.color = cc.color(255, 255, 255);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
            if (childNode.getChildByName("icon_fu")) {
                childNode.getChildByName("icon_fu").active = false;
            }
        }

    },
    // 特殊蛋(长春麻将)
    ShowTeShuDanDownCardByCCMJ: function (cardIDList, childNode, imageString = 'EatCard_Self_', jin1 = 0, jin2 = 0) {
        childNode.active = true;
        let sameCardTypes = this.GetSameCardTypes(cardIDList);
        let cardCount = Object.keys(sameCardTypes).length;
        let i = 1;
        for (let cardType in sameCardTypes) {
            if (sameCardTypes.hasOwnProperty(cardType)) {
                let cardList = sameCardTypes[cardType] || [];
                let count = cardList.length;
                let cardNode = childNode.getChildByName("card0" + i++);
                cardNode.getChildByName("lb_num").active = count > 1;
                cardNode.getChildByName("lb_num").getComponent(cc.Label).string = "x" + count;
                let cardID = Math.floor(cardType + "01");
                if (cardNode.getChildByName("da")) {
                    cardNode.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, cardNode, jin1, jin2);
                this.ShowImage(cardNode, imageString, cardID);
            }
        }

        for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
            let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childPath = paiChildName;//[childName, paiChildName].join("/");
            if (cardIndex == 6) {
                childPath = [paiChildName, "cards"].join("/");
            }
            let cardNode = cc.find(childPath, childNode);
            if (!cardNode) {
                continue
            }
            cardNode.color = cc.color(255, 255, 255);
            // console.error("cardNode: ", cardNode.name)
            cardNode.active = false;
            let cardSprite = cardNode.getComponent(cc.Sprite);
            cardSprite.spriteFrame = null;
        }
    },
    // 长春麻将
    ShowDownCardByCCMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            // 长春特殊蛋处理
            if (opType == this.ShareDefine.OpType_TeShuDan) {
                let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
                let childNode = this.node.getChildByName(childName);
                if (!!childNode) {
                    this.ShowTeShuDanDownCardByCCMJ(cardIDList, childNode, imageString, jin1, jin2);
                }
                continue;
            }
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            let isNeedShowCard06 = false;
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                // 长春特殊蛋处理(第四张牌校正)
                if (cardIndex == 3) {
                    paiChildName = this.ComTool.StringAddNumSuffix("card", 6, 2);
                    childPath = [childName, paiChildName, "cards"].join("/");
                    isNeedShowCard06 = true;
                }
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            let offset = 1;
            if (isNeedShowCard06) {
                offset = 0;
            }
            for (let cardIndex = cardCount + offset; cardIndex <= 6; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (cardIndex == 6) {
                    if (isNeedShowCard06) {
                        continue;
                    }
                    childPath = [childName, paiChildName, "cards"].join("/");
                    childNode = cc.find(childPath, this.node);
                }
                if (!childNode) {
                    continue
                }
                childNode.active = false;
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCard: function (publicCardList, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCardByZJYYMJ: function (publicCardList, pengCardList = [], jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        let isPengGang = false;
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //操作的牌
            let actionCardID = publicInfoList[2];
            isPengGang = pengCardList.indexOf(actionCardID) > -1;
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCardByYBXZMJ: function (publicCardList, jin1 = 0, jin2 = 0, jinJin = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowJinBgByYBXZMJ(cardID, childNode, jin1, jin2, jinJin);
                this.ShowImage(childNode, imageString, cardID);
                if (isPengGang) {
                    childNode.color = cc.color(200, 200, 200);
                } else {
                    childNode.color = cc.color(255, 255, 255);
                }
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCardBySSE: function (publicCardList, imageString = 'Poker_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }
            if (opType == this.ShareDefine.OpType_TianGang) {
                cardIDList = [0, 0, 0, 0, cardIDList[3]];
            }


            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowImageBySSE(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= 5; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= 8; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    //诸暨麻将
    ShowDownCardBySXZJMJ: function (kexuanwanfa, publicCardList, jin1, jin2, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            let actionCardID = publicInfoList[2];
            let carIDIndex = cardIDList.indexOf(actionCardID);
            cardIDList.splice(carIDIndex, 1);
            cardIDList.push(actionCardID);
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                if (kexuanwanfa.indexOf(2) > -1) {//暗杠可见

                } else {
                    cardIDList = [0, 0, 0, cardIDList[3]];
                }
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    // 内江麻将
    ShowDownCardBySCNJMJ: function (publicCardList, imageString = 'EatCard_Self_', gangMap, posResultInfo) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }

        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            let cardId = cardIDList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                childNode.getChildByName("bg_mask").active = (posResultInfo["ypdyList"] || []).indexOf(cardID) > -1;
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                childNode.getChildByName("bg_mask").active = false;
            }

            let cardType = Math.floor(cardId / 100);
            let gangNumLists = gangMap && gangMap[cardType] || [];
            // gangNumLists = this.SwitchToTargetData(gangNumLists);
            childNode.getChildByName("lb_gangNum").getComponent(cc.Label).string = gangNumLists.join("");
        }


        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    //邻水麻将
    ShowDownCardByGALSMJ: function (publicCardList, imageString = 'EatCard_Self_', gangMap, posResultInfo, yiPaiCardID) {
        console.log("邻水麻将", yiPaiCardID);
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }

        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            let cardId = cardIDList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                childNode.getChildByName("bg_mask").active = false;
                this.ShowImage(childNode, imageString, cardID);
                if (Math.floor(yiPaiCardID / 100) == Math.floor(cardID / 100)) {
                    childNode.getChildByName("bg_mask").active = true;
                }
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                childNode.getChildByName("bg_mask").active = false;
            }

            let cardType = Math.floor(cardId / 100);
            let gangNumLists = gangMap && gangMap[cardType] || [];
            // gangNumLists = this.SwitchToTargetData(gangNumLists);
            childNode.getChildByName("lb_gangNum").getComponent(cc.Label).string = gangNumLists.join("");
        }


        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCardByJinBg: function (publicCardList, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCardByLKMJ: function (publicCardList, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (publicInfoList.indexOf(5001) > -1) {
            } else {
                if (opType == this.ShareDefine.OpType_AnGang) {
                    cardIDList = [0, 0, 0, cardIDList[3]];
                }
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCardByJMSKMJ: function (publicCardList, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                if (childNode.getChildByName("pi")) {
                    childNode.getChildByName("pi").active = false;
                }
                if (childNode.getChildByName("pi2")) {
                    childNode.getChildByName("pi2").active = false;
                }
                this.ShowJinBgByJMSKMJ(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                if (childNode.getChildByName("pi")) {
                    childNode.getChildByName("pi").active = false;
                }
                if (childNode.getChildByName("pi2")) {
                    childNode.getChildByName("pi2").active = false;
                }

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCardByHSHHMJ: function (publicCardList, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jin02")) {
                    childNode.getChildByName("icon_jin02").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
                this.ShowJinBgByHSHHMJ(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jin02")) {
                    childNode.getChildByName("icon_jin02").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    ShowDownCardLLFYMJ: function (publicCardList, imageString = 'EatCard_Self_', liangPaiList, baoZhangList) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                childNode.getChildByName("da").active = false;
                childNode.getChildByName("kouting").active = false;
                this.ShowImage(childNode, imageString, cardID);
                if (liangPaiList.indexOf(cardID) > -1) {
                    childNode.getChildByName("da").active = true;
                }
                if (baoZhangList.indexOf(cardID) > -1) {
                    childNode.getChildByName("kouting").active = true;
                }
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    //武汉麻将
    ShowDownCardByHBWHMJ: function (publicCardList, posCount, jin1 = 0, laiZiPiList = [], specialLaiZiPiList = [], imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBgByHBWHMJ(cardID, childNode, jin1, laiZiPiList, specialLaiZiPiList);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    //景德镇麻将
    ShowDownCardByJDZMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    //普洱麻将
    ShowDownCardByPEMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_') {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                if (cardIDList.length == 3) {
                    //中发白的暗杆特殊处理
                    cardIDList = cardIDList;
                } else {
                    cardIDList = [0, 0, 0, cardIDList[3]];
                }
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    //河南信阳麻将
    ShowDownCardByHnxymj: function (publicCardList, allKanList, imageString = "EatCard_Self_") {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowImage(childNode, imageString, cardID);
                this.ShowDownCardKan(childNode, allKanList.indexOf(cardID) > -1);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
    //黎川麻将
    ShowDownCardByLCMJ: function (publicCardList, posCount, jin1 = 0, jin2 = 0, imageString = 'EatCard_Self_', notPointGangList = []) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }
        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //定位碰吃位置，上家下家还是对家
            let cardbgPos = -1;
            let cardIDPos = publicInfoList[1];
            let getCardID = publicInfoList[2];

            let nodeParentName = this.node.parent.name;
            if (nodeParentName.indexOf("1") > 0) {
            } else if (nodeParentName.indexOf("2") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 3;
                } else if (cardIDPos == 1) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 2) {
                    cardIDPos = 1;
                } else if (cardIDPos == 3) {
                    cardIDPos = 2;
                }
            } else if (nodeParentName.indexOf("3") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 2;
                } else if (cardIDPos == 1) {
                    cardIDPos = 3;
                } else if (cardIDPos == 2) {
                    // cardIDPos = 0;
                } else if (cardIDPos == 3) {
                    cardIDPos = 1;
                }
            } else if (nodeParentName.indexOf("4") > 0) {
                if (cardIDPos == 0) {
                    cardIDPos = 1;
                } else if (cardIDPos == 1) {
                    cardIDPos = 2;
                } else if (cardIDPos == 2) {
                    cardIDPos = 3;
                } else if (cardIDPos == 3) {
                    // cardIDPos = 0;
                }
            }
            if (cardIDPos == 1) {
                cardbgPos = 0;
            } else if (cardIDPos == 2) {
                cardbgPos = 1;
            } else if (cardIDPos == 3) {
                cardbgPos = 2;
            }

            if (opType == this.ShareDefine.OpType_Chi) {
                let middleIndex = cardIDList.indexOf(getCardID);
                let middleCardID = cardIDList.splice(middleIndex, 1);
                cardIDList.splice(0, 0, middleCardID);
            }

            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
                //暗杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            if (opType == this.ShareDefine.OpType_MingGang) {
                //明杠自己摸得杠，不标记
                cardbgPos = -1;
                getCardID == -1;
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            if (cardIDList.length == 4 && cardbgPos == 1) {
                //如果是杠，牌还是对家的，那蒙版就贴在第4张
                cardbgPos = 3;
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                if (posCount > 2) {
                    if (cardbgPos == cardIndex && cardbgPos > -1) {
                        childNode.color = cc.color(150, 150, 150);
                    } else {
                        childNode.color = cc.color(255, 255, 255);
                    }
                }
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                this.ShowJinBg(cardID, childNode, jin1, jin2);
                this.ShowImage(childNode, imageString, cardID);
                //不算分的杠置灰
                if (notPointGangList.indexOf(Math.floor(cardID / 100)) > -1) {
                    childNode.color = cc.color(125, 125, 125);
                } else {
                    childNode.color = cc.color(255, 255, 255);
                }
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },

    ShowImage: function (childNode, imageString, cardID) {
        //显示贴图
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        let imageName = "";
        if (cardID) {
            //取卡牌ID的前2位
            imageName = [imageString, Math.floor(cardID / 100)].join("");
        }
        else {
            if (imageString == "EatCard_Self_") {
                imageName = "CardBack_Self";
            }
        }
        let imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                    app['majiang_' + imageName] = spriteFrame;
                })
                .catch(function (error) {
                        that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                    }
                );
        }
    },
    ShowImageDXHFT: function (childNode, imageString, cardID) {
        //显示贴图
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        let mjToPokerDict = {
            1101: "C1", 1102: "C1", 1103: "S1", 1104: "S1",
            1201: "C2", 1202: "C2", 1203: "S2", 1204: "S2",
            1301: "C3", 1302: "C3", 1303: "S3", 1304: "S3",
            1401: "C4", 1402: "C4", 1403: "S4", 1404: "S4",
            1501: "C5", 1502: "C5", 1503: "S5", 1504: "S5",
            1601: "C6", 1602: "C6", 1603: "S6", 1604: "S6",
            1701: "C7", 1702: "C7", 1703: "S7", 1704: "S7",
            1801: "C8", 1802: "C8", 1803: "S8", 1804: "S8",
            1901: "C9", 1902: "C9", 1903: "S9", 1904: "S9",
            2001: "C10", 2002: "C10", 2003: "S10", 2004: "S10",
            2101: "C11", 2102: "C11", 2103: "S11", 2104: "S11",
            2201: "C12", 2202: "C12", 2203: "S12", 2204: "S12",
            2301: "C13", 2302: "C13", 2303: "S13", 2304: "S13",

            3101: "D1", 3102: "D1", 3103: "H1", 3104: "H1",
            3201: "D2", 3202: "D2", 3203: "H2", 3204: "H2",
            3301: "D3", 3302: "D3", 3303: "H3", 3304: "H3",
            3401: "D4", 3402: "D4", 3403: "H4", 3404: "H4",
            3501: "D5", 3502: "D5", 3503: "H5", 3504: "H5",
            3601: "D6", 3602: "D6", 3603: "H6", 3604: "H6",
            3701: "D7", 3702: "D7", 3703: "H7", 3704: "H7",
            3801: "D8", 3802: "D8", 3803: "H8", 3804: "H8",
            3901: "D9", 3902: "D9", 3903: "H9", 3904: "H9",
            4001: "D10", 4002: "D10", 4003: "H10", 4004: "H10",
            4101: "D11", 4102: "D11", 4103: "H11", 4104: "H11",
            4201: "D12", 4202: "D12", 4203: "H12", 4204: "H12",
            4301: "D13", 4302: "D13", 4303: "H13", 4304: "H13",
        };
        //取卡牌转
        let imageName = mjToPokerDict[cardID];

        let imagePath = "texture/mjToPoker/" + imageName;
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                    app['majiang_' + imageName] = spriteFrame;
                })
                .catch(function (error) {
                        that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                    }
                );
        }
    },
    ShowImageBySSE: function (childNode, imageString, cardID) {
        //显示贴图
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        // if (cardID) {
        //     //取卡牌ID的前2位
        //     imageName = [imageString, Math.floor(cardID / 100)].join("");
        // }
        // else {
        //     if (imageString == "") {
        //         imageName = "CardBack_Self";
        //     }
        // }
        //取卡牌ID的前2位
        let imageName = [imageString, Math.floor(cardID / 100)].join("");
        let imageInfo = this.IntegrateImage[imageName];
        if (!imageInfo) {
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if (app['majiang_' + imageName]) {
            childSprite.spriteFrame = app['majiang_' + imageName];
        } else {
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
                .then(function (spriteFrame) {
                    if (!spriteFrame) {
                        that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                        return
                    }
                    childSprite.spriteFrame = spriteFrame;
                    app['majiang_' + imageName] = spriteFrame;
                })
                .catch(function (error) {
                        that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
                    }
                );
        }
    },
    ShowJinBg: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
            if (roomSet) {
                jin1 = roomSet.get_jin1();
                jin2 = roomSet.get_jin2();
            }
        }
        if (cardID > 0) {
            if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) || Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
                childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = true;
                }
            } else {
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
            }
        } else {
            childNode.color = cc.color(255, 255, 255);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
        }

    },
    ShowJinBgByYBXZMJ: function (cardID, childNode, jin1 = 0, jin2 = 0, jinJin = 0) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
            if (roomSet) {
                jin1 = roomSet.get_jin1();
                jin2 = roomSet.get_jin2();
            }
        }
        if (cardID > 0) {
            if (Math.floor(cardID / 100) == Math.floor(jin1 / 100) ||
                Math.floor(cardID / 100) == Math.floor(jin2 / 100) ||
                Math.floor(cardID / 100) == Math.floor(jinJin / 100)) {
                childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = true;
                }
            } else {
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
            }
        } else {
            childNode.color = cc.color(255, 255, 255);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
        }

    },
    ShowJinBgByHBWHMJ: function (cardID, childNode, jin1 = 0, laiZiPiList = [], specialLaiZiPiList = []) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
            if (roomSet) {
                jin1 = roomSet.get_jin1();
                jin2 = roomSet.get_jin2();
            }
        }
        if (cardID > 0) {
            if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
                // childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = true;
                }
                if (childNode.getChildByName("pi")) {
                    childNode.getChildByName("pi").active = false;
                }
                if (childNode.getChildByName("pi2")) {
                    childNode.getChildByName("pi2").active = false;
                }
            } else if (laiZiPiList.indexOf(Math.floor(cardID / 100)) > -1) {
                // childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                if (childNode.getChildByName("pi")) {
                    childNode.getChildByName("pi").active = true;
                }
                if (childNode.getChildByName("pi2")) {
                    childNode.getChildByName("pi2").active = false;
                }
            } else if (specialLaiZiPiList.indexOf(Math.floor(cardID / 100)) > -1) {
                // childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                if (childNode.getChildByName("pi")) {
                    childNode.getChildByName("pi").active = false;
                }
                if (childNode.getChildByName("pi2")) {
                    childNode.getChildByName("pi2").active = true;
                }
            }
        } else {
            // childNode.color = cc.color(255, 255, 255);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
            if (childNode.getChildByName("pi")) {
                childNode.getChildByName("pi").active = false;
            }
            if (childNode.getChildByName("pi2")) {
                childNode.getChildByName("pi2").active = false;
            }
        }

    },
    ShowJinBgByJMSKMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        if (jin1 == 0) {
            if (this.RoomMgr == null) {
                return;
            }
            let room = this.RoomMgr.GetEnterRoom();
            if (!room) return;
            let roomSet = room.GetRoomSet();
            if (roomSet) {
                jin1 = roomSet.get_jin1();
                jin2 = roomSet.get_jin2();
            }
        }
        if (cardID > 0) {
            if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
                childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = true;
                }
                if (childNode.getChildByName("pi")) {
                    childNode.getChildByName("pi").active = false;
                }
                if (childNode.getChildByName("pi2")) {
                    childNode.getChildByName("pi2").active = false;
                }
            } else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                if (childNode.getChildByName("pi")) {
                    childNode.getChildByName("pi").active = false;
                }
                if (childNode.getChildByName("pi2")) {
                    childNode.getChildByName("pi2").active = false;
                }
            }
            if (Math.floor(cardID / 100) == 45 || Math.floor(cardID / 100) == 46) {
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("da")) {
                    childNode.getChildByName("da").active = false;
                }
                if (childNode.getChildByName("pi")) {
                    childNode.getChildByName("pi").active = false;
                }
                if (childNode.getChildByName("pi2")) {
                    childNode.getChildByName("pi2").active = true;
                }
            }
        } else {
            childNode.color = cc.color(255, 255, 255);
            if (childNode.getChildByName("da")) {
                childNode.getChildByName("da").active = false;
            }
            if (childNode.getChildByName("pi")) {
                childNode.getChildByName("pi").active = false;
            }
            if (childNode.getChildByName("pi2")) {
                childNode.getChildByName("pi2").active = false;
            }
        }
    },
    ShowJinBgByHSHHMJ: function (cardID, childNode, jin1 = 0, jin2 = 0) {
        if (cardID > 0) {
            if (Math.floor(cardID / 100) == Math.floor(jin1 / 100)) {
                childNode.color = cc.color(255, 255, 125);
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = true;
                }
                if (childNode.getChildByName("icon_jin02")) {
                    childNode.getChildByName("icon_jin02").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
            } else if (Math.floor(cardID / 100) == Math.floor(jin2 / 100)) {
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jin02")) {
                    childNode.getChildByName("icon_jin02").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
            } else if (Math.floor(cardID / 100) == 45 || Math.floor(cardID / 100) == 46) {
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jin02")) {
                    childNode.getChildByName("icon_jin02").active = true;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
            } else {
                childNode.color = cc.color(255, 255, 255);
                if (childNode.getChildByName("icon_jin01")) {
                    childNode.getChildByName("icon_jin01").active = false;
                }
                if (childNode.getChildByName("icon_jin02")) {
                    childNode.getChildByName("icon_jin02").active = false;
                }
                if (childNode.getChildByName("icon_jinJin")) {
                    childNode.getChildByName("icon_jinJin").active = false;
                }
            }
        } else {
            childNode.color = cc.color(255, 255, 255);
            if (childNode.getChildByName("icon_jin01")) {
                childNode.getChildByName("icon_jin01").active = false;
            }
            if (childNode.getChildByName("icon_jin02")) {
                childNode.getChildByName("icon_jin02").active = false;
            }
            if (childNode.getChildByName("icon_jinJin")) {
                childNode.getChildByName("icon_jinJin").active = false;
            }
        }
    },
    //河南信阳麻将
    ShowDownCardKan: function (childNode, isShow) {
        if (childNode.getChildByName("da")) {
            childNode.getChildByName("da").active = isShow;
        }
    },

    //血战血流
    ShowDownCardToGangMap: function (publicCardList, imageString = 'EatCard_Self_', gangMap) {
        let count = 0;
        if (typeof (publicCardList) != "undefined") {
            count = publicCardList.length;
        }

        for (let index = 0; index < count; index++) {
            let publicInfoList = publicCardList[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            let cardId = cardIDList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if (opType == this.ShareDefine.OpType_AnGang) {
                cardIDList = [0, 0, 0, cardIDList[3]];
            }

            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                this.ShowImage(childNode, imageString, cardID);
            }
            //设置多余的卡牌位置空
            for (let cardIndex = cardCount + 1; cardIndex <= this.PaiChildCount; cardIndex++) {
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, this.node);
                if (!childNode) {
                    continue
                }
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;
            }

            let cardType = Math.floor(cardId / 100);
            let gangNumLists = gangMap && gangMap[cardType] || [];
            // gangNumLists = this.SwitchToTargetData(gangNumLists);
            childNode.getChildByName("lb_gangNum").getComponent(cc.Label).string = gangNumLists.join("");
        }


        //隐藏掉剩余的卡牌
        for (let index = count + 1; index <= this.ChildCount; index++) {
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = this.node.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = false;
        }
    },
});
