(function() {
    app.factory('$itinerary', ['$q', '$log', '$http', '$service', '$gmap', function($q, $log, $http, $service, $gmap) {
        var service = {};
        service.itineraries = [];
        service.currentItinerary = [];
        service.from = {};
        service.to = {};
        service.timeOfQuery;
        /**
         * [fromToValid Check From To Is Valid]
         * @param  {[type]} from [description]
         * @param  {[type]} to   [description]
         * @return {[type]}      [description]
         */
        service.fromToValid = function(from, to) {
            if (from && to && from.name && to.name && from.lat && from.lng && to.lat && to.lng) {
                return true;
            } else {
                $log.error('From or To is invalid');
                return false;
            }
        };

        /**
         * [processItineraries Process Itineraries]
         * @param  {[type]} itineraries [description]
         * @param  {[type]} timeOfQuery [description]
         * @return {[type]}             [description]
         */
        service.processItineraries = function(itineraries, timeOfQuery) {
            var d = $q.defer(),
                promises = [];
            service.timeOfQuery = timeOfQuery;
            angular.forEach(itineraries, function(itinerary, itineraryIndex) {
                itinerary.ID = itinerary.startTime + '#' + itinerary.endTime;
                itinerary.mainStopsId = [];
                var noLegs = itinerary.legs.length - 1;
                angular.forEach(itinerary.legs, function(leg, legIndex) {
                    if (!leg.from.stopId) leg.from.stopId = 'pointA';
                    if (!leg.to.stopId) leg.to.stopId = 'pointB';
                    if (legIndex == 0) itinerary.mainStopsId.push(leg.from.stopId);
                    itinerary.mainStopsId.push(leg.to.stopId);
                    promises.push(service.processLeg(leg));
                });
            });
            $q.all(promises).then(function() {
                $gmap.processItineraries(itineraries);
                d.resolve(itineraries);
            });

            return d.promise;
        };

        /**
         * [processLeg Process Leg]
         * @param  {[type]} leg [description]
         * @return {[type]}     [description]
         */
        service.processLeg = function(leg) {
            var d = $q.defer(),
                promises = [],
                interStops = [],
                interStopTimes = [],
                legMode = leg.mode,
                fromStopSequence = leg.from.stopSequence,
                toStopSequence = leg.to.stopSequence,
                noInterStops = toStopSequence - fromStopSequence - 1;
            leg.legPath = google.maps.geometry.encoding.decodePath(leg.legGeometry.points);

            if (legMode == 'WALK' || noInterStops == 0) {
                leg.interStops = interStops;
                d.resolve(true);
            } else {
                var tripId = leg.tripId,
                    tripStopsUrl = $service.getUrl('tripStops', { tripId: tripId }),
                    tripStopTimesUrl = $service.getUrl('tripStopTimes', { tripId: tripId }),
                    tripRealTimeInfoUrl = $service.getUrl('getTripRealTimeInfo'),
                    tripRealTimeInfoParams = { tripID: '"VBB:' + tripId + '"', timeOfQuery: service.timeOfQuery };
                promises.push($service.httpGet(tripStopsUrl, {}));
                promises.push($service.httpGet(tripStopTimesUrl, {}));
                $q.all(promises).then(function(data) {
                    if (data[2]) console.log(data[2]);
                    interStops = data[0].data.slice(fromStopSequence, toStopSequence - 1);
                    interStopTimes = data[1].data.slice(fromStopSequence, toStopSequence - 1);
                    for (var i = 0; i < noInterStops; i++) {
                        $.extend(interStops[i], interStopTimes[i]);
                    }
                    leg.interStops = interStops;
                    d.resolve(true);
                }, function() {
                    leg.interStops = interStops;
                    d.reject(false);
                });
            }

            return d.promise;
        };

        service.setItinerary = function(item) {
            service.currentItinerary = item;
        };
        service.getItinerary = function () {
            return service.currentItinerary;
        }

        return service;
    }]);
})();
