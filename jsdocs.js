/** ****************************************************************************************************
 * @file: jsdocs.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Aug-2018
 *******************************************************************************************************/
'use strict';

/**
 * @module module:middleware
 * @global
 * @description API middleware
 */

module.exports = {
	plugins: [
		'plugins/markdown'
	],
	recurseDepth: 20,
	source: {
		include: [
			'README.md',
			'./'
		],
		exclude: [
			'node_modules/',
			'docs/'
		],
		includePattern: '.+\\.js(doc|x)?$',
		excludePattern: '(^|\\/|\\\\)_'
	},
	sourceType: 'module',
	tags: {
		allowUnknownTags: true,
		dictionaries: [
			'jsdoc',
			'closure'
		]
	},
	templates: {
		referenceTitle: 'beapi',
		cleverLinks: true,
		monospaceLinks: true,
		disableSort: false
	},
	opts: {
		encoding: 'utf8',
		destination: 'docs/',
		recurse: true,
		template: './node_modules/jsdoc-template'
	}
};
