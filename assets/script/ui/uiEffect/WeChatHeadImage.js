var app = require("app");

cc.Class({
	extends: require("BaseComponent"),

	properties: {
	},

	// use this for initialization
	OnLoad: function (heroID=0) {
		this.heroID = heroID;
		this.getHeadTime=0;
		this.isGetHead=false;
		this.JS_Name = this.node.name + "_WeChatHeadImage";
		app.Client.RegEvent("RefreshHeadImageSprite", this.Event_RefreshHeadImageSprite, this);
	},

	/*//显示
	onEnable:function(){
		app.Client.RegEvent("RefreshHeadImageSprite", this.Event_RefreshHeadImageSprite, this);
	},

	//关闭时
	onDisable:function(){
		app.Client.UnRegTargetEvent(this);
	},
*/
	Event_RefreshHeadImageSprite:function(event){
		let heroIDList = event["HeroIDList"]||[];
		if(heroIDList.InArray(this.heroID)){
			//重置标志，允许重新加载新头像
			this.isGetHead = false;
			this.getHeadTime = 0;
			//获取最新的头像URL并重新加载
			let headImageUrl = app.WeChatManager().HeroIDGetHeadImgUrl(this.heroID);
			if(headImageUrl){
				this.ShowHeroHead(this.heroID, headImageUrl, 0);
			}else{
				//如果没有URL，尝试从缓存获取spriteFrame
				let spriteFrame = app.WeChatManager().GetHeroHeadSpriteFrame(this.heroID);
				if(spriteFrame){
					this.isGetHead = true;
					this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
				}
			}
		}
	},
	OnReloadHeroHead:function(heroID, heroSex=0){

	},
	//显示微信头像
	ShowHeroHead:function(heroID,headImageUrl,heroSex=0){
		if(this.isGetHead==true){
			return;
		}
		let that = this;
		if(this.getHeadTime>3){
			if(headImageUrl){
				if(headImageUrl.indexOf('thirdwx.qlogo.cn')>0){
					headImageUrl=headImageUrl+"?a.png";
				}
				app.ControlManager().CreateLoadPromiseByUrl(headImageUrl)
	                    .then(function(texture){
	                        if(texture instanceof cc.Texture2D){
	                        	if(!cc.isValid(that.node)){
									return;
								}
								that.isGetHead=true;
	                            let spriteFrame = new cc.SpriteFrame(texture);
	                            that.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
	                        }
	                        else{
	                            that.ErrLog("texture not Texture2D");
	                        }
	                    })
	                .catch(function(error){
	                    that.ErrLog("OnHttpPack_HeadImagePathInfo error:%s", error.stack);
	            })
			}
			return;
		}
		this.heroID = heroID;
		let spriteFrame = app.WeChatManager().GetHeroHeadSpriteFrame(heroID);
		if(spriteFrame){
			this.isGetHead=true;
			this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
		}else{
			setTimeout(function(){
               that.getHeadTime++;
               that.ShowHeroHead(heroID,headImageUrl);
            },500);
		}
	},
});
