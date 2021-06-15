$(document).ready(function() {
	pluginGallery.init();
});

var pluginGallery = {
	OPERATION_GETINSTALLEDPLUGINS:	"getInstalledPlugins",
	OPERATION_GETAVAILABLEPLUGINS:	"getAvailablePlugins",
	OPERATION_GETUPDATEABLEPLUGINS:	"getUpdateablePlugins",
	
	APPPLATFORM_OSX:		"osx",
	APPPLATFORM_WIN:		"win",
	APPPLATFORM_IOS:		"ios",
	APPPLATFORM_ANDROID:	"android",

	ANIMATION_SPEED: "fast",
	UPDATES_BAR_HEIGHT_HIDDEN: 0,
	UPDATES_BAR_HEIGHT_VISIBLE: 42,
	
	appPlatform: "",
	appVersion: "",
	language: "",
	darkMode: false,
	accentColor: "0e7afe",
	
	installedPlugins: null,
	availablePlugins: null,
	updateablePlugins: null,
	
	currentOperation: "",
	
	init: function () {
		// Read QueryString Arguments
		
		pluginGallery.language = "en";
		var langQ = utils.getParameter("language");
		
		if (langQ) {
			pluginGallery.language = langQ;
		}
		pluginGallery.language = "cn";
		pluginGallery.appPlatform = pluginGallery.APPPLATFORM_OSX;
		var appPlatQ = utils.getParameter("appPlatform");
		
		if (appPlatQ) {
			pluginGallery.appPlatform = appPlatQ;
		}
		
		pluginGallery.appVersion = "0.0.0.0";
		var appVersionQ = utils.getParameter("appVersion");
		
		if (appVersionQ) {
			pluginGallery.appVersion = appVersionQ;
		}

		pluginGallery.darkMode = false;
		var darkModeQ = utils.getParameter("darkMode");

		if (darkModeQ == "true") {
			pluginGallery.darkMode = true;
		}

		var accentColorQ = utils.getParameter("accentColor");

		if (accentColorQ) {
			pluginGallery.accentColor = accentColorQ;
		}
		
		pluginGallery.loadCss();
		
		language.init(pluginGallery.language);
		pluginGallery.loadLanguage();
		
		pluginGallery.bindEventHandlers();

		if (!royalAppProxy.isAvailable()) {
			pluginGallery.getPluginServiceUrl();

			pluginGallery.configureAdditionalElements();
			
			pluginService.appVersion = pluginGallery.appVersion;
			pluginService.baseUrl = config.pluginServiceBaseUrl;
			pluginService.timeOutAfterMs = config.timeOutAfterMs;

			pluginGallery.switchToInstalled(true);
		}
	},

	initRoyalAppProxy: function(pluginServiceBaseUrl, featuresAllPluginsUrl, installedPluginInfosJsonBase64) {
		royalAppProxy.pluginServiceBaseUrl = pluginServiceBaseUrl;
		royalAppProxy.featuresAllPluginsUrl = featuresAllPluginsUrl;
		royalAppProxy.installedPluginInfosJson = installedPluginInfosJsonBase64;

		pluginGallery.getPluginServiceUrl();

		pluginGallery.configureAdditionalElements();
		
		pluginService.appVersion = pluginGallery.appVersion;
		pluginService.baseUrl = config.pluginServiceBaseUrl;
		pluginService.timeOutAfterMs = config.timeOutAfterMs;

		pluginGallery.switchToInstalled(true);
	},
	
	loadLanguage: function () {
		$(".ts_localize").each(function() {
			$(this).html(language.get($(this).html()));
		});
	},
	
	loadCss: function () {
		if (pluginGallery.appPlatform == pluginGallery.APPPLATFORM_OSX) {
			if (pluginGallery.darkMode) {
				$("link").attr("href", "css/osx_dark.css");
			} else {
				$("link").attr("href", "css/osx.css");
			}
		}

		var installedToolbarButtonStyle = ".ts_toolbar_button_installed.ts_toolbar_button_active .ts_toolbar_button_icon { background-image: url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 25.99 20.99\"%3E%3Cdefs%3E%3Cstyle%3E.fill%7Bfill:%230e7afe;fill-rule:evenodd;%7D%3C/style%3E%3C/defs%3E%3Cg%3E%3Cg%3E%3Cpath class=\"fill\" d=\"M0,10.49,5.2,5.24l5.2,5.25L20.79,0,26,5.25,10.4,21Z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); }";
		var availableToolbarButtonStyle = ".ts_toolbar_button_available.ts_toolbar_button_active .ts_toolbar_button_icon { background-image: url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 25 20\"%3E%3Cdefs%3E%3Cstyle%3E.fill%7Bfill:%230e7afe;fill-rule:evenodd;%7D%3C/style%3E%3C/defs%3E%3Cg%3E%3Cg%3E%3Cpath class=\"fill\" d=\"M24.64,19.14a2,2,0,0,1-2.8.51L13.55,14a2,2,0,0,1-.87-1.72,7.19,7.19,0,0,1-4,2.18,7.31,7.31,0,0,1-5.49-1.17A7.24,7.24,0,0,1,1.3,3.13,7.38,7.38,0,0,1,11.5,1.29a7.26,7.26,0,0,1,2.42,9.18,2,2,0,0,1,1.93.2l8.28,5.69A2,2,0,0,1,24.64,19.14ZM12.36,6.36A5.07,5.07,0,0,0,10.24,3.1,5.15,5.15,0,0,0,3.13,4.38a5,5,0,0,0,1.29,7.06,5.15,5.15,0,0,0,7.12-1.28A5.06,5.06,0,0,0,12.36,6.36Z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); }";
		var progressToolbarButtonStyle = ".ts_toolbar_progress { background-image: url('data:image/svg+xml,%3Csvg width=\"32px\" height=\"32px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"lds-dual-ring\" style=\"background: none;\"%3E%3Ccircle cx=\"50\" cy=\"50\" ng-attr-r=\"%7B%7Bconfig.radius%7D%7D\" ng-attr-stroke-width=\"%7B%7Bconfig.width%7D%7D\" ng-attr-stroke=\"%7B%7Bconfig.stroke%7D%7D\" ng-attr-stroke-dasharray=\"%7B%7Bconfig.dasharray%7D%7D\" fill=\"none\" stroke-linecap=\"round\" r=\"41\" stroke-width=\"14\" stroke=\"%230e7afe\" stroke-dasharray=\"64.40264939859075 64.40264939859075\" transform=\"rotate(330 50 50)\"%3E%3CanimateTransform attributeName=\"transform\" type=\"rotate\" calcMode=\"linear\" values=\"0 50 50;360 50 50\" keyTimes=\"0;1\" dur=\"1.4s\" begin=\"0s\" repeatCount=\"indefinite\"%3E%3C/animateTransform%3E%3C/circle%3E%3C/svg%3E'); }";

		installedToolbarButtonStyle = installedToolbarButtonStyle.replace("0e7afe", pluginGallery.accentColor);
		availableToolbarButtonStyle = availableToolbarButtonStyle.replace("0e7afe", pluginGallery.accentColor);
		progressToolbarButtonStyle = progressToolbarButtonStyle.replace("0e7afe", pluginGallery.accentColor);

		var allStyles = installedToolbarButtonStyle + "\n" + availableToolbarButtonStyle + "\n" + progressToolbarButtonStyle;

		pluginGallery.injectStyles(allStyles);
	},

	injectStyles: function(rule) {
  		var div = $("<div />", {
    		html: '<style>' + rule + '</style>'
  		});

  		div.appendTo("body");
	},
	
	getPluginServiceUrl: function() {
		if (royalAppProxy.isAvailable()) {
			config.pluginServiceBaseUrl = royalAppProxy.getPluginServiceBaseUrl();
		}
	},

	configureAdditionalElements: function() {
		if (royalAppProxy.isAvailable()) {
			config.featuresAllPluginsUrl = royalAppProxy.getFeaturesAllPluginsUrl();
		}

		$(".ts_plugins_more_info_button").attr("href", config.featuresAllPluginsUrl);
	},
	
	getInstalledPlugins: function(isStartup) {
		pluginGallery.currentOperation = pluginGallery.OPERATION_GETINSTALLEDPLUGINS;
		
		if (royalAppProxy.isAvailable()) {
			pluginGallery.setInstalledPlugins(royalAppProxy.getInstalledPluginInfos(), isStartup);
		} else { // TODO: Just for debugging without App
			// No Plugins
			//pluginGallery.setInstalledPlugins(null, isStartup);
			
			// Test Plugins
			pluginGallery.setInstalledPlugins(JSON.parse('[{"ID":"a6330510-982c-11e1-a8b0-0800200c9a66","PluginVersion":"0.2.9.1","MinAppVersion":"0.6.3.0","MaxAppVersion":"9999.0.0.0","State":1,"ExtendedPluginInfo":{"ID":"a6330510-982c-11e1-a8b0-0800200c9a66","Name":"RDP Plugin (CoRD/rdesktop)","ShortDescription":"This is the official Royal TSX RDP Plugin.","Description":"<i>This is the official Royal TSX RDP Plugin.</i><br /><br />It is based on CoRD/rdesktop and provides all the basic features of the RDP protocol.","SupportedProtocols":"RDP","ObjectTypeName":null,"Version":"0.2.9.1","MinAppVersion":"0.6.3.0","MaxAppVersion":"9999.0.0.0","PluginURL":"https://www.royalapps.com/ts/mac","UpdateURL":"Plugins/Content/a6330510-982c-11e1-a8b0-0800200c9a66/0.2.9.1/a6330510-982c-11e1-a8b0-0800200c9a66.prm","PublisherName":"Royal Apps","PublisherURL":"https://www.royalapps.com","PublisherEMail":"office@royalapps.com","SupportURL":"https://www.royalapps.com/go/support","SupportEMail":"support+royaltsx@royalapps.com","LicenseType":"GPL V2","LicenseURL":"http://www.gnu.org/licenses/gpl-2.0.html","Icon48Data":"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","Icon256Data":null,"BundleURL":"Plugins/Content/a6330510-982c-11e1-a8b0-0800200c9a66/0.2.9.1/a6330510-982c-11e1-a8b0-0800200c9a66.prm","ReleaseNotesURL":"Plugins/Content/a6330510-982c-11e1-a8b0-0800200c9a66/0.2.9.1/a6330510-982c-11e1-a8b0-0800200c9a66.plugin/Resources/ReleaseNotes.txt"}},{"ID":"1c919170-3ee3-437f-9326-a2316a9293a0","PluginVersion":"0.3.0.1","MinAppVersion":"0.6.4.0","MaxAppVersion":"9999.0.0.0","State":1,"ExtendedPluginInfo":{"ID":"1c919170-3ee3-437f-9326-a2316a9293a0","Name":"RDP Plugin (FreeRDP)","Description":"This is the official Royal TSX RDP Plugin. It is based on FreeRDP and provides most features of the RDP protocol.","SupportedProtocols":"RDP","ObjectTypeName":"RoyalRDSConnection","Version":"0.3.0.1","MinAppVersion":"0.6.4.0","MaxAppVersion":"9999.0.0.0","PluginURL":"https://www.royalapps.com/ts/mac","UpdateURL":"Plugins/Content/1c919170-3ee3-437f-9326-a2316a9293a0/0.3.0.1/1c919170-3ee3-437f-9326-a2316a9293a0.prm","PublisherName":"Royal Apps","PublisherURL":"https://www.royalapps.com","PublisherEMail":"office@royalapps.com","SupportURL":"https://www.royalapps.com/go/support","SupportEMail":"support+royaltsx@royalapps.com","LicenseType":"Apache License 2.0","LicenseURL":"http://www.apache.org/licenses/LICENSE-2.0.html","Icon48Data":"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","Icon256Data":null,"BundleURL":"Plugins/Content/1c919170-3ee3-437f-9326-a2316a9293a0/0.3.0.1/1c919170-3ee3-437f-9326-a2316a9293a0.prm","ReleaseNotesURL":"Plugins/Content/1c919170-3ee3-437f-9326-a2316a9293a0/0.3.0.1/1c919170-3ee3-437f-9326-a2316a9293a0.plugin/Resources/ReleaseNotes.txt"}},{"ID":"7c84a650-9896-11e1-a8b0-0800200c9a66","PluginVersion":"0.3.6.1","MinAppVersion":"0.6.4.0","MaxAppVersion":"9999.0.0.0","State":1,"ExtendedPluginInfo":{"ID":"7c84a650-9896-11e1-a8b0-0800200c9a66","Name":"Terminal Plugin (iTerm)","Description":"This is the official Royal TSX Terminal Plugin. It is based on iTerm and provides support for connecting to servers running either SSH or Telnet.","SupportedProtocols":"SSH;Telnet","ObjectTypeName":"RoyalSSHConnection","Version":"0.3.6.1","MinAppVersion":"0.6.4.0","MaxAppVersion":"9999.0.0.0","PluginURL":"https://www.royalapps.com/ts/mac","UpdateURL":"Plugins/Content/7c84a650-9896-11e1-a8b0-0800200c9a66/0.3.6.1/7c84a650-9896-11e1-a8b0-0800200c9a66.prm","PublisherName":"Royal Apps","PublisherURL":"https://www.royalapps.com","PublisherEMail":"office@royalapps.com","SupportURL":"https://www.royalapps.com/go/support","SupportEMail":"support+royaltsx@royalapps.com","LicenseType":"GPL V2","LicenseURL":"http://www.gnu.org/licenses/gpl-2.0.html","Icon48Data":"iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAALMklEQVRoBe1ZS4wcVxW9VV3Vv+n2jMf2jOOA8UfBQkgBpCAMQpEFC8jC2SBZIWLBJytLETsiJDbeskDyyqwRsEQIL5BYIAEbCJKxFCRCiC0bx/E48+uZ7p7+V3HOfe++rqn4wy62lOfpqlfv3nfvuZ9336tylOe5PM0tfprBE/vHBnzUEYwMwMWLF39+9uzZL929e/cOxnQ8ihyZ64R9u9ucR93LvOXn8tzH0ckPnvzIkSOrd+7cuX3p0qULHAsG3LhxIz916hTHnvjW7/el1Wop9sTQbm9vZ+jH6+vrUqlUbFjv/493ihMsWsWxB/VdhFkFGV1yPLoiZnkmhw8dls3NzSAuGHD58mU5efKkEuPYre2Igr1QSyd9pO3QZbQgzXeK84xGJzyqkawZi06RU5+oy89fXFwUOtlaSKE0TbPpdBoZozE8wff9KfTFF16Q9oEDMhyM/Mqg2Q4+vRDliAanRDOlZ6zAUaZeQ2TpInF39vXRdXC1VnZOJpjIuYVW5jGSjddqNen1enL9+nUlhRSazmYyG89kMh1LnMQybc2k1qlKZRJL/+iexN1YoiGMSGFMJZaUBjWxVihhjLGeyCiB8VPYNSEub71HYAAMkBppPGT1uZBlbmZIDZCYPS6VcmF6I1OCmGAA8k/TnJdZO5Oltbbc/O6adI4O5Suvf1rWP7+NSZkko1T6pwfyzovvSXVcVUGTZCbJIJITf1gR2aIy79kKYPjcZX77rlNOhGZjES2GS49+bczZnQB3nRuQYVpMr+ZSz2qSLlflnW/8V+RTHXl7oyXLf2xIvFNB4sSSHcxl4/QGwNac1DrSKk/lZOuoyLb6Cp6KStnx4aWtHmPqEUvRID6zkCAaj2uu3HiuPM4lQfokS4lcvfp7BS/vH5G3v39Ntp7vS30tFdjmQrW1IPVuU3/SaUq8i2hUgSKFLVQOVMREkAqUOnyf0eCPLbcxcHMsjjwkgHe9IsRIS3yQh/nzCIA9gtdam2358+v/gYaZvPKdCzIcDWQ36cl4NJPhiYkkeeIAYQFzUSsO9CtArqAAXFVinfCZOc1GpeppzSOdhVGsHaXaBU8RuCiDhuCRsqLI7UszrlP8TCZnBfOoTJUkmRy7v6AS//Tav9Sr9c2agmWEHAqSK4LEeUDbD0kZ/L7C6cX2AE4FzY00wvpxWZTJZDKR4XAog8FA9vb2ZDRCsfAtGCCYEGEd9A4N5MwvPiny5mm5d+4t+e2vfid3LmzK0s6CRA3Ip2BORoS4Rh/bgMKUaBm2CZyrIXMpFoEvSRBdMLHKjEdj6fcBeLAH4EMZjofqeUorppDJdmLpoT2RnVZPzv/4M/K1n3wdJTKRt177u/z7B/dlYaMteYVM1B4jBiULfP4CkpOnXL5rUQCNSskTxYmC5nM+zdS73V5X7/S0lUtkNnRVdE1z7yiW5LkBYFLLsEhrO4lM4olEqP3fO/9tkWFD3n3putS4ZJiOheLgjHBiIr+xET+6vIUWI3cJhHtIJU21nk9mQ4DtS2d3V3Z7uwpckJjEoWnECGnWslLRcQ68boBecljEfGaONzZqcu+ljuyeGMgXrp6Suy/i3FEfiLx7VPKZExhygpOIkj/KByG3lcH80nEuVHi9WlUQo+FIc3o8HquH6U0DTNDOuyqMAkPTDS6fKT2a72PzKqTa4Mikk8hwdSq3X/2n3H75tkiriwik8s2fPS+9pa7E2JkVLHKVBUMzCmuHWBkZ3hmgmF5MGPZMK0e/19e8HkwHSBeU60oiMaJhzdKiWGGMxjvpLGikZ1TsW5DAaEWzWHrP7clzv1mR86+8LDKB59da8uqXvyWztVwmlalEGNL8WOlJfxkldglniJWujJd7OGrAAdjQUu9t5jGO6bK1tSXdnY6MJiNJ41SqoBt4BURQM/xwZ5Ul2PLP0dw4SylR8LIvhSJYFmMR9w6M5MB7iXz215+TcXsi2+1tBGEkFWCd8tjwfipn/nJKFxaPDTncUB9jhYwrMpyi3HUHqCB9mWYwGP+YGhWAZiOQYjPP6xjAl+nGWzbIxucGMCqsc0yNbiSd1R159pfLEiPvu5/oAzxWLzaUaTqV9F4ix28elcoilnANZ6feRPq7A1nHv253T5IJTqkoidW0GgAZsH2AodLGDVCZXh4vbGSMALZVa3zUIeQvI7RbkVF75NZm1++EWESVGbyJ3J4emEpvhDTaYJ3G5oLNBlktVb7Ngc5GcGVAjwPMFAIuXvY1m1eWOTegOMlv57lfqCg/6tFGraGVY9gdyi5K3xA5PkE+ptVEashtOiCf7Vduig1N2aDyM/nKczhmfHbnGFswICweNQRI8JcBHHfHVq0po/FEOp0OfgCOUpgkkSQ1AM9R+iDI1ekPKy8rJLPxEsCjwJJuzfgoz/qkBQOK2zOZ+NxstmSMLXztgw3pd7HR4CySVlOp1eBtNAWH17CMO7BfnDSGZx4kj/K42z7IxuroNMez+oF9AG3MHEHwvs8KmgUDKIMVJQKYRqOuh6eN9fuytbMj4+EeQDek0cRhiOCgkbsqheElGsGCUKYPkeBv5lPQlNMcb58bAh/1WSt6lGMOIAQWuIyHNOuTd24ANNTTBtIm17f+jY0NNaIOY5qtFjForeYktoxYAxAH3CkGEY9FJeQPND5AV7GY0u4HgeWoNZufZdyNbbRgQAMvy91+V27duqVnEm42zWZTOTMctNhMiD64gYKPgEut9FSvpaDLR4EpoJOt6AVjed5jpIIeHwTeKBpvA9hsWeHmB/kQgfvweB9v+zx7txea2ISYm0X1mIfn0khQTh0OV5GjlDrgoEi6Ay+myl9MrTl4x0EGOkVfY3HnppijIhbnBAM2YcBie1FPiVMFitwOWNQHXqET6ESrTQadNnjhBDBvzg88gbn9gUzGoS4JetwcB9A4nKa5M8O4ggoG4MMW3ALBE1YgCILQuVzXs7w29XOhpjgIV0+rBA5palCooz9qHiWV6Rwz3TiYhD7HgwFkmOkm5MNcjBM50cqCTaijKkMw2kH1BuGmUbDqhGdzgsrVy9xdRtXUURzwAMiEF6NGF3EEAwIIrg++jWijUHhObyyybEihDALxp81YXJ6QvB8c6WYW+mWji2CcQPK43txI9LDfzGNonHMYOqLCmab+9U/Bk8KZuMSQrG+4Bj7QQNW8g3LaFuZzfE4je5Gm0/089h/aqM9k0kFmIYYVGicuLS3lhZOehsk7wjl7NsWRuLbvi0DwHjxLR+fwEo/OUIEzE2YTnEUGdw0GlaHRENZ0QghylPL4C52FOTyfT/al0MGDB/XTBUVQgb44AFAERfgWIHv4tHHs2WPoERj/ipDcnG4Xb3Bo7XY7vJTzuQiScvm+cBCfynkY1KaicHHg3FjhSq9TxgJK/Pr6Bzi299X5IQJXrlzJz507J/jvGwVPZksLyqnX67K2dl96AFir1/bRTA8rGd/A2OgM7ikPajSAX5gPHz78UJ7yPO91WX3mGXnzr3+TN974ET4/8JuJb3z9I/i1tTUdKeaqs3wBR+gduXbtGs5KjQcaQC/x8zfvlo7mBN754zgNpfybN2+GyFiEHD+97fgJhjSjHzp0yP6DQ50fDGDu0iP8AmZKvW0KiCnBsC8vL/P/p5SHQg0Y+zx6k4d98jMCxkNZ5OUzf9RDMDSo2Io8xTkcJ+/Kyooe60HTXTGkEBT+EAZ8FZ/vRvCOrl9MwsHT5TnBMezmQVNKb1u0wJ8TGBtTzuby2fjIQxnks7MW6Q9rNo909PFJKa0Cxz/gqJ/aHDXi+PHj9vxE38+cOSOrq6uGEe7wHraRp+1e3JKeNuyK92MDPuqw/Q+vwUWYTRz2TwAAAABJRU5ErkJggg==","Icon256Data":null,"BundleURL":"Plugins/Content/7c84a650-9896-11e1-a8b0-0800200c9a66/0.3.6.1/7c84a650-9896-11e1-a8b0-0800200c9a66.prm","ReleaseNotesURL":"Plugins/Content/7c84a650-9896-11e1-a8b0-0800200c9a66/0.3.6.1/7c84a650-9896-11e1-a8b0-0800200c9a66.plugin/Resources/ReleaseNotes.txt"}},{"ID":"dfd69050-9897-11e1-a8b0-0800200c9a66","PluginVersion":"0.2.0.1","MinAppVersion":"0.6.4.0","MaxAppVersion":"9999.0.0.0","State":1,"ExtendedPluginInfo":{"ID":"dfd69050-9897-11e1-a8b0-0800200c9a66","Name":"VNC Plugin (Chicken)","Description":"This is the official Royal TSX VNC Plugin. It is based on Chicken and provides support for connecting to hosts running VNC and Apple Remote Desktop.","SupportedProtocols":"VNC","ObjectTypeName":"RoyalVNCConnection","Version":"0.2.0.1","MinAppVersion":"0.6.4.0","MaxAppVersion":"9999.0.0.0","PluginURL":"https://www.royalapps.com/ts/mac","UpdateURL":"Plugins/Content/dfd69050-9897-11e1-a8b0-0800200c9a66/0.2.0.1/dfd69050-9897-11e1-a8b0-0800200c9a66.prm","PublisherName":"Royal Apps","PublisherURL":"https://www.royalapps.com","PublisherEMail":"office@royalapps.com","SupportURL":"https://www.royalapps.com/go/support","SupportEMail":"support+royaltsx@royalapps.com","LicenseType":"GPL V2","LicenseURL":"http://www.gnu.org/licenses/gpl-2.0.html","Icon48Data":"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","Icon256Data":null,"BundleURL":"Plugins/Content/dfd69050-9897-11e1-a8b0-0800200c9a66/0.2.0.1/dfd69050-9897-11e1-a8b0-0800200c9a66.prm","ReleaseNotesURL":"Plugins/Content/dfd69050-9897-11e1-a8b0-0800200c9a66/0.2.0.1/dfd69050-9897-11e1-a8b0-0800200c9a66.plugin/Resources/ReleaseNotes.txt"}},{"ID":"4a376bc0-9c23-11e1-a8b0-0800200c9a66","PluginVersion":"0.3.5.1","MinAppVersion":"0.6.4.0","MaxAppVersion":"9999.0.0.0","State":1,"ExtendedPluginInfo":{"ID":"4a376bc0-9c23-11e1-a8b0-0800200c9a66","Name":"Web Plugin (WebKit)","Description":"This is the official Royal TSX Web Plugin. It is based on WebKit and enables you to connect to any website running the http or https protocol.","SupportedProtocols":"HTTP;HTTPS","ObjectTypeName":"RoyalWebConnection","Version":"0.3.5.1","MinAppVersion":"0.6.4.0","MaxAppVersion":"9999.0.0.0","PluginURL":"https://www.royalapps.com/ts/mac","UpdateURL":"Plugins/Content/4a376bc0-9c23-11e1-a8b0-0800200c9a66/0.3.5.1/4a376bc0-9c23-11e1-a8b0-0800200c9a66.prm","PublisherName":"Royal Apps","PublisherURL":"https://www.royalapps.com","PublisherEMail":"office@royalapps.com","SupportURL":"https://www.royalapps.com/go/support","SupportEMail":"support+royaltsx@royalapps.com","LicenseType":"Closed Source","LicenseURL":"","Icon48Data":"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","Icon256Data":null,"BundleURL":"Plugins/Content/4a376bc0-9c23-11e1-a8b0-0800200c9a66/0.3.5.1/4a376bc0-9c23-11e1-a8b0-0800200c9a66.prm","ReleaseNotesURL":"Plugins/Content/4a376bc0-9c23-11e1-a8b0-0800200c9a66/0.3.5.1/4a376bc0-9c23-11e1-a8b0-0800200c9a66.plugin/Resources/ReleaseNotes.txt"}}]'), isStartup);
		}
	},
	
	getAvailablePlugins: function() {
		pluginGallery.currentOperation = pluginGallery.OPERATION_GETAVAILABLEPLUGINS;
		pluginGallery.showProgress();
		
		var args = { };
		
		pluginService.call("PublicService_GetLatestCompatiblePluginInfos", args, function (response) {
			if (response.State == pluginService.ResponseState_Success) {
				pluginGallery.hideToolbarIcon();
				
				if (response.ResponseData != null) {
					pluginGallery.setAvailablePlugins(response.ResponseData);
            	}
			} else {
				var details = language.get(response.ErrorMessage);
				
				if (response.ErrorDetails != null) {
					details += " (" + response.ErrorDetails + ")";
				}
				
				//royalAppProxy.showMessageBox(language.get("Warning"), language.get("An error occurred") + ": " + details, language.get("OK"));
				pluginGallery.showWarning(language.get("An error occurred") + ": " + details);
				
				pluginGallery.setAvailablePlugins(null);
			}
		});
	},
	
	getUpdateablePlugins: function () {
		pluginGallery.currentOperation = pluginGallery.OPERATION_GETUPDATEABLEPLUGINS;
		pluginGallery.showProgress();
		
		var plugins = new Array();
		
		$.each(pluginGallery.installedPlugins, function(index, plugin) {
			var newPlugin = jQuery.extend(true, {}, plugin);
			newPlugin.ExtendedPluginInfo = null;
			
			plugins.push(newPlugin);
		});
		
		var args = {
			CurrentPluginInfos: plugins
		};
		
		pluginService.call("PublicService_GetUpdatablePluginInfos", args, function (response) {
			if (response.State == pluginService.ResponseState_Success) {
				pluginGallery.hideToolbarIcon();
				
				if (response.ResponseData != null) {
					pluginGallery.setUpdateablePlugins(response.ResponseData);
            	}
			} else {
				var details = language.get(response.ErrorMessage);
				
				if (response.ErrorDetails != null) {
					details += " (" + response.ErrorDetails + ")";
				}
				
				//royalAppProxy.showMessageBox(language.get("Warning"), language.get("An error occurred") + ": " + details, language.get("OK"));
				pluginGallery.showWarning(language.get("An error occurred") + ": " + details);
			}
		});
	},
	
	setAvailablePlugins: function(plugins) {
		if (pluginGallery.currentOperation != pluginGallery.OPERATION_GETAVAILABLEPLUGINS)
			return;
			
		pluginGallery.availablePlugins = plugins;
		
		pluginGallery.hideUpdatesBar();
		
		if (pluginGallery.availablePlugins != null && pluginGallery.availablePlugins.length > 0) {
			pluginGallery.addPluginsToDom(plugins, false);
			pluginGallery.showInstallAllPlugins();
		} else {
			pluginGallery.showNoPluginsAvailable();
			$(".ts_plugins").fadeIn(pluginGallery.ANIMATION_SPEED);
		}
	},
	
	setInstalledPlugins: function(plugins, isStartup) {
		if (pluginGallery.currentOperation != pluginGallery.OPERATION_GETINSTALLEDPLUGINS)
			return;
			
		pluginGallery.installedPlugins = plugins;
		
		if (pluginGallery.installedPlugins != null && pluginGallery.installedPlugins.length > 0) {
			pluginGallery.addPluginsToDom(plugins, true);
			pluginGallery.getUpdateablePlugins();
		} else {
			if (isStartup) {
				pluginGallery.switchToAvailable();
			} else {
				pluginGallery.showNoPluginsInstalled();
				$(".ts_plugins").fadeIn(pluginGallery.ANIMATION_SPEED);
			}
		}
	},
	
	setUpdateablePlugins: function (plugins) {
		if (pluginGallery.currentOperation != pluginGallery.OPERATION_GETUPDATEABLEPLUGINS)
			return;
			
		pluginGallery.updateablePlugins = plugins;
		
		pluginGallery.mergePlugins(plugins);
	},
	
	addPluginsToDom: function(plugins, installedPlugins) {
		$.each(plugins, function(index, plugin) {
			pluginGallery.addPluginToDom(plugin, installedPlugins);
		});
		
		$(".ts_plugins").fadeIn(pluginGallery.ANIMATION_SPEED);
	},
	
	mergePlugins: function(plugins) {
		$.each(plugins, function(index, newPlugin) {
			pluginGallery.updatePluginDom(newPlugin);
		});
		
		pluginGallery.setUpdatesAvailableCount(pluginGallery.updateablePlugins.length);
		
		pluginGallery.showUpdatesBar(function() {
			if (pluginGallery.updateablePlugins.length > 0) {
				pluginGallery.reorderUpdatedPlugins();
			}
		});
	},
	
	reorderUpdatedPlugins: function() {
		var rootEl = $(".ts_plugins");
		
		rootEl.css({
			position: "relative"
		});
		
		var pElH;
		var pEl = $(".ts_plugin");
		
		pEl.each(function(i, el){
			var iY = $(el).position().top;
			$.data(el, "h", iY);
			
			if (i === 1) 
				pElH = iY;
		});
		
		var sortedEls = pEl.tsort({
			attr: "class",
			order: "desc"
		});
		
		var sortedElsCount = sortedEls.length;
		
		sortedEls.each(function(i, el) {
			var currEl = $(el);
			var iFr = $.data(el, "h");
			var iTo = i * pElH;
			
			currEl.css({
				position: "absolute",
				top: iFr
			}).animate({
				top: iTo
			}, pluginGallery.ANIMATION_SPEED, function() {
				if (i >= sortedElsCount - 1) {
					// when the last sort animation finishes, restore all styles to their original values
					
					sortedEls.each(function(i2, el2) {
						var currEl2 = $(el2);
						
						currEl2.css({
							position: "",
							top: ""
						});
					});
					
					rootEl.css({
						position: ""
					});
				}
			});
		});
	},

	updatePluginDom: function(plugin) {
		var tsp = $(".ts_plugin_id:contains(" + plugin.ID + ")").closest(".ts_plugin");
		
		pluginGallery.setPluginDomProperties(tsp, plugin, true, true);
		
		return tsp;
	},
	
	addPluginToDom: function(plugin, isInstalled) {
		var tsp = $(".ts_plugin_template").clone();
		
		tsp.removeClass("ts_plugin_template");
		tsp.addClass("ts_plugin");
		pluginGallery.setPluginDomProperties(tsp, plugin, false, isInstalled);
		
		tsp.appendTo($(".ts_plugins"));
		
		return tsp;
	},
	
	setPluginDomProperties: function(element, plugin, changeOnlyForUpdate, isInstalled) {
		var installBtn = element.find(".ts_plugin_content_right").find(".ts_button");
		
		var id = plugin.ExtendedPluginInfo.ID;
		var name = plugin.ExtendedPluginInfo.Name;
		var publisher = plugin.ExtendedPluginInfo.PublisherName;
		var description = plugin.ExtendedPluginInfo.Description;
		var licenseType = plugin.ExtendedPluginInfo.LicenseType;
		var licenseUrl = plugin.ExtendedPluginInfo.LicenseURL;
		var pluginUrl = plugin.ExtendedPluginInfo.PluginURL;
		var supportUrl = plugin.ExtendedPluginInfo.SupportURL;
		var releaseNotesUrl = plugin.ExtendedPluginInfo.ReleaseNotesURL;
		var version = plugin.ExtendedPluginInfo.Version;

		var shortDescription = null;

		try {
			shortDescription = plugin.ExtendedPluginInfo.ShortDescription;
		} catch (ex) { }

		var iconData48 = plugin.ExtendedPluginInfo.Icon48Data;
		var iconData256 = plugin.ExtendedPluginInfo.Icon256Data;

		var iconData = (utils.isRetina() && iconData256 != null && iconData256 != "")
						? iconData256
						: ((iconData48 != null && iconData48 != "") ? iconData48 : iconData256);
		
		if (iconData != null &&
			iconData != "") {
			iconData = "url(data:image/png;base64," + iconData + ")";
		}
			
		if (publisher == null ||
			publisher == "") {
			publisher = language.get("N/A");
		}
			
		if (licenseType == null ||
			licenseType == "") {
			licenseType = language.get("N/A");
		}
		
		if (licenseUrl == null ||
			licenseUrl == "") {
			licenseUrl = "#";
		}
		
		if (pluginUrl == null ||
			pluginUrl == "") {
			pluginUrl = "#";
		}
			
		if (supportUrl == null ||
			supportUrl == "") {
			supportUrl = "#";
		}
			
		if (releaseNotesUrl == null ||
			releaseNotesUrl == "") {
			releaseNotesUrl = "#";
		} else {
			releaseNotesUrl = config.pluginServiceBaseUrl + releaseNotesUrl;
		}
			
		if (version == null ||
			version == "") {
			version = "0.0.0.0";
		}

		version = utils.formatPluginVersionForDisplay(version);
		
		if (!changeOnlyForUpdate) {
			element.removeClass("ts_plugin_update");

			var elId = element.find(".ts_plugin_id");
			var elIcon = element.find(".ts_plugin_content_info_icon");
			var elName = element.find(".ts_plugin_content_info_name");
			var elPublisher = element.find(".ts_plugin_content_info_publisher");
			var elDescription = element.find(".ts_plugin_content_info_description");
			var elLicense = element.find(".ts_plugin_content_info_license");
			var elWebsite = element.find(".ts_plugin_content_info_website");
			var elSupport = element.find(".ts_plugin_content_info_supportwebsite");
			
			elId.html(id);
			elIcon.css("background-image", iconData);
			elName.html(name);

			if (shortDescription != null &&
				shortDescription != "" &&
				shortDescription != " ") {
				var elShortDescription = elPublisher.parent();

				elShortDescription.html(shortDescription);
			} else {
				elPublisher.html(publisher);
			}

			elDescription.html(description);
			elLicense.html(licenseType);
			elLicense.attr("href", licenseUrl);
			elWebsite.attr("href", pluginUrl);
			elSupport.attr("href", supportUrl);
			
			if (!isInstalled) {
				installBtn.show();
				installBtn.removeClass("ts_plugin_update_button");
				installBtn.addClass("ts_plugin_install_button");
				installBtn.find(".ts_button_content").html(language.get("Install"));
				element.find(".ts_plugin_content_extended_content_bottom_left").find(".ts_button").hide();
			} else {
				installBtn.hide();
			}
			
			element.find(".ts_plugin_content_info_updateversion").parent().css("visibility", "hidden");
			element.find(".ts_plugin_content_info_version").html(version);
		} else {
			element.addClass("ts_plugin_update");
			
			if (!isInstalled) {
				installBtn.find(".ts_button_content").html(language.get("Install"));
				installBtn.hide();
			} else {
				installBtn.find(".ts_button_content").html(language.get("ToUpdate"));
				installBtn.show();
				
				element.find(".ts_plugin_content_info_updateversion").parent().css("visibility", "");
				element.find(".ts_plugin_content_info_updateversion").html(version);
			}
		}
			
		element.find(".ts_plugin_content_info_releasenotes").attr("href", releaseNotesUrl);
	},
	
	setUpdatesAvailableCount: function(count) {
		var element = $(".ts_updates_bar_counter");
		var msg = "";
		
		if (count <= 0) {
			msg = language.get("No Updates available");
		} else {
			msg = language.getFormat("{0} Update(s) available", count);
		}
		
		element.html(msg);
	},
	
	hideUpdatesBar: function() {
		$(".ts_updates_bar").animate({ height: pluginGallery.UPDATES_BAR_HEIGHT_HIDDEN }, pluginGallery.ANIMATION_SPEED);
	},
	
	showUpdatesBar: function(onDone) {
		$(".ts_updates_bar").animate({ height: pluginGallery.UPDATES_BAR_HEIGHT_VISIBLE }, pluginGallery.ANIMATION_SPEED, onDone);
	},
	
	hideToolbarIcon: function() {
		$(".ts_toolbar_icon").fadeOut(pluginGallery.ANIMATION_SPEED);
	},
	
	showToolbarIcon: function() {
		if (!$(".ts_toolbar_icon").is(":visible"))
			$(".ts_toolbar_icon").fadeIn(pluginGallery.ANIMATION_SPEED);
	},
	
	showProgress: function() {
		$(".ts_toolbar_icon").removeClass("ts_toolbar_warning").addClass("ts_toolbar_progress");
		pluginGallery.showToolbarIcon();
	},
	
	showWarning: function(text) {
		$(".ts_toolbar_icon").removeClass("ts_toolbar_progress").addClass("ts_toolbar_warning").attr("title", text);
		pluginGallery.showToolbarIcon();
	},
	
	showNoPluginsInstalled: function() {
		$(".ts_no_plugins_installed").clone().appendTo(".ts_plugins");
	},
	
	showNoPluginsAvailable: function() {
		$(".ts_no_plugins_available").clone().appendTo(".ts_plugins");
	},

	showInstallAllPlugins: function() {
		$(".ts_plugins_footer_container").clone().appendTo(".ts_plugins");
	},
	
	switchToInstalled: function(isStartup) {
		$(".ts_toolbar_button_installed").removeClass("ts_toolbar_button");
		$(".ts_toolbar_button_installed").addClass("ts_toolbar_button_active");
		
		$(".ts_toolbar_button_available").removeClass("ts_toolbar_button_active");
		$(".ts_toolbar_button_available").addClass("ts_toolbar_button");
		
		pluginGallery.hideUpdatesBar();
		
		$(".ts_plugins").fadeOut(pluginGallery.ANIMATION_SPEED, function () {
			$(".ts_plugins").empty();
			pluginGallery.getInstalledPlugins(isStartup);
		});
	},
	
	switchToAvailable: function() {
		$(".ts_toolbar_button_installed").removeClass("ts_toolbar_button_active");
		$(".ts_toolbar_button_installed").addClass("ts_toolbar_button");
		
		$(".ts_toolbar_button_available").removeClass("ts_toolbar_button");
		$(".ts_toolbar_button_available").addClass("ts_toolbar_button_active");
		
		pluginGallery.hideUpdatesBar();
		
		$(".ts_plugins").fadeOut(pluginGallery.ANIMATION_SPEED, function () {
			$(".ts_plugins").empty();
			pluginGallery.getAvailablePlugins();
		});
	},
	
	bindToolbarButtonsEventHandler: function() {
		$(".ts_toolbar_button_installed").click(function() {
			pluginGallery.switchToInstalled();
		});
		
		$(".ts_toolbar_button_available").click(function() {
			pluginGallery.switchToAvailable();
		});
	},
	
	bindMoreButtonEventHandler: function(rootElement) {
		if (!rootElement)
			rootElement = $("body");
		
		$(rootElement).on("click", ".ts_plugin_bottom_button", function() {
			var pressedBtn = $(this);
			var extendedDiv = pressedBtn.closest(".ts_plugin").find(".ts_plugin_content_extended_content");
			
			extendedDiv.toggle(100, function() {
				if (extendedDiv.is(":visible"))
					pressedBtn.html(language.get("Less") + " ...");
				else
					pressedBtn.html(language.get("More") + " ...");
			});
		});
	},
	
	bindUpdateButtonsEventHandler: function(rootElement) {
		$(".ts_updates_bar_updateall_button").click(function() {
			try {
				royalAppProxy.updatePlugins(pluginGallery.updateablePlugins);
			} catch (ex) {
				// TODO: Handle Error
			}
		});
		
		if (!rootElement) {
			rootElement = $("body");
		}

		$(rootElement).on("click", ".ts_plugins_install_all_button", function() {
			try {
				royalAppProxy.installPlugins(pluginGallery.availablePlugins, true);
			} catch (ex) {
				// TODO: Handle Error
			}
		});

		$(rootElement).on("click", ".ts_plugin_update_button, .ts_plugin_install_button", function() {
			var pressedBtn = $(this);
			var pluginId = pressedBtn.closest(".ts_plugin").find(".ts_plugin_id").html();
			var plugin = null;
			
			if ($(this).hasClass("ts_plugin_update_button"))
				plugin = pluginGallery.getPluginById(pluginGallery.updateablePlugins, pluginId);
			else if ($(this).hasClass("ts_plugin_install_button"))
				plugin = pluginGallery.getPluginById(pluginGallery.availablePlugins, pluginId);
			
			if (plugin == null)
				return;
			
			var pluginsArr = [ plugin ];
			
			var err = false;
			
			try {
				if (!royalAppProxy.isAvailable())
					err = true;
					
				if (pressedBtn.hasClass("ts_plugin_update_button"))
					royalAppProxy.updatePlugins(pluginsArr);
				else if (pressedBtn.hasClass("ts_plugin_install_button"))
					royalAppProxy.installPlugins(pluginsArr, false);
			} catch (ex) {
				// TODO: Handle Error
				err = true;
			}
			
			if (err)
				location.href = config.pluginServiceBaseUrl + plugin.ExtendedPluginInfo.UpdateURL;
		});
	},
	
	bindUninstallButtonsEventHandler: function(rootElement) {
		if (!rootElement)
			rootElement = $("body");
		
		$(rootElement).on("click", ".ts_plugin_uninstall_button", function() {
			var pressedBtn = $(this);
			var pluginId = pressedBtn.closest(".ts_plugin").find(".ts_plugin_id").html();
			var plugin = pluginGallery.getPluginById(pluginGallery.installedPlugins, pluginId);
			var pluginsArr = [ plugin ];
			
			try {
				royalAppProxy.uninstallPlugins(pluginsArr);
			} catch (ex) {
				// TODO: Handle Error
			}
		});
	},
	
	bindWarningButtonEventHandler: function(rootElement) {
		if (!rootElement)
			rootElement = $("body");
		
		$(rootElement).on("click", ".ts_toolbar_warning", function() {
			var pressedBtn = $(this);
			
			try {
				royalAppProxy.showMessageBox(language.get("Warning"), $(this).attr("title"), language.get("OK"));
			} catch (ex) {
				// TODO: Handle Error
			}
		});
	},
	
	getPluginById: function(pluginList, pluginId) {
		var foundPlugin = null;
		
		$.each(pluginList, function(index, plugin) {
			if (plugin.ID == pluginId) {
				foundPlugin = plugin;
				return false; // = break
			}
		});
		
		return foundPlugin;
	},
	
	bindEventHandlers: function() {
		pluginGallery.bindToolbarButtonsEventHandler();
		pluginGallery.bindMoreButtonEventHandler();
		pluginGallery.bindUpdateButtonsEventHandler();
		pluginGallery.bindUninstallButtonsEventHandler();
		pluginGallery.bindWarningButtonEventHandler();
	}
};