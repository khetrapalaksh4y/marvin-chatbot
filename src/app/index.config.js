(function() {
	'use strict';
	angular.module('surveyChatbot').config(config);

	/** @ngInject */
	function config($logProvider) {
		// Enable log
		$logProvider.debugEnabled(true);
	}

})();