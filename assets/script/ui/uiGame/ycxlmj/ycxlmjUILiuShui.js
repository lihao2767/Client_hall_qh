let app = require("app");

cc.Class({

    extends: require("BaseForm"),

    properties: {
        singleLiuShui: cc.Prefab,
        liuShuiNodes: cc.Node,
    },

    OnShow: function (liuShuiList) {
        this.ShowAllLiuShui(liuShuiList);
    },

    ShowAllLiuShui: function (liuShuiList) {
        for (let i = 0; i < this.liuShuiNodes.children.length; i++) {
            this.liuShuiNodes.children[i].opacity = 0;
        }
        for (let i = 0; i < liuShuiList.length; i++) {
            let singleLiuShuiNode = this.liuShuiNodes.children[i];
            if (!singleLiuShuiNode) {
                singleLiuShuiNode = cc.instantiate(this.singleLiuShui);
                this.liuShuiNodes.addChild(singleLiuShuiNode);
            }
            singleLiuShuiNode.opacity = 255;
            singleLiuShuiNode.active = true;
            let comp = singleLiuShuiNode.getComponent("ycxlmjSingleLiuShui");
            comp.ShowUI(liuShuiList[i]);
        }
    },
   
    OnClick: function (btnName, btnNode) {
        // if (btnName == "btn_close") {
            this.CloseForm();
        // }
    }



});
