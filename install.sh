#!/bin/bash

# 设置最大和最小支持版本号
readonly max_support_version="6.0.2"
readonly min_support_version="4.3.6"

# 获取当前脚本运行目录并切换到工作目录
base_path=$(cd "$(dirname "$0")" || exit; pwd)
cd "$base_path" || exit

# 获取主程序安装路径
main_app_path=""
if [ -d "/Applications/Royal TSX.app" ]; then
    main_app_path="/Applications/Royal TSX.app"
elif [ -d "$HOME/Applications/Royal TSX.app" ]; then
    main_app_path="$HOME/Applications/Royal TSX.app"
else
    echo -e "\033[31m主程序未安装!\033[0m"
    exit 1
fi

# 获取主程序版本号
get_version() {
    defaults read "$1/Contents/Info.plist" CFBundleShortVersionString
}

# 检查主程序版本是否在支持范围内
check_version() {
    local current_version="$1"
    local min_version="$2"
    local max_version="$3"

    if [[ "$current_version" > "$max_version" ]]; then
        echo -e "\033[31m主程序版本不匹配，本程序支持的最大版本号为:${max_version}，当前安装的版本为:${current_version}!\033[0m"
        exit 1
    elif [[ "$current_version" < "$min_version" ]]; then
        echo -e "\033[31m主程序版本不匹配，本程序支持的最小版本号为:${min_version}，当前安装的版本为:${current_version}!\033[0m"
        exit 1
    else
        echo "主程序版本匹配，当前安装的版本为:${current_version}"
    fi
}

# 汉化主程序
translate_main_app() {
    cp -R Main\ Application/* "$1/Resources/"
    echo "主程序汉化完成!"
}

# 汉化插件
translate_plugins() {
    local plugin_list=("$@")
    echo "目前共有${#plugin_list[@]}个插件支持汉化，开始检查并汉化，请留意后续汉化进度。"
    for plugin in "${plugin_list[@]}"; do
        # 获取 UUID 和名称
        uuid=$(echo "${plugin}" | cut -d':' -f1)
        name=$(echo "${plugin}" | cut -d':' -f2)
        if [ -d "$HOME/Library/Application Support/Royal TSX/Plugins/Installed/$uuid.plugin" ]; then
            cp -r "Plugins/$uuid.plugin/Contents/Resources/" "$HOME/Library/Application Support/Royal TSX/Plugins/Installed/$uuid.plugin/Contents/Resources"
            echo "${name}插件汉化完成!"
        else
            echo -e "\033[33m${name}插件未安装!\033[0m"
        fi
    done
}

# 汉化插件中心
translate_plugin_gallery() {
    cp -rf "$1"/* "$2/Resources/PluginGallery/"
    echo "插件中心汉化完成!"
}

# 汉化入门简介
translate_getting_started() {
    cp -rf GettingStarted/* "$1/Resources/GettingStarted/"
    echo "入门简介汉化完成!"
}

version=$(get_version "$main_app_path")

check_version "$version" "$min_support_version" "$max_support_version"

# 设置其他路径和插件中心路径
other_path=""
plugin_gallery_path="PluginGallery"
if [[ "$version" < "6.0.0" ]]; then
    other_path="$main_app_path/Contents"
else
    other_path="$main_app_path/Contents/Frameworks/RoyalTSXNativeUI.framework/Versions/A"
    plugin_gallery_path="PluginGallery-6.x"
fi

# 插件列表
plugins=(
    "1c919170-3ee3-437f-9326-a2316a9293a0:RDP"
    "3e63afa6-61f6-4f9f-85bf-a773ab0408b0:File Transfer"
    "4a376bc0-9c23-11e1-a8b0-0800200c9a66:Web (based on WebKit)"
    "6b941bae-bff5-46a3-8a40-91ca66c54c89:Windows Events View"
    "7c84a650-9896-11e1-a8b0-0800200c9a66:Terminal (based on iTerm2)"
    "9e13c958-7515-4ddd-b914-e00f77dd609b:VMware"
    "21e6e2a4-50e7-49a9-a1b9-56e2eb6f9640:PowerShell"
    "651a0888-d654-4d6e-b3c5-355fc392f3c9:Hyper-V"
    "49253779-c4b7-43c0-bf33-0654f1589481:Windows Services"
    "53945263-2109-409b-b682-90c282be9b58:TeamViewer"
    "b395595d-c20f-49b6-87a0-375d8d8b052c:Windows Processes"
    "c96b0f90-98be-456e-acc6-b9ee3896ffb5:VNC (based on Apple Screen Sharing)"
    "dfd69050-9897-11e1-a8b0-0800200c9a66:VNC (based on Chicken)"
    "ecda13f4-a5b5-4791-a027-b947008c943f:Terminal Services"
)

# 汉化主程序
translate_main_app "$main_app_path"
# 汉化插件中心及其它
translate_plugin_gallery "$plugin_gallery_path" "$other_path"
# 汉化入门简介
translate_getting_started "$other_path"
# 汉化插件
translate_plugins "${plugins[@]}"
