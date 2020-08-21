angular.module('app')
	.directive('box', function () {
		return {
			restrict: 'E',
			title: '',
			data: '&',
			link: function ($scope, element, attrs) {
				$scope.home = attrs.type == "home" ? true : false;
				var template;


				function getChartChild() {
					switch (attrs.chart) {
						case "acceleration":
							template = "accelerationChart.html";
							break;
						case "velocity":
							template = "velocityChart.html";
							break;
						case "battery":
							template = "batteryChart.html";
						case "main":
							template = "charts.html"
							break;
					}
					return 'app/directives/components/' + template;
				}

				function getDefaultComponentElement() {
					return "app/directives/components/" + template;
				}

				$scope.getContent = function () {
					switch (attrs.type) {
						case "chart": return getChartChild(); break;
						default: template = attrs.template; break;
					}
					if (template != "") {
						return getDefaultComponentElement();
					}
				}

				


			},
			template: "<div ng-include='getContent()'></div>"
		};
	});