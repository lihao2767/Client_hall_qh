var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        layout:cc.Node,
        demo:cc.Node,

        clubname:cc.EditBox,
        clubfangka:cc.EditBox,
    },
    OnCreateInit: function () {
    },
    //-----------------显示函数------------------
    OnShow: function () {
//        this.ShowShiMing();
    },
    OnClick:function(btnName, btnNode){
        if('btn_create' == btnName){
            this.allSelectCityData = app.HeroManager().GetCurSelectCityData();
            let heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
            if(heroRoomCard>=100){  //阳阳改，10W钻石才能创建亲友圈
                app.FormManager().ShowForm('ui/club/UIClubCreate',this.allSelectCityData[0].selcetId);
            }else{
                app.SysNotifyManager().ShowSysMsg('您的权限不足，请联系管理员！');
            }



        }else if('btn_join' == btnName){
            this.FormManager.ShowForm('ui/club/UIJoinClub');
        }else if('btn_close' == btnName){
            this.CloseForm();
        }
    },
});