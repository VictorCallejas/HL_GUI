
var app = angular.module('app', [
	'ngRoute',
	'btford.socket-io',
	'highcharts-ng',
	'ngJustGage',
	'gridster',
	'cp.ngConfirm',
	'uiSwitch',
	'rzModule'
])
	.config(config);

function config($routeProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'app/modules/dashboard/index.html',
			controller: 'DashboardCtrl'
		})
		.when('/subsystems/motors', {
			templateUrl: 'app/modules/subSystems/motors/index.html',
			controller: 'motorSystemController'
		})
		
		.when('/subsystems/brakesH4', {
			templateUrl: 'app/modules/subSystems/brakesH4/index.html',
			controller: 'brakesH4SystemController'
		})
		
		.when('/sensorData', {
			templateUrl: 'app/modules/sensorData/index.html',
			controller: 'sensorDataController'
		})
		.when('/bmsH4', {
			templateUrl: 'app/modules/bmsH4/index.html',
			controller: 'bmsH4Controller'
		})
		.when('/bmsAvionics', {
			templateUrl: 'app/modules/bmsAvionics/index.html',
			controller: 'bmsAvionicsController'
		})
		.otherwise({
			redirectTo: '/'
		});

}