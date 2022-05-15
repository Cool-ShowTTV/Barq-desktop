const { app, BrowserWindow } = require("electron");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    win.webContents.loadURL("https://web.barq.social/");
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
