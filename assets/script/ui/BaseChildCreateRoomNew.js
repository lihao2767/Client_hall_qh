/*
 创建房间子界面
 */
var app = require("app");

var BaseChildCreateRoom = cc.Class({
    extends: require("BaseForm"),

    properties: {},

    InitBase: function (clubData, unionData, gameType, isChangeRoom = false) {
        this.roomcostConfig = {};
        this.gameCreateConfig = {};
        this.SysDataManager = app.SysDataManager();
        this.gameFilter = [];
        this.LocalDataManager = app.LocalDataManager();
        this.FormManager = app.FormManager();
        this.ComTool = app.ComTool();
        this.RedColor1 = new cc.Color(0, 155, 46);
        this.RedColor2 = new cc.Color(182, 64, 12);
        this.WhiteClolor = new cc.Color(79, 79, 79);
        this.gameType = gameType;
        this.Toggles = {};
        this.clubData = clubData;
        this.unionData = unionData;
        this.isChangeRoom = isChangeRoom;
        this.node_RightLayout = this.node.getChildByName("mark").getChildByName("layout");
        this.scroll_Right = this.node.getChildByName("mark").getComponent(cc.ScrollView);
        this.scroll_Right.node.on(cc.Node.EventType.TOUCH_END, this.OnScrollEnded, this);
        this.prefab_Toggles = this.node.getChildByName("ToggleGroup2Item");
        this.scrollTip = this.node.getChildByName("scrollTip");
        if (!this.clubData || 0 == this.clubData.gameIndex) {
            this.node.getChildByName("btn_create").active = true;
            this.node.getChildByName("btn_save").active = false;
        }
        else {
            this.node.getChildByName("btn_create").active = false;
            this.node.getChildByName("btn_save").active = true;
        }
        //赛事的
        if (this.unionData) {
            this.node.getChildByName("btn_help").active = false;
            this.node.getChildByName("btn_create").active = false;
            this.node.getChildByName("btn_save").active = false;
            this.node.getChildByName("btn_next").active = true;
            this.node.getChildByName("tip").active = false;
        }
        this.node.getChildByName("btn_help").on("click", this.OnClickBtnHelp, this);
        this.node.getChildByName("btn_create").on("click", this.OnClickBtnCreate, this);
        this.node.getChildByName("btn_save").on("click", this.OnClickBtnCreate, this);
        this.node.getChildByName("btn_next").on("click", this.OnClickBtnNext, this);
        this.addPrefabWidth = 210;
        this.rightPrefabSpacing = this.node_RightLayout.getComponent(cc.Layout).spacingY;
        cc.find('mark', this.node).on(cc.Node.EventType.TOUCH_START, this.OnRightBgClick, this);
        this.disCount = -1;
        this.isGetDiscount = false;
        this.GetRoomCostByDiscount();
        app.Client.RegEvent("OnMicPermissionOpen", this.Event_MicPermissionOpen, this);
    },
    //创建界面回掉，重写
    OnCreateInit: function () {
    },
    //显示， 重写
    OnShow: function () {
    },
    RefreshAllTogglesFormServer: function (gameType, filterConfig, gameCreateConfig, roomcostConfig) {
        this.gameFilter = filterConfig;
        this.gameCreateConfig = gameCreateConfig;
        this.roomcostConfig = roomcostConfig;
        this.RefreshAllToggles(gameType);
    },
    RefreshAllToggles: function (gameType) {
        this.gameType = gameType;
        this.Toggles = {};
        this.scroll_Right.stopAutoScroll();
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
                //node.toggleType=this.gameCreateConfig[key].ToggleType;
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

                let fristPos = {x: 0, y: 0};
                let lastPos = {x: 0, y: 0};
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
                            curNode.getChildByName("editboxEX").x = 50;

                            //纪录区间
                            let minAndMax = this.gameCreateConfig[key].ToggleDesc.toString().split('-');
                            curNode.getChildByName("editboxEX").minEnter = parseInt(minAndMax[0]);
                            curNode.getChildByName("editboxEX").maxEnter = parseInt(minAndMax[1]);

                            if (linshi > 0) {
                                curNode.getChildByName("editboxEX").getComponent(cc.EditBox).string = linshi;
                            } else {
                                curNode.getChildByName("editboxEX").getComponent(cc.EditBox).string = this.gameCreateConfig[key].ShowIndexs;
                                // curNode.getChildByName("editboxEX").getComponent(cc.EditBox).string = "";
                            }

                            curNode.getChildByName("editboxEX").getChildByName("PLACEHOLDER_LABEL").getComponent(cc.Label).string = "请输入" + parseInt(minAndMax[0]) + "_" + parseInt(minAndMax[1]);
                        }
                        this.Toggles[dataKey].toggleType = this.gameCreateConfig[key].ToggleType;
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

    UpdateOnClickToggleEX: function () {
        for (let index = 0; index < this.gameFilter.length; index++) {
            let filterType = this.gameFilter[index].filterType;
            let selectKeyValue = this.gameFilter[index].selectKeyValue;

            let mt = selectKeyValue.split(':');
            let selectKey = mt[0];
            let selectValue = mt[1];
            if (!this.Toggles[selectKey]) {
                continue;
            }
            if (!this.Toggles[selectKey][selectValue]) {
                continue;
            }
            let filterKeyValue = this.gameFilter[index].filterKeyValue
            if (filterType == 1 && this.Toggles[selectKey][selectValue].getChildByName('checkmark').active == true) {
                //选中不选
                this.UnCheckToggle(filterKeyValue);
            }

            if (filterType == 2) {
                //选中隐藏
                this.HideShowToggle(filterKeyValue, !this.Toggles[selectKey][selectValue].getChildByName('checkmark').active);
            }
            if (filterType == 3) {
                //选中显示
                this.HideShowToggle(filterKeyValue, this.Toggles[selectKey][selectValue].getChildByName('checkmark').active);
            }
            if (filterType == 4 && this.Toggles[selectKey][selectValue].getChildByName('checkmark').active == true) {
                //选中必选另外一个
                this.UnCheckToggle(filterKeyValue, true);
            }
            if (filterType == 5 && this.Toggles[selectKey][selectValue].getChildByName('checkmark').active == true) {
                //2选1
                this.TwoOneToggle(filterKeyValue, false);
            }

        }


    },
    //获取创建缓存
    GetLocalConfig: function (configName, clubId, roomKey, unionId, unionRoomKey) {
        if (this.isChangeRoom) {
            let key = "change_" + this.gameType + '_' + clubId + '_' + roomKey + '_' + unionId + '_' + unionRoomKey + '_' + configName;
            console.log("get change_key:" + key);
            return cc.sys.localStorage.getItem(key);
        } else {
            return cc.sys.localStorage.getItem(this.gameType + '_' + clubId + '_' + roomKey + '_' + unionId + '_' + unionRoomKey + '_' + configName);
        }

    },
    SetLocalConfig: function (configName, configInfo, clubId, roomKey, unionId, unionRoomKey) {
        cc.sys.localStorage.setItem(this.gameType + '_' + clubId + '_' + roomKey + '_' + unionId + '_' + unionRoomKey + '_' + configName, configInfo);
    },

    UpdateTogglesLabel: function (TogglesNode, isResetPos = true) {
        this.OnUpdateTogglesLabel(TogglesNode, isResetPos);
        let curKey = TogglesNode.name.substring(('Toggles_').length, TogglesNode.name.length);
        let reg = /\/s/g;
        for (let key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName) {
                if (curKey == this.gameCreateConfig[key].Key) {
                    let AAfangfeiDatas = [];
                    let WinfangfeiDatas = [];
                    let FangZhufangfeiDatas = [];
                    let clubGuanLiFangFeiDatas = [];
                    let clubWinFangFeiDatas = [];
                    let clubAAFangFeiDatas = [];
                    let unionGuanliFangFeiDatas = [];
                    let title = this.gameCreateConfig[key].Title.replace(reg, ' ');
                    TogglesNode.getChildByName('title').getComponent(cc.Label).string = title;
                    let descList = [];
                    if ('jushu' != curKey) {//局数读roomcost
                        descList = this.gameCreateConfig[key].ToggleDesc.split(',');
                        if (this.clubData && 'fangfei' == curKey) {
                            descList = ['管理付'];
                        } else if (this.unionData && 'fangfei' == curKey) {
                            descList = ['盟主付'];
                        }
                        if (descList.length != TogglesNode.children.length - 2) {//减去标题和帮助按钮
                            this.ErrLog('gameCreate config ToggleDesc and Toggle count error');
                            break;
                        }
                    }
                    let jushuIndex = -1;
                    let renshuIndex = -1;
                    let renshu = [];//0表示读房主支付配置
                    if ('renshu' == curKey || 'fangfei' == curKey || 'jushu' == curKey) {

                        let publicCosts = this.getCostData(renshu);

                        if (this.Toggles['renshu']) {
                            renshu = this.getCurSelectRenShu();
                        }
                        let SpiltCosts = this.getCostData(renshu);
                        let curCostData = null;
                        if (0 == renshu.length) {
                            curCostData = publicCosts;
                        }
                        else {
                            curCostData = SpiltCosts;
                        }
                        if (this.Toggles['jushu']) {
                            jushuIndex = 0;
                            for (let i = 0; i < this.Toggles['jushu'].length; i++) {
                                let mark = this.Toggles['jushu'][i].getChildByName('checkmark').active;
                                if (mark) {
                                    jushuIndex = i;
                                    break;
                                }
                                jushuIndex++;
                            }
                            for (let i = 0; i < curCostData.length; i++) {
                                if(curCostData[i].SetCount > 100 && curCostData[i].SetCount < 200){
                                    this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = curCostData[i].SetCount % 100 + "圈";
                                } else {
                                    this.Toggles['jushu'][i].getChildByName('label').getComponent(cc.Label).string = curCostData[i].SetCount + '局';
                                }
                            }
                        }
                        if (this.Toggles['fangfei'] && -1 != jushuIndex) {
                            if (jushuIndex < publicCosts.length) {
                                AAfangfeiDatas.push(publicCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(publicCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(publicCosts[jushuIndex].CostCount);

                                clubGuanLiFangFeiDatas.push(publicCosts[jushuIndex].ClubCostCount);
                                clubWinFangFeiDatas.push(publicCosts[jushuIndex].ClubWinCostCount);
                                clubAAFangFeiDatas.push(publicCosts[jushuIndex].ClubAaCostCount);
                                //赛事房费
                                unionGuanliFangFeiDatas.push(publicCosts[jushuIndex].UnionCostCount);
                            }
                            if (jushuIndex < SpiltCosts.length) {
                                AAfangfeiDatas.push(SpiltCosts[jushuIndex].AaCostCount);
                                WinfangfeiDatas.push(SpiltCosts[jushuIndex].WinCostCount);
                                FangZhufangfeiDatas.push(SpiltCosts[jushuIndex].CostCount);

                                clubGuanLiFangFeiDatas.push(SpiltCosts[jushuIndex].ClubCostCount);
                                clubWinFangFeiDatas.push(SpiltCosts[jushuIndex].ClubWinCostCount);
                                clubAAFangFeiDatas.push(SpiltCosts[jushuIndex].ClubAaCostCount);
                                //赛事房费
                                unionGuanliFangFeiDatas.push(SpiltCosts[jushuIndex].UnionCostCount);
                            }
                        }
                    }
                    if ('jushu' != curKey) {
                        let descInde = 0;
                        for (let i = 0; i < TogglesNode.children.length; i++) {
                            if (TogglesNode.children[i].name.startsWith('Toggle')) {
                                TogglesNode.children[i].getChildByName('label').getComponent(cc.Label).string = descList[descInde];
                                descInde++;
                            }
                        }
                    }

                    if (0 != AAfangfeiDatas.length) {
                        let needCount = AAfangfeiDatas[AAfangfeiDatas.length - 1];
                        let ffNodes = this.Toggles['fangfei'];
                        let hasHideNode = false;
                        let spacing = this.gameCreateConfig[key].Spacing.toString().split(',');
                        for (let s = 0; s < ffNodes.length; s++) {
                            let needNode = ffNodes[s].getChildByName('fangfeiNode');
                            needNode.active = true;
                            if (hasHideNode && !needNode.parent.isFirstNode && isResetPos) {
                                needNode.parent.x = needNode.parent.x - spacing[s] - 80;
                                hasHideNode = false;
                            }
                            //如果房费配的是0，则隐藏
                            if (needCount <= 0 && 1 == s) {
                                needNode.parent.active = false;
                                hasHideNode = true;
                                continue;
                            }
                            let disCost = -1;
                            if (this.clubData == null && this.unionData == null) {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * FangZhufangfeiDatas[FangZhufangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                                else if (1 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + AAfangfeiDatas[AAfangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * AAfangfeiDatas[AAfangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                                else {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + WinfangfeiDatas[WinfangfeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * WinfangfeiDatas[WinfangfeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                            } else if (this.clubData == null && this.unionData != null) {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * unionGuanliFangFeiDatas[unionGuanliFangFeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                            } else {
                                if (0 == s) {
                                    if (this.disCount == -1) {
                                        needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1];
                                    } else {
                                        disCost = Math.ceil(this.disCount * clubGuanLiFangFeiDatas[clubGuanLiFangFeiDatas.length - 1]);
                                        if (disCost == 0) {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = '免费';
                                        } else {
                                            needNode.getChildByName('needNum').getComponent(cc.Label).string = 'x' + disCost;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.Toggles["gaoji"]) {
            for (let i = 0; i < this.Toggles["gaoji"].length; i++) {
                let ToggleDesc = this.Toggles["gaoji"][i].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "30秒未准备自动踢出房间" || ToggleDesc == "10秒未准备自动踢出房间" || ToggleDesc == "5秒未准备自动踢出房间") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["gaoji"][i].active = false;
                        this.Toggles["gaoji"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                    } else {
                        this.Toggles["gaoji"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        } else if (this.Toggles["kexuanwanfa"]) {
            for (let i = 0; i < this.Toggles["kexuanwanfa"].length; i++) {
                let ToggleDesc = this.Toggles["kexuanwanfa"][i].getChildByName("label").getComponent(cc.Label).string;
                if (ToggleDesc == "比赛分不能低于0" || ToggleDesc == "只赢当前分" || ToggleDesc == "只能赢当前身上分") {
                    if (!this.clubData && !this.unionData) {
                        this.Toggles["kexuanwanfa"][i].active = false;
                        this.Toggles["kexuanwanfa"][i].getChildByName("checkmark").active = false;//隐藏高级30秒被踢，ps：注释防止缓存
                        // break;
                    } else {
                        this.Toggles["kexuanwanfa"][i].active = true;
                        //this.Toggles["gaoji"][i].getChildByName("checkmark").active = true;//隐藏高级30秒被踢，ps：注释防止缓存
                        break;
                    }
                }
            }
        }
    },
    //获取打折后的价格
    GetRoomCostByDiscount: function () {
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
		if(realGameType == "sss"){
			gameId = 1;
		}
		else if (realGameType == "nn"){
			gameId = 4;
		}
		else if (realGameType == "sg"){
			gameId = 18;
		}
        let packName = "";
        let sendPack = {};
        if (this.clubData == null && this.unionData != null) {
            packName = "union.CUnionGameDiscount";
            sendPack.gameId = gameId;
            sendPack.clubId = this.unionData.clubId;
            sendPack.unionId = this.unionData.unionId;
        } else if (this.clubData != null && this.unionData == null) {
            packName = "club.CClubGameDiscount";
            sendPack.gameId = gameId;
            sendPack.clubId = this.clubData.clubId;
        } else {
            packName = "room.CBaseGameDiscount";
            sendPack.gameId = gameId;
        }
        let self = this;
        app.NetManager().SendPack(packName, sendPack, function (event) {
            if (event.gameId == gameId) {
                if (event.value >= 0) {
                    self.disCount = event.value / 100;
                }
                self.isGetDiscount = true;
                self.RefreshAllToggles(self.gameType);
            }
        }, function (event) {
            app.SysNotifyManager().ShowSysMsg("获取折扣失败", [], 3);
        });
    },
    UpdateLabelColor: function (TogglesNode) {
        for (let i = 0; i < TogglesNode.children.length; i++) {
            let toggleNode = TogglesNode.children[i];
            if (toggleNode.name.startsWith('Toggle')) {
                let isChecked = toggleNode.getChildByName('checkmark').active;
                for (let j = 0; j < toggleNode.children.length; j++) {
                    let label = toggleNode.children[j].getComponent(cc.Label);
                    if (null != label) {
                        if (isChecked) {
                            toggleNode.children[j].color = this.RedColor1;
                        }
                        else {
                            toggleNode.children[j].color = this.RedColor2;
                        }
                    }
                    let fangkaNode = toggleNode.getChildByName('fangfeiNode');
                    if (fangkaNode.active) {
                        label = null;
                        for (let s = 0; s < fangkaNode.children.length; s++) {
                            label = fangkaNode.children[s].getComponent(cc.Label);
                            if (null != label) {
                                if (isChecked) {
                                    fangkaNode.children[s].color = this.RedColor1;
                                }
                                else {
                                    fangkaNode.children[s].color = this.RedColor2;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    setHelpBtnPos: function () {//垃圾label控件自适应宽度有BUG草泥马
        let helpNode = null;
        let lastNode = null;
        let Toggles = null;
        for (let j = 0; j < this.node_RightLayout.children.length; j++) {
            if (j % 2 == 1) {
                continue;
            }
            Toggles = this.node_RightLayout.children[j];
            helpNode = null;
            lastNode = null;
            for (let i = 0; i < Toggles.children.length; i++) {
                if (Toggles.children[i].name.startsWith('Toggle'))
                    lastNode = Toggles.children[i];
                else if (Toggles.children[i].name.startsWith('btn_help'))
                    helpNode = Toggles.children[i];

                if (helpNode && helpNode.active && lastNode) {
                    let labelNode = lastNode.getChildByName('label');
                    let str = lastNode.getChildByName('label').getComponent(cc.Label);
                    let maxWidth = 0;
                    let label = lastNode.getChildByName('label');
                    if (label) {
                        maxWidth = label.x + label.width;
                        label = null;
                    }
                    let fangfeiNode = lastNode.getChildByName('fangfeiNode');
                    if (fangfeiNode.active) {
                        for (let n = 0; n < fangfeiNode.children.length; n++) {
                            let label = fangfeiNode.children[n].getComponent(cc.Label);
                            if (label) {
                                maxWidth = fangfeiNode.x + label.node.x + label.node.width;
                                label = null;
                            }
                        }
                    }
                    helpNode.x = lastNode.x + maxWidth + 60;
                    helpNode.y = lastNode.y;
                }
            }
        }
    },
    getCostData: function (renshu) {//renshu =0 房主支付
        let costs = [];
        if (renshu.length != 2) {
            return costs;
        }
        let allSelectCityData = app.HeroManager().GetCurSelectCityData();
        let curselectId = allSelectCityData[0]['selcetId'];
        if (this.clubData != null) {
            curselectId = this.clubData.cityId;
            if (typeof (curselectId) == "undefined") {
                let clubDataTemp = app.ClubManager().GetClubDataByClubID(this.clubData.clubId);
                curselectId = clubDataTemp.cityId;
            }
        } else if (this.unionData != null) {
            curselectId = this.unionData.cityId;
        }
        for (let key in this.roomcostConfig) {
            if (parseInt(renshu[0]) == this.roomcostConfig[key].PeopleMin && parseInt(renshu[1]) == this.roomcostConfig[key].PeopleMax) {
                costs.push(this.roomcostConfig[key]);
            }
        }
        if (0 == costs.length) {
            app.SysNotifyManager().ShowSysMsg("获取对应城市配置失败：" + curselectId);
        }
        return costs;
    },

    getCurSelectRenShu: function () {
        let renshu = 0;
        let needIndex = -1;
        if (this.Toggles['renshu']) {
            for (let i = 0; i < this.Toggles['renshu'].length; i++) {
                let toggle = this.Toggles['renshu'][i].getChildByName('checkmark');
                if (toggle.active) {
                    needIndex = i;
                    break;
                }
            }
        }
        for (let key in this.gameCreateConfig) {
            if (this.gameType == this.gameCreateConfig[key].GameName && 'renshu' == this.gameCreateConfig[key].Key) {
                let AtRows = this.gameCreateConfig[key].ToggleDesc.toString().split(',');
                // return AtRows[needIndex].replace('人','').replace('2-','');
                let AtRowArr = [];
                AtRowArr = AtRows[needIndex].replace('人', '').split('-');
                if (AtRowArr.length == 1) {
                    //只是固定人数，没有配置浮动人数，最大最小都一样
                    AtRowArr.push(AtRowArr[0]);
                }
                return AtRowArr;
            }
        }
    },
    OnClickForm: function () {
        this.FormManager.CloseForm("UIMessageTip");
    },
    //滑动结束
    OnScrollEnded: function () {
        this.scrollTip.active = false;
    },
    //---------点击函数---------------------
    OnHelpBtnClick: function (event) {
        let btnNode = event.target;
        let btnName = btnNode.name;
        if (btnName.startsWith("btn_help")) {
            this.Click_btn_help(btnName, btnNode);
        }
    },
    Click_btn_help: function (btnName, btnNode) {
        let that = this;
        let gameType = this.gameType;
        let curIndex = btnName.substring(('btn_help0').length, btnName.length);
        let msgID = 'UIMessageTip_Help' + curIndex + '_' + gameType
        this.FormManager.ShowForm("UIMessageTip", msgID)
            .then(function (formComponent) {
                let wndSize = formComponent.GetMsgWndSize();
                let btnNodeParentPosition = btnNode.parent.convertToWorldSpaceAR(btnNode.getPosition());
                let btnX = btnNodeParentPosition.x - that.node.width / 2 - wndSize.width / 2 - btnNode.width / 2;
                let btnY = 0;
                if (wndSize.height > that.node.height / 2)
                    btnY = that.node.convertToWorldSpaceAR(that.node.getPosition()).y - that.node.height / 2;
                else
                    btnY = btnNodeParentPosition.y - that.node.height / 2;
                -wndSize.height / 2 + btnNode.height / 2;
                formComponent.SetFormPosition(cc.v2(btnX, btnY));
            })
            .catch(function (error) {
                that.ErrLog("error:%s", error.stack);
            })
    },
    filterKeyValue2Array(filterKeyValue){
        let filter = new Array();
        if (filterKeyValue.indexOf(',') > 0) {
            let mt = filterKeyValue.split(',');
            for (let i = 0; i < mt.length; i++) {
                let data2 = mt[i].split(':');
                filter.push({'key': data2[0], 'value': data2[1]});
            }
        } else {
            let data = filterKeyValue.split(':');
            let filterKey = data[0];
            let filterValue = data[1];
            filter.push({'key': data[0], 'value': data[1]});
        }
        return filter;
    },
    //操作2选1
    CheckToggle2To1: function (checkKeyValue, filterKeyValue, isChecked = false) {
        let filter = this.filterKeyValue2Array(filterKeyValue);
        for (let i = 0; i < filter.length; i++) {
            let key = filter[i].key;
            let value = filter[i].value;
            let filterKeyValueTemp = key + ":" + value;
            if(checkKeyValue == filterKeyValueTemp) continue;
            let checkmark = this.Toggles[key][value].getChildByName('checkmark');
            checkmark.active = isChecked;
        }
    },
    //操作未选中
    UnCheckToggle: function (filterKeyValue, isChecked = false) {
        let filter = this.filterKeyValue2Array(filterKeyValue);
        for (let i = 0; i < filter.length; i++) {
            let key = filter[i].key;
            let value = filter[i].value;
            let checkmark = this.Toggles[key][value].getChildByName('checkmark');
            checkmark.active = isChecked;
        }
    },
    HideShowToggle: function (filterKeyValue, isHide = true) {
        let filter = this.filterKeyValue2Array(filterKeyValue);
        for (let i = 0; i < filter.length; i++) {
            let key = filter[i].key;
            let value = filter[i].value;
            if (typeof(value) == "undefined") {
                //没有定于value，就是隐藏所有的选项
                this.Toggles[key][0].parent.active = isHide;
            } else {
                this.Toggles[key][value].active = isHide;
            }
        }
    },
    TwoOneToggle: function (filterKeyValue, isChecked) {
        let filter = this.filterKeyValue2Array(filterKeyValue);
        for (let i = 0; i < filter.length; i++) {
            let key = filter[i].key;
            let value = filter[i].value;
            this.Toggles[key][value].getChildByName('checkmark').active = isChecked;
        }
    },
    ShowToggleMessage: function (filterKeyValue, message) {
        let filter = this.filterKeyValue2Array(filterKeyValue);
        for (let i = 0; i < filter.length; i++) {
            let key = filter[i].key;
            let value = filter[i].value;
            if (this.Toggles[key][value].getChildByName('checkmark').active == false) {
                app.SysNotifyManager().ShowSysMsg(message);
                return false;
            }
        }
        return true;
    },
    //选中置灰处理
    SelectAshSisposalToggle: function (filterKeyValue, isChecked = false) {
        let filter = this.filterKeyValue2Array(filterKeyValue);
        for (let i = 0; i < filter.length; i++) {
            let key = filter[i].key;
            let value = filter[i].value;
            if(this.Toggles[key]){
                if(isChecked){
                    this.Toggles[key][value].getChildByName('checkmark').active = false;
                    if(this.Toggles[key][value].getChildByName("label")){
                        this.Toggles[key][value].getChildByName("label").color = cc.color(180, 180, 180);
                    }
                }else{
                    //恢复
                    if(this.Toggles[key][value].getChildByName("label")){
                        this.Toggles[key][value].getChildByName("label").color = cc.color(158, 49, 16);
                    }
                    //选中
                    if(this.Toggles[key][value].getChildByName("checkmark").active){
                        this.Toggles[key][value].getChildByName("label").color = cc.color(0, 155, 46);
                    }
                }
            }
        }
    },
    //未选中置灰处理
    UnSelectAshSisposalToggle: function (filterKeyValue, isChecked = false) {
        let filter = this.filterKeyValue2Array(filterKeyValue);
        for (let i = 0; i < filter.length; i++) {
            let key = filter[i].key;
            let value = filter[i].value;
            if(this.Toggles[key]){
                if(!isChecked){
                    this.Toggles[key][value].getChildByName('checkmark').active = false;
                    if(this.Toggles[key][value].getChildByName("label")){
                        this.Toggles[key][value].getChildByName("label").color = cc.color(180, 180, 180);
                    }
                }else{
                    //恢复
                    if(this.Toggles[key][value].getChildByName("label")){
                        this.Toggles[key][value].getChildByName("label").color = cc.color(158, 49, 16);
                    }
                    //选中
                    if(this.Toggles[key][value].getChildByName("checkmark").active){
                        this.Toggles[key][value].getChildByName("label").color = cc.color(0, 155, 46);
                    }
                }
            }
        }
    },

    //默认置灰选中
    DefaultSelectAshSisposalToggle: function (toggleNode) {
        toggleNode.getChildByName('checkmark').active = true;
        if(toggleNode.getChildByName("label")){
            toggleNode.getChildByName("label").color = cc.color(180, 180, 180);
        }
    },
    //默认置灰不选中
    DefaultUnSelectAshSisposalToggle: function (toggleNode) {
        toggleNode.getChildByName('checkmark').active = false;
        if(toggleNode.getChildByName("label")){
            toggleNode.getChildByName("label").color = cc.color(180, 180, 180);
        }
    },
    //检测选中的在不在检测列表里
    CheckCheckKeyValueInSelectKeyValue: function(checkKeyValue, selectKeyValue){
        let filter = this.filterKeyValue2Array(selectKeyValue);
        for (let i = 0; i < filter.length; i++) {
            let key = filter[i].key;
            let value = filter[i].value;
            let filterKeyValue = key + ":" + value;
            if(checkKeyValue == filterKeyValue){
                return true;
            }
        }
        return false;
    },

    ToggleFilter: function (key, toggleIndex) {
        for (let index = 0; index < this.gameFilter.length; index++) {
            let filterType = this.gameFilter[index].filterType;
            let selectKeyValue = this.gameFilter[index].selectKeyValue;
            let checkKeyValue = key + ":" + toggleIndex;
            if(filterType == 0){
                if(this.CheckCheckKeyValueInSelectKeyValue(checkKeyValue, selectKeyValue)){
                    //多选一
                    this.CheckToggle2To1(checkKeyValue, selectKeyValue);
                }
                continue;
            }

            let mt = selectKeyValue.split(':');
            let selectKey = mt[0];
            let selectValue = mt[1];

            let filterKeyValue = this.gameFilter[index].filterKeyValue;
            
            if (checkKeyValue == selectKeyValue) {
                if (filterType == 1 && this.Toggles[key][toggleIndex].getChildByName('checkmark').active == false) {
                    //选中不选
                    this.UnCheckToggle(filterKeyValue);
                }

                if (filterType == 2) {
                    //选中隐藏
                    this.HideShowToggle(filterKeyValue, this.Toggles[key][toggleIndex].getChildByName('checkmark').active);
                }
                if (filterType == 3) {
                    //选中显示
                    this.HideShowToggle(filterKeyValue, !this.Toggles[key][toggleIndex].getChildByName('checkmark').active);
                }
                if (filterType == 4 && this.Toggles[key][toggleIndex].getChildByName('checkmark').active == false) {
                    //选中必选另外一个
                    this.UnCheckToggle(filterKeyValue, true);
                }
                if (filterType == 5) {
                    //2选1
                    this.TwoOneToggle(filterKeyValue, this.Toggles[key][toggleIndex].getChildByName('checkmark').active);
                }
                if (filterType == 6 && this.Toggles[key][toggleIndex].getChildByName('checkmark').active == false) {
                    //未选中提示
                    return this.ShowToggleMessage(filterKeyValue, this.gameFilter[index].Memo);
                }
                this.UpdateLabelColor(this.Toggles[key][0].parent);
            } else if (key == selectKey) {
                //处理单选按钮，选中了别的选项，需要触发
                if (this.Toggles[key].toggleType == 0) {
                    //单选按钮
                    if (filterType == 2) {
                        //操D中隐藏，不选中展示
                        this.HideShowToggle(filterKeyValue, this.Toggles[key][selectValue].getChildByName('checkmark').active);
                    }
                }
            }
        }
        return true;
    },

    UpdateOnClickToggle: function () {
        for (let index = 0; index < this.gameFilter.length; index++) {
            let filterType = this.gameFilter[index].filterType;
            let selectKeyValue = this.gameFilter[index].selectKeyValue;

            if(filterType == 0){
                continue;
            }
            let mt = selectKeyValue.split(':');
            let selectKey = mt[0];
            let selectValue = mt[1];

            let filterKeyValue = this.gameFilter[index].filterKeyValue;

            let checkmark = this.Toggles[selectKey][selectValue].getChildByName('checkmark').active;
            if (filterType == 7) {
                //选中置灰处理 select选中，filter置灰
                this.SelectAshSisposalToggle(filterKeyValue, checkmark);
            }
            if (filterType == 8) {
                //未选中置灰处理 select不选选，filter置灰
                this.UnSelectAshSisposalToggle(filterKeyValue, checkmark);
            }
            if (filterType == 9) {
                //默认置灰选中
                this.DefaultSelectAshSisposalToggle(this.Toggles[selectKey][selectValue]);
            }
            if (filterType == 10) {
                //默认置灰不选中
                this.DefaultUnSelectAshSisposalToggle(this.Toggles[selectKey][selectValue]);
            }
        }
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

        let check = this.ToggleFilter(key, toggleIndex);  //点击选择过滤
        if (!check) {
            return;
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
    ClearToggleCheck: function (toggles, showIndexList) {
        for (let i = 0; i < toggles.length; i++)
            toggles[i].getChildByName('checkmark').active = false;

        if (showIndexList) {
            for (let i = 0; i < toggles.length; i++) {
                for (let j = 0; j < showIndexList.length; j++) {
                    if (i == showIndexList[j])
                        toggles[i].getChildByName('checkmark').active = true;
                }
            }
        }
    },

    //-------------点击函数-------------
    OnRightBgClick: function (event) {
        this.FormManager.CloseForm("UIMessageTip");
    },
    OnClickBtnHelp: function () {
        this.FormManager.ShowForm("UIGameHelp", this.gameType);
        this.FormManager.CloseForm("UIMessageTip");
    },
    OnClickBtnNext: function () {
        let tempObj = this.Click_btn_create(1);
        if (tempObj == null) {
            return;
        }
        this.FormManager.ShowForm("ui/club/UIUnionPLSet", this.unionData, tempObj.realGameType, tempObj.sendPack);
        this.FormManager.CloseForm("UIMessageTip");
    },
    OnClickBtnCreate: function () {
        this.Click_btn_create(1);
    },
    Event_MicPermissionOpen: function () {
        this.Click_btn_create(1, true);
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
        let setCount = needCostData[jushuIndex].SetCount;
        let sendPack = this.CreateSendPack(renshu, setCount, isSpiltRoomCard);
        if (!sendPack) {
            return null;
        }
        sendPack = this.AdjustSendPack(sendPack);
        //如果勾选了强制连麦，需要先判断是否开启麦克风权限，不如没开不能创建
        if (cc.sys.isNative && !isCheckedMic && sendPack.lianmai == 2 && !this.clubData && !this.unionData) {
            app.NativeManager().CallToNative("CheckMicPermission", [{
                "Name": "name",
                "Value": "createRoom"
            }, {"Name": "switchGameData", "Value": ""}]);
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
		if(realGameType == "sss"){
			gameId = 1;
		}
		else if (realGameType == "nn"){
			gameId = 4;
		}
		else if (realGameType == "sg"){
			gameId = 18;
		}
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


    },

    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    OnConFirm: function (clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return
        }
        if (msgID == "goBuyCard") {
            app.FormManager().ShowForm("UIStore", 'btn_table1');
        }
    },

    /**
     * 单选
     */
    GetIdxByKey: function (key) {
        if (!this.Toggles[key]) {
            return -1;
        }
        if (!this.Toggles[key].active == false) {
            return -1;
        }
        for (let i = 0; i < this.Toggles[key].length; i++) {
            let mark = this.Toggles[key][i].active && this.Toggles[key][i].getChildByName('checkmark').active;
            if (mark) {
                return i;
            }
        }
    },

    /**
     * 多选
     */
    GetIdxsByKey: function (key) {
        if (!this.Toggles[key]) {
            return [];
        }
        if (!this.Toggles[key].active == false) {
            return [];
        }
        let arr = [];
        for (let i = 0; i < this.Toggles[key].length; i++) {
            if (this.Toggles[key][i].active && this.Toggles[key][i].getChildByName('checkmark').active) {
                arr.push(i);
            }
        }
        return arr;
    },


    /**
     * 输入框
     */
    GetEditBoxByKey: function (key) {
        if (!this.Toggles[key]) {
            return false;
        }
        if (!this.Toggles[key].active == false) {
            return false;
        }

        let enterList = [];
        for (let i = 0; i < this.Toggles[key].length; i++) {
            let value = parseInt(this.Toggles[key][i].getChildByName('editboxEX').getComponent(cc.EditBox).string);
            let minEnter = this.Toggles[key][i].getChildByName('editboxEX').minEnter;
            let maxEnter = this.Toggles[key][i].getChildByName('editboxEX').maxEnter;
            if (value === "") {
                enterList.push(minEnter, maxEnter);
                return enterList;
            }

            value = Number(value);
            if (isNaN(value)) {
                enterList.push(minEnter, maxEnter);
                return enterList;
            }

            if (!Number.isInteger(value)) {
                enterList.push(minEnter, maxEnter);
                return enterList;
            }
            if (value < minEnter ||
                value > maxEnter) {
                enterList.push(minEnter, maxEnter);
                return enterList;
            }
            return value;
        }
    },
    // =========================== 子类可重写接口 ===========================

    CreateSendPack: function (renshu, setCount, isSpiltRoomCard) {
        let sendPack = {};
        sendPack = {
            "playerMinNum": renshu[0],
            "playerNum": renshu[1],
            "setCount": setCount,
            "paymentRoomCardType": isSpiltRoomCard,
        };
        for (let key in this.gameCreateConfig) {
            let dataKey = this.gameCreateConfig[key].Key;
            if (dataKey == "fangfei" || dataKey == "renshu" || dataKey == "jushu") {
                continue;
            }
            if (0 == this.gameCreateConfig[key].ToggleType) {
                //单选
                sendPack[dataKey] = this.GetIdxByKey(dataKey);
            }
            if (1 == this.gameCreateConfig[key].ToggleType) {
                //多选
                sendPack[dataKey] = this.GetIdxsByKey(dataKey);
            }
            if (2 == this.gameCreateConfig[key].ToggleType) {
                //输入框GetEditBoxByKey
                let editBox = this.GetEditBoxByKey(dataKey);
                if (editBox && editBox.length == 2) {
                    app["SysNotifyManager"]().ShowSysMsg("请检查输入的区间值是否为" + editBox[0] + "_" + editBox[1]);
                    return;
                } else {
                    sendPack[dataKey] = this.GetEditBoxByKey(dataKey);

                }
            }

        }
        return sendPack;

    },

    AdjustSendPack: function (sendPack) {
        return sendPack;
    },

    /**
     this.RemoveRadioSelect(sendPack, "kexuanwanfa");
     * 单选
     * @param {*} sendPack
     * @param {*} name
     */
    RemoveRadioSelect: function (sendPack, name) {
        sendPack[name] = -1;
        return sendPack;
    },

    /**
     this.RemoveMultiSelect(sendPack, "kexuanwanfa", 4);
     * 多选
     * @param {*} sendPack
     * @param {*} name
     * @param {*} idx
     */
    RemoveMultiSelect: function (sendPack, name, idx) {
        var index = sendPack[name].indexOf(idx);
        if (-1 != index) {
            sendPack[name].splice(index, 1);
        }
        return sendPack;
    },

    OnUpdateTogglesLabel: function (TogglesNode, isResetPos = true) {

    },


});

module.exports = BaseChildCreateRoom;