const path = require("path");
const { ipcRenderer } = require("electron");
const config = require("../../config");
const { Titlebar, Color } = require("custom-electron-titlebar");
const is = require("electron-is");
function $(selector) { return document.querySelector(selector); }

module.exports = (options) => {
	let visible = true;
	const bar = new Titlebar({
		backgroundColor: Color.fromHex("#050505"),
		itemBackgroundColor: Color.fromHex("#1d1d1d"),
		svgColor: Color.WHITE, 
		menu: visible ? undefined : null
	});
	bar.updateTitle("Barq desktop");
	document.title = "Barq desktop";

	const hideIcon = hide => document.querySelector('.cet-window-icon').style.display = hide ? 'none' : 'flex';

	if (options.hideIcon) hideIcon(true);
	hideIcon(true);

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

	const observer = new MutationObserver((mutations, obs) => {
		const hello = document.querySelector("body > div.cet-container")
		if (hello) {
			document.querySelector("body > div.cet-container").style.top = '0px'; // fix for top bar
			try {
				document.querySelector("#root > div > nav > a > img").remove() //remove logo from navbar
				console.log("logo removed")
			} catch (e) {
				document.querySelector("#root > div > div.sc-eCImPb.gPqAwn > div > a.sc-gsDKAQ.inUaRg.neutral").remove(); //remove return to homepage
				document.querySelector("#root > div > div.sc-eCImPb.gPqAwn > div > a").text = "You have no choice in this matter";
				console.log("\"Return to homepage\" button removed")
			}
			obs.disconnect();
			return;
		}
	});
	  
	observer.observe(document, {
		childList: true,
		subtree: true
	});
};