const Store = require("electron-store");

const defaults = require("./defaults");

const migrations = {
};

module.exports = new Store({
	defaults,
	clearInvalidConfig: false,
	migrations,
});