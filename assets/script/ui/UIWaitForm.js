/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
       
    },

   
    //---------显示函数--------------------

    OnShow:function(){
        let appName=cc.sys.localStorage.getItem('appName');
        if (appName!="hubei") {
            this.node.getChildByName("bgImage").active=true;
        }else{
            this.node.getChildByName("bgImagehubei").active=true;
        }
    },
});
