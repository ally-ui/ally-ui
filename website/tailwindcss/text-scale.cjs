const plugin = require('tailwindcss/plugin');

module.exports = plugin(({addUtilities}) => {
	addUtilities({
		'.text-scale': {
			fontSize:
				'clamp(0.9rem, 0.75rem + 0.375vw + var(--user-font-scale), 1rem)',
			lineHeight:
				'clamp(1.575rem, 1.3125rem + 0.65vw + var(--user-font-scale), 1.75rem)',
		},
	});
});
