const plugin = require('tailwindcss/plugin');

module.exports = plugin(({addUtilities}) => {
	addUtilities({
		'.overflow-initial': {
			overflow: 'initial',
		},
		'.overflow-x-initial': {
			overflowX: 'initial',
		},
		'.overflow-y-initial': {
			overflowY: 'initial',
		},
	});
});
