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
		let zhuangjia=this.GetIdxByKey('zhuangjia');
		let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
		let fangjian=this.GetIdxsByKey('fangjian');
		let xianShi=this.GetIdxByKey('xianShi');
		let jiesan=this.GetIdxByKey('jiesan');
		let gaoji=this.GetIdxsByKey('gaoji');

    	sendPack = {
			"zhuangjia":zhuangjia,
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
			this.UpdateOnClickToggle();
			return;
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
		this.UpdateOnClickToggle(key, toggleIndex);
	},

	UpdateOnClickToggle: function (key, toggleIndex) {
		/*//底分选择“0.1”或“0.5时”，强制勾选“整十”且不能取消选中。
		if(this.Toggles["kexuanwanfa"]){
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            if(this.Toggles["difen"][0].getChildByName("checkmark").active
            	|| this.Toggles["difen"][2].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active = true;
                //置灰
                if(this.Toggles['kexuanwanfa'][4].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                if(this.Toggles['kexuanwanfa'][4].getChildByName("label")){
                	if(this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active){
                		this.Toggles['kexuanwanfa'][4].getChildByName("label").color = this.RedColor1;
                	}else{
                		this.Toggles['kexuanwanfa'][4].getChildByName("label").color = this.RedColor2;
                	}
                }
            }
        }*/
        
        //房间内切换人数不可选。
        this.Toggles['fangjian'][0].getChildByName("checkmark").active = false;
        this.Toggles['fangjian'][0].getChildByName("label").color = cc.color(180, 180, 180);
	},
});

module.exports = dbwskChildCreateRoom;