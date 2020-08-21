angular.module('app')
    .directive('check', function () {
        return {
            restrict: 'E',
            title: '',
            data: '&',
            link: function ($scope, $mdToast, element, attrs, NominalValues, Socket) {

                /**
                 * Insert in $scope.off_nominal array, arrays with parameter and off-nominal value.
                 * For every array within the array, show box with error with directive
                 */

                $scope.off_nominal = new Array(20) //Array of arrays
                $scope.addedArching = false

                flag()//RUN

                /**
                 * Check whether any values from dataObject are not within nominal ranges
                 */
                
                function flag() {
                    /*
                    try {
                        setInterval(function () {
                            $scope.warningText = '' //RESET ON EACH ITERATION

                            //BAT FRONT LOW VOLTAGE CHECK
                            value = $scope.data.sensorData.batteries.front_pack_lowest_voltage
                            if ($scope.bat_front_v_low[0] > value || value > $scope.bat_front_v_low[1]) {
                                addOffNominal('bat_front_v_low', value)
                            } else {
                                checkIfOffNominal('bat_front_v_low')
                            }

                            //BAT FRONT MEAN VOLTAGE CHECK
                            value = $scope.data.sensorData.batteries.front_pack_mean_voltage
                            if ($scope.bat_front_v_mean[0] > value || value > $scope.bat_front_v_mean[1]) {
                                addOffNominal('bat_front_v_mean', value)
                            } else {
                                checkIfOffNominal('bat_front_v_mean')
                            }

                            //BAT FRONT HIGH VOLTAGE CHECK
                            value = $scope.data.sensorData.batteries.front_pack_highest_voltage
                            if ($scope.bat_front_v_high[0] > value || value > $scope.bat_front_v_high[1]) {
                                addOffNominal('bat_front_v_high', value)
                            } else {
                                checkIfOffNominal('bat_front_v_high')
                            }

                            //BAT FRONT CURRENT CHECK
                            value = $scope.data.sensorData.batteries.front_pack_current
                            if ($scope.bat_front_a[0] > value || value > $scope.bat_front_a[1]) {
                                addOffNominal('bat_front_a', value)
                            } else {
                                checkIfOffNominal('bat_front_a')
                            }

                            //BAT FRONT TEMPERATURE CHECK
                            value = $scope.data.sensorData.batteries.front_pack_temperature
                            if ($scope.bat_front_t[0] > value || value > $scope.bat_front_t[1]) {
                                addOffNominal('bat_front_t', value)
                            } else {
                                checkIfOffNominal('bat_front_t')
                            }

                            //BAT FRONT PRESSURE CHECK
                            value = $scope.data.sensorData.batteries.front_pack_pressure
                            if ($scope.bat_front_pressure[0] > value || value > $scope.bat_front_pressure[1]) {
                                addOffNominal('bat_front_pressure', value)
                            } else {
                                checkIfOffNominal('bat_front_pressure')
                            }

                            //BAT REAR VOLTAGE CHECK
                            value = $scope.data.sensorData.batteries.rear_pack_voltage
                            if ($scope.bat_rear_v_high[0] > value || value > $scope.bat_rear_v_high[1]) {
                                addOffNominal('bat_rear_v', value)
                            } else {
                                checkIfOffNominal('bat_rear_v')
                            }

                            //BAT REAR CURRENT CHECK
                            value = $scope.data.sensorData.batteries.rear_pack_current
                            if ($scope.bat_rear_a[0] > value || value > $scope.bat_rear_a[1]) {
                                addOffNominal('bat_rear_a', value)
                            } else {
                                checkIfOffNominal('bat_rear_a')
                            }

                            //BAT REAR TEMPERATURE CHECK
                            value = $scope.data.sensorData.batteries.rear_pack_temperature
                            if ($scope.bat_rear_t[0] > value || value > $scope.bat_rear_t[1]) {
                                addOffNominal('bat_rear_t', value)
                            } else {
                                checkIfOffNominal('bat_rear_t')
                            }

                            //FRONT MOTOR VOLTAGE CHECK
                            value = $scope.data.sensorData.motors.front_motor_voltage
                            if ($scope.motor_front_v[0] > value || value > $scope.motor_front_v[1]) {
                                addOffNominal('front_motor_v', value)
                            } else {
                                checkIfOffNominal('front_motor_v')
                            }

                            //REAR MOTOR VOLTAGE CHECK
                            value = $scope.data.sensorData.motors.rear_motor_voltage
                            if ($scope.motor_rear_v[0] > value || value > $scope.motor_rear_v[1]) {
                                addOffNominal('rear_motor_v', value)
                            } else {
                                checkIfOffNominal('rear_motor_v')
                            }

                            //FRONT MOTOR CURRENT CHECK
                            value = $scope.data.sensorData.motors.front_motor_current
                            if ($scope.motor_front_a[0] > value || value > $scope.motor_front_a[1]) {
                                addOffNominal('front_motor_a', value)
                            } else {
                                checkIfOffNominal('front_motor_a')
                            }

                            //REAR MOTOR CURRENT CHECK
                            value = $scope.data.sensorData.motors.rear_motor_current
                            if ($scope.motor_rear_a[0] > value || value > $scope.motor_rear_a[1]) {
                                addOffNominal('rear_motor_a', value)
                            } else {
                                checkIfOffNominal('rear_motor_a')
                            }

                            //FRONT MOTOR TEMPERATURE CHECK
                            value = $scope.data.sensorData.motors.front_motor_temperature
                            if ($scope.motor_front_t[0] > value || value > $scope.motor_front_t[1]) {
                                addOffNominal('front_motor_t', value)
                            } else {
                                checkIfOffNominal('front_motor_t')
                            }

                            //REAR MOTOR TEMPERATURE CHECK
                            value = $scope.data.sensorData.motors.rear_motor_temperature
                            if ($scope.motor_rear_t[0] > value || value > $scope.motor_rear_t[1]) {
                                addOffNominal('rear_motor_t', value)
                            } else {
                                checkIfOffNominal('rear_motor_t')
                            }


                            //BAT REAR PRESSURE CHECK
                            value = $scope.data.sensorData.batteries.rear_pack_pressure
                            if ($scope.bat_rear_pressure[0] > value || value > $scope.bat_rear_pressure[1]) {
                                addOffNominal('bat_rear_pressure', value)
                            } else {
                                checkIfOffNominal('bat_rear_pressure')
                            }

                            //COOLANT PRESSURE CHECK
                            value = $scope.data.sensorData.pressure.coolant_pressure
                            if ($scope.coolant_pressure[0] > value || value > $scope.coolant_pressure[1]) {
                                addOffNominal('coolant_pressure', value)
                            } else {
                                checkIfOffNominal('coolant_pressure')
                            }

                            //PNEUMATIC PRESSURE 1
                            value = $scope.data.sensorData.pressure.pneumatic_circuit_pressure1
                            if ($scope.pneumatic_pressure1[0] > value || value > $scope.pneumatic_pressure1[1]) {
                                addOffNominal('pneumatic_pressure1', value)
                            } else {
                                checkIfOffNominal('pneumatic_pressure1')
                            }

                            //PNEUMATIC PRESSURE 2
                            value = $scope.data.sensorData.pressure.pneumatic_circuit_pressure2
                            if ($scope.pneumatic_pressure2[0] > value || value > $scope.pneumatic_pressure2[1]) {
                                addOffNominal('pneumatic_pressure2', value)
                            } else {
                                checkIfOffNominal('pneumatic_pressure2')
                            }

                            //PNEUMATIC PRESSURE 3
                            value = $scope.data.sensorData.pressure.pneumatic_circuit_pressure3
                            if ($scope.pneumatic_pressure3[0] > value || value > $scope.pneumatic_pressure3[1]) {
                                addOffNominal('pneumatic_pressure3', value)
                            } else {
                                checkIfOffNominal('pneumatic_pressure3')
                            }

                            //PNEUMATIC PRESSURE 4
                            value = $scope.data.sensorData.pressure.pneumatic_circuit_pressure4
                            if ($scope.pneumatic_pressure4[0] > value || value > $scope.pneumatic_pressure4[1]) {
                                addOffNominal('pneumatic_pressure4', value)
                            } else {
                                checkIfOffNominal('pneumatic_pressure4')
                            }

                            if ($scope.warningText == '') {
                                $scope.showModal = false
                            }

                        }, 1000)//CHECK EVERY 1000ms
                    } catch (e) {

                    }
                    */
                }
                
                //TEMP
                $scope.showModal = false
                $scope.warningText = ''


                function addWarning(text, value) {
                    $scope.warningText += $scope.trustAsHtml(text + " : " + value + '<br>')
                    $scope.showModal = true
                };

                /**
                 * Add to error array off nominal component and its value
                 * @param {String} component 
                 * @param {Double} value 
                 */
                function addOffNominal(component, value) {
                    var found = false
                    for (var i = 0; i < $scope.off_nominal.length; i++) {
                        try {
                            if ($scope.off_nominal[i][0] == component) {
                                //Already inside don't do anything
                                $scope.warningText += $scope.trustAsHtml(component + " : " + value + '<br>')
                                found = true
                            }
                        } catch (e) {
                            //NOTHING
                        }
                    }

                    if (!found) {
                        $scope.off_nominal.push([component, value])
                        addWarning(component, value)
                    }
                }

                /**
                 * Check in flag array if component was not within nominal range
                 * @param {String} componentName 
                 */
                function checkIfOffNominal(componentName) {
                    for (var i = 0; i < $scope.off_nominal.length; i++) {
                        try {
                            if ($scope.off_nominal[i][0] == componentName) {
                                $scope.off_nominal.splice(i, 1)
                            }
                        } catch (e) {
                            //NOTHING
                        }
                    }
                }

                //Close modal on click
                $scope.closeModal = function () {
                    $scope.showModal = false
                }

                //Open modal on click
                $scope.openModal = function () {
                    $scope.showModal = true
                }


            },
            template: ""
        };
    });