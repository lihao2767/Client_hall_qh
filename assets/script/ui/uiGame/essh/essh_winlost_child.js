/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
        icon_wintype:cc.SpriteFrame,
        img_huinfo: [cc.SpriteFrame],
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();

        this.IntegrateImagePath={
            "zi_fang_11": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/11",
            },
            "zi_fang_12": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/12",
            },
            "zi_fang_13": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/13",
            },
            "zi_fang_14": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/14",
            },
            "zi_fang_15": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/15",
            },
            "zi_fang_16": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/16",
            },
            "zi_fang_17": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/17",
            },
            "zi_fang_18": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/18",
            },
            "zi_fang_19": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/19",
            },
            "zi_fang_21": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/21",
            },
            "zi_fang_22": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/22",
            },
            "zi_fang_23": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/23",
            },
            "zi_fang_24": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/24",
            },
            "zi_fang_25": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/25",
            },
            "zi_fang_26": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/26",
            },
            "zi_fang_27": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/27",
            },
            "zi_fang_28": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/28",
            },
            "zi_fang_29": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/29",
            },
            "zi_fang_31": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/31",
            },
            "zi_fang_32": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/32",
            },
            "zi_fang_33": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/33",
            },
            "zi_fang_34": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/34",
            },
            "zi_fang_35": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/35",
            },
            "zi_fang_36": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/36",
            },
            "zi_fang_bg": {
                "FilePath": "ui/uiGame/essh/zi/fangxing/0",
            },
                  
        };
	},
    ShowPlayerData:function(setEnd,playerAll,index){
        let dPos=setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        this.node.active=true;
        if(dPos===index){
            this.node.getChildByName("userinfo").getChildByName("tip_zhuang").active = true;
        }else{
            this.node.getChildByName("userinfo").getChildByName("tip_zhuang").active = false;
        }
        let PlayerInfo = playerAll[index];
        //显示头像，如果头像UI
        if(PlayerInfo["pid"] && PlayerInfo["iconUrl"]){
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"],PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("userinfo").getChildByName("touxiang").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
        //显示名字跟pid
        this.node.getChildByName("userinfo").getChildByName("lb_name").getComponent(cc.Label).string=PlayerInfo.name;
        this.node.getChildByName("userinfo").getChildByName("lb_id").getComponent(cc.Label).string=PlayerInfo.pid;
        this.PlayerData(this.node,posResultList[index],index);
    },
    PlayerData:function(PlayerNode,result,pos){
        PlayerNode.active=true;
        let huType=result.huType;
        if(huType== "ZiMo" || huType == "JiePao"){
            PlayerNode.getChildByName("img_wintype").getComponent(cc.Sprite).spriteFrame=this.icon_wintype;
        }else{
            PlayerNode.getChildByName("img_wintype").getComponent(cc.Sprite).spriteFrame="";
        }
        //显示胡牌分数
        let layout_huinfo=PlayerNode.getChildByName("layout_huinfo");
        let demo_huinfo=this.node.getChildByName("demo_huinfo");
        let huTypeMap=result.endPoint.huTypeMap;
        let huTypeDict = {
            PiHu:"屁胡",
            YiChong:"一冲",
            LaoChong:"老冲",
            DaHu:"大胡",
            SuHu:"素胡",
            HDL:"海底捞",
            XiaoHu: "笑胡",
        };
        let infoType = 1;
        let outlineColor = new cc.Color(98, 67, 57);
        layout_huinfo.removeAllChildren();
        for (let huType in huTypeMap) {
            let huPoint = huTypeMap[huType];
            let lb_huInfo=cc.instantiate(demo_huinfo);
            if(huType == "XiaoHu"){
                infoType = 0;
                outlineColor = new cc.Color(50, 99, 152);
            }
            lb_huInfo.getComponent(cc.Sprite).spriteFrame = this.img_huinfo[infoType];
            lb_huInfo.getChildByName("label").getComponent(cc.LabelOutline).color = outlineColor;
            lb_huInfo.getChildByName("label").getComponent(cc.Label).string=huTypeDict[huType];
            lb_huInfo.active=true;
            layout_huinfo.addChild(lb_huInfo);
        }
        let point=result.point;
        let sportsPoint=result["sportsPoint"];
        let cardPublicMap=result.endPoint.publicCardList;
        let cardMap=result.endPoint.shouCardList;
        let huCard=result.handCard;
        let layoutyou=PlayerNode.getChildByName("layoutyou");
        layoutyou.removeAllChildren();
        let demo_you=this.node.getChildByName("demo_you");
        demo_you.x=0;demo_you.y=0;
        //碰吃的牌
        for(let i=0;i<cardPublicMap.length;i++){
            let addYou=cc.instantiate(demo_you);
            layoutyou.addChild(addYou);
            let publicInfo = cardPublicMap[i];
            let publicInfoList=publicInfo["cardList"];
            let publicInfoValue=publicInfo["youNum"];

            let getCardID = publicInfoList[2];
            let cardIDList = publicInfoList.slice(1, publicInfoList.length);

            let opType = publicInfoList[0];
            if (opType ==1) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="句";
            }else if (opType == 2) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="口";
            }else if (opType == 3) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="碰";
            }else if (opType == 4) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="绍";
                cardIDList = [0,cardIDList[1],cardIDList[2]];
            }else if (opType == 5) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="暗抓";
                cardIDList = [0,cardIDList[1],cardIDList[2],cardIDList[3]];
            }else if (opType == 6) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="明抓";
            }else if (opType == 7) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="满龙";
                cardIDList = [0,cardIDList[1],cardIDList[2],cardIDList[3],cardIDList[4],cardIDList[5]];
            }else if (opType == 8) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="半龙";
            }else if (opType == 9) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="克";
            }else if (opType == 10) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="抵";
            }else if (opType == 11) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="歪";
            }else{
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="";
            }
            addYou.getChildByName("lb_you").getComponent(cc.Label).string=publicInfoValue;

            if(cardIDList.length > 4){
                addYou.width = 70;
            }else{
                addYou.width = 35;
            }
            let layoutpai=addYou.getChildByName("layoutpai1");
            let layoutpaiTemp=addYou.getChildByName("layoutpai2");

            for(let k=1;k<=4;k++){
                let cardChild=layoutpai.getChildByName("card"+k);
                if(typeof(cardIDList[k-1])=="undefined"){
                    if(cardChild){
                        cardChild.active=false;
                    }
                    continue;
                }
                cardChild.cardID=cardIDList[k-1];
                /*if(opType==this.ShareDefine.OpType_Chi && cardChild.cardID==getCardID){
                    cardChild.color=cc.color(180,180,180);
                }else{
                    cardChild.color=cc.color(255,255,255);
                }*/
                this.ShowOutCardImage(cardChild);
                if(huCard>0 && huCard==cardIDList[k-1]){
                    cardChild.getChildByName("tip_hu").active=true;
                }else{
                    cardChild.getChildByName("tip_hu").active=false;
                }
            }
            for(let x=5;x<=6;x++){
                let cardChild=layoutpaiTemp.getChildByName("card"+x);
                if(typeof(cardIDList[x-1])=="undefined"){
                    if(cardChild){
                        cardChild.active=false;
                    }
                    continue;
                }
                cardChild.cardID=cardIDList[x-1];
                /*if(opType==this.ShareDefine.OpType_Chi && cardChild.cardID==getCardID){
                    cardChild.color=cc.color(180,180,180);
                }else{
                    cardChild.color=cc.color(255,255,255);
                }*/
                this.ShowOutCardImage(cardChild);
                //如果是胡的牌。显示胡牌
                if(huCard>0 && huCard==cardIDList[x-1]){
                    cardChild.getChildByName("tip_hu").active=true;
                }else{
                    cardChild.getChildByName("tip_hu").active=false;
                }
            }

            addYou.active=true;
        }
        //余下的牌
        for(let i=0;i<cardMap.length;i++){
            let addYou=cc.instantiate(demo_you);
            let publicInfo = cardMap[i];
            let opType = publicInfo["cardList"][0];
            let publicInfoList=publicInfo["cardList"].slice(1,publicInfo["cardList"].length);
            let publicInfoValue=publicInfo["youNum"];
            let cardIDList = publicInfoList;
            if (opType ==1) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="句";
            }else if (opType == 2) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="口";
            }else if (opType == 3) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="碰";
            }else if (opType == 4) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="绍";
                cardIDList = [0,cardIDList[1],cardIDList[2]];
            }else if (opType == 5) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="暗抓";
                cardIDList = [0,cardIDList[1],cardIDList[2],cardIDList[3]];
            }else if (opType == 6) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="明抓";
            }else if (opType == 7) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="满龙";
                cardIDList = [0,cardIDList[1],cardIDList[2],cardIDList[3],cardIDList[4],cardIDList[5]];
            }else if (opType == 8) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="半龙";
            }else if (opType == 9) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="克";
            }else if (opType == 10) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="抵";
            }else if (opType == 11) {
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="歪";
            }else{
                addYou.getChildByName("lb_optype").getComponent(cc.Label).string="";
            }
            addYou.getChildByName("lb_you").getComponent(cc.Label).string=publicInfoValue;
            let child=addYou.getChildByName("layoutpai1");
            let childTemp=addYou.getChildByName("layoutpai2");
            
            if(cardIDList.length > 4){
                addYou.width = 70;
            }else{
                addYou.width = 35;
            }
            
            for(let j=1;j<=4;j++){
                let cardChild=child.getChildByName("card"+j);
                if(typeof(cardIDList[j-1])=="undefined"){
                    if(cardChild){
                        cardChild.active=false;
                    }
                    continue;
                }
                cardChild.cardID=cardIDList[j-1];
                this.ShowOutCardImage(cardChild);
                //如果是胡的牌。显示胡牌
                if(huCard>0 && huCard==cardIDList[j-1]){
                    cardChild.getChildByName("tip_hu").active=true;
                }else{
                    cardChild.getChildByName("tip_hu").active=false;
                }
            }
            for(let y=5;y<=6;y++){
                let cardChild=childTemp.getChildByName("card"+y);
                if(typeof(cardIDList[y-1])=="undefined"){
                    if(cardChild){
                        cardChild.active=false;
                    }
                    continue;
                }
                cardChild.cardID=cardIDList[y-1];
                this.ShowOutCardImage(cardChild);
                //如果是胡的牌。显示胡牌
                if(huCard>0 && huCard==cardIDList[y-1]){
                    cardChild.getChildByName("tip_hu").active=true;
                }else{
                    cardChild.getChildByName("tip_hu").active=false;
                }
            }
            addYou.active=true;
            layoutyou.addChild(addYou);
        }

        //显示总分
        let lb_winpoint=PlayerNode.getChildByName("lb_winpoint");
        let lb_lostpoint=PlayerNode.getChildByName("lb_lostpoint");
        if(point>0){
            lb_winpoint.active=true;
            lb_lostpoint.active=false;
            lb_winpoint.getComponent(cc.Label).string="+"+point;
        }else{
            lb_winpoint.active=false;
            lb_lostpoint.active=true;
            lb_lostpoint.getComponent(cc.Label).string=point;
        }


        //比赛分
        let lb_sportsPoint=PlayerNode.getChildByName("lb_sportsPoint");
        if(typeof(sportsPoint)!="undefined"){
            lb_sportsPoint.active=true;
            lb_sportsPoint.getComponent(cc.Label).string="比赛分:"+sportsPoint;
        }else{
            lb_sportsPoint.active=false;
        }

        //显示额外分
        let lb_hushu = PlayerNode.getChildByName("other").getChildByName("lb_hushu");
        let lb_fanshu = PlayerNode.getChildByName("other").getChildByName("lb_fanshu");
        let lb_qiangshu = PlayerNode.getChildByName("other").getChildByName("lb_qiangshu");
        let lb_haidilao = PlayerNode.getChildByName("other").getChildByName("lb_haidilao");

        lb_hushu.getComponent(cc.Label).string = "胡数:" + this.ToUiScore(result.huShu);
        lb_fanshu.getComponent(cc.Label).string = "底分:" + this.ToUiScore(result.fanShu);
        lb_qiangshu.getComponent(cc.Label).string = "枪数:" + this.ToUiScore(result.qiangShu);

         //显示文字海底捞
        lb_haidilao.active = result.isHDL;
    },
    ToUiScore: function(score){
        if (0 === score) return 0;
        if (!score) return "";

        let symbol = score > 0 ? "+" : "";
        return symbol + score;
    },
    ShowOutCardImage:function(childNode){
        childNode.active=true;
            let imageName = ["zi_fang_", Math.floor(childNode.cardID/100)].join("");
            if(childNode.cardID==0){
                imageName = ["zi_fang_bg"].join("");
            }
            let imageInfo = this.IntegrateImagePath[imageName];
            if(!imageInfo){
                this.ErrLog("ShowOutCardImage IntegrateImage.txt not find:%s", imageName);
                return
            }
            let imagePath = imageInfo["FilePath"];
            let that = this;
             childNode.getChildByName("hua").getComponent(cc.Sprite).spriteFrame="";
            let childSprite = childNode.getChildByName("dian").getComponent(cc.Sprite);
            this.SpriteShow(childSprite,imagePath);
       
    },
    SpriteShow:function(childSprite,imagePath){
        let that = this;
        app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
            .then(function(spriteFrame){
                        if(!spriteFrame){
                            that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                            return
                        }
                        childSprite.spriteFrame = spriteFrame;
            }).catch(function(error){
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            }
        );
    },
    GetFanXingCardID:function(map){
        let xingCardList=[];
        for(let key in map){
            xingCardList.push(parseInt(key));
        }
        return xingCardList;
    },
});
