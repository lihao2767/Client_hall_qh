var app = require("app");
var SubgameManager = require('SubgameManager');
cc.Class({
    extends: require("BaseForm"),

    properties: {
        RightNode:cc.Node,
        pafabItem:cc.Node,
        btn_tuijian:cc.Node,
        btn_majiang:cc.Node,
        btn_poker:cc.Node,
    },
    OnCreateInit: function () {
        this.gametypeConfig = app.SysDataManager().GetTableDict("gametype");
        this.gameListConfig = app.SysDataManager().GetTableDict("gameList");
        this.RegEvent("OnUpdateGameEnd", this.ShowAllGameByType, this);
        let appName=cc.sys.localStorage.getItem('appName');
        if (appName!="hubei") {
            this.node.getChildByName("bgImage").active=true;
        }else{
            this.node.getChildByName("bgImagehubei").active=true;
        }
    },
    //-----------------显示函数------------------
    OnShow: function (clubData = null, unionData = null,gameList) {
        this.clubData = clubData;
        this.unionData = unionData;
        this.gameList=gameList;
        this.FormManager.ShowForm('UITop', "UIMoreGame");
        this.curShowType = 0;//0是推荐，1是麻将，2是扑克
        this.ShowAllGameByType();
        this.pafabItem.active = false;
    },
    ShowAllGameByType:function(){
        if (this.curShowType == 0) {
            this.btn_tuijian.getChildByName("icon").active = true;
            this.btn_majiang.getChildByName("icon").active = false;
            this.btn_poker.getChildByName("icon").active = false;
        }else if (this.curShowType == 1) {
            this.btn_tuijian.getChildByName("icon").active = false;
            this.btn_majiang.getChildByName("icon").active = true;
            this.btn_poker.getChildByName("icon").active = false;
        }else if (this.curShowType == 2) {
            this.btn_tuijian.getChildByName("icon").active = false;
            this.btn_majiang.getChildByName("icon").active = false;
            this.btn_poker.getChildByName("icon").active = true;
        }
        
        //this.RightNode.removeAllChildren();
        this.DestroyAllChildren(this.RightNode);
        let appName=this.GetAppName();

        let allGameId = this.gameList;

        for (var id in this.gametypeConfig) {
            let Type = this.gametypeConfig[id]["Type"];
            // if (this.curShowType == 0) {
            if (allGameId.indexOf(id) < 0) continue;
            // }
            if (this.curShowType != 0 && Type != this.curShowType) continue;
            //未开发的游戏不显示在真机上
            // if(cc.sys.isNative){
            //     //读取gamelist表，只显示已开放的游戏,备注:gameList的id需要加1
            //     let gameId = parseInt(id) + 1;
            //     let isOpen = this.gameListConfig[gameId].isOpen;
            //     if (isOpen == 0) {
            //         console.log("游戏："+id+"未开放");
            //         continue;
            //     }else{
            //         console.log("游戏："+id+"开放");
            //     }
            // }
            let gameName = app.ShareDefine().GametTypeID2PinYin[id];
            let gameItem = cc.instantiate(this.pafabItem);
            gameItem.name = "btn_" + gameName;
            if(cc.sys.isNative){
                if (SubgameManager.isSubgameDownLoad(gameName)) {
                    gameItem.getChildByName("img_xiazai").active = false;
                    //已下载，判断是否需要更新
                    SubgameManager.needUpdateSubgame(gameName, (success) => {
                        if (success) {
                            //子游戏需要更新;
                            gameItem.getChildByName("img_gengxin").active = true;
                        } else {
                            //子游戏不需要更新;
                            gameItem.getChildByName("img_gengxin").active = false;
                        }
                    }, () => {
                        console.log("子游戏更新失败");
                        gameItem.getChildByName("img_gengxin").active = false;
                    });
                }else{
                    gameItem.getChildByName("img_xiazai").active = true;
                    gameItem.getChildByName("img_gengxin").active = false;
                }
            }
            let imgName = this.gametypeConfig[id]["imgUrl"];
            if(appName=="baodao"){
                if(gameName=="nn" || gameName=="fqpls"){
                    //NN跟fqpls
                    imgName=imgName+"_baodao";
                }
            }


           //图片改成远程加载开始
            let that=this;
            if(cc.sys.isNative){
                let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'gameicons');
                if (!jsb.fileUtils.isDirectoryExist(storagePath) ){
                    jsb.fileUtils.createDirectory(storagePath);
                }
                let imagePath = storagePath+"/"+imgName+".png";
                if (jsb.fileUtils.isFileExist(imagePath)) {
                    //加载本地图片
                    cc.loader.load(imagePath,function (error, tex) {
                        if(error){
                            console.log("加载图片精灵失败  " + imagePath);
                            return
                        }
                        var spriteFrame = new cc.SpriteFrame(tex);
                        gameItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    });
                }else{
                    //下载远程图片精灵
                    let url="http://8.159.141.75:82/icon/"+imgName+".png";
                    var downloader = new jsb.Downloader();
                    downloader.setOnFileTaskSuccess(function () {
                        //加载本地图片
                        cc.loader.load(imagePath,function (error, tex) {
                            if(error){
                                console.log("加载图片2精灵失败  " + imagePath);
                                return
                            }
                            var spriteFrame = new cc.SpriteFrame(tex);
                            gameItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        });

                    });
                    downloader.setOnTaskError(function () {
                        console.log("加载远程图片精灵失败  " + url);
                    });
                    downloader.createDownloadFileTask(url, imagePath);//创建下载任务


                }
            }else{
                //手机版直接调用http图片
                let httpImgUrl="http://8.159.141.75:82/icon/"+imgName+".png";
                app.ControlManager().CreateLoadPromiseByUrl(httpImgUrl)
                        .then(function(texture){
                            if(texture instanceof cc.Texture2D){
                                let spriteFrame = new cc.SpriteFrame(texture);
                                gameItem.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                            }
                            else{
                                that.ErrLog("texture not Texture2D");
                            }
                        })
                    .catch(function(error){
                        that.ErrLog("加载http远程图片精灵失败 error:%s", error.stack);
                })


            }


            //图片改成远程加载结束



            gameItem.active = true;
            this.RightNode.addChild(gameItem);
        }
    },
    OnClick:function(btnName, btnNode){
        if('btn_tuijian' == btnName){
            this.curShowType = 0;
            this.ShowAllGameByType();
        }else if('btn_majiang' == btnName){
            this.curShowType = 1;
            this.ShowAllGameByType();
        }else if('btn_poker' == btnName){
            this.curShowType = 2;
            this.ShowAllGameByType();
        }else if(btnName.startsWith("btn_")){
            let gameName = btnName.replace('btn_','');
            let clubId = 0;
            let cityId = 0;
            if (this.clubData) {
                clubId = this.clubData.clubId;
                cityId = this.clubData.cityId;
            }
            if (cc.sys.isNative) {
                app.FormManager().ShowForm("UIDownLoadGame", gameName,0,null,0,0,false,clubId,this.unionData);
            }else{
                let clubDataTemp = null;
                if (this.clubData) {
                    clubDataTemp = {};
                    clubDataTemp.clubId = this.clubData.clubId;
                    clubDataTemp.cityId = cityId;
                    clubDataTemp.roomKey = '0';
                    clubDataTemp.gameIndex = 0;//用来判断保存还是创建
                    clubDataTemp.enableGameType = '';//不禁用的按钮
                }
                app.FormManager().CloseForm('UIMoreGame');
                app.FormManager().CloseForm('UITop');
                app.FormManager().GetFormComponentByFormName("UITop").RemoveCloseFormArr("UIMoreGame");
                app.FormManager().ShowForm('UICreatRoomNew',{"gameList":app.Client.GetAllGameId()},gameName,clubDataTemp,this.unionData);
            }
            
        }
        else{
            this.ErrLog("OnClick(%s) not find",btnName);
        }
        
    },
});