#!/bin/bash
set -e

# 1. 安装 Cocos Creator 2.2.2
COCOS_APP="/Applications/CocosCreator.app"
if [ ! -d "$COCOS_APP" ];then
curl -L -o /tmp/cocos.dmg https://download.cocos.com/CocosCreator/v2.2.2/CocosCreator_v2.2.2_mac.dmg
hdiutil attach /tmp/cocos.dmg -nobrowse -quiet
cp -R /Volumes/CocosCreator_v2.2.2/CocosCreator.app /Applications/
hdiutil detach /Volumes/CocosCreator_v2.2.2
rm -f /tmp/cocos.dmg
sudo xcodebuild -license accept
fi

# 2. 结束残留 Cocos 进程，导出 iOS Xcode 工程
export DISPLAY=
export QT_QPA_PLATFORM=offscreen
pkill -9 -f CocosCreator 2>/dev/null || true
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path "$(pwd)" --build "platform=ios;debug=false;template=default;md5Cache=true;encryptJs=false;xxteaKey=df124dde-c814-4b"

# 3. 批量配置 iOS 隐私权限
INFO_PLIST=$(find "$(pwd)/build" -name "Info.plist" | head -1)
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

# 4. 压缩 Xcode 工程方便下载
cd "$(pwd)/build"
zip -r ios_xcode_project.zip .
