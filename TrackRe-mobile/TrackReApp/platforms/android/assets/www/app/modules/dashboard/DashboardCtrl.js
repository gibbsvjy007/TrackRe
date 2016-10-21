//////////////////////
//Created By: vijay //
//////////////////////
(function() {
    'use strict';
    app.controller('DashboardCtrl', ['$scope', '$rootScope', '$utils', '$service', '$mdDialog', '$log', '$q', '$itinerary', '$gmap','$state', function($scope, $rootScope, $utils, $service, $mdDialog, $log, $q, $itinerary, $gmap, $state) {
        var self = $scope;
        self.title_head = 'Journey';
        self.isSlidup = false;
        self.selectedDirection = { id: 'depart', name: 'Depart' };
        self.selectedTime = { id: 'now', name: 'Now' };
        self.eventListenerOnMapClick = true;
        self.noOfStops = 1000;
        $scope.pointOnMap = {};
        self.fromName = null;
        self.toName = null;
        self.fromSelectedItem = null;
        self.toSelectedItem = null;
        self.from = {};
        self.to = {};
        self.preLoadedStops = [];
        self.markerOnMapClick = new google.maps.Marker();
        var polyline = new google.maps.Polyline();


        /* Gmap Service */

        self.showItinerary = $gmap.showItinerary;
        self.zoomPolyline = $gmap.zoomPolyline;
        self.zoomMainMarker = $gmap.zoomMainMarker;


        /**
         * [initialize - load all init method]
         * @return {[type]} [description]
         */
        self.initialize = function() {
            self.directions = $utils.getDirections(); // get all the direction used in the application    
            self.timings = $utils.getTimings(); // get all the timings
            $service.preLoadStops(self.noOfStops).then(function(stops) { //success handler
                    if ($utils.notBlank(stops) && stops.length > 0) {
                        self.preLoadedStops = stops;
                        self.initMap();
                    } else {
                        console.log('DashboardCtrl:: No Stops Found');
                    }
                    console.log(self.preLoadedStops);
                },
                function() { //error handler
                    console.log('DashBoardCtrl:: Error while fetching pre load stops');
                });
        };
        // $rootScope.$on("callInitiMap", function(){
        //    self.initMap();
        // });
        self.initMap = function() {
            setTimeout(function() {
                $rootScope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                google.maps.event.addListenerOnce($rootScope.map, 'idle', function() {
                    if (self.eventListenerOnMapClick) {
                        google.maps.event.addListener($rootScope.map, 'click', eventListenerOnMapClick);
                    }
                });
            }, 3000);
        };
        self.slideToggle = function() {
            self.isSlidup = !self.isSlidup;
        };
        var eventListenerOnMapClick = function(event) {
            self.showPointDialog(event);
        };
        self.showPointDialog = function(event) {
            $scope.pointOnMap.name = "Point on map";
            $scope.pointOnMap.lat = event.latLng.lat();
            $scope.pointOnMap.lng = event.latLng.lng();
            self.markerOnMapClick.setPosition(event.latLng);
            $mdDialog.show({
                templateUrl: 'app/templates/point-on-map.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                scope: self, // use parent scope in template
                //preserveScope: true,  // do not forget this if use parent scope
                controller: self.dialogCtrl,
            });
        };
        self.dialogCtrl = function($scope, $mdDialog) {
            $scope.hide = function() {
                console.log('close');
            };
        };


        $scope.fromHereOnMapTouch = function(event) {
            self.setFromTo('from', self.pointOnMap, 'mapClick');
            setTimeout(function() {
                $mdDialog.hide();
                self.searchItineraries();
            }, 50);
        };
        $scope.toHereOnMapTouch = function(event) {
            self.setFromTo('to', self.pointOnMap, 'mapClick');
            setTimeout(function() {
                $mdDialog.hide();
                self.searchItineraries();
            }, 50);
        };

        /**
         * Select box Departure and Time Selected
         */
        $scope.directionSelected = function(item) {
            $scope.selectedDirection = item;
            $scope.searchItineraries();
        };
        $scope.timeSelected = function(item) {
            $scope.selectedTime = item;
            //console.log($scope.selectedTime);
            $scope.searchItineraries();
        };
        /**
         * [autoComplete and search placesfunction]
         * @param  {[type]} query [Accepts search input entered by the user]
         * @return {[type]}       [return all the stops based on the search query]
         */
        self.autoComplete = function(query) {
            var d = $q.defer();
            $service.autoCompletePlace(query, self.preLoadedStops).then(function(response) {
                d.resolve(response);
            });
            return d.promise;
        };
        self.fromTextChanged = function(text) {
            $log.info('Text changed to ' + text);
        };
        self.toTextChanged = function(text) {
            $log.info('Text changed to ' + text);
        };
        self.fromItemChanged = function(item) {
            self.setFromTo('from', item, 'autocomplete');
            self.searchItineraries();
        };
        self.toItemChanged = function(item) {
            self.setFromTo('to', item, 'autocomplete');
            self.searchItineraries();
        };

        /**
         * [setFromTo -Setup method for From and To Place]
         */
        self.setFromTo = function(inputObj, data, event) {
            var bounds = new google.maps.LatLngBounds();
            var data = data || {};
            $scope[inputObj].name = data.name || null;
            $scope[inputObj].lat = data.lat || null;
            $scope[inputObj].lng = data.lng || null;
            $scope[inputObj + "Name"] = $scope[inputObj].name;
            if (data.lat && data.lng) {
                var position = new google.maps.LatLng(data.lat, data.lng);
                marker[inputObj].setOptions({ map: $rootScope.map, position: position }); //marker
                if ($scope.from.name && $scope.to.name) {
                    bounds.extend(marker.from.getPosition());
                    bounds.extend(marker.to.getPosition());
                    $rootScope.map.fitBounds(bounds);
                } else {
                    bounds.extend(marker[inputObj].getPosition());
                    $rootScope.map.fitBounds(bounds);
                    if (event == 'autocomplete') {
                        $rootScope.map.panTo(marker[inputObj].getPosition());
                    }
                }
            } else {
                polyline.setMap(null);
                marker[inputObj].setMap(null);
            }
        };
        /**
         * [searchItineraries Check Itineraries]
         * @return {[type]} [description]
         */
        $scope.searchItineraries = function() {

            if ($itinerary.fromToValid($scope.from, $scope.to)) {

                $gmap.deleteAllItinerary();
                $scope.itineraries = [];
                $gmap.from = $scope.from;
                $gmap.to = $scope.to;

                var url = $service.getUrl('searchItineraries');
                var params = {
                    fromPlace: $scope.from.name + '::' + $scope.from.lat + ',' + $scope.from.lng,
                    toPlace: $scope.to.name + '::' + $scope.to.lat + ',' + $scope.to.lng,
                    arriveBy: $scope.selectedDirection.id == 'arrive',
                    time: $scope.selectedTime.id == 'now' ? '' : $scope.selectedTime.id,
                    date: "12-07-2015"
                }
                $service.httpGet(url, params).then(function(response) {
                    var data = response.data;
                    if (data.error) {
                        console.log(data.error.msg);
                    } else if (data.plan.itineraries.length == 0) {
                        console.log('No trip found')
                    } else {
                        var timeOfQuery = common.calculateDemoUnixtime($scope.selectedTime.id);
                        
                        $itinerary.setItineraryFromTo(data.plan);
                        $itinerary.processItineraries(data.plan.itineraries, timeOfQuery).then(function(resp) {
                            $scope.itineraries = resp;
                            $itinerary.setItinerary(resp);
                        });
                    }
                });
            }
        };
        /**
         * [showItineraryList description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        $scope.showItineraryList = function(event){
            event.preventDefault();
            $state.go('itineraryList');
        };
    }]);
})();
