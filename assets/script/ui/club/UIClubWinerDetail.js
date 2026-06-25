var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        right_layout:cc.Node,
        demo:cc.Node,

        // store_icon:[cc.SpriteFrame],
    },
    OnCreateInit: function () {
        this.demo.active=false;
    },
    //-----------------显示函数------------------
    OnShow: function (clubPlayerRoomAloneLogBOS) {
        this.demo.active=false;
        this.right_layout.removeAllChildren();

        for(let i=0;i<clubPlayerRoomAloneLogBOS.length;i++){
            let nodePrefab = cc.instantiate(this.demo);

            nodePrefab.getChildByName("lb_roomname").getComponent(cc.Label).string=clubPlayerRoomAloneLogBOS[i].roomName;
            nodePrefab.getChildByName("lb_jushu").getComponent(cc.Label).string=clubPlayerRoomAloneLogBOS[i].size;

            nodePrefab.active=true;
            this.right_layout.addChild(nodePrefab);
        }

       
    },
   


    OnClick:function(btnName, btnNode){
        if(btnName=="btn_back"){
            this.CloseForm();
        }
    },
});