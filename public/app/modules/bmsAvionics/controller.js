
(function () {

    angular.module('app')

        .controller('bmsAvionicsController', bmsAvionicsController);

    function bmsAvionicsController($scope, $location, $timeout, $ngConfirm, $window, $sce, Socket, NominalValues, pdfValuesService) {

        var globalData;
		$scope.avionicsErrors = false

       /* function updateObj(obj, oldObj) {
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
		}*/
        
    	Socket.on('data', function (msg) {
        	/*if(first){
            	globalData = msg
            	first = false
        	}
			updateObj(msg, globalData)
			console.log(globalData)*/
			globalData = JSON.parse(msg)
			
			checkingErrors();
			
    	})

		function checkingErrors(){
			var errors = NominalValues.checkErrors($scope, "CHECK_BMSLV")
			   
			   if (errors[[2]].length > 0 ) {
					$scope.err_a1 = false
					$scope.err_a2 = false
					$scope.err_a3 = false
				   // Check if the error is from Avionics BMS1 or BMS
				 errors[[2]].forEach(element => {
					if (element.includes("a1")) {
						$scope.err_a1 = true
					}
					if (element.includes("a2")) {
					 	$scope.err_a2 = true
					}
					if (element.includes("a3")) {
						$scope.err_a3 = true
				   }
				 }); 
			 
			   
				} else {
					$scope.err_a1 = false
					$scope.err_a2 = false
					$scope.err_a3 = false
				}
		}
		

    	Socket.on('alive', function (data) {
        	$scope.alive = data
    	})


    	setInterval(()=>{
			   $scope.data = globalData
			   
    	},10)

	
      

        $scope.emOn = function(){
            Socket.emit('parameter', { 'battery_contactors': 1 });
            $scope.switchBusStatus = 1
		}
		

        $scope.emergencyShutOff = function () {
            Socket.emit('parameter', { 'batteryContactors': 0 });
            $scope.switchBusStatus = 0
		}


        var obj = {
            battery: '0%'
        };

        function changeBatAnim(percentage) {
            $('#bms-process').css("width", percentage);
        }


        //charge level
        $scope.chargeLevel = 0

        function calculateChargeLevel(sum) {
            console.log(sum)
            //max possible charge
            $scope.chargeLevel = (sum - 585) / 171

            changeBatAnim(($scope.chargeLevel * 100).toFixed(2) + '%')
            console.log($scope.chargeLevel)
        }
    }
}());
