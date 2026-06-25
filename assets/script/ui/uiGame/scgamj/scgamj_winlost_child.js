/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();
	},
    ShowPlayerHuImg:function(huNode,huTypeName){
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType=this.ShareDefine.HuTypeStringDict[huTypeName];
        if(typeof(huType)=="undefined"){
            huNode.getComponent(cc.Label).string = '';
        }else if(huType == this.ShareDefine.HuType_DianPao){
            huNode.getComponent(cc.Label).string = '点泡';
        }else if(huType == this.ShareDefine.HuType_JiePao){
            huNode.getComponent(cc.Label).string = '接炮';
        }else if(huType == this.ShareDefine.HuType_ZiMo){
            huNode.getComponent(cc.Label).string = '自摸';
        }else if(huType == this.ShareDefine.HuType_QGH){
            huNode.getComponent(cc.Label).string = '抢杠胡';
        }else if(huType == this.ShareDefine.HuType_HuOne){
            huNode.getComponent(cc.Label).string = '接炮1';
        }else if(huType == this.ShareDefine.HuType_HuTwo){
            huNode.getComponent(cc.Label).string = '接炮2';
        }else if(huType == this.ShareDefine.HuType_HuThree){
            huNode.getComponent(cc.Label).string = '接炮3';
        }else if(huType == this.ShareDefine.HuType_HuFour){
            huNode.getComponent(cc.Label).string = '接炮4';
        }else if(huType == this.ShareDefine.HuType_HuFive){
            huNode.getComponent(cc.Label).string = '接炮5';
        }else if(huType == this.ShareDefine.HuType_ZiMoOne){
            huNode.getComponent(cc.Label).string = '自摸1';
        }else if(huType == this.ShareDefine.HuType_ZiMoTwo){
            huNode.getComponent(cc.Label).string = '自摸2';
        }else if(huType == this.ShareDefine.HuType_ZiMoThree){
            huNode.getComponent(cc.Label).string = '自摸3';
        }else if(huType == this.ShareDefine.HuType_ZiMoFour){
            huNode.getComponent(cc.Label).string = '自摸4';
        }else if(huType == this.ShareDefine.HuType_ZiMoFive){
            huNode.getComponent(cc.Label).string = '自摸5';
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    ShowPlayerData:function(setEnd,playerAll,index){
        let jin1=setEnd.jin1;
        let jin2=setEnd.jin2;
        let dPos=setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray=new Array();
        let posCount = posResultList.length;
        for(let i=0; i<posCount; i++){
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos]=posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2);
        let huNode=this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode,posResultList[index]['huType']);

        if(dPos===index){
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        }else{
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if(PlayerInfo["pid"] && PlayerInfo["iconUrl"]){
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"],PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    LabelName:function(huType){
	    let huTypeDict = {
            PingHu: "平胡",
            HP: "胡牌",
            QYM: "缺一门",
            QLM: "缺两门",
            BZ: "边张",
            KZ: "卡张",
            DD: "单吊",
            JXW: "夹心5",
            MQ: "门清",
            MD: "门大",
            DDH: "对对胡",
            QD: "七对",
            LQD: "龙七对",
            QYS: "清一色",
            HYS: "混一色",
            DSY: "大三元",
            XSY: "小三元",
            QBZ: "七板子",
            LBZ: "六板子",
            WBZ: "五板子",
            DBZ: "大板子",
            XBZ: "小板子",
            SiHJ: "四火箭",
            SanHJ: "三火箭",
            HJ: "火箭",
            SiFJ: "四飞机",
            DaFJ: "大飞机",
            XFJ: "小飞机",
            YTL: "一条龙",

            OGSH: "杠上开花",
            GSP: "杠上炮",
            QiangGangHu: "抢杠胡",
            JGD: "金钩钓",
            HDP: "海底炮",
            HDL: "海底胡",
            HDGSP: "海底杠上炮",

            ZiMo: "自摸",
            ZFBP: "中发白碰",
            ZFBMG: "中发白明杠",
            ZFBAG: "中发白暗杠",
            MG: "明杠",
            AG: "暗杠",

            ChaHuaZhu: "查花猪",
            ChaDaJiao: "查大叫",
            MQQYS:"门清清一色",
            MQHYS:"门清混一色",
            SBXS:"十八学士",
            QYSDDH:"清一色对对胡",
            HYSDDH:"混一色对对胡",
            DDHuoJian:"大大火箭",
            ZiHuoJian:"字火箭",
            MQHYSYTL:"门清混一色一条龙",
            MQQYSYTL:"门清清一色一条龙",
            MQYTL:"门清一条龙",
            HYSLQD:"混一色龙七对",
            QYSLQD:"清一色龙七对",
            HYSQD:"混一色七对",
            QYSQD:"清一色七对",
            MQDDH:"门清对对胡",
            ZFBAK:"中发白暗刻",
            SGY:"四归一",
            MQQYSDDH:"门清清一色对对胡",
            MQHYSDDH:"门清混一色对对胡",
        };
	    return huTypeDict[huType];
    },
});
