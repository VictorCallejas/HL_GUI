
(function () {

	angular.module('app')

		.controller('sensorDataController', sensorDataController);

	function sensorDataController($scope, $location, $timeout, $sce, Socket, NominalValues, pdfValuesService) {

		var globalData;
		var first = false
		var counter = 0 //Connection secondary service

		var boards; 
		$scope.boards = []

		$scope.brakesErrors = true;

		stateDebug = false

        
		$scope.debugClick = function() {
			stateDebug = !stateDebug
			Socket.emit('debug',stateDebug)
        }
        

    	Socket.on('data', function (msg) {
			
        	/*if(first){
            	globalData = msg
            	first = false
        	}
			updateObj(msg, globalData)*/
			//console.log(globalData)
			globalData = JSON.parse(msg)
    	})


    	Socket.on('alive', function (data) {
        	$scope.alive = data
    	})


		setInterval(()=>{
			$scope.data = globalData
			// Check which actuators are failling
			boards = parseInt($scope.data.bs, 10)
			console.log(boards)			
			boards = boards.toString(2) // Convert to binary
			console.log(boards)


			boardStatusList = (""+boards).split("")  // Split number into list of digits
			console.log(boardStatusList)
			
			$scope.boards = []
			
			//var j = 1
			for (var i = boardStatusList.length -1; i >=0; i--) {
				if (boardStatusList[i] == 1) {
					//console.log('Está fallando el actuador: ' + (i+1))
					$scope.boards.push(true)
				} else {
					$scope.boards.push(false)
					//$scope.listBadActuators.push()
				}
				//j++;
			}
			console.log($scope.boards)
			//console.log('Bad boards: ' + $scope.listBadBoards)
		},100)

	}
}());
