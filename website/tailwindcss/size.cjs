const plugin = require('tailwindcss/plugin');

module.exports = plugin(({addUtilities, theme, e}) => {
	const widths = theme('width', {});
	const utilityEntries = Object.entries(widths)
		.filter(([sizeKey]) => sizeKey !== 'screen')
		.flatMap(([sizeKey, size]) => [
			['.' + e(`wh-${sizeKey}`), {width: size, height: size}],
			['.' + e(`min-wh-${sizeKey}`), {minWidth: size, minHeight: size}],
			['.' + e(`max-wh-${sizeKey}`), {maxWidth: size, maxHeight: size}],
		]);
	addUtilities(Object.fromEntries(utilityEntries));
	addUtilities({
		'.wh-screen': {
			width: '100vw',
			height: '100vh',
		},
	});
});
