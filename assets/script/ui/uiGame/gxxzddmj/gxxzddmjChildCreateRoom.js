/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
    extends: require("BaseChildCreateRoom"),

    properties: {

    },
    //需要自己重写
    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        let fangshu=this.GetIdxByKey('fangshu');
        let zimo=this.GetIdxByKey('zimo');
        let fengDing=this.GetIdxByKey('fengDing');
        let huansanzhang=this.GetIdxByKey('huansanzhang');
        let kexuanwanfa=this.GetIdxsByKey('kexuanwanfa');
        let dianganghua=this.GetIdxByKey('dianganghua');
        let fangjian=this.GetIdxsByKey('fangjian');
        let xianShi=this.GetIdxByKey('xianShi');
        let jiesan=this.GetIdxByKey('jiesan');
        let gaoji=this.GetIdxsByKey('gaoji');

        sendPack = {
            "fangshu":fangshu,
            "zimo":zimo,
            "fengDing":fengDing,
            "huansanzhang":huansanzhang,
            "kexuanwanfa":kexuanwanfa,
            "dianganghua":dianganghua,
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
    UpdateOnClickToggle:function(){
       //选项置灰
        if(this.Toggles["kexuanwanfa"]){
            this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
            //“死叫不算叫”仅限勾选“查大叫”玩法可选；
            if(!this.Toggles["kexuanwanfa"][9].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][10].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][10].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][10].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][10].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][10].getChildByName("label").color = cc.color(158, 49, 16);
                }
                //选中
                if(this.Toggles['kexuanwanfa'][10].getChildByName("checkmark").active){
                    this.Toggles['kexuanwanfa'][10].getChildByName("label").color = cc.color(0, 155, 46);
                }
            }
            //“差花猪”仅限未勾选“不封顶”玩法可选；
            if(this.Toggles["fengDing"][14].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][11].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][11].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][11].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][11].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][11].getChildByName("label").color = cc.color(158, 49, 16);
                }
                //选中
                if(this.Toggles['kexuanwanfa'][11].getChildByName("checkmark").active){
                    this.Toggles['kexuanwanfa'][11].getChildByName("label").color = cc.color(0, 155, 46);
                }
            }
            //“查花猪限制”仅限勾选“查花猪”玩法可选；
            if(!this.Toggles["kexuanwanfa"][11].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][12].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][12].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][12].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][12].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][12].getChildByName("label").color = cc.color(158, 49, 16);
                }
                //选中
                if(this.Toggles['kexuanwanfa'][12].getChildByName("checkmark").active){
                    this.Toggles['kexuanwanfa'][12].getChildByName("label").color = cc.color(0, 155, 46);
                }
            }
            //“定缺”仅限勾选“3房”玩法可选；
            if(!this.Toggles["fangshu"][0].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][16].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][16].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][16].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][16].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][16].getChildByName("label").color = cc.color(158, 49, 16);
                }
                //选中
                if(this.Toggles['kexuanwanfa'][16].getChildByName("checkmark").active){
                    this.Toggles['kexuanwanfa'][16].getChildByName("label").color = cc.color(0, 155, 46);
                }
            }
            //“过手加番可胡”，仅限勾选“过庄过胡”玩法后可选；
            if(!this.Toggles["kexuanwanfa"][22].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][23].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][23].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][23].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][23].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][23].getChildByName("label").color = cc.color(158, 49, 16);
                }
                //选中
                if(this.Toggles['kexuanwanfa'][23].getChildByName("checkmark").active){
                    this.Toggles['kexuanwanfa'][23].getChildByName("label").color = cc.color(0, 155, 46);
                }
            }
            //“无癞子加番”仅限“癞子玩法”玩法可选
            if(!this.Toggles["kexuanwanfa"][24].getChildByName("checkmark").active){
                this.Toggles['kexuanwanfa'][25].getChildByName("checkmark").active = false;
                //置灰
                if(this.Toggles['kexuanwanfa'][25].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][25].getChildByName("label").color = cc.color(180, 180, 180);
                }
            }else{
                //恢复
                if(this.Toggles['kexuanwanfa'][25].getChildByName("label")){
                    this.Toggles['kexuanwanfa'][25].getChildByName("label").color = cc.color(158, 49, 16);
                }
                //选中
                if(this.Toggles['kexuanwanfa'][25].getChildByName("checkmark").active){
                    this.Toggles['kexuanwanfa'][25].getChildByName("label").color = cc.color(0, 155, 46);
                }
            }
        }
    },
});

module.exports = fzmjChildCreateRoom;