#!/bin/bash

# 汉化主程序
cp -r Main\ Application/* /Applications/Royal\ TSX.app/Contents/Resources/
echo "主程序汉化完成!"

# 汉化RDP插件
cp -r Plugins/Remote\ Desktop\ \(based\ on\ FreeRDP\)/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/1c919170-3ee3-437f-9326-a2316a9293a0.plugin/Contents/Resources
echo "RDP插件汉化完成!"

# 汉化File Transfer插件
cp -r Plugins/File\ Transfer/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/3e63afa6-61f6-4f9f-85bf-a773ab0408b0.plugin/Contents/Resources
echo "File Transfer插件汉化完成!"

# 汉化Web (based on WebKit)插件
cp -r Plugins/Web\ \(based\ on\ WebKit\)/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/4a376bc0-9c23-11e1-a8b0-0800200c9a66.plugin/Contents/Resources
echo "Web (based on WebKit)插件汉化完成!"

# 汉化Windows Events View插件
cp -r Plugins/Windows\ Events\ View/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/6b941bae-bff5-46a3-8a40-91ca66c54c89.plugin/Contents/Resources
echo "Windows Events View插件汉化完成!"

# 汉化Terminal (based on iTerm2)插件
cp -r Plugins/Terminal\ \(based\ on\ iTerm2\)/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/7c84a650-9896-11e1-a8b0-0800200c9a66.plugin/Contents/Resources
echo "Terminal (based on iTerm2)插件汉化完成!"

# 汉化VMware插件
cp -r Plugins/VMware/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/9e13c958-7515-4ddd-b914-e00f77dd609b.plugin/Contents/Resources
echo "VMware插件汉化完成!"

# 汉化PowerShell插件
cp -r Plugins/PowerShell/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/21e6e2a4-50e7-49a9-a1b9-56e2eb6f9640.plugin/Contents/Resources
echo "PowerShell插件汉化完成!"

# 汉化Hyper-V插件
cp -r Plugins/Hyper-V/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/651a0888-d654-4d6e-b3c5-355fc392f3c9.plugin/Contents/Resources
echo "Hyper-V插件汉化完成!"

# 汉化Windows Services插件
cp -r Plugins/Windows\ Services/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/49253779-c4b7-43c0-bf33-0654f1589481.plugin/Contents/Resources
echo "Windows Services插件汉化完成!"

# 汉化TeamViewer插件
cp -r Plugins/TeamViewer/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/53945263-2109-409b-b682-90c282be9b58.plugin/Contents/Resources
echo "TeamViewer插件汉化完成!"

# 汉化Windows Processes插件
cp -r Plugins/Windows\ Processes/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/b395595d-c20f-49b6-87a0-375d8d8b052c.plugin/Contents/Resources
echo "Windows Processes插件汉化完成!"

# 汉化VNC (based on Apple Screen Sharing)插件
cp -r Plugins/VNC\ \(based\ on\ Apple\ Screen\ Sharing\)/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/c96b0f90-98be-456e-acc6-b9ee3896ffb5.plugin/Contents/Resources
echo "VNC (based on Apple Screen Sharing)插件汉化完成!"

# 汉化VNC (based on Chicken)插件
cp -r Plugins/VNC\ \(based\ on\ Chicken\)/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/dfd69050-9897-11e1-a8b0-0800200c9a66.plugin/Contents/Resources
echo "VNC (based on Chicken)插件汉化完成!"

# 汉化Terminal Services插件
cp -r Plugins/Terminal\ Services/* ~/Library/Application\ Support/Royal\ TSX/Plugins/Installed/ecda13f4-a5b5-4791-a027-b947008c943f.plugin/Contents/Resources
echo "Terminal Services插件汉化完成!"