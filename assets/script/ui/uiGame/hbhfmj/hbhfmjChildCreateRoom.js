/*
创建房间子界面
 */
var app = require("app");

var wxmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let wanfa = this.GetIdxByKey('wanfa');
        let piaofen = this.GetIdxByKey('piaofen');
        let laizi = this.GetIdxByKey('laizi');
        let fengDing = this.GetIdxByKey('fengDing');
        let difen = this.GetIdxByKey('difen');
        let kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
        let fangjian = this.GetIdxsByKey('fangjian');
        let xianShi = this.GetIdxByKey('xianShi');
        let jiesan = this.GetIdxByKey('jiesan');
        let gaoji = this.GetIdxsByKey('gaoji');

        sendPack = {
            "wanfa": wanfa,
            "piaofen": piaofen,
            "laizi": laizi,
            "fengDing": fengDing,
            "difen": difen,
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
    UpdateOnClickToggle: function () {
        //选项置灰
        if (this.Toggles["kexuanwanfa"]) {
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            if (this.Toggles["fengDing"][0].getChildByName("checkmark").active) {
                this.Toggles['kexuanwanfa'][7].getChildByName("checkmark").active = false;
                //置灰
                if (this.Toggles['kexuanwanfa'][7].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][7].getChildByName("label").color = cc.color(180, 180, 180);
                }
            } else {
                //恢复
                if (this.Toggles['kexuanwanfa'][7].getChildByName("label")) {
                    this.Toggles['kexuanwanfa'][7].getChildByName("label").color = cc.color(158, 49, 16);
                }
            }
        }
    },
});

module.exports = wxmjChildCreateRoom;