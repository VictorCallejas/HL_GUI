(function () {

	angular.module('app')

		.controller('DashboardCtrl', DashboardController);

	function DashboardController($scope, Socket, NominalValues, $interval, pdfGeneratorService, pdfValuesService, $ngConfirm) {

		//Initialize run variables to empty
		$scope.maxstripecount = '-'
		$scope.maxspeed = '-'
		$scope.motorsRamp = '-'
		//$scope.timeout = '400'

		$scope.podIP = '192.168.1.150'
		$scope.podPort = '1337'
		$scope.spacexIP = '192.168.8.1'
		$scope.spacexPort = '3000'
		$scope.keepAlive = '50'

		$scope.configRun = false
		$scope.configMiddleware = false
		$scope.mainTest = false

		$scope.runTime = "T- 5:00"
		$scope.alive = 0
		$scope.timestamp = 0

		var globalData;
		$scope.stateDebug = false

		var neumaticaRB = $('#neumatica')
		var contactoresRB = $('#contactores')

		$scope.systemMotor = false
		$scope.systemBMSHV = false
		$scope.systemBrakes = false
		$scope.systemBMSLV = false

		var seconds = 0,
			millis = 0
		var duration = 500
		$scope.timerLabel = 'Countdown'

		$scope.pdf = {}
		$scope.pdf.plot = []
		$scope.pdf.minTempTank1 = 0
		$scope.pdf.maxTempTank1 = 0
		$scope.pdf.minTempTank2 = 0
		$scope.pdf.maxTempTank2 = 0
		$scope.pdf.minPresionTank1 = 0
		$scope.pdf.maxPresionTank1 = 0
		$scope.pdf.minPresionTank2 = 0
		$scope.pdf.maxPresionTank2 = 0
		$scope.pdf.minPresionValve1 = 0
		$scope.pdf.maxPresionValve1 = 0
		$scope.pdf.minPresionValve2 = 0
		$scope.pdf.maxPresionValve2 = 0


		$scope.isTestOrReadyDisabled = true;
		$scope.isCrawlingDisabled = true;
		$scope.isStartDisabled = true;
		$scope.isBrakeDisabled = true;
		$scope.isPneumaticsDisabled = true;
		$scope.isIsolationDisabled = true;
		$scope.isConfigRunDisabled = true;
		$scope.isConfigRunSet = false;
		$scope.areConfigurationParamsValid = false;
		$scope.isSimulationDisabled = true;		

		//$scope.activeCrawler = false;
		$scope.isTest = true;

		// DATA SERVICE

		Socket.on('data', function (msg) {
			globalData = JSON.parse(msg)
		})


		Socket.on('alive', function (data) {
			$scope.alive = data
		})

		setInterval(() => {
			$scope.data = globalData
			updateAchivements()
			states()
			averageRPM()
			updateSystems()
			//manageButtons()
		}, 10)


		manageButtons = () => {
			/*
			
			if ($scope.actualState == 'TST') {
				$scope.isTest = true
			} else {
				$scope.isTest = false
			}
			*/
		}



		// Create the chart
		var chart = Highcharts.stockChart('dash-graphics-velacc', {
			chart: {
				type: 'spline',
				animationLimit: Infinity,
				backgroundColor: null,
				events: {
					load() {
						let chart = this,
							series1 = chart.series[0];
						series2 = chart.series[1];
						setInterval(() => {
							var x1 = (new Date()).getTime(); // current time
							var y1 = parseInt($scope.data.td.a.x);
							var y2 = parseInt($scope.data.td.v);
							// var y1 = Math.floor(Math.random() * 90 ) + 10;
							// var y2 = Math.floor(Math.random() * 90 ) + 10;
							series1.addPoint([x1, y1], true, true);
							series2.addPoint([x1, y2], true, true);

						}, 1000)
					}

				},
			},
			rangeSelector: {
				enabled: false
			},
			xAxis: {
				type: 'datetime',
				tickPixelInterval: 150,
				labels: {
					style: {
						color: 'white',
						fontSize: '1.5em'
					}
				},
			},

			yAxis: [{
				title: {
					text: 'Velocity',
					style: {
						color: 'orange',
						fontSize: '1.5em'
					}
				},
				opposite: false,
				labels: {
					style: {
						color: 'orange',
						fontSize: '1.5em'
					}
				},
			}, {
				title: {
					text: 'Acceleration',
					style: {
						color: 'lightgreen',
						fontSize: '1.5em'
					}
				},
				labels: {
					style: {
						color: 'lightgreen',
						fontSize: '1.5em'
					}
				},
			}],
			tooltip: {
				headerFormat: '<b>{series.name}</b><br/>',
				//pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
				pointFormat: '{point.y:.2f}'
			},
			plotOptions: {
				area: {
					marker: {
						enabled: false,
						symbol: 'circle',
						radius: 2,
						states: {
							hover: {
								enabled: true
							}
						}
					}
				}
			},
			legend: {
				enabled: false
			},
			exporting: {
				enabled: true
			},
			credits: {
				enabled: false
			},
			series: [{
				name: 'Pos',
				marker: {
					enabled: false,
				},
				color: 'lightgreen',
				/*marker: {
					symbol: '',
					radius: 200,

				},*/
				data: (function () {
					// generate an array of random data
					var data = [],
						time = (new Date()).getTime(),
						i;

					for (i = -50; i <= 0; i += 1) {
						data.push({
							x: time,
							y: 0
						});
					}

					return data;

				}()),
			}, {
				name: 'Vel',
				marker: {
					enabled: false
				},

				color: 'orange',
				data: (function () {
					// generate an array of random data
					var data = [];
					var time = (new Date()).getTime();
					var i;

					for (i = -50; i <= 0; i += 1) {
						data.push({
							x: time,
							y: 0
						});
					}

					return data;

				}()),
				yAxis: 1
			}]

		});

		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});

		//STATES

		/**
		 * Return in string format status of Pod
		 * @param {number} id 
		 */

		$scope.previousState = '-'
		$scope.actualState = '-'


		states = () => {
			//console.log($scope.data.s);
			//var stateID = $scope.actualState
			if ($scope.actualState == 'IDLE') {
				$scope.previousState = '-'
			}

			if ($scope.actualState != getNameStatus($scope.data.s)) {
				$scope.previousState = $scope.actualState
				$scope.actualState = getNameStatus($scope.data.s)
				giveButtonPermissions();
			}

		}

		getNameStatus = function (id) {
			if (id == 0) {
				return 'IDLE'
			} else if (id == 1) {
				return 'TST'
			} else if (id == 2) {
				return 'RDY'
			} else if (id == 3) {
				return 'ACC'
			} else if (id == 4) {
				return 'BRK'
			} else if (id == 5) {
				return 'CWL'
			} else if (id == 6) {
				return 'END'
			} else if (id == 7) {
				return 'FLT'
			}

			return '-'
		}

		//AVERAGE RPM

		$scope.averageRPM = 0

		averageRPM = () => {
			$scope.averageRPM = (parseInt($scope.data.m.frtRPM) +
				parseInt($scope.data.m.frbRPM) +
				parseInt($scope.data.m.fltRPM) +
				parseInt($scope.data.m.flbRPM) +
				parseInt($scope.data.m.mrtRPM) +
				parseInt($scope.data.m.mrbRPM) +
				parseInt($scope.data.m.mltRPM) +
				parseInt($scope.data.m.mlbRPM) +
				parseInt($scope.data.m.rrtRPM) +
				parseInt($scope.data.m.rrbRPM) +
				parseInt($scope.data.m.rltRPM) +
				parseInt($scope.data.m.rlbRPM)) / 12
		}


		//ACHIVEMENTS

		$scope.maxVel = 0
		$scope.maxAcc = 0

		resetAchivements = () => {
			$scope.maxVel = 0
			$scope.maxAcc = 0
		}

		updateAchivements = () => {
			if (globalData.td.v > $scope.maxVel) {
				$scope.maxVel = globalData.td.v
			}
			if (globalData.td.a.x > $scope.maxAcc) {
				$scope.maxAcc = globalData.td.a.x
			}
		}

		//CONTROL PANEL

		/*$scope.debugClick = () => {
			$scope.stateDebug = !$scope.stateDebug
			Socket.emit('debug',$scope.stateDebug)
			resetAchivements()
		}*/



		$scope.simulation = () => {
			Socket.emit('simulation')
		}

		$scope.report = () => {
			pdfGeneratorService.createPDF($scope);
			//PdfValuesRunService.startRunValues($scope);

		}

		$scope.run = () => {

			//$scope.runHide()
			countDown($scope, $interval)
			resetAchivements()

			//Empezar a grabar  para la segunda grafica
		}

		$scope.brake = () => {
			var message = {}
			Socket.emit('sendToPod', '3', message)
		}

		$scope.neumatica = () => {
			message = {}
			Socket.emit('sendToPod', '6', message)
		}

		$scope.contactores = () => {
			message = {}
			Socket.emit('sendToPod', '7', message)
		}

		var updateSystems = () => {
			neumaticaRB.prop('checked', parseInt(globalData.p.v))
			contactoresRB.prop('checked', parseInt(globalData.e.c))

			$scope.errors = NominalValues.checkErrors($scope, "CHECK_ALL")

			if ($scope.errors[[1]].length > 0) {
				$scope.systemBMSHV = false;
			} else {
				$scope.systemBMSHV = true;
			}

			if ($scope.errors[[2]].length > 0) {
				$scope.systemBMSLV = false;
			} else {
				$scope.systemBMSLV = true;
			}

			if ($scope.errors[[3]].length > 0) {
				$scope.systemBrakes = false;
			} else {
				$scope.systemBrakes = true;
			}

			if ($scope.errors[[4]].length > 0) {
				$scope.systemMotor = false;
			} else {
				$scope.systemMotor = true;
			}
		}


		// DATA SERVICE

		Socket.on('data', function (msg) {
			globalData = JSON.parse(msg)
		})


		Socket.on('alive', function (data) {
			$scope.alive = data
		})

		setInterval(() => {
			$scope.data = globalData
			updateAchivements()
			states()
			averageRPM()
			updateSystems()
		}, 20)

		//PARAMETER CONFIGURATION FOR RUN

		$scope.configurePamRun = function () {
			var maxstripecount = document.getElementById('maxstripecount').value ? document.getElementById('maxstripecount').value : '0'
			var maxspeed = document.getElementById('maxspeed').value ? document.getElementById('maxspeed').value : '0'
			//var timeout = document.getElementById('timeout').value ? document.getElementById('timeout').value : '0'	
			var motorsRamp = document.getElementById('motorsRamp').value ? document.getElementById('motorsRamp').value : '0'

			var accTimeout = document.getElementById('accTimeout').value ? document.getElementById('accTimeout').value : '0'
			var brakeTimeout = document.getElementById('brakeTimeout').value ? document.getElementById('brakeTimeout').value : '0'
			var crawlerTimeout = document.getElementById('crawlerTimeout').value ? document.getElementById('crawlerTimeout').value : '0'


			var message = ""
			message += maxstripecount
			message += ","
			message += maxspeed
			message += ","
			message += motorsRamp
			message += ","
			message += accTimeout
			message += ","
			message += brakeTimeout
			message += ","
			message += crawlerTimeout
			message += "}"

			var configParamValues = [maxstripecount, maxspeed, motorsRamp, accTimeout, brakeTimeout, crawlerTimeout];

			if (true || areConfigurationParamsValid(configParamValues)) {

				//Transition state parameters to view
				$scope.maxstripecount = maxstripecount
				$scope.maxspeed = maxspeed
				$scope.motorsRamp = motorsRamp

				//SOCKET.EMIT
				Socket.emit('sendToPod', '5', message)

				$scope.configRun = false
				$scope.areConfigurationParamsValid = true;

			} else {
				window.alert("incorrect params for configuration, change it");
			}


		}

		//PARAMETER CONFIGURATION FOR MIDDLEWARE

		$scope.configureMiddleware = function () {
			var podIP = document.getElementById('podIP').value ? document.getElementById('podIP').value : '192.168.1.21'
			var podPort = document.getElementById('podPort').value ? document.getElementById('podPort').value : 1337
			var spacexIP = document.getElementById('spacexIP').value ? document.getElementById('spacexIP').value : '192.168.8.1'
			var spacexPort = document.getElementById('spacexPort').value ? document.getElementById('spacexPort').value : 3000
			var keepAlive = document.getElementById('keepAlive').value ? document.getElementById('keepAlive').value : 50


			var message = "tcp.pod.ip;" + podIP + ';' +
				"tcp.pod.port;" + podPort + ';' +
				"udp.spacex.host;" + spacexIP + ';' +
				"udp.spacex.port;" + spacexPort + ';' +
				"tcp.pod.aliveTimer" + ';' + keepAlive

			//Transition state parameters to view
			$scope.podIP = podIP
			$scope.podPort = podPort
			$scope.spacexIP = spacexIP
			$scope.spacexPort = spacexPort
			$scope.keepAlive = keepAlive

			//SOCKET.EMIT
			Socket.emit('sendToMiddleware', message)

			$scope.configMiddleware = false
		}

		//CONFIGURING PARAMETERS

		$scope.runHide = function () {
			$scope.configRun = false
		}

		$scope.runShow = function () {
			$scope.configRun = true
		}

		$scope.showMiddleware = () => {
			$scope.configMiddleware = true
		}

		$scope.hideMiddleware = () => {
			$scope.configMiddleware = false
		}

		$scope.showMainTest = () => {
			$scope.mainTest = true
			$scope.setTest();
		}

		$scope.setTest = () => {
			var testIDs = ['imu', 'bms', 'avionics', 'brakes', 'motores', 'others']
			i = 0

			testIDs.forEach(id => {
				console.log(id)
				element = '.icon_' + id
				if ($scope.errors[[i]].length > 0) {
					$scope.errors[[i]].forEach(error => {
						console.log(error)
						$(('#err_' + id)).append("<p style=\"margin:2px\">" + error + "</p>");
					});
					$(element).removeClass("fa fa-check fa-3x")
					$(element).addClass('fa fa-times');
					$(element).css('color', 'red');
				} else {
					$(element).removeClass("fa fa-times")
					$(element).addClass('fa fa-check fa-3x');
					$(element).css('color', 'green');
				}
				i++
			});
		}

		$scope.hideMainTest = () => {
			$scope.mainTest = false
		}

		/**
		 * Timer for run
		 */

		stopTimer = () => {
			//endACC($scope, $scope.runTime, $scope.data.td.p, $scope.maxAcc, $scope.maxVel)
			$interval.cancel($scope.stInterval)
		}

		function startTimer($scope, $interval) {
			$interval.cancel($scope.cdInterval)
			//var message = {}
			//Socket.emit('sendToPod', '2' , message)
			//startRunValues($scope)
			startTime = Date.now();
			$scope.timerLabel = 'Timer'
			$scope.stInterval = $interval(function () {
				if ($scope.actualState == 'BRK' || $scope.actualState == 'FLT') {
					console.log('cancel')
					$interval.cancel($scope.stInterval)
				}
				timer = (Date.now() - startTime) / 10

				seconds = timer / 100
				seconds = parseInt(seconds)
				seconds = seconds < 10 ? "0" + seconds : seconds

				millis = timer % 100
				millis = parseInt(millis)
				millis = millis < 10 ? "0" + millis : millis

				$scope.runTime = seconds + ':' + millis
			}, 5)
		}

		function countDown($scope, $interval) {
			timer = duration
			startTime = Date.now();
			$scope.cdInterval = $interval(function () {

				delta = (Date.now() - startTime) / 10
				timer = duration - delta

				seconds = timer / 100
				seconds = parseInt(seconds)
				seconds = seconds < 10 ? "0" + seconds : seconds

				millis = timer % 100
				millis = parseInt(millis)
				millis = millis < 10 ? "0" + millis : millis

				$scope.runTime = 'T- ' + seconds + ":" + millis

				if (timer < 0) {
					var message = {}
					Socket.emit('sendToPod', '2', message)
					startTimer($scope, $interval)
				}
			}, 5);
		}

		/****************************************************************************/

		//CONFIRMATION DIALOG
		$scope.confirm = function (letter) {
			$ngConfirm({
				title: 'Warning',
				content: 'Are you sure you want to execute this command?' + '\n\n' + letter.toUpperCase().bold(),
				icon: 'fa fa-exclamation-triangle',
				animation: 'scale',
				closeAnimation: 'scale',
				opacity: 0.5,
				buttons: {
					'confirm': {
						text: 'Proceed',
						btnClass: 'btn-info',
						action: function () {
							//return send(letter)
							if (letter == 'start') {
								//$scope.activeCrawler = true;
								return $scope.run()

							}
							if (letter == 'isolation') {
								enableRunState();
								return $scope.contactores()
							}
							if (letter == 'pneumatics') {
								return $scope.neumatica()
							}
							if (letter == 'crawler') {
								message = {}
								return Socket.emit('sendToPod', '8', message)
							}
							if (letter == 'test') {
								if ($scope.isTest) {
									$scope.isTest = false;
									message = {}
									return Socket.emit('sendToPod', '1', message)
								} else {
									$scope.isTest = true;
									message = {}
									return Socket.emit('sendToPod', '4', message)

								}

							}
						}
					},
					cancel: function () {
						//CLOSE
					},
				}
			})
		};

		/***********************************************************************
		 * functions to enable buttons in gui in function of every state
		 * 
		 */


		//call function to enable and disable permissions in function of the current state
		function giveButtonPermissions() {
			switch (String($scope.actualState)) {
				case 'IDLE':
					giveButtonPermissionsInIdle();
					break;
				case 'TST':
					giveButtonPermissionsInTest();
					break;
				case 'RDY':
					giveButtonPermissionsInReady();
					break;
				case 'ACC':
					giveButtonPermissionsInRun();
					break;
				case 'BRK':
					giveButtonPermissionsInBrake();
					break;
				case 'CWL':
					giveButtonPermissionsInCrawling();
					break;
				case 'END':
					giveButtonPermissionsInEnd();
					break;
				case 'FLT':
					giveButtonPermissionsInFault();
					break;
				case '-':
					giveButtonPermissionsInNone();
					break;
				default:
					giveButtonPermissionsInNone();
					break;
			}


		}

		function giveButtonPermissionsInIdle() {
			$scope.isIsolationDisabled = true;
			$scope.isPneumaticsDisabled = true;
			$scope.isConfigRunDisabled = true;
			$scope.isSimulationDisabled = false;
			$scope.isCrawlingDisabled = true;
			$scope.isStartDisabled = true;
			$scope.isTestOrReadyDisabled = false;
		}

		function giveButtonPermissionsInTest() {
			$scope.isIsolationDisabled = false;
			$scope.isPneumaticsDisabled = false;
			$scope.isConfigRunDisabled = false;
			$scope.isSimulationDisabled = true;
			$scope.isCrawlingDisabled = true;
			$scope.isStartDisabled = false;
			$scope.isTestOrReadyDisabled = neumaticaRB.checked ? false : true;
		}

		function giveButtonPermissionsInReady() {
			$scope.isIsolationDisabled = false;
			$scope.isPneumaticsDisabled = true;
			$scope.isConfigRunDisabled = false;
			$scope.isSimulationDisabled = true;
			$scope.isCrawlingDisabled = true;
			$scope.isStartDisabled = false;
			$scope.isTestOrReadyDisabled = true;
		}

		function giveButtonPermissionsInRun() {
			$scope.isIsolationDisabled = true;
			$scope.isPneumaticsDisabled = true;
			$scope.isConfigRunDisabled = true;
			$scope.isSimulationDisabled = true;
			$scope.isCrawlingDisabled = true;
			$scope.isStartDisabled = true;
			$scope.isTestOrReadyDisabled = true;
		}

		function giveButtonPermissionsInBrake() {
			$scope.isIsolationDisabled = false;
			$scope.isPneumaticsDisabled = false;
			$scope.isConfigRunDisabled = true;
			$scope.isSimulationDisabled = true;
			$scope.isCrawlingDisabled = false;
			$scope.isStartDisabled = true;
			$scope.isTestOrReadyDisabled = true;
		}

		function giveButtonPermissionsInCrawling() {
			$scope.isIsolationDisabled = true;
			$scope.isPneumaticsDisabled = true;
			$scope.isConfigRunDisabled = true;
			$scope.isSimulationDisabled = true;
			$scope.isCrawlingDisabled = true;
			$scope.isStartDisabled = true;
			$scope.isTestOrReadyDisabled = true;
		}

		function giveButtonPermissionsInEnd() {
			$scope.isIsolationDisabled = true;
			$scope.isPneumaticsDisabled = true;
			$scope.isConfigRunDisabled = true;
			$scope.isSimulationDisabled = true;
			$scope.isCrawlingDisabled = true;
			$scope.isStartDisabled = true;
			$scope.isTestOrReadyDisabled = true;
		}

		function giveButtonPermissionsInFault() {
			$scope.isIsolationDisabled = true;
			$scope.isPneumaticsDisabled = true;
			$scope.isConfigRunDisabled = true;
			$scope.isSimulationDisabled = true;
			$scope.isCrawlingDisabled = true;
			$scope.isStartDisabled = true;
			$scope.isTestOrReadyDisabled = true;
		}

		function giveButtonPermissionsInNone() {
			$scope.isIsolationDisabled = true;
			$scope.isPneumaticsDisabled = true;
			$scope.isConfigRunDisabled = true;
			$scope.isSimulationDisabled = false;
			$scope.isCrawlingDisabled = true;
			$scope.isStartDisabled = true;
			$scope.isTestOrReadyDisabled = true;
		}

		function areConfigurationParamsValid(params) {
			params.forEach(element => {
				if (element.isNaN() || element == undefined || element <= 0) {
					return false;
				}
			});
			return true;

		}

		//function called if isolation is clicked, if isolation is active and state = ready allow go to run
		function enableRunState() {
			if ($scope.actualState == 'RDY' && neumaticaRB.checked) {
				$scope.isTestOrReadyDisabled = false;
			} else {
				$scope.isTestOrReadyDisabled = true;
			}
		}
	}
}());