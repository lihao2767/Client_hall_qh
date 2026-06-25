
let app = require("app");

cc.Class({

	extends: cc.Component,

	properties: {

	},

	ShowUI: function (liuShuiInfo) {
		this.huTypeDict = this.GetHuTypeDict();
		this.node.getChildByName("lb_hufen").getComponent(cc.Label).string = liuShuiInfo.point;
		let color = liuShuiInfo.point >= 0 ? cc.color(228, 158, 3) : cc.color(122, 122, 122);
		this.node.getChildByName("lb_hufen").color = color;

		this.node.getChildByName("lb_num").getComponent(cc.Label).string = this.ArrayAddOne(liuShuiInfo.duiXiangList).join("");
		this.ShowCard(liuShuiInfo.cardType);
		this.ShowOpType(liuShuiInfo.huTypeMap);
	},

	ArrayAddOne: function (duiXiangList) {
		let arr = [];
		for (let i = 0; i < duiXiangList.length; i++) {
			let pos = duiXiangList[i];
			arr.push(pos + 1);
		}
		return arr;
	},

	ShowOpType: function (huTypeMap) {
		let strString = "";
		for (let key in huTypeMap) {
			let fanShu = huTypeMap[key];
			let huTypeStr = this.huTypeDict[key];
			huTypeStr = huTypeStr + ":" + fanShu;
			strString += " " + huTypeStr;
		}
		this.node.getChildByName("lb_type").getComponent(cc.Label).string = strString;
	},

	ShowCard: function (cardType) {
		if (cardType > 0) {
			this.node.getChildByName("card").opacity = 255;
			let cardCom = this.node.getChildByName("card").getComponent(app.subGameName + "_BaseSingleCard");
			cardCom.ShowSingleCardByCardType(cardType, this.node.getChildByName("card"));
		} else {
			this.node.getChildByName("card").opacity = 0;
		}
	},

	ShowCard: function (cardType) {
		if (cardType > 0) {
			this.node.getChildByName("card").opacity = 255;
			let imageString = "EatCard_Self_";
			let cardCom = this.node.getChildByName("card").getComponent("UIMJCard_Down");
			cardCom.ShowImage(this.node.getChildByName("card"), imageString, cardType + "01");
		} else {
			this.node.getChildByName("card").opacity = 0;
		}
	},

	// GetHuTypeDict -start-
	GetHuTypeDict: function () {
		let huTypeDict = {};
		huTypeDict["DG"] = "点杠"; 
		huTypeDict["BG"] = "补杠"; 
		huTypeDict["AG"] = "暗杠"; 
		huTypeDict["PH"] = "平胡"; 
		huTypeDict["DDH"] = "对对胡"; 
		huTypeDict["QYS"] = "清一色"; 
		huTypeDict["QYSPPH"] = "清一色碰碰胡"; 
		huTypeDict["MQ"] = "门清"; 
		huTypeDict["ZM"] = "自摸次数"; 
		huTypeDict["DP"] = "点炮次数"; 
		huTypeDict["JP"] = "接炮次数"; 
		huTypeDict["GP"] = "杠牌次数"; 
		huTypeDict["PF"] = "飘分"; 
		huTypeDict["HZ"] = "花猪"; 
		huTypeDict["CBZ"] = "吃包子"; 

		return huTypeDict;
	},
	// GetHuTypeDict -end-


});

