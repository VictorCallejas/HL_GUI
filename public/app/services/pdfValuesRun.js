angular.module('app')

    .service('PdfValuesRunService', function () {

        this.calculatePDF = function($scope, counter, pos, acc, vel, aX, aY, aZ, mrpm) {
        var tick = {
            id : counter,
            position : pos,
            acceleration : acc,
            velocity : vel,
            perfilX : aX,
            perfilY : aY,
            perfilZ : aZ,
            rpm : mrpm
        }

            $scope.pdf.plot.push(tick)

            //BRAKES
            if($scope.data.p.T1 > $scope.pdf.maxTempTank1){
                $scope.pdf.maxTempTank = $scope.data.p.T1
            }
            if($scope.data.p.T1 < $scope.pdf.minTempTank1){
                $scope.pdf.minTempTank = $scope.data.p.T1
            }
            if($scope.data.p.T2 > $scope.pdf.maxTempTank2){
                $scope.pdf.maxTempTank = $scope.data.p.T2
            }
            if($scope.data.p.T2 < $scope.pdf.minTempTank2){
                $scope.pdf.minTempTank = $scope.data.p.T2
            }

            if($scope.data.p.HP1 > $scope.pdf.maxPresionTank1){
                $scope.pdf.maxPresionTank1 = $scope.data.p.HP1
            }
            if($scope.data.p.HP1 < $scope.pdf.minPresionTank1){
                $scope.pdf.minPresionTank1 = $scope.data.p.HP1
            }
            if($scope.data.p.HP2 > $scope.pdf.maxPresionTank2){
                $scope.pdf.maxPresionTank2 = $scope.data.p.HP2
            }
            if($scope.data.p.HP2 < $scope.pdf.minPresionTank2){
                $scope.pdf.minPresionTank2 = $scope.data.p.HP2
            }


            if($scope.data.p.LP1 > $scope.pdf.maxPresionValve1){
                $scope.pdf.maxPresionValve1 = $scope.data.p.LP1
            }
            if($scope.data.p.LP1 < $scope.pdf.minPresionValve1){
                $scope.pdf.minPresionValve1 = $scope.data.p.LP1
            }
            if($scope.data.p.LP2 > $scope.pdf.minPresionValve2){
                $scope.pdf.minPresionValve2 = $scope.data.p.LP2
            }
            if($scope.data.p.LP2 < $scope.pdf.maxPresionValve2){
                $scope.pdf.maxPresionValve2 = $scope.data.p.LP2
            }



        }

        this.startRunValues = ($scope) => {
            $scope.pdf.preassure = $scope.data.o.p
            $scope.pdf.temperature = $scope.data.o.t
        }

        this.endRunValues = ($scope, time) => {
            $scope.pdf.tapeCounter = $scope.data.td.c
            $scope.pdf.totalDistance = $scope.data.td.p
            $scope.pdf.laserDistance = $scope.data.td.d
            $scope.pdf.totalTime = time
        }

        this.endACC = ($scope, time, distance, acceleration) => {
            $scope.pdf.timeACC = time
            $scope.pdf.maxDistance = distance
            $scope.pdf.maxAcceleration = acceleration
        }

    });