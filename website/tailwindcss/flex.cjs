const plugin = require('tailwindcss/plugin');

module.exports = plugin(({addUtilities}) => {
	addUtilities({
		'.flex-center': {
			justifyContent: 'center',
			alignItems: 'center',
		},
	});
});
