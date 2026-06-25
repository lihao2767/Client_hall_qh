var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties:{
    	rankScrollView:cc.Node,
    },

    //初始化
    OnCreateInit:function(){
        
    },

    //---------显示函数--------------------

    OnShow:function(serverPack){
    	this.serverPack = serverPack;
        let layout = this.rankScrollView.getChildByName("layout");
        this.rankScrollView.getComponent(cc.ScrollView).scrollToTop();
        layout.removeAllChildren();
        let demo = this.node.getChildByName("demo");
        demo.active = false;
        for (let i = 0; i < serverPack.length; i++) {
            let matchItem = serverPack[i];
            let child = cc.instantiate(demo);
            //child.zIndex=10+i; //普通数据放后面
            if (i%2 == 0) {
                child.getComponent(cc.Sprite).enabled = true;
            }else{
                child.getComponent(cc.Sprite).enabled = false;
            }
            //child.zIndex=matchItem.id;
            child.getChildByName("img_rank").active = true;
            child.getChildByName("lb_rank").active = true;



            child.getChildByName("lb_rank").getComponent(cc.Label).string = parseInt(matchItem.id)+((1-1)*8);
           
            child.getChildByName("lb_clubName").getComponent(cc.Label).string =matchItem.clubName;
            child.getChildByName("lb_clubId").getComponent(cc.Label).string = matchItem.clubSign;
            // child.getChildByName("lb_bigWinner").getComponent(cc.Label).string = matchItem.bigWinner;
            child.getChildByName("lb_promotionShareValue").getComponent(cc.Label).string = matchItem.promotionShareValue;
            child.getChildByName("lb_unionAllMemberPointTotal").getComponent(cc.Label).string = matchItem.unionAllMemberPointTotal;
            child.getChildByName("lb_zhongZhiTotalPoint").getComponent(cc.Label).string = matchItem.zhongZhiTotalPoint;

            child.getChildByName("lb_youxiaoka").getComponent(cc.Label).string = matchItem.consumeValue;
            child.getChildByName("lb_dayingjia").getComponent(cc.Label).string = matchItem.bigWinner;

            


            child.active = true;
            layout.addChild(child);
        }
        //content.sortAllChildren();
       
    },
    
  
    //---------点击函数---------------------

	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }
	},
    
   
});
