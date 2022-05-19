const { existsSync } = require("fs");
const path = require("path");

const { app, Menu, dialog } = require("electron");
const is = require("electron-is");

const { getAllPlugins } = require("./plugins/utils");
const config = require("./config");

//const prompt = require("custom-electron-prompt");

// true only if in-app-menu was loaded on launch
const inAppMenuActive = config.plugins.isEnabled("in-app-menu");

const pluginEnabledMenu = (plugin, label = "", hasSubmenu = false, refreshMenu = undefined) => ({
	label: label || plugin,
	type: "checkbox",
	checked: config.plugins.isEnabled(plugin),
	click: (item) => {
		if (item.checked) {
			config.plugins.enable(plugin);
		} else {
			config.plugins.disable(plugin);
		}
		if (hasSubmenu) {
			refreshMenu();
		}
	},
});

const mainMenuTemplate = (win) => {
	const refreshMenu = () => {
		this.setApplicationMenu(win);
		if (inAppMenuActive) {
			//win.webContents.send("refreshMenu"); //this is not working
		}
	}
	return [
		{
			label: "Plugins",
			submenu: [
				...getAllPlugins().map((plugin) => {
					const pluginPath = path.join(__dirname, "plugins", plugin, "menu.js")
					if (existsSync(pluginPath)) {
						if (!config.plugins.isEnabled(plugin)) {
							return pluginEnabledMenu(plugin, "", true, refreshMenu);
						}
						const getPluginMenu = require(pluginPath);
						return {
							label: plugin,
							submenu: [
								pluginEnabledMenu(plugin, "Enabled", true, refreshMenu),
								{ type: "separator" },
								...getPluginMenu(win, config.plugins.getOptions(plugin), refreshMenu),
							],
						};
					}

					return pluginEnabledMenu(plugin);
				}),
			],
		},
		{
			label: "Options",
			submenu: [
				{
					label: "Auto-update",
					type: "checkbox",
					checked: config.get("options.autoUpdates"),
					click: (item) => {
						//config.setMenuOption("options.autoUpdates", item.checked);
                            dialog.showMessageBox(win, {
                                type: 'info', title: 'Auto-update', message: 'Auto-update is not yet implemented.', buttons: ['OK']
                            });
					},
				},
				{
					label: "Dark Mode",
					type: "checkbox",
					checked: config.get("options.darkmode"),
					click: (item) => {
						config.setMenuOption("options.darkmode", item.checked);
						if (is.dev()){
							console.log("Dark mode:", item.checked);
						}

						dialog.showMessageBox(win, {
							type: 'info',
							title: 'Option changed',
							message: 'Changing this requires restarting the app.\nPlease restart.',
							buttons: ['Ok']
						});
					},
				},
				{
					label: "Center Icon",
					type: "checkbox",
					checked: config.get("options.centericon"),
					click: (item) => {
						config.setMenuOption("options.centericon", item.checked);
						if (is.dev()){
							console.log("Center icon set to:", item.checked);
						}

						dialog.showMessageBox(win, {
							type: 'info',
							title: 'Option changed',
							message: 'Changing this requires restarting the app.\nPlease restart.',
							buttons: ['Ok']
						});
					},
				},
				{ type: "separator" },
				{
					label: "Advanced options",
					submenu: [
						{
							label: "Override useragent",
							type: "checkbox",
							checked: config.get("options.overrideUserAgent"),
							click: (item) => {
								config.setMenuOption("options.overrideUserAgent", item.checked);
							}
						},
						{ type: "separator" },
						is.macOS() ?
							{
								label: "Toggle DevTools",
								// Cannot use "toggleDevTools" role in MacOS
								click: () => {
									const { webContents } = win;
									if (webContents.isDevToolsOpened()) {
										webContents.closeDevTools();
									} else {
										const devToolsOptions = {};
										webContents.openDevTools(devToolsOptions);
									}
								},
							} :
							{ role: "toggleDevTools" },
						{
							label: "Edit config.json",
							click: () => {
								config.edit();
							},
						},
					]
				},
			],
		},
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				{ role: "forceReload" },
				{ type: "separator" },
				{ role: "zoomIn" },
				{ role: "zoomOut" },
				{ role: "resetZoom" },
				{ type: "separator" },
				{ role: "togglefullscreen" },
			],
		},
		{
			label: "Navigation",
			submenu: [
				{
					label: "Go back",
					click: () => {
						if (win.webContents.canGoBack()) {
							win.webContents.goBack();
						}
					},
				},
				{
					label: "Go forward",
					click: () => {
						if (win.webContents.canGoForward()) {
							win.webContents.goForward();
						}
					},
				},
				{
					label: "Restart App",
					click: () => {
						app.relaunch();
						app.quit();
					},
				},
				{ role: "quit" },
			],
		},
	];
}

module.exports.mainMenuTemplate = mainMenuTemplate;
module.exports.setApplicationMenu = (win) => {
	const menuTemplate = [...mainMenuTemplate(win)];
	if (process.platform === "darwin") {
		const name = app.name;
		menuTemplate.unshift({
			label: name,
			submenu: [
				{ role: "about" },
				{ type: "separator" },
				{ role: "hide" },
				{ role: "hideothers" },
				{ role: "unhide" },
				{ type: "separator" },
				{
					label: "Select All",
					accelerator: "CmdOrCtrl+A",
					selector: "selectAll:",
				},
				{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
				{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
				{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
				{ type: "separator" },
				{ role: "minimize" },
				{ role: "close" },
				{ role: "quit" },
			],
		});
	}

	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
};