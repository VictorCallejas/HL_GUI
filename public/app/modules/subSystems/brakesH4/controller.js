
(function () {

	angular.module('app')

		.controller('brakesH4SystemController', brakesH4SystemController);

	function brakesH4SystemController($scope, $location, $timeout, $sce, Socket, NominalValues, pdfValuesService) {

		$scope.pneumatic_circuit = 'assets/img/pneumatics_0.png'
		
		var globalData;
		var actuators; 
		$scope.listBadActuators = []

		$scope.brakesErrors = true;

		$scope.neumatica = () => {
			message = {}
			Socket.emit('sendToPod', '6' , message)
		}
        

    	Socket.on('data', function (msg) {
			globalData = JSON.parse(msg)
			globalData.p.T1 = parseInt(globalData.p.T1) - 50;
			globalData.p.T2 = parseInt(globalData.p.T2) - 50;
    	})


    	Socket.on('alive', function (data) {
        	$scope.alive = data
    	})


    	setInterval(()=>{
			$scope.data = globalData

			// Open/Close Valve
			if ($scope.data.p.v == 0) {
				console.log("Válvula cerrada")
				
				$scope.pneumatic_circuit = 'assets/img/pneumatics_0.png'	// BLANK
			} else {
				console.log("Válvula abierta")
				
				if ($scope.listBadActuators.length == 0 && $scope.brakesErrors == false) {					
					$scope.pneumatic_circuit = 'assets/img/pneumatics_1.png'  // GREEN
				} else {
					$scope.pneumatic_circuit = 'assets/img/pneumatics_2.png'  // RED
				}
				
			}

			// Check if there are errors
			var errors = NominalValues.checkErrors($scope, "CHECK_BRAKES")
			console.log('Number of errors : ' + errors[[3]].length)
			if (errors[[3]].length > 0) {
				$scope.brakesErrors = true;
			} else {
				$scope.brakesErrors = false;
			}

			// Check which actuators are failling
			actuators = parseInt($scope.data.p.a)
			actuators = actuators.toString(2) // Convert to binary
			console.log(actuators)

			actuatorsList = (""+actuators).split("")  // Split number into list of digits
			
			
			$scope.listBadActuators = []
			
			//var j = 1
			for (var i = 0; i < actuatorsList.length; i++) {
				if (actuatorsList[i] == 1) {
					//console.log('Está fallando el actuador: ' + (i+1))
					$scope.listBadActuators.push((i+1))
				} else {
					//$scope.listBadActuators.push()
				}
				//j++;
			}
			console.log('Bad actuators: ' + $scope.listBadActuators)
		

		},100)
		
	

		/*
		$scope.trustAsHtml = function (string) {
			return $sce.trustAsHtml(string)
		}
		*/

		//Emergency shut off
		$scope.emergencyShutOff = function () {
			console.log("Emergency shut off activated!")
			var message = {}			
			Socket.emit('sendToPod', '6', message)
		}
	}
}());
