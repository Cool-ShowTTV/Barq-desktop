const path = require("path");
const { ipcRenderer } = require("electron");
const config = require("../../config");
const { Titlebar, Color } = require("custom-electron-titlebar");
function $(selector) { return document.querySelector(selector); }

module.exports = (options) => {
	let visible = true;
	const bar = new Titlebar({
		backgroundColor: Color.fromHex("#050505"),
		itemBackgroundColor: Color.fromHex("#1d1d1d"),
		svgColor: Color.WHITE, 
		menu: visible ? undefined : null,
		icon: "https://web.barq.social/barq-navbar.png"
	});
	bar.updateTitle("Barq desktop");
	console.log(bar);
	document.title = "Barq desktop";

	const hideIcon = hide => $('.cet-window-icon').style.display = hide ? 'none' : 'flex';

	if (options.hideIcon) hideIcon(true);

	ipcRenderer.on("refreshMenu", (_, showMenu) => {
		if (showMenu === undefined && !visible) return;
		if (showMenu === false) {
			bar.updateMenu(null);
			visible = false;
		} else {
			bar.refreshMenu();
			visible = true;
		}
	});

	ipcRenderer.on("hideIcon", (_, hide) => hideIcon(hide));
};