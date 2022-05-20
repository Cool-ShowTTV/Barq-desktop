const { setOptions } = require("../../config/plugins");

module.exports = (win, options) => [
    {
        label: "(I don't recommend turning the menu off)",
        click: (item) => {
        },
    },
    {
        label: "Hide Icon",
        type: "checkbox",
        checked: options.hideIcon,
        click: (item) => {
            options.hideIcon = item.checked;
            setOptions("in-app-menu", options);
        },
    }
];