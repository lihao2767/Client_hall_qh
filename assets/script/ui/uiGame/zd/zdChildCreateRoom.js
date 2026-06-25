/*
创建房间子界面
 */
var app = require("app");

var zdChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let difen=this.GetIdxByKey('difen');
        let beishu=this.GetIdxByKey('beishu');
        let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
        let fangjian=this.GetIdxsByKey('fangjian');
        let xianShi=this.GetIdxByKey('xianShi');
        let jiesan=this.GetIdxByKey('jiesan');
        let gaoji=this.GetIdxsByKey('gaoji');

        sendPack = {
            "difen":difen,
            "beishu":beishu,
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
    OnToggleClick: function (event) {
        this.FormManager.CloseForm("UIMessageTip");
        let toggles = event.target.parent;
        let toggle = event.target;
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
        else if('gaoji' == key){
            if (this.Toggles['gaoji'][4].getChildByName('checkmark').active && toggleIndex == 7) {
                this.Toggles['gaoji'][4].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['gaoji'][4].parent);
            } else if (this.Toggles['gaoji'][7].getChildByName('checkmark').active && toggleIndex == 4) {
                this.Toggles['gaoji'][7].getChildByName('checkmark').active = false;
                this.UpdateLabelColor(this.Toggles['gaoji'][7].parent);
            }
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
    UpdateOnClickToggle: function() {
        //选项置灰
        if(this.Toggles["difen"]){
            this.UpdateLabelColor(this.Toggles['difen'][0].parent);
            if(!this.Toggles["renshu"][0].getChildByName("checkmark").active){
                this.Toggles['difen'][2].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['difen'][2].getChildByName("label")){
                    this.Toggles['difen'][2].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['difen'][2].getChildByName("label")){
                    this.Toggles['difen'][2].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
        }
    },
});

module.exports = zdChildCreateRoom;