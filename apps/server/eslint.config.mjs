import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist'] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
		},
	}
);
