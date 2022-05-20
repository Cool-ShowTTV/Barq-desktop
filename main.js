const { fileExists, injectCSS } = require("./plugins/utils");
const { app, BrowserWindow } = require("electron");
const { setApplicationMenu } = require("./menu");
const config = require("./config");
const is = require("electron-is");
const path = require("path");

const createWindow = () => {
    
	const windowSize = config.get("window-size");
	const useInlineMenu = config.plugins.isEnabled("in-app-menu");
	
	const icon = config.get("options.centericon")
					? path.join(__dirname, "assets", "barq-navbar-center.png")
					: path.join(__dirname, "assets", "barq-navbar.png");

    const win = new BrowserWindow({
		icon: icon,
        width: windowSize.width,
        height: windowSize.height,
		titleBarStyle: useInlineMenu
			? "hidden"
			: is.macOS()
			? "hiddenInset"
			: "default",
		autoHideMenuBar: config.get("options.hideMenu"),
		backgroundColor: "#fff",
		webPreferences: {
			nodeIntegration: false,
			preload: path.join(__dirname, "preload.js"),
			nativeWindowOpen: true,
			affinity: "main-window"
		}
    });
	
	win.icon = path.join(__dirname, "assets", "barq-navbar.png");

    win.webContents.loadURL(config.defaultConfig.url);
};

function loadPlugins(win) {
    // Going to be 100 with you I stole this from another electron project
	
	if (config.get("options.darkmode")) {
		// Inject the darkmode CSS if enabled
		if (is.dev()) {
			console.log("Injecting dark mode.");
		}
		injectCSS(win.webContents, path.join(__dirname,"themes", "darkmode.css"));
	}
	
	win.webContents.once("did-finish-load", () => {
		console.log("Finish loading");
		if (is.dev()) {
			console.log("Opening devtools");
			win.webContents.openDevTools();
		}
	});

	config.plugins.getEnabled().forEach(([plugin, options]) => {
		console.log("Loaded plugin - " + plugin);
		const pluginPath = path.join(__dirname, "plugins", plugin, "back.js");
		fileExists(pluginPath, () => {
			const handle = require(pluginPath);
			handle(win, options);
		});
	});
}

app.once("browser-window-created", (event, win) => {
    loadPlugins(win);
});

app.whenReady().then(() => {
    mainWin = createWindow();
    setApplicationMenu(mainWin);
});
