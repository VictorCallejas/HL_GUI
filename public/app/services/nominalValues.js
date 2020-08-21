angular.module('app')

    .service('NominalValues', function () {

        /**
        * Assigns to scope the nominal values
        */
        this.checkErrors = function ($scope, mode) {
            $scope.errors = [[],[],[],[],[],[]];
            var errors = [[],[],[],[],[],[]];            
            
            /**
             * Configurable nominal values for health check
             * Format: [min,max]
             */

            /**
             * Batteries and motors (values)
             * Voltage 		-Voltage
             * Amperage 	-Amps
             * Temperature  -Celcius
             */
            
           
            if (mode == 'CHECK_IMU' || mode == 'CHECK_ALL') {
                //console.log('Checking IMU..')           
                if ($scope.data.a.x < 0 || $scope.data.a.x > 14)  {
                    errors[[0]].push('X Acceleration sensor error')
                }   
                if ($scope.data.o.p < 0 || $scope.data.o.p > 1) {
                    errors[[0]].push('Ambient pressure error')
                }
                if ($scope.data.o.t < -50 || $scope.data.o.t > 150) {
                    errors[[0]].push('Ambient temperature error')
                }
                if ($scope.data.td.c < 0 || $scope.data.td.c > 41) {
                    errors[[0]].push('Tapes count error')
                }
                if ($scope.data.td.p < 0 || $scope.data.td.p > 4150) {
                    errors[[0]].push('IMU position sensor error')
                }
                if ($scope.data.td.d < 0 || $scope.data.td.d > 4150) {
                    errors[[0]].push('Distance to end sensor error')
                }
            }

            //1
            if (mode == 'CHECK_BMSHV' || mode == 'CHECK_ALL') {
                //console.log('Checking BMS HV..')
                var bmsBoxes = ['b1','b2','b3','b4','b5','b6'];
                var bmsTCells = ['cT1','cT2','cT3','cT4','cT5','cT6', 'cT7', 'cT8', 'cT9', 'cT10', 'cT11', 'cT12']
                var bmsV = ['v1', 'v2']
                var bmsC = ['c1', 'c2']
                var bmsCharge = ['s1','s2']

                // Check Temperatures
                for (var i = 0; i < bmsBoxes.length; i++){
                    for (var j = 0; j < bmsTCells.length; j++) {
                        if ($scope.data.e[bmsBoxes[i]][bmsTCells[j]] < 10 || $scope.data.e[bmsBoxes[i]][bmsTCells[j]] > 70) {
                            errors[[1]].push('Temperature (' + bmsTCells[j] + ') from box (' + bmsBoxes[i] + ') is failling')
                        }
                    }
                }

                // Check Voltages
                for (var i = 0; i < bmsBoxes.length; i++){
                    for (var j = 0; j < bmsV.length; j++) {
                        if ($scope.data.e[bmsBoxes[i]][bmsV[j]] < 69 || $scope.data.e[bmsBoxes[i]][bmsV[j]] > 97) {
                            errors[[1]].push('Voltage (' + bmsV[j] + ') from box (' + bmsBoxes[i] + ') is failling')
                        }
                    }
                }

                // Check Currents
                for (var i = 0; i < bmsBoxes.length; i++){
                    for (var j = 0; j < bmsC.length; j++) {
                        if ($scope.data.e[bmsBoxes[i]][bmsC[j]] < 0 || $scope.data.e[bmsBoxes[i]][bmsC[j]] > 202) {
                            errors[[1]].push('Current (' + bmsC[j] + ') from box (' + bmsBoxes[i] + ') is failling')
                        }
                    }
                }

                // Check % Charge
                for (var i = 0; i < bmsBoxes.length; i++){
                    for (var j = 0; j < bmsCharge.length; j++) {
                        if ($scope.data.e[bmsBoxes[i]][bmsCharge[j]] < 5|| $scope.data.e[bmsBoxes[i]][bmsCharge[j]] > 100) {
                            errors[[1]].push('Charge (' + bmsCharge[j] + ') from box (' + bmsBoxes[i] + ') is failling')
                        }
                    }
                }
                
                
            }

            //2
            if (mode == 'CHECK_BMSLV' || mode == 'CHECK_ALL') {
                //console.log('Checking BMS LV..')
                var avBoxes = ['a1','a2','a3']          
                var avVoltage = ['c1','c2','c3','c4'];      
                
                
                // Check Cell Voltages
                for (var i = 0; i < avBoxes.length; i++){
                    for (var j = 0; j < avVoltage.length; j++) {
                        if ($scope.data.a[avBoxes[i]][avVoltage[j]] < 2.95 || $scope.data.a[avBoxes[i]][avVoltage[j]] > 4.3) {
                            errors[[2]].push('Avionics cell voltage (' +avVoltage[j] + ') from ' + avBoxes[i] + ' is failling')
                        }
                    }
                }

                var avTemperatures = ['t1', 't2'];
                //Check Pack temperature
                for (var i = 0; i < avBoxes.length; i++){
                    for (var j = 0; j < avTemperatures.length; j++) {
                        if ($scope.data.a[avBoxes[i]][avTemperatures[j]] < 10 || $scope.data.a[avBoxes[i]][avTemperatures[j]] > 60) {
                            errors[[2]].push('Avionics cell temperature (' + avTemperatures[j] + ') from ' + avBoxes[i] + ' is failling')
                        }
                    }
                }

                var avCurrent = ['c1', 'c2', 'c3', 'c4'];
                // Check Cell Current
                for (var i = 0; i < avBoxes.length; i++){
                    for (var j = 0; j < avCurrent.length; j++) {
                        if ($scope.data.a[avBoxes[i]][avCurrent[j]] < 0 || $scope.data.a[avBoxes[i]][avCurrent[j]] > 5) {
                            errors[[2]].push('Avionics cell current (' +avCurrent[j] + ') from ' + avBoxes[i] + ' is failling')
                        }
                    }
                }
            }

            //3
            if (mode == 'CHECK_BRAKES' || mode == 'CHECK_ALL') {
                //console.log('Checking PNEUMATICS..')        
                
                // Check High Pressure
                if ($scope.data.p.HP1 < 100|| $scope.data.p.HP1 > 220) {
                    errors[[3]].push('High Pressure (HP1) from Tank 1 is failling')
                }
                if ($scope.data.p.HP2 < 100 || $scope.data.p.HP2 > 220) {
                    errors[[3]].push('High Pressure (HP2) from Tank 2 is failling')
                }

                // Check Low Pressure
                if ($scope.data.p.LP1 < -3 || $scope.data.p.LP1 > 8) {
                    errors[[3]].push('Low Pressure (LP1) from Tank 1 is failling')
                }
                if ($scope.data.p.LP2 < -3 || $scope.data.p.LP2 > 8) {
                    errors[[3]].push('Low Pressure (LP2) from Tank 2 is failling')
                }

                // Check Temperature
                if ($scope.data.p.T1 < 5 || $scope.data.p.T1 > 90) {
                    errors[[3]].push('Temperature (T1) is failling')
                }
                if ($scope.data.p.T2 < 5 || $scope.data.p.T2 > 90) {
                    errors[[3]].push('Temperature (T2) is failling')
                }

                

            }

            //4
            if (mode == 'CHECK_MOTORS' || mode == 'CHECK_ALL') {
                //console.log('Checking motors... \n')
                var motorsT = ["frtT","frbT","fltT","flbT","mrtT",
                    "mrbT","mltT","mlbT","rrtT","rrbT","rltT","rlbT",
                ];
                var motorsC = ["frtC","frbC","fltC","flbC","mrtC",
                    "mrbC","mltC","mlbC","rrtC","rrbC","rltC","rlbC",
                ];
                var motorsV = ["frtV","frbV","fltV","flbV","mrtV",
                    "mrbV","mltV","mlbV","rrtV","rrbV","rltV","rlbV",
                ];

                

                // Check Temperature
                // console.log('Checking Temperature: \n' )   
                
                for (var i = 0; i < motorsT.length; i++) {
                    if ($scope.data.m[motorsT[i]] < 0 || $scope.data.m[motorsT[i]] > 75 ) {
                        errors[[4]].push('Motor Temperature (' + motorsT[i] + ') is failling')
                    }
                }
                //console.log('---------------------' )
                
                // Check Current
                //console.log('Checking Current: \n')
                for (var i = 0; i < motorsC.length; i++) {
                    if ($scope.data.m[motorsC[i]] < 0 || $scope.data.m[motorsC[i]] > 300) {
                        errors[[4]].push('Motor Current (' + motorsC[i] + ') is failling')
                    }
                }
                //console.log('---------------------' )

                // Check Voltage
                //console.log('Checking Voltage: \n')
                for (var i = 0; i < motorsV.length; i++) {
                    if ($scope.data.m[motorsV[i]] < 0 || $scope.data.m[motorsV[i]] > 150) {
                        errors[[4]].push('Motor Voltage (' + motorsV[i] + ') is failling')
                    }
                }
                //console.log('---------------------' )
                //console.log(errors)
                
                
            }
            

            if (mode == 'CHECK_ERRORS' || mode == 'CHECK_ALL') {
                //console.log('Checking ERRORS..')                
            }


            return errors;


        }
        
    });
