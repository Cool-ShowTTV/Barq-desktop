const path = require("path");
const is = require("electron-is");

const config = require("./config");
const { fileExists } = require("./plugins/utils");

const plugins = config.plugins.getEnabled();

plugins.forEach(([plugin, options]) => {=

	const actionPath = path.join(__dirname, "plugins", plugin, "actions.js");
	fileExists(actionPath, () => {
		const actions = require(actionPath).actions || {};

		Object.keys(actions).forEach((actionName) => {
			global[actionName] = actions[actionName];
		});
	});
});

document.addEventListener("DOMContentLoaded", () => {

	plugins.forEach(([plugin, options]) => {
		const pluginPath = path.join(__dirname, "plugins", plugin, "front.js");
		fileExists(pluginPath, () => {
			const run = require(pluginPath);
			run(options);
		});
	});

	if (config.get("options.darkmode")) {
		// Inject the darkmode CSS if enabled
		if (is.dev()) {
			console.log("Injecting dark mode.");
		}
		const pluginPath = path.join(__dirname, "darkmode.js");
		console.log(pluginPath);
		fileExists(pluginPath, () => {
			const run = require(pluginPath);
			run(options);
		});
	}

	const observer = new MutationObserver((mutations, obs) => {
		const checkIfLoaded = document.querySelector("body > div.cet-container") // Checks if the menu bar is loaded
		if (checkIfLoaded) {
			try{
				document.querySelector("#root > div > div.sc-eCImPb.gPqAwn > div > a.sc-gsDKAQ.inUaRg.neutral").remove(); //remove return to homepage on login
			} catch (e) {}
			
			try{
				//document.querySelector("#root > div > nav > a").innerHTML = "<a>Return home</a>"; // Replace logo with return button
			} catch (e) {}

			return;
		}
	});
	  
	observer.observe(document, {
		childList: true,
		subtree: true
	});
});