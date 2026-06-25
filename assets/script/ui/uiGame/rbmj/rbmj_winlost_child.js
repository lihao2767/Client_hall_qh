/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
		huaNum: cc.Node,
	},

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
	},
	ShowPlayerData: function (setEnd, playerAll, index) {
		let jin1 = setEnd.jin;
		let jin2 = 0;
		if (setEnd.jin2 > 0) {
			jin2 = setEnd.jin2;
		}
		let dPos = setEnd.dPos;
		let posResultList = setEnd["posResultList"];
		let posHuArray = new Array();
		let posCount = posResultList.length;
		for (let i = 0; i < posCount; i++) {
			let posInfo = posResultList[i];
			let pos = posInfo["pos"];
			let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
			posHuArray[pos] = posHuType;
		}
		let PlayerInfo = playerAll[index];
		this.node.active = true;
		let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
		let huType = posResultList[index]['huType'];
		this.ShowPlayerHuImg(huNode, huType);
		let huaCard = this.node.getChildByName("huacardscrollView").getChildByName("view");
		huaCard.active = false;
		let layout = huaCard.getChildByName("content");
		for (let i = 0; i < layout.children.length; i++) {
			layout.children[i].getComponent(cc.Sprite).spriteFrame = "";
			layout.children[i].children[0].active = false;
		}
		let banGangMap = setEnd["banGangMap"];
		let banGangList = [];
		if (this.ShareDefine.HuTypeStringDict[huType] != this.ShareDefine.HuType_NotHu &&
			this.ShareDefine.HuTypeStringDict[huType] != this.ShareDefine.HuType_DianPao) {
			if (JSON.stringify(banGangMap) == "{}") {
				return;
			}
			let banGangCom = layout.getComponent("UIMJCard_ShowHua");
			for (let key in banGangMap) {
				let value = banGangMap[key];
				banGangList.push({"cardID":key, "isBanGang":value});
			}
			huaCard.active = true;
			console.log("banGangList", banGangList);
			banGangCom.ShowBanGangMap(banGangList, jin1, jin2);
		}
		this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, banGangList);

		if (dPos === index) {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
		} else {
			this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
		}
		//显示头像，如果头像UI
		if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
			app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
		}
		let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
		weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
	},
	UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, banGangList) {
		this.showLabelNum = 1;
		this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
		//显示比赛分
		if (typeof(HuList.sportsPoint) != "undefined") {
			if (HuList.sportsPoint > 0) {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：+" + HuList.sportsPoint);
			} else {
				this.ShowLabelName(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'), "比赛分：" + HuList.sportsPoint);
			}
		}
		this.huaNum.active = false;
		this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
		this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
		this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo, HuList["piao"]);
		this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList);
		this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
		if (banGangList.length > 0) {
			this.huaNum.active = true;
			this.huaNum.getComponent(cc.Label).string = banGangList.length + "个";
		}
	},
	ShowPlayerInfo: function (ShowNode, PlayerInfo, piaoHua) {
		ShowNode.getChildByName('lable_name').getComponent("cc.Label").string = this.ComTool.GetBeiZhuName(PlayerInfo["pid"],PlayerInfo["name"]);
		ShowNode.getChildByName('label_id').getComponent("cc.Label").string = "ID:" + this.ComTool.GetPid(PlayerInfo["pid"]);
		// ShowNode.getChildByName('piaofen').getComponent("cc.Label").string = "飘" + piaoHua;
		ShowNode.getChildByName('piaofen').getComponent("cc.Label").string = "";
	},
	LabelName: function (huType) {
		let huTypeDict = {
			LZ:"立直",
			YF:"一发",
			DYJ:"断幺九",
			YP:"役牌",
			PH:"平胡",
			MQQZMH:"门前清自摸胡",
			GSKH:"杠上开花",
			YBK:"一盃口",
			HDLY:"海底捞月",
			HDLYu:"海底捞鱼",
			QG:"抢杠",

			SSTS:"三色同顺",
			YQTG:"一气贯通",
			HQDYJ:"混全带幺九",
			QD:"七对",
			DDH:"对对胡",
			SAK:"三暗刻",
			XSY:"小三元",
			HLT:"混老头",
			SSTK:"三色同刻",
			SGZ:"三杠子",
			SLZ:"双立直",

			HYS:"混一色",
			CQDYJ:"纯全带幺九",
			EBK:"二盃口",
			QYS:"清一色",

			SiAK:"四暗刻",
			GSWS:"国士无双",
			DSY:"大三元",
			ZYS:"字一色",
			XSX:"小四喜",
			LYS:"绿一色",
			QLT:"清老头",
			SiGZ:"四杠子",
			JLBD:"九莲宝灯",
			TH:"天胡",
			DH:"地胡",

			SAKDD:"四暗刻单吊",
			GSWSSSM:"国士无双十三面",
			DSX:"大四喜",
			CZJLBD:"纯正九莲宝灯",

			BPF:"宝牌分",
			FS:"符数",
			FanS:"番数",
			DS:"点数",
		};
		return huTypeDict[huType];
	},
	ShowPlayerJieSuan: function (ShowNode, huInfoAll) {
		let huInfo = false;
		if (huInfoAll['endPoint']) {
			huInfo = huInfoAll['endPoint'];
		} else {
			huInfo = huInfoAll;
		}
		let huTypeMap = huInfo.huTypeMap;
		for (let huType in huTypeMap) {
			let huPoint = huTypeMap[huType];
			this.ShowLabelName(ShowNode.getChildByName('label_lists'), this.LabelName(huType) + huPoint);
		}
	},
});
