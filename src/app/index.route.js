(function() {
	'use strict';
	angular.module('surveyChatbot').config(routerConfig);
	/** @ngInject */
	function routerConfig($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'app/templates/index.html',
			controller: 'IndexController',
			controllerAs: 'index'
		})
		.state('oops', {
			url: '/oops',
			templateUrl: 'app/templates/404.html',
			controller: 'IndexController',
			controllerAs: 'index'
		})
		.state('chat', {
			url: '/chat',
			templateUrl: 'app/templates/chat.html',
			controller: 'ChatController',
			controllerAs: 'chat'
		});
		$urlRouterProvider.otherwise('/oops');
	}
})();