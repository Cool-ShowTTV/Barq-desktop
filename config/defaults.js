const defaultConfig = {
	"window-size": {
		width: 1100,
		height: 550,
	},
	url: "https://web.barq.app/",
	options: {
		autoUpdates: false, // Planed but not implemented
		hideMenu: true,
		proxy: "",
		darkmode: true
	},
	plugins: {
		"in-app-menu": {
			enabled: true
		}
	},
};

module.exports = defaultConfig;