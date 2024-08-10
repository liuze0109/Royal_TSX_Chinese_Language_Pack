$(document).ready(function() {
	pluginGallery.init();
});

var pluginGallery = {
	OPERATION_GETINSTALLEDPLUGINS:	"getInstalledPlugins",
	OPERATION_GETAVAILABLEPLUGINS:	"getAvailablePlugins",
	OPERATION_GETUPDATEABLEPLUGINS:	"getUpdateablePlugins",
	
	ANIMATION_SPEED: "fast",
	UPDATES_BAR_HEIGHT_HIDDEN: 0,
	UPDATES_BAR_HEIGHT_VISIBLE: 42,
	
	appVersion: "",
	language: "cn",
	accentColor: "0e7afe",
	
	installedPlugins: null,
	availablePlugins: null,
	updateablePlugins: null,
	
	currentOperation: "",
	
	init: function () {
		// Read QueryString Arguments
		
		pluginGallery.language = "cn";
		var langQ = utils.getParameter("language");
		
		if (langQ) {
			pluginGallery.language = langQ;
		}
		pluginGallery.language = "cn";
		pluginGallery.appVersion = "0.0.0.0";
		var appVersionQ = utils.getParameter("appVersion");
		
		if (appVersionQ) {
			pluginGallery.appVersion = appVersionQ;
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

			pluginGallery.switchToAvailable();
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
		var backgroundStyle = "";
		
		if (!royalAppProxy.isAvailable()) {
			backgroundStyle = "@media (prefers-color-scheme: dark) { body { background-color: #2e3131; } }";
		}
		
		var installedToolbarButtonStyle = ".ts_toolbar_button_installed.ts_toolbar_button_active .ts_toolbar_button_icon { background-image: url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 25.99 20.99\"%3E%3Cdefs%3E%3Cstyle%3E.fill%7Bfill:%230e7afe;fill-rule:evenodd;%7D%3C/style%3E%3C/defs%3E%3Cg%3E%3Cg%3E%3Cpath class=\"fill\" d=\"M0,10.49,5.2,5.24l5.2,5.25L20.79,0,26,5.25,10.4,21Z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); }";
		var availableToolbarButtonStyle = ".ts_toolbar_button_available.ts_toolbar_button_active .ts_toolbar_button_icon { background-image: url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 25 20\"%3E%3Cdefs%3E%3Cstyle%3E.fill%7Bfill:%230e7afe;fill-rule:evenodd;%7D%3C/style%3E%3C/defs%3E%3Cg%3E%3Cg%3E%3Cpath class=\"fill\" d=\"M24.64,19.14a2,2,0,0,1-2.8.51L13.55,14a2,2,0,0,1-.87-1.72,7.19,7.19,0,0,1-4,2.18,7.31,7.31,0,0,1-5.49-1.17A7.24,7.24,0,0,1,1.3,3.13,7.38,7.38,0,0,1,11.5,1.29a7.26,7.26,0,0,1,2.42,9.18,2,2,0,0,1,1.93.2l8.28,5.69A2,2,0,0,1,24.64,19.14ZM12.36,6.36A5.07,5.07,0,0,0,10.24,3.1,5.15,5.15,0,0,0,3.13,4.38a5,5,0,0,0,1.29,7.06,5.15,5.15,0,0,0,7.12-1.28A5.06,5.06,0,0,0,12.36,6.36Z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); }";
		var progressToolbarButtonStyle = ".ts_toolbar_progress { background-image: url('data:image/svg+xml,%3Csvg width=\"32px\" height=\"32px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"lds-dual-ring\" style=\"background: none;\"%3E%3Ccircle cx=\"50\" cy=\"50\" ng-attr-r=\"%7B%7Bconfig.radius%7D%7D\" ng-attr-stroke-width=\"%7B%7Bconfig.width%7D%7D\" ng-attr-stroke=\"%7B%7Bconfig.stroke%7D%7D\" ng-attr-stroke-dasharray=\"%7B%7Bconfig.dasharray%7D%7D\" fill=\"none\" stroke-linecap=\"round\" r=\"41\" stroke-width=\"14\" stroke=\"%230e7afe\" stroke-dasharray=\"64.40264939859075 64.40264939859075\" transform=\"rotate(330 50 50)\"%3E%3CanimateTransform attributeName=\"transform\" type=\"rotate\" calcMode=\"linear\" values=\"0 50 50;360 50 50\" keyTimes=\"0;1\" dur=\"1.4s\" begin=\"0s\" repeatCount=\"indefinite\"%3E%3C/animateTransform%3E%3C/circle%3E%3C/svg%3E'); }";

		installedToolbarButtonStyle = installedToolbarButtonStyle.replace("0e7afe", pluginGallery.accentColor);
		availableToolbarButtonStyle = availableToolbarButtonStyle.replace("0e7afe", pluginGallery.accentColor);
		progressToolbarButtonStyle = progressToolbarButtonStyle.replace("0e7afe", pluginGallery.accentColor);
		
		var buttonStyle = ".ts_button .ts_button_content.ts_button_content_accent { background-color: #" + pluginGallery.accentColor + "; }";
		var linkStyle = "a { color: #" + pluginGallery.accentColor + " }";

		var allStyles = backgroundStyle + "\n" + installedToolbarButtonStyle + "\n" + availableToolbarButtonStyle + "\n" + progressToolbarButtonStyle + "\n" + buttonStyle + "\n" + linkStyle;

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
			pluginGallery.setInstalledPlugins(null, isStartup);
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
			
            if (err) {
                var baseURL = config.pluginServiceBaseUrl;
                var updateURL = plugin.ExtendedPluginInfo.UpdateURL;
                var absoluteUpdateURL = updateURL;
                
                if (updateURL != null &&
                    updateURL != undefined &&
                    !updateURL.toLowerCase().startsWith("http") &&
                    !updateURL.toLowerCase().startsWith(baseURL.toLowerCase())) {
                    absoluteUpdateURL = baseURL + updateURL;
                }
                
                location.href = absoluteUpdateURL;
            }
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
