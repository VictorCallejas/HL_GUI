
(function () {

    angular.module('app')

        .controller('bmsH4Controller', bmsH4Controller);

    function bmsH4Controller($scope, Socket, NominalValues, pdfValuesService) {

        var globalData;
        var first = false
        var counter = 0 //Connection secondary service

        $scope.isolationOn = 0;
        $scope.errorsBMSHV = true;
		

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
    	})


    	Socket.on('alive', function (data) {
        	$scope.alive = data
    	})


    	setInterval(()=>{
               $scope.data = globalData
               $scope.isolationOn = $scope.data.e.c
			   var errors = NominalValues.checkErrors($scope, "CHECK_BMSHV")
			   
			   if (errors[[1]].length > 0 ) {
                    $scope.errorsBMSHV = true;
				    console.log($scope.errorsBMSHV)
			   } else {
                    $scope.errorsBMSHV = false;
			   }
			   
    	},100)

       

        $scope.switchBusStatus = 0

		$scope.contactores = () => {
			message = {}
			Socket.emit('sendToPod', '7' , message)
		}


		/**
		 * On pod data from rabbit module save to scope
		 */
        /*
        Socket.on('data', function (msg) {
            var data = JSON.parse(msg)
            if (!first) {
                //Set object on first iteration
                globalData = data;
                first = true
            } else {
               // connectivityService.saveTimeStamp(data.messageData.timestamp) //timeStamp connection service
                counter = counter + 1
                updateObj(data, globalData)
            }
        })

        /*
        Socket.on('debug', function (msg) {
            var data = msg
            if (!first) {
                //Set object on first iteration
                globalData = data;
                first = true
            } else {
               // connectivityService.saveTimeStamp(data.messageData.timestamp) //timeStamp connection service
                counter = counter + 1
                updateObj(data, globalData)
            }
        })

        function updateObj(obj, oldObj) {
            try {
                for (var key in obj) {
                    var value = obj[key];
                    var oldValue = oldObj[key]
                    if (typeof value === 'object') {
                        updateObj(value, oldValue);
                    } else {
                        oldObj[key] = obj[key]
                    }
                }
            } catch (e) {
                //NOTHING
            }

        }
        */
        /*
        setInterval(function () {
            $scope.data = globalData


            var sum = 0.0
            //on finish calculate charge level
            for (var key in $scope.data.sensorData.batteries) {
                if (key.startsWith('batt30voltage')) {
                    sum = sum + $scope.data.sensorData.batteries[key]
                    break;
                }
                if (key.startsWith('batt')) {
                    counter += 1
                    sum = sum + $scope.data.sensorData.batteries[key]
                }
            }
            calculateChargeLevel(sum)

            if($scope.chargeLevel > 0.6){
                $('#bms-process').css("background-color", 'lime');
            }else if($scope.chargeLevel > 0.3){
                $('#bms-process').css("background-color", 'yellow');
            }else {
                $('#bms-process').css("background-color", 'red');
            }
        }, 300)
        */


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

        $scope.checkBatteries = function (letter) {
            console.log('Checkout ha sido clickado!!!!!')
            var failure = false;

            /* Recorrer el JSON y mirar los valores de las baterías y de las celdas
            for (var batValue in batteries) {
                if (batValue < VALOR_NOMINAL_MINIMO || batValue > VALOR_NOMINAL_MAXIMO) {
                    console.log('La batería X ha fallado. Revisar')
                    failure = true;

                    //Comprobar cuál de las celdas de esta batería da problemas
                }

            } 

            if (failure == false) {
                console.log('Todas las baterías y sus celdas tienen valores correctos')
            }
            */
            
		};





    }
}());
