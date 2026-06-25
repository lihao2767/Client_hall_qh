
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
		let huTypeDict = {
			SSY:"十三幺",
			QXLZ:"七星连珠",
			DNZX:"东南之秀",
			QXLD:"七星连对",
			HBFM:"黑白分明",
			DMXB:"大漠西北",
			NZBZ:"南征北战",
			DCXJ:"东成西就",
			DSX:"大四喜",
			DSY:"大三元",
			QLT:"清老头",
			HLT:"混老头",
			HSJ:"混三节",
			HYDT:"鸿运当头",
			FHXY:"风花雪月",
			XSX:"小四喜",
			LYS:"绿一色",
			SBLH:"十八罗汉",
			SSSJG:"三色四节高",
			ShuangSSJG:"双色四节高",
			SanSSJG:"三色三节高",
			WMQ:"五门齐",
			ShuangSSanJG:"双色三节高",
			TH:"天胡",
			QD:"全大",
			QZ:"全中",
			QX:"全小",
			ZYS:"字一色",
			SAK:"四暗刻",
			WJSFK:"无极三风刻",
			JGDD:"金钩独钓",
			XSY:"小三元",
			DH:"地胡",
			SJG:"四节高",
			SEJC:"十二金钗",
			SanJG:"三节高",
			QSK:"全双刻",
			QDK:"全单刻",
			SanAK:"三暗刻",
			HDK:"混单刻",
			HSK:"混双刻",
			DDH:"对对胡",
			HYS:"混一色",
			STK:"三同刻",
			QDui:"七对",
			ShuangAK:"双暗刻",
			DYW:"大于五",
			XYW:"小于五",
			WHG:"无花果",
			BWT:"百万筒",
			BCGT:"百尺竿头",
			QL:"清龙",
			QYS:"清一色",
			TBD:"推不倒",
			BQR:"不求人",
			DYJ:"断幺九",
			ShuangTK:"双同刻",
			QSJ:"起手叫",
			MQ:"门清",
			MSHC:"妙手回春",
			HDLY:"海底捞月",
			JZ:"绝张",
			ZM:"自摸",
			PH:"平胡",
			SYKT:"三羊开泰",
			HKSJ:"花开四季",
			BHQF:"百花齐放",
			WFLM:"五福临门",
			QXGZ:"七星高照",

			GSKH:"杠上开花",
			MP:"明牌",
			GSP:"杠上炮",
			QGH:"抢杠胡",
			TS:"退税",
			GF:"杠分",
			CDJ:"查大叫",
			HG:"花杠",
		};
		return huTypeDict;
	},
	// GetHuTypeDict -end-


});

