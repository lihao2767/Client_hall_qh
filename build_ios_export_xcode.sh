#!/bin/bash
# 关闭严格失败退出，方便输出错误日志排查
set +e

COCOS_APP="/Applications/CocosCreator.app"
# 定义安装包路径
DMG_FILE="/tmp/cocos.dmg"

# 1. 先判断是否已经安装Cocos，避免重复下载
if [ -d "$COCOS_APP" ];then
    echo "✅ CocosCreator 已存在，跳过下载安装步骤"
else
    echo "🔽 开始下载 Cocos Creator 2.2.2 安装包"
    # 增加超时、重试参数，提升海外节点下载稳定性
    curl --connect-timeout 60 --max-time 600 --retry 3 -L -o "$DMG_FILE" https://download.cocos.com/CocosCreator/v2.2.2/CocosCreator_v2.2.2_mac.dmg

    # 校验文件大小，低于100MB判定为下载失败（安装包实际大小约300MB）
    FILE_SIZE=$(du -m "$DMG_FILE" | awk '{print $1}')
    if [ "$FILE_SIZE" -lt 100 ];then
        echo "❌ Cocos安装包下载失败，文件仅${FILE_SIZE}MB，属于错误页面，终止构建"
        exit 1
    fi
    echo "✅ 安装包下载完成，文件大小：${FILE_SIZE}MB"

    # 挂载安装包并安装
    hdiutil attach "$DMG_FILE" -nobrowse -quiet
    cp -R /Volumes/CocosCreator_v2.2.2/CocosCreator.app /Applications/
    hdiutil detach /Volumes/CocosCreator_v2.2.2
    rm -f "$DMG_FILE"
    sudo xcodebuild -license accept
    echo "✅ CocosCreator 安装完成"
fi

# 2. 杀掉残留Cocos进程，防止端口占用导出失败
export DISPLAY=
export QT_QPA_PLATFORM=offscreen
pkill -9 -f CocosCreator 2>/dev/null || true

# 3. 执行iOS Xcode工程导出
echo "🔨 开始导出iOS Xcode工程"
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path "$AC_REPOSITORY_DIR" --build "platform=ios;debug=false;template=default;md5Cache=true;encryptJs=false;xxteaKey=df124dde-c814-4b"

# 校验是否成功生成build目录
if [ ! -d "$AC_REPOSITORY_DIR/build" ];then
    echo "❌ Xcode工程导出失败，build文件夹未生成"
    exit 1
fi

# 4. 批量配置iOS隐私权限
INFO_PLIST=$(find "$AC_REPOSITORY_DIR/build" -name "Info.plist" | head -1)
if [ -f "$INFO_PLIST" ];then
/usr/libexec/PlistBuddy -c "Add :NSLocationWhenInUseUsageDescription string '用于高德地图定位服务'" "$INFO_PLIST" 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Set :NSLocationWhenInUseUsageDescription '用于高德地图定位服务'" "$INFO_PLIST"
/usr/libexec/PlistBuddy -c "Add :NSCameraUsageDescription string '需要使用相机'" "$INFO_PLIST" 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Set :NSCameraUsageDescription '需要使用相机'" "$INFO_PLIST"
/usr/libexec/PlistBuddy -c "Add :NSPhotoLibraryUsageDescription string '需要访问相册'" "$INFO_PLIST" 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Set :NSPhotoLibraryUsageDescription '需要访问相册'" "$INFO_PLIST"
/usr/libexec/PlistBuddy -c "Add :NSMicrophoneUsageDescription string '需要使用麦克风'" "$INFO_PLIST" 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Set :NSMicrophoneUsageDescription '需要使用麦克风'" "$INFO_PLIST"
fi

# 5. 压缩Xcode工程包
cd "$AC_REPOSITORY_DIR/build"
zip -r ios_xcode_project.zip .
echo "✅ Xcode工程压缩完成，等待上传构建产物"
