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
		let paixingwanfa = this.GetIdxsByKey('paixingwanfa');
		let zhadanjifen = this.GetIdxByKey('zhadanjifen');
		let zhadanfenzhi = this.GetIdxByKey('zhadanfenzhi');
		let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
		let fangjian = this.GetIdxsByKey('fangjian');
		let xianShi = this.GetIdxByKey('xianShi');
		let jiesan = this.GetIdxByKey('jiesan');
		let gaoji = this.GetIdxsByKey('gaoji');

    	sendPack = {
			"paixingwanfa": paixingwanfa,
			"zhadanjifen": zhadanjifen,
			"zhadanfenzhi": zhadanfenzhi,
			"kexuanwanfa": kexuanwanfa,
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

	AdjustSendPack: function (sendPack) {
		// if (sendPack.jiamai == 0) {
		// 	sendPack.jiamaishu = -1;
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
			// if (key == "renshu") {
			// 	if (toggleIndex == 2) {
			// 		// 四人

			// 		// 	二三人场，必选无花牌。
			// 		this.Toggles["huapai"][0].getChildByName("checkmark").active = true;
			// 		this.Toggles["huapai"][1].getChildByName("checkmark").active = false;
			// 		this.Toggles["huapai"][2].getChildByName("checkmark").active = false;

			// 		this.Toggles['huapai'][0].getChildByName("label").color = cc.color(158, 49, 16);
			// 		this.Toggles['huapai'][1].getChildByName("label").color = cc.color(158, 49, 16);
			// 		this.Toggles['huapai'][2].getChildByName("label").color = cc.color(158, 49, 16);

			// 		// 	二三人场隐藏摇摆,炸错罚分,额外加分。
			// 		this.Toggles["kexuanwanfa"][1].active = true;
			// 		this.Toggles["kexuanwanfa"][2].active = true;
			// 		this.Toggles["kexuanwanfa"][3].active = true;

			// 		// 	四人场必选算喜。
			// 		this.Toggles["sywsk"][0].getChildByName("checkmark").active = true;
			// 		this.Toggles["sywsk"][1].getChildByName("checkmark").active = false;
			// 		this.Toggles['sywsk'][0].getChildByName("label").color = cc.color(158, 49, 16);
			// 		this.Toggles['sywsk'][1].getChildByName("label").color = cc.color(180, 180, 180);
			// 	} else {
			// 		// 二三人场

			// 		// 	二三人场，必选无花牌。
			// 		this.Toggles["huapai"][0].getChildByName("checkmark").active = true;
			// 		this.Toggles["huapai"][1].getChildByName("checkmark").active = false;
			// 		this.Toggles["huapai"][2].getChildByName("checkmark").active = false;

			// 		this.Toggles['huapai'][0].getChildByName("label").color = cc.color(158, 49, 16);
			// 		this.Toggles['huapai'][1].getChildByName("label").color = cc.color(180, 180, 180);
			// 		this.Toggles['huapai'][2].getChildByName("label").color = cc.color(180, 180, 180);

			// 		// 	二三人场隐藏摇摆,炸错罚分,额外加分。
			// 		this.Toggles["kexuanwanfa"][1].active = false;
			// 		this.Toggles["kexuanwanfa"][2].active = false;
			// 		this.Toggles["kexuanwanfa"][3].active = false;

			// 		// 	四人场必选算喜。
			// 		this.Toggles['sywsk'][0].getChildByName("label").color = cc.color(158, 49, 16);
			// 		this.Toggles['sywsk'][1].getChildByName("label").color = cc.color(158, 49, 16);
			// 	}
			// }
			this.ClearToggleCheck(needClearList, needShowIndexList);
			this.UpdateLabelColor(toggles);
			this.UpdateTogglesLabel(toggles, false);
			return;
		}
		// else if ('kexuanwanfa2' == key) {
		// 	if (this.Toggles['kexuanwanfa2'][4].getChildByName('checkmark').active && toggleIndex == 5) {
		// 		this.Toggles['kexuanwanfa2'][4].getChildByName('checkmark').active = false;
		// 		this.UpdateLabelColor(this.Toggles['kexuanwanfa2'][4].parent);
		// 	} else if (this.Toggles['kexuanwanfa2'][5].getChildByName('checkmark').active && toggleIndex == 4) {
		// 		this.Toggles['kexuanwanfa2'][5].getChildByName('checkmark').active = false;
		// 		this.UpdateLabelColor(this.Toggles['kexuanwanfa2'][5].parent);
		// 	}
		// }
		// else if ('xifen' == key) {
		// 	// 	“不带喜”玩法隐藏解散喜分选项。
		// 	if (toggleIndex == 0) {
		// 		this.Toggles['jiesanxifen'][0].parent.active = false;
		// 	} else {
		// 		this.Toggles['jiesanxifen'][0].parent.active = true;
		// 	}
		// }
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

	//创建房间
	Click_btn_create: function (createType, isCheckedMic = false) {
		this.FormManager.CloseForm("UIMessageTip");
		let isSpiltRoomCard = this.GetIdxByKey('fangfei');
		let renshu = [];
		if (isSpiltRoomCard) {
			renshu = this.getCurSelectRenShu();
		}
		renshu = this.getCurSelectRenShu();//发给服务器人数用选的
		let needCostData = this.getCostData(renshu);
		if (!needCostData) {
			this.ErrLog('Click_btn_create Not CostData');
			return null;
		}
		let hasRoomCard = app.HeroManager().GetHeroProperty("roomCard");

		let jushuIndex = this.GetIdxByKey('jushu');
		if (-1 == jushuIndex || jushuIndex >= needCostData.length) {
			this.ErrLog('Click_btn_create error -1 == jushuIndex || jushuIndex >= needCostData.length');
			return null;
		}
		let costCoun = 0;
		if (isSpiltRoomCard == 0) {
			//房主付
			costCoun = needCostData[jushuIndex].CostCount;
		} else if (isSpiltRoomCard == 1) {
			//AA付
			costCoun = needCostData[jushuIndex].AaCostCount;
		} else if (isSpiltRoomCard == 2) {
			//大赢家付
			costCoun = needCostData[jushuIndex].WinCostCount;
		}
		// if(this.clubData==null){
		//     if(hasRoomCard < costCoun){//金币不足
		//         let desc = app.SysNotifyManager().GetSysMsgContentByMsgID("MSG_NotRoomCard");
		//         app.ConfirmManager().SetWaitForConfirmForm(this.OnConFirm.bind(this), "goBuyCard", []);
		//         app.FormManager().ShowForm("UIMessage", null, app.ShareDefine().ConfirmBuyGoTo, 0, 0, desc)
		//         return null;
		//     }
		// }
		let setCount = needCostData[jushuIndex].SetCount;
		let sendPack = this.CreateSendPack(renshu, setCount, isSpiltRoomCard);
		if (!sendPack) {
			return null;
		}
		sendPack = this.AdjustSendPack(sendPack);
		//如果勾选了强制连麦，需要先判断是否开启麦克风权限，不如没开不能创建
		if (cc.sys.isNative && !isCheckedMic && sendPack.lianmai == 2 && !this.clubData && !this.unionData) {
			app.NativeManager().CallToNative("CheckMicPermission", [{ "Name": "name", "Value": "createRoom" }, { "Name": "switchGameData", "Value": "" }]);
			return;
		}
		//把人数，局数，房费索引传给服务端用作修改房间显示当前配置用
		let jushu = this.GetIdxByKey('jushu');
		sendPack.jushu = jushu;
		let renshuIndex = this.GetIdxByKey('renshu');
		sendPack.renshu = renshuIndex;
		let fangfei = this.GetIdxByKey('fangfei');
		sendPack.fangfei = fangfei;
		//记录到本地缓存
		if (this.unionData == null || this.unionData.cfgData == null) {
			for (var item in sendPack) {
				let configData = sendPack[item];
				let dataType = typeof (configData);
				if (dataType == 'object') {
					let linshi2 = '0';
					for (let i = 0; i < configData.length; i++) {
						if (i == 0) {
							linshi2 = configData[0] + 1;
						} else {
							linshi2 = linshi2 + ',' + (configData[i] + 1);
						}
					}
					configData = linshi2;
				} else {
					if (item == 'playerNum') {
						item = 'renshu';
					} else if (item == 'setCount') {
						item = 'jushu';
					} else if (item == 'paymentRoomCardType') {
						item = 'fangfei';
					} else if (item == 'cardNum') {
						item = 'shoupai';
					} else if (item == 'resultCalc') {
						item = 'jiesuan';
					} else if (item == 'maxAddDouble') {
						item = 'fengdingbeishu';
					}
					configData = this.GetIdxByKey(item) + 1;
					if (isNaN(configData)) {
						configData = this.GetEditBoxByKey(item);
					}
				}
				let clubId = 0;
				let roomKey = '0';
				let unionId = 0;
				let unionRoomKey = "0";
				if (this.clubData) {
					clubId = this.clubData.clubId;
					roomKey = this.clubData.gameIndex;
				}
				if (this.unionData) {
					clubId = this.unionData.clubId;
					unionId = this.unionData.unionId;
					unionRoomKey = this.unionData.roomKey;
				}
				this.SetLocalConfig(item, configData, clubId, roomKey, unionId, unionRoomKey);
			}
		}


		if (1 == createType || 3 == createType) {
			if (this.clubData) {
				sendPack.clubId = this.clubData.clubId;
				sendPack.gameIndex = this.clubData.gameIndex;
				if (this.clubData != null) {
					if (isSpiltRoomCard == 0) {
						this.clubWinnerPayConsume = 0;
					} else if (isSpiltRoomCard == 1) {
						let default1 = this.Toggles['fangfei'][1].getChildByName('fangfeiNode').getChildByName('needNum').clubWinnerPayConsume;
						let new1 = parseInt(this.Toggles['fangfei'][1].getChildByName('editbox').getComponent(cc.EditBox).string);
						if (new1 > 0 && new1 > default1) {
							this.clubWinnerPayConsume = new1;
						} else {
							this.clubWinnerPayConsume = default1;
						}
					} else if (isSpiltRoomCard == 2) {
						let default2 = this.Toggles['fangfei'][2].getChildByName('fangfeiNode').getChildByName('needNum').clubWinnerPayConsume;
						let new2 = parseInt(this.Toggles['fangfei'][2].getChildByName('editbox').getComponent(cc.EditBox).string);
						if (new2 > 0 && new2 > default2) {
							this.clubWinnerPayConsume = new2;
						} else {
							this.clubWinnerPayConsume = default2;
						}
					}
				} else {
					this.clubWinnerPayConsume = 0;
				}
				sendPack.clubWinnerPayConsume = this.clubWinnerPayConsume;
				if (this.clubWinnerPayConsume > 0) {
					sendPack.clubCostType = 1;
				} else {
					sendPack.clubCostType = 0;
				}
				createType = 3;
			}
		}
		sendPack.createType = createType;
		let realGameType = this.gameType;
		if (this.gameType == "sss_zz" || this.gameType == "sss_dr") {
			realGameType = "sss";
		}
		if (this.gameType == "zyqz_nn" ||
			this.gameType == "nnsz_nn" ||
			this.gameType == "gdzj_nn" ||
			this.gameType == "tbnn_nn" ||
			this.gameType == "mpqz_nn" ||
			this.gameType == "lz_nn") {
			realGameType = "nn";
		}
		if (this.gameType == "zyqz_sg" ||
			this.gameType == "sgsz_sg" ||
			this.gameType == "gdzj_sg" ||
			this.gameType == "tb_sg" ||
			this.gameType == "mpqz_sg") {
			realGameType = "sg";
		}
		let gameId = app.ShareDefine().GametTypeNameDict[realGameType.toUpperCase()];
		// if (1 == createType || 3 == createType) {
		//     if (this.clubData) {
		//         sendPack.roomName = app.ShareDefine().GametTypeID2Name[gameId];
		//     }
		// }
		sendPack.gameType = gameId;
		app.Client.SetGameType(realGameType);
		this.LocalDataManager.SetConfigProperty("SysSetting", "LastGameType", this.gameType);
		if (this.unionData) {
			let tempObj = {
				"realGameType": realGameType,
				"sendPack": sendPack
			}
			return tempObj;
		} else {
			app.Client.CreateRoomCheckSubGame(realGameType, sendPack);
		}

		// if(!cc.sys.isNative){
		//     let self = this;
		//     app.NetManager().SendPack("room.CBaseCreateRoom", sendPack, function(event){
		//         app.SysNotifyManager().ShowSysMsg("创建房间成功",[],3);
		//     }, function(event){
		//         app.SysNotifyManager().ShowSysMsg("创建房间失败",[],3);
		//     });
		// }

	},

	RefreshAllToggles: function (gameType) {
		this.gameType = gameType;
		this.Toggles = {};
		this.scroll_Right.stopAutoScroll();
		//this.node_RightLayout.removeAllChildren();
		this.DestroyAllChildren(this.node_RightLayout);
		let isHideZhadanfenshu = false;

		let helpIndex = 1;//01是总帮助
		for (let key in this.gameCreateConfig) {
			if (this.gameType == this.gameCreateConfig[key].GameName) {
				let node = null;
				let dataKey = this.gameCreateConfig[key].Key;
				let toggleCount = this.gameCreateConfig[key].ToggleCount;
				let AtRows = this.gameCreateConfig[key].AtRow.toString().split(',');
				let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
				if (this.clubData && 'fangfei' == dataKey) {
					toggleCount = 1;  //一个管理付，一个大赢家付
					AtRows = [1];
				} else if (this.unionData && 'fangfei' == dataKey) {
					toggleCount = 1;  //一个盟主付`
					AtRows = [1];
				}

				node = cc.instantiate(this.prefab_Toggles);
				node.active = true;
				//需要判断添更加多的Toggle
				let addCount = toggleCount - 1;
				if (addCount < 0)
					this.ErrLog('gameCreate Config ToggleCount error');
				else {
					for (let i = 2; i <= toggleCount; i++) {
						let prefabNode = node.getChildByName('Toggle1');
						let newNode = cc.instantiate(prefabNode);
						newNode.name = 'Toggle' + i;
						node.addChild(newNode);
					}
				}

				node.name = 'Toggles_' + dataKey;
				node.x = 10;
				let nodeHelp = node.getChildByName('btn_help');
				nodeHelp.active = false;
				if (this.gameCreateConfig[key].IsShowHelp) {
					nodeHelp.name = 'btn_help0' + helpIndex;
					nodeHelp.on('click', this.OnHelpBtnClick, this);
					nodeHelp.active = true;
					helpIndex++;
				}


				if (!this.Toggles[dataKey])
					this.Toggles[dataKey] = [];

				let fristPos = { x: 0, y: 0 };
				let lastPos = { x: 0, y: 0 };
				for (let i = 1; i <= toggleCount; i++) {
					let curNode = node.getChildByName('Toggle' + i);
					curNode.isFirstNode = false;
					if (curNode) {
						//位置宽高设置下
						//记录下第一个的位置方便换行
						if (1 == i) {
							fristPos.x = curNode.x;
							fristPos.y = curNode.y;
							lastPos.x = curNode.x;
							lastPos.y = curNode.y;
							curNode.isFirstNode = true;
						}
						else if (1 < i) {//第1个以后都是新增的
							if (AtRows[i - 2] != AtRows[i - 1]) {
								curNode.x = fristPos.x;
								curNode.y = lastPos.y - curNode.height - this.rightPrefabSpacing;
								node.height = node.height + curNode.height + this.rightPrefabSpacing;
								curNode.isFirstNode = true;
							}
							else {
								// if ('fangfei' == dataKey) {
								//     //房费节点比较长，需要再位移一点
								//     curNode.x = lastPos.x + this.addPrefabWidth + 80;
								// }else{
								//     curNode.x = lastPos.x + this.addPrefabWidth;
								// }
								curNode.x = lastPos.x + parseInt(spacing[i - 1]);
								curNode.y = lastPos.y;
							}
						}
						lastPos.x = curNode.x;
						lastPos.y = curNode.y;

						curNode.on(cc.Node.EventType.TOUCH_START, this.OnToggleClick, this);
						let checkNode = curNode.getChildByName('checkmark');
						//默认不勾选
						checkNode.active = false;
						let icon_selectBg = curNode.getChildByName('icon_selectBg');
						let showList = this.gameCreateConfig[key].ShowIndexs.toString().split(',');
						//尝试获取缓存
						let clubId = 0;
						let roomKey = '0';
						let unionId = 0;
						let unionRoomKey = '0';
						let linshi = null;
						if (this.clubData) {
							clubId = this.clubData.clubId;
							roomKey = this.clubData.gameIndex;
							linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey, unionId, unionRoomKey);
						}
						//如果cfg没有的话，就是新建房间，才读本地
						if (this.unionData != null && this.unionData.cfgData == null) {
							clubId = this.unionData.clubId;
							unionId = this.unionData.unionId;
							unionRoomKey = this.unionData.roomKey;
							linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, roomKey, unionId, unionRoomKey);
						}
						//如果cfg没有的话，就是新建房间，才读本地
						if (this.unionData == null || this.unionData.cfgData == null) {
							//第一次创建俱乐部房间没有roomKey为0
							if (!linshi)
								linshi = this.GetLocalConfig(this.gameCreateConfig[key].Key, clubId, '0', unionId, unionRoomKey);
							if (linshi) {
								let linshiList = linshi.split(',');
								for (let j = 0; j < linshiList.length; j++) {//缓存可能出BUG(配置删除了按钮数量)
									if (parseInt(linshiList[j]) > toggleCount) {
										linshiList = ['1'];
										break;
									}
								}
								showList = linshiList;
							}
						} else {
							let cfgDataList = this.unionData.cfgData.bRoomConfigure[dataKey];
							if (typeof (cfgDataList) == "object") {
								showList = [];
								for (let j = 0; j < cfgDataList.length; j++) {
									//索引要加1
									let realIndex = cfgDataList[j] + 1;
									showList.push(realIndex);
								}
							} else if (typeof (cfgDataList) == "number") {
								//单选，就一个数字，加入数组
								let showListTemp = [];
								//索引要加1
								showListTemp.push(cfgDataList + 1);
								showList = showListTemp;
							}
						}

						if (this.clubData && 'fangfei' == dataKey)
							showList = [1];
						if (this.unionData && 'fangfei' == dataKey)
							showList = [1];

						//尝试获取缓存
						if (0 == this.gameCreateConfig[key].ToggleType && 1 != showList.length)
							this.ErrLog('gameCreate Config ToggleType and ShowIndexs error');

						if (1 == this.gameCreateConfig[key].ToggleType) {//多选的图片设置下(不放上面是因为路径)
							let imgPath = 'texture/ui/createRoom/icon_checkin02';
							node.addComponent(cc.Toggle);
							this.SetNodeImageByFilePath(checkNode, imgPath);
							this.SetNodeImageByFilePath(icon_selectBg, 'texture/ui/createRoom/icon_check02');
						}

						for (let j = 0; j < showList.length; j++) {
							if (i == parseInt(showList[j])) {
								checkNode.active = true;
								break;
							}
							else {
								checkNode.active = false;
							}
						}

						if (2 == this.gameCreateConfig[key].ToggleType) {//显示输入框
							curNode.getChildByName("icon_selectBg").active = false;
							curNode.getChildByName("checkmark").active = false;
							curNode.getChildByName("label").active = false;
							curNode.getChildByName("editboxEX").active = true;
							curNode.getChildByName("editboxEX").x = 180;
							curNode.getChildByName("editboxEX").getComponent(cc.EditBox).string = (!linshi || isNaN(linshi)) ? this.gameCreateConfig[key].ShowIndexs : linshi;
							curNode.getChildByName("editboxEX").getComponent(cc.EditBox).placeholder = this.gameCreateConfig[key].ToggleDesc;

							//纪录区间
							let minAndMax = this.gameCreateConfig[key].ToggleDesc.toString().split('-');
							curNode.getChildByName("editboxEX").minEnter = minAndMax[0];
							curNode.getChildByName("editboxEX").maxEnter = minAndMax[1];
						}

						this.Toggles[dataKey].push(curNode);
					}
				}
				this.UpdateTogglesLabel(node);
				this.UpdateLabelColor(node);
				this.node_RightLayout.addChild(node);
				let line = this.scroll_Right.node.getChildByName('line');
				let addline = cc.instantiate(line);
				addline.active = true;
				this.node_RightLayout.addChild(addline);
			}
		}
		this.setHelpBtnPos();
		this.scroll_Right.scrollToTop();
		//如果可以滚动，显示滚动提示节点
		if (this.node_RightLayout.height > this.scroll_Right.node.height) {
			this.scrollTip.active = true;
		} else {
			this.scrollTip.active = false;
		}
		this.UpdateOnClickToggle();
	},

	/**
	 * 输入框
	 */
	GetEditBoxByKey: function (key) {
		if (!this.Toggles[key]) {
			return false;
		}

		let value = parseInt(this.Toggles[key][0].getChildByName('editboxEX').getComponent(cc.EditBox).string);
		return value;
	},

	CheckEditBoxData: function (key) {
		if (!this.Toggles[key]) {
			return false;
		}

		let value = this.Toggles[key][0].getChildByName('editboxEX').getComponent(cc.EditBox).string;
		if (value == "") {
			return false;
		}

		value = Number(value);
		if (isNaN(value)) {
			app.SysNotifyManager().ShowSysMsg('请输入整数');
			return false;
		}

		if (!Number.isInteger(value)) {
			app.SysNotifyManager().ShowSysMsg('请输入整数');
			return false;
		}

		if (value < this.Toggles[key][0].getChildByName('editboxEX').minEnter ||
			value > this.Toggles[key][0].getChildByName('editboxEX').maxEnter) {
			app.SysNotifyManager().ShowSysMsg('请检查输入的区间值是否正确');
			return false;
		}

		return true;
	},

	UpdateOnClickToggle: function (key, toggleIndex) {
		// 	房间内切换人数不可选。
		// if (this.Toggles["fangjian"] && this.Toggles["fangjian"][0]) {
		// 	this.Toggles['fangjian'][0].getChildByName("label").color = cc.color(180, 180, 180);
		// }

		// 	房间内切换人数不可选。
		if (this.Toggles["fangjian"] && this.Toggles["fangjian"][0]) {
			this.Toggles['fangjian'][0].getChildByName("label").color = cc.color(180, 180, 180);
		}

		// 	加买数：买1,买2；
		// 	单选，默认买1；
		// 	勾选“不买”则隐藏该玩法；
		// if (this.Toggles["jiamaishu"] && this.Toggles["jiamai"]) {
		// 	if (this.Toggles["jiamai"][0].getChildByName("checkmark").active) {
		// 		this.Toggles['jiamaishu'][0].parent.active = false;
		// 	} else {
		// 		this.Toggles['jiamaishu'][0].parent.active = true;
		// 	}
		// }

		// // 	“不带喜”玩法隐藏解散喜分选项。
		// if (this.Toggles["xifen"][0].getChildByName("checkmark").active) {
		// 	this.Toggles['jiesanxifen'][0].parent.active = false;
		// } else {
		// 	this.Toggles['jiesanxifen'][0].parent.active = true;
		// }
		// 	大炸摊牌和八王不能同时勾选。（选中一个时，置灰另一个）
		// 	勾选比奖时，取消选中且置灰不可选“可投降”、“红桃3”、“流局比炸”、“大炸摊牌（九炸,硬八,四王摊牌）”。
		// if (this.Toggles["kexuanwanfa"][6].getChildByName("checkmark").active) {

		// 	this.Toggles['kexuanwanfa'][1].getChildByName("checkmark").active = false;
		// 	this.Toggles['kexuanwanfa'][2].getChildByName("checkmark").active = false;
		// 	this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active = false;
		// 	this.Toggles['kexuanwanfa'][4].getChildByName("checkmark").active = false;

		// 	this.Toggles['kexuanwanfa'][1].getChildByName("label").color = cc.color(180, 180, 180);
		// 	this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(180, 180, 180);
		// 	this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(180, 180, 180);
		// 	this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(180, 180, 180);
		// } else {
		// 	if (("kexuanwanfa" == key && toggleIndex == 6)) {
		// 		this.Toggles['kexuanwanfa'][1].getChildByName("label").color = cc.color(158, 49, 16);
		// 		this.Toggles['kexuanwanfa'][2].getChildByName("label").color = cc.color(158, 49, 16);
		// 		this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(158, 49, 16);
		// 		this.Toggles['kexuanwanfa'][4].getChildByName("label").color = cc.color(158, 49, 16);
		// 	} else {
		// 		this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
		// 	}
		// }

		// if (this.Toggles["fangjian"] && this.Toggles["fangjian"][4]) {
		// 	this.Toggles['fangjian'][4].active = false;
		// }
	},

	OnUpdateTogglesLabel: function (TogglesNode) {
		// 	二三人场，必选无花牌。
		// if (this.Toggles["huapai"]) {
		// 	if (this.Toggles["renshu"][2].getChildByName("checkmark").active) { // 四人
		// 		// this.Toggles["huapai"][0].getChildByName("checkmark").active = true;
		// 		// this.Toggles["huapai"][1].getChildByName("checkmark").active = false;
		// 		// this.Toggles["huapai"][2].getChildByName("checkmark").active = false;

		// 		this.Toggles['huapai'][0].getChildByName("label").color = cc.color(158, 49, 16);
		// 		this.Toggles['huapai'][1].getChildByName("label").color = cc.color(158, 49, 16);
		// 		this.Toggles['huapai'][2].getChildByName("label").color = cc.color(158, 49, 16);
		// 	} else {
		// 		// 二三人场
		// 		// 	二三人场，必选无花牌。
		// 		this.Toggles["huapai"][0].getChildByName("checkmark").active = true;
		// 		this.Toggles["huapai"][1].getChildByName("checkmark").active = false;
		// 		this.Toggles["huapai"][2].getChildByName("checkmark").active = false;

		// 		this.Toggles['huapai'][0].getChildByName("label").color = cc.color(158, 49, 16);
		// 		this.Toggles['huapai'][1].getChildByName("label").color = cc.color(180, 180, 180);
		// 		this.Toggles['huapai'][2].getChildByName("label").color = cc.color(180, 180, 180);
		// 	}
		// }

		// // 	四人场必选算喜。
		// if (this.Toggles["sywsk"]) {
		// 	if (this.Toggles["renshu"][2].getChildByName("checkmark").active) { // 四人
		// 		this.Toggles["sywsk"][0].getChildByName("checkmark").active = true;
		// 		this.Toggles["sywsk"][1].getChildByName("checkmark").active = false;
		// 		this.Toggles['sywsk'][1].getChildByName("label").color = cc.color(180, 180, 180);
		// 	} else {
		// 		this.Toggles['sywsk'][1].getChildByName("label").color = cc.color(158, 49, 16);
		// 	}
		// }

		// // 	二三人场隐藏摇摆,炸错罚分,额外加分。
		// if (this.Toggles["kexuanwanfa"]) {
		// 	if (this.Toggles["renshu"][2].getChildByName("checkmark").active) { // 四人
		// 		this.Toggles["kexuanwanfa"][1].active = true;
		// 		this.Toggles["kexuanwanfa"][2].active = true;
		// 		this.Toggles["kexuanwanfa"][3].active = true;
		// 	} else {
		// 		// 二三人场
		// 		this.Toggles["kexuanwanfa"][1].active = false;
		// 		this.Toggles["kexuanwanfa"][2].active = false;
		// 		this.Toggles["kexuanwanfa"][3].active = false;
		// 	}
		// }
	},

});

module.exports = sjChildCreateRoom;