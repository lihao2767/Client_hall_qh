/*
创建房间子界面
 */
var app = require("app");

var dbwskChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {

	},

	// CreateSendPack -start-
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
		let sendPack = {};
		let wanfa = this.GetIdxByKey('wanfa');
		let jiangfen = this.GetIdxByKey('jiangfen');
		let wuwang = this.GetIdxByKey('wuwang');
		let fafen = this.GetIdxByKey('fafen');
		let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		let jiesansuanfen = this.GetIdxByKey('jiesansuanfen');
		let fangjian = this.GetIdxsByKey('fangjian');
		let xianShi = this.GetIdxByKey('xianShi');
		let jiesan = this.GetIdxByKey('jiesan');
		let gaoji = this.GetIdxsByKey('gaoji');

		sendPack = {
			"wanfa": wanfa,
			"jiangfen": jiangfen,
			"wuwang": wuwang,
			"fafen": fafen,
			"kexuanwanfa": kexuanwanfa,
			"jiesansuanfen": jiesansuanfen,
			"fangjian": fangjian,
			"xianShi": xianShi,
			"jiesan": jiesan,
			"gaoji": gaoji,

			"playerMinNum": renshu[0],
			"playerNum": renshu[1],
			"setCount": setCount,
			"paymentRoomCardType": isSpiltRoomCard,

		}
		return sendPack;
	},
	// CreateSendPack -end-
	UpdateOnClickToggle: function () {
		if (this.Toggles["kexuanwanfa"]){
			this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
			if (this.Toggles["wanfa"][0].getChildByName("checkmark").active) {
				this.Toggles['kexuanwanfa'][6].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa'][6].getChildByName("label").color = cc.color(180, 180, 180);

				this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(158, 49, 16);
				this.Toggles['kexuanwanfa'][5].getChildByName("label").color = cc.color(158, 49, 16);
				this.Toggles['kexuanwanfa'][8].getChildByName("label").color = cc.color(158, 49, 16);
			} else {
				this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(180, 180, 180);
				this.Toggles['kexuanwanfa'][5].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa'][5].getChildByName("label").color = cc.color(180, 180, 180);
				this.Toggles['kexuanwanfa'][8].getChildByName("checkmark").active = false;
				this.Toggles['kexuanwanfa'][8].getChildByName("label").color = cc.color(180, 180, 180);

				this.Toggles['kexuanwanfa'][6].getChildByName("label").color = cc.color(158, 49, 16);
			}
		}

		if (this.Toggles["fangjian"] && this.Toggles["fangjian"][0]) {
			this.Toggles['fangjian'][0].active = false;
		}
	},

});

module.exports = dbwskChildCreateRoom;