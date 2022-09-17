const plugin = require('tailwindcss/plugin');

module.exports = plugin(({addVariant}) => {
	addVariant(
		'has-pointer',
		'@media (any-hover: hover) and (any-pointer: fine)',
	);
});
