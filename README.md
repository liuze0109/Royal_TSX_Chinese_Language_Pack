# Royal_TSX_Chinese_Language_Pack
Royal_TSX的简体中文汉化包，适用于macOS系统。汉化过程中，以谷歌汉化为主，真人汉化为辅，如有汉化不准确的地方，欢迎大家提出改正。

## 一、适用平台

本中文汉化包是为Royal_TSX制作而成，适用于MACOS版本的Royal_TSX。

## 二、使用方法

### 1、主程序汉化

1. 使用finder（访达）打开应用程序文件夹，找到Royal TSX 应用。
2. 在Royal TSX 应用图标上面点击右键，点击“显示包内容”。
3. 依次进入“Contents”>“Resources”文件夹。
4. 把本项目目录“Main Application”下面的“zh_Hans.lproj”复制到“Resources”文件夹内。
5. 关闭Royal TSX 程序，并重新启动应用即可。

### 2、插件汉化

以RDP插件为例，完整的插件路径可能是如下所示：

~/Library/Application Support/Royal TSX/Plugins/Installed/1c919170-3ee3-437f-9326-a2316a9293a0.plugin/Contents/Resources

其中“Resources”文件夹下的“en.lproj”就代表的是英文语言包。我们需要创建“zh_Hans.lproj”所对应的中文语言包。

【注意】：这里的插件文件夹可能是每台电脑安装后随机生成的，这点有待验证。

|              插件名称               | 路径（可能并不准确）                                         |
| :---------------------------------: | ------------------------------------------------------------ |
|                 RDP                 | ~/Library/Application Support/Royal TSX/Plugins/Installed/1c919170-3ee3-437f-9326-a2316a9293a0.plugin/Contents/Resources |
|            File Transfer            | ~/Library/Application Support/Royal TSX/Plugins/Installed/3e63afa6-61f6-4f9f-85bf-a773ab0408b0.plugin/Contents/Resources |
|        Web (based on WebKit)        | ~/Library/Application Support/Royal TSX/Plugins/Installed/4a376bc0-9c23-11e1-a8b0-0800200c9a66.plugin/Contents/Resources |
|         Windows Events View         | ~/Library/Application Support/Royal TSX/Plugins/Installed/6b941bae-bff5-46a3-8a40-91ca66c54c89.plugin/Contents/Resources |
|     Terminal (based on iTerm2)      | ~/Library/Application Support/Royal TSX/Plugins/Installed/7c84a650-9896-11e1-a8b0-0800200c9a66.plugin/Contents/Resources |
|               VMware                | ~/Library/Application Support/Royal TSX/Plugins/Installed/9e13c958-7515-4ddd-b914-e00f77dd609b.plugin/Contents/Resources |
|             PowerShell              | ~/Library/Application Support/Royal TSX/Plugins/Installed/21e6e2a4-50e7-49a9-a1b9-56e2eb6f9640.plugin/Contents/Resources |
|               Hyper-V               | ~/Library/Application Support/Royal TSX/Plugins/Installed/651a0888-d654-4d6e-b3c5-355fc392f3c9.plugin/Contents/Resources |
|          Windows Services           | ~/Library/Application Support/Royal TSX/Plugins/Installed/49253779-c4b7-43c0-bf33-0654f1589481.plugin/Contents/Resources |
|             TeamViewer              | ~/Library/Application Support/Royal TSX/Plugins/Installed/53945263-2109-409b-b682-90c282be9b58.plugin/Contents/Resources |
|          Windows Processes          | ~/Library/Application Support/Royal TSX/Plugins/Installed/b395595d-c20f-49b6-87a0-375d8d8b052c.plugin/Contents/Resources |
| VNC (based on Apple Screen Sharing) | ~/Library/Application Support/Royal TSX/Plugins/Installed/c96b0f90-98be-456e-acc6-b9ee3896ffb5.plugin/Contents/Resources |
|       VNC (based on Chicken)        | ~/Library/Application Support/Royal TSX/Plugins/Installed/dfd69050-9897-11e1-a8b0-0800200c9a66.plugin/Contents/Resources |
|          Terminal Services          | ~/Library/Application Support/Royal TSX/Plugins/Installed/ecda13f4-a5b5-4791-a027-b947008c943f.plugin/Contents/Resources |

1. 找到插件所在的资源文件。
2. 复制本目录“Plugins”下面所对应的插件汉化文件夹到对应插件资源文件夹下。
3. 重启Royal TSX 程序即可。

### 3、插件中心汉化

1. 使用finder（访达）打开应用程序文件夹，找到Royal TSX 应用。
2. 在Royal TSX 应用图标上面点击右键，点击“显示包内容”。
3. 依次进入“Contents”>“Resources”文件夹。
4. 把“zh_Hans.lproj”复制进来，但是目前并不生效，正在寻找解决办法。

## 三、更新日志

2020-11-18  更新日志

V4.3.6 版本适配