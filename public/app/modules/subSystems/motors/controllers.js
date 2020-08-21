
(function () {

	angular.module('app')

		.controller('motorSystemController', motorSystemController);

	function motorSystemController($scope, $location, $timeout, $sce, Socket, NominalValues, pdfValuesService) {

		/*
		var motorSpeed, pumpSpeed
		var bat1Switch, bat2Switch
		*/

		var destroyed = false
		var globalData
		var first = true

		$scope.errorsMotors = true
		$scope.configTestMotors = false
		$scope.configMotorsDone = false

		$scope.motorId = 0		
		$scope.rampTime = 0
		$scope.speedTarget = 0
		$scope.testTimeout = 0

		$scope.startMotorTest = () => {
			var message = {}
			Socket.emit('sendToPod', '2' , message)
		}

		$scope.stopMotorTest = () => {
			var message = {}
			Socket.emit('sendToPod', '3' , message)
		}


		$scope.showMotorsConfig = () => {
			$scope.configTestMotors = true
			console.log("boton activado!")
		}

		$scope.hideMotorsConfig = () => {
			$scope.configTestMotors = false
		}

		$scope.configMotorsTest = () => {
			var motorId = document.getElementById('motorId').value ? document.getElementById('motorId').value : '0'
			var rampTime = document.getElementById('rampTime').value ? document.getElementById('rampTime').value : '0'
			//var timeout = document.getElementById('timeout').value ? document.getElementById('timeout').value : '0'	
			var speedTarget = document.getElementById('speedTarget').value ? document.getElementById('speedTarget').value : '0'	

			var testTimeout = document.getElementById('testTimeout').value ? document.getElementById('testTimeout').value : '0'

			
			var message = {
				"mi": motorId,
				"rt": rampTime,
				"st": speedTarget,
				"tt": testTimeout
			} 

			//Transition state parameters to view
			$scope.motorId = motorId		
			$scope.rampTime = rampTime
			$scope.speedTarget = speedTarget
			$scope.testTimeout = testTimeout
			//SOCKET.EMIT
			Socket.emit('sendToPod', '9' , message)

			//$scope.configTestMotors = false

			$scope.hideMotorsConfig()
			
		}

		/* ---------------------- Connectivity --------------------- */
		/*
		function updateObj(obj, oldObj) {
			try {
				for (var key in obj) {
					var value = obj[key]
					var oldValue = oldObj[key]
					if (typeof value === 'object') {
						updateObj(value, oldValue)
					} else {
						oldObj[key] = obj[key]
					}
				}
			} catch (e) {
				//NOTHING
			}
		}
		*/

		//stateDebug = false

		/*
		$scope.debugClick = function() {
			stateDebug = !stateDebug
			Socket.emit('debug',stateDebug)
		}
		*/
        

    	Socket.on('data', function (msg) {
        	/*if(first){
            	globalData = msg
            	first = false
        	}
			updateObj(msg, globalData)*/
			//console.log(globalData)
			globalData = JSON.parse(msg)
			checkingErrors();
			
    	})


    	Socket.on('alive', function (data) {
        	$scope.alive = data
		})
		
		setInterval(()=>{
			$scope.data = globalData

		},100)
		
		/* ---------------------- END Connectivity --------------------- */

		/* ---------------------- Buttons Controllers ------------------- */
		
		// Send Stop order
		$scope.stopMotors = function () {
			message = {}
			Socket.emit('sendToPod', 3 , message)
		}

		// Check nominal values
		$scope.checkMotors = function (letter) {
			var errors = NominalValues.checkErrors($scope, 'CHECK_ALL');
			//console.log(errors);           
		};

		function checkingErrors(){

			// Check if there are errors
			var errors = NominalValues.checkErrors($scope, "CHECK_MOTORS")
			//console.log('Number of errors : ' + errors[[3]].length)
			if (errors[[4]].length > 0) {
				$scope.errorsMotors = true;

				$scope.err_frt = false
				$scope.err_frb = false
				$scope.err_flt = false
				$scope.err_flb = false

				$scope.err_mrt = false
				$scope.err_mrb = false
				$scope.err_mlt = false
				$scope.err_mlb = false

				$scope.err_rrt = false
				$scope.err_rrb = false
				$scope.err_rlt = false
				$scope.err_rlb = false

				errors[[4]].forEach(element => {
					// Check front motors
					if (element.includes("frt")) {
						if($scope.data.m.frtRPM > 30){
							$scope.err_frt = false
						}else{
							$scope.err_frt = true
						}
					}
					if (element.includes("frb")) {
						$scope.err_frb = true
					}
					if (element.includes("flt")) {
						$scope.err_flt = true
					}
					if (element.includes("flb")) {
						$scope.err_flb = true
					}

					// Check middle motors
					if (element.includes("mrt")) {
						$scope.err_mrt = true
					}
					if (element.includes("mrb")) {
						$scope.err_mrb = true
					}
					if (element.includes("mlt")) {
						$scope.err_mlt = true
					}
					if (element.includes("mlb")) {
						$scope.err_mlb = true
					}

					// Check rear motors
					if (element.includes("rrt")) {
						$scope.err_rrt = true
					}
					if (element.includes("rrb")) {
						$scope.err_rrb = true
					}
					if (element.includes("rlt")) {
						$scope.err_rlt = true
					}
					if (element.includes("rlb")) {
						$scope.err_rlb = true
					}
				 }); 

			} else {
				$scope.err_frt = false
				$scope.err_frb = false
				$scope.err_flt = false
				$scope.err_flb = false

				$scope.err_mrt = false
				$scope.err_mrb = false
				$scope.err_mlt = false
				$scope.err_mlb = false

				$scope.err_rrt = false
				$scope.err_rrb = false
				$scope.err_rlt = false
				$scope.err_rlb = false
				
			}

		}

	}
}());
