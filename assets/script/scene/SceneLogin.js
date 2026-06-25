/*
 登陆场景
 */

var app = require("app");

cc.Class({
	extends: require("BaseScene"),

	properties: {
		LabelRes:cc.Label,
	},

	//----------回掉函数------------------
	OnCreate: function () {

		this.FormManager = app.FormManager();
		this.ShareDefine = app.ShareDefine();
		this.WeChatManager = app.WeChatManager();
		this.HeroAccountManager = app.HeroAccountManager();
		this.SDKManager = app.SDKManager();

		if(this.LabelRes){
			this.LabelRes.string = app.ShareDefine().ClientVersion;
		}
	},


	//进入场景
	OnSwithSceneEnd:function(){
		console.log("come in OnSwithSceneEnd");


		//如果是h5sdk直接登录
		if(this.SDKManager.IsH5AccountSDK()){
			//直接调用登录服务器
			this.SDKManager.LoginBySDK();
			//重置微信分享文本,因为有可能被修改成分享房间的连接文本
			this.WeChatManager.InitGameWeChatShare();
			cc.log("OnSwithSceneEnd IsH5AccountSDK");
		}
		//如果是appsdk 显示授权界面
		else if(this.SDKManager.IsAppAccountSDK()){
			console.log("OnSwithSceneEnd 2 this.SDKManager.CheckLoginBySDK():%s",this.SDKManager.CheckLoginBySDK());
			if(this.SDKManager.CheckLoginBySDK()){
				this.SDKManager.LoginBySDK();
			}else{
				// this.FormManager.ShowForm("UILogin01");
			}	

			if (app.SDKManager().CheckIsAppCheck())  {
				this.FormManager.ShowForm("UILogin01");	
			} else {
				this.FormManager.ShowForm(this.FormManager.LoginForm());
			}	
		}
		//否则公司内部账号登录界面
		else{
			cc.log("OnSwithSceneEnd 3");
			if (app.SDKManager().CheckIsAppCheck())   {
				this.FormManager.ShowForm("UILogin01");	
			} else {
				this.FormManager.ShowForm(this.FormManager.LoginForm());
			}
		}
	},

	OnTouchEnd:function(event){

	},
});
