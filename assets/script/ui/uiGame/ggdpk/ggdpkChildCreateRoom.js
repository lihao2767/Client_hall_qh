/*
创建房间子界面
 */
var app = require("app");

var sjChildCreateRoom = cc.Class({
	extends: require("BaseChildCreateRoom"),

	properties: {

	},

	// CreateSendPack -start-
	CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
    	let sendPack = {};
		let wanfa=this.GetIdxByKey('wanfa');
		let jifen=this.GetIdxByKey('jifen');
		let shunzi=this.GetIdxByKey('shunzi');
		let sandai=this.GetIdxsByKey('sandai');
		let sidai=this.GetIdxsByKey('sidai');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let fangjian=this.GetIdxsByKey('fangjian');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');

    	sendPack = {
			"wanfa":wanfa,
			"jifen":jifen,
			"shunzi":shunzi,
			"sandai":sandai,
			"sidai":sidai,
			"kexuanwanfa":kexuanwanfa,
			"fangjian":fangjian,
			"xianShi":xianShi,
			"jiesan":jiesan,
			"gaoji":gaoji,

        	"playerMinNum": renshu[0],
        	"playerNum": renshu[1],
        	"setCount": setCount,
        	"paymentRoomCardType": isSpiltRoomCard,

    	}
    	return sendPack;
	},
	// CreateSendPack -end-

	AdjustSendPack: function (sendPack) {
		// if(sendPack.xifen == 0){
		// 	sendPack.jiesanxifen = -1;
		// }
		return sendPack;
	},

	OnToggleClick: function (event) {
		this.FormManager.CloseForm("UIMessageTip");
		let toggles = event.target.parent;
		let toggle = event.target;
		let color = toggle.getChildByName("label").color;
		if (color.r == 180 ||
			color.g == 180 ||
			color.b == 180) {
			return false;
		}

		let key = toggles.name.substring(('Toggles_').length, toggles.name.length);
		let toggleIndex = parseInt(toggle.name.substring(('Toggle').length, toggle.name.length)) - 1;
		let needClearList = [];
		let needShowIndexList = [];
		needClearList = this.Toggles[key];
		needShowIndexList.push(toggleIndex);
		if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles, false);
			return;
		}
		else if ('kexuanwanfa' == key) {
			if (toggleIndex == 2 && this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active) {
				this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['kexuanwanfa'][3].parent);
			}
		}
		else if ("fangjian" == key) {
			// 小局托管解散,解散次数不超过5次,
			// 托管2小局解散,解散次数不超过3次",
			if (this.Toggles['fangjian'][3].getChildByName('checkmark').active && toggleIndex == 5) {
				this.Toggles['fangjian'][3].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][3].parent);
			} else if (this.Toggles['fangjian'][5].getChildByName('checkmark').active && toggleIndex == 3) {
				this.Toggles['fangjian'][5].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][5].parent);
			}

			if (this.Toggles['fangjian'][2].getChildByName('checkmark').active && toggleIndex == 4) {
				this.Toggles['fangjian'][2].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][2].parent);
			} else if (this.Toggles['fangjian'][4].getChildByName('checkmark').active && toggleIndex == 2) {
				this.Toggles['fangjian'][4].getChildByName('checkmark').active = false;
				this.UpdateLabelColor(this.Toggles['fangjian'][4].parent);
			}
		}
		else if ("gaoji" == key) {
			// "ToggleDesc": "同IP不可进,100米内不可进,禁止使用道具,200米内不可进,30秒未准备自动踢出房间,禁止语音,禁止文字,10秒未准备自动踢出房间",
			// 30秒未准备自动踢出房间
			// 10秒未准备自动踢出房间
			// if (this.Toggles['gaoji'][7].getChildByName('checkmark').active && toggleIndex == 4) {
			// 	this.Toggles['gaoji'][7].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['gaoji'][7].parent);
			// } else if (this.Toggles['gaoji'][4].getChildByName('checkmark').active && toggleIndex == 7) {
			// 	this.Toggles['gaoji'][4].getChildByName('checkmark').active = false;
			// 	this.UpdateLabelColor(this.Toggles['gaoji'][4].parent);
			// }
		}

		if (toggles.getComponent(cc.Toggle)) {//复选框
			needShowIndexList = [];
			for (let i = 0; i < needClearList.length; i++) {
				let mark = needClearList[i].getChildByName('checkmark').active;
				//如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
				if (mark && i != toggleIndex) {
					needShowIndexList.push(i);
				}
				//如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
				else if (!mark && i == toggleIndex) {
					needShowIndexList.push(i);
				}
			}
		}
		this.ClearToggleCheck(needClearList, needShowIndexList);
		this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
		this.UpdateOnClickToggle();
	},

	UpdateOnClickToggle: function (key, toggleIndex) {
		//X人场，仅可选≤“X-1”副牌。
		if(this.Toggles["wanfa"]){
            this.UpdateLabelColor(this.Toggles['wanfa'][0].parent);
            for (let i = 0; i < this.Toggles["renshu"].length; i++) {
            	if(this.Toggles["renshu"][i].getChildByName("checkmark").active){
            		this.ShowHideWanFaToggleNode(i);
            	}
            }
        }
        //“飞机带翅膀”需在勾选含“三带一”或“三带一对”情况下可选。
        if(this.Toggles["kexuanwanfa"]){
        	this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
        	if(!this.Toggles["sandai"][0].getChildByName("checkmark").active && !this.Toggles["sandai"][1].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][3].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
		        if(this.Toggles['kexuanwanfa'][3].getChildByName("label")){
		            this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(158, 49, 16);
		        }
		        //选中
		        if(this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active){
		            this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(0, 155, 46);
		            //勾选“飞机带翅膀”默认勾选上“飞机”。
		            this.Toggles['kexuanwanfa'][2].getChildByName("checkmark").active = true;
		            this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(0, 155, 46);
		        }
            }

            /*if(!this.Toggles["kexuanwanfa"][2].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][3].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
		        if(this.Toggles['kexuanwanfa'][3].getChildByName("label")){
		            this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(158, 49, 16);
		        }
		        //选中
		        if(this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active){
		            this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(0, 155, 46);
		        }
            }*/
        }
	},

	ShowHideWanFaToggleNode: function(index){
		let isCheckToggle = false;
		for (let i = 0; i < this.Toggles["wanfa"].length; i++) {
			if(i > index){
				if(this.Toggles['wanfa'][i].getChildByName("checkmark").active){
					this.Toggles['wanfa'][i].getChildByName("checkmark").active = false;
					isCheckToggle = true;
				}
				this.Toggles['wanfa'][i].getChildByName("label").color = cc.color(180, 180, 180);
			}else{
				this.Toggles['wanfa'][i].getChildByName("label").color = cc.color(158, 49, 16);
			}
        }
        if(isCheckToggle){
        	this.Toggles['wanfa'][index].getChildByName("checkmark").active = true;
        	this.Toggles['wanfa'][index].getChildByName("label").color = cc.color(0, 155, 46);
        }
	},

});

module.exports = sjChildCreateRoom;