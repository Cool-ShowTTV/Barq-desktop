const { app, BrowserWindow } = require("electron");
const config = require("./config");


const createWindow = () => {
    
	const windowSize = config.get("window-size");
    const win = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
    });

    win.webContents.loadURL(config.defaultConfig.url);
};

function loadPlugins(win) {
    // Going to be 100 with you I stole this from another electron project
	injectCSS(win.webContents, path.join(__dirname, "youtube-music.css"));
	win.webContents.once("did-finish-load", () => {
		if (is.dev()) {
			console.log("did finish load");
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

app.whenReady().then(() => {
    createWindow();
});
