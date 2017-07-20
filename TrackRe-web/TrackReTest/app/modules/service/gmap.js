(function() {
    app.factory('$gmap', ['$q', '$http', '$log', '$timeout', 'modeColor', '$rootScope', function($q, $http, $log, $timeout, modeColor, $rootScope) {
        var service = {},
            color = modeColor,
            infoWindow = {
                interStop: new google.maps.InfoWindow(),
                mainStop: new google.maps.InfoWindow()
            },
            lineSymbol = {
                path: 'M 0,-0.5 0,0.5',
                strokeOpacity: 1,
                scale: 4
            };
        service.itineraries = {};
        service.from = {};
        service.to = {};
        /**
         * [processItineraries description]
         * @param  {[type]} itineraries [description]
         * @return {[type]}             [description]
         */
        service.processItineraries = function(itineraries) {
          var processID;
            angular.forEach(itineraries, function(itinerary, itineraryIndex) {
               if(itineraryIndex === 0)
                processID = itinerary.ID;
                var polylines = {},
                    markers = {},
                    mainMarkersIds = [],
                    noLegs = itinerary.legs.length;
                // LEG
                angular.forEach(itinerary.legs, function(leg, legIndex) {

                    if (legIndex == 0) {
                        var LatLng = new google.maps.LatLng(service.from.lat, service.from.lng);
                        leg.legPath.unshift(LatLng);
                    }
                    if (legIndex == noLegs - 1) {
                        var LatLng = new google.maps.LatLng(service.to.lat, service.to.lng);
                        leg.legPath.push(LatLng);
                    }

                    <!-- LEG LINE -->
                    var polylineFront = new google.maps.Polyline({
                        path: leg.legPath,
                        zIndex: 1,
                        strokeColor: color[leg.mode],
                        strokeWeight: 4,
                        strokeOpacity: leg.mode == 'WALK' ? 0 : 4,
                        icons: leg.mode != 'WALK' ? null : [{
                            icon: lineSymbol,
                            offset: '0',
                            repeat: '12px'
                        }]
                    });
                    var polylineBack = new google.maps.Polyline({
                        path: leg.legPath,
                        strokeColor: '#fff',
                        strokeWeight: 8
                    });


                    polylines[legIndex] = polylineFront;
                    polylines[100 + legIndex] = polylineBack;

                    <!-- START + MID STOP -->
                    if (!(legIndex == noLegs)) {
                        var position = new google.maps.LatLng(leg.from.lat, leg.from.lon);
                        var fillColor = legIndex == 0 ? color['LEAF'] : color[leg.mode];
                        var scale = legIndex == 0 ? 1 : 10;
                        var fillOpacity = legIndex == 0 ? 0 : 1;
                        var strokeOpacity = legIndex == 0 ? 0 : 1;

                        mainMarkersIds.push(leg.from.stopId);
                        markers[leg.from.stopId] = new google.maps.Marker({
                            position: position,
                            title: leg.from.name,
                            id: leg.from.stopId,
                            data: leg.from,
                            stopIndex: legIndex,
                            stopType: legIndex == 0 ? 'first' : 'mid',
                            zIndex: 5,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: scale,
                                fillOpacity: fillOpacity,
                                strokeOpacity: strokeOpacity,
                                fillColor: fillColor,
                                strokeWeight: 1,
                                strokeColor: '#fff'
                            }
                        });
                        markers[leg.from.stopId].addListener('click', function() {
                            service.infoWindowMainStop(this, 'from');
                        });
                        if (legIndex == 0) {
                            marker.from.addListener('click', function() {
                                google.maps.event.trigger(markers[leg.from.stopId], 'click');
                            });
                        }
                    }
                    <!-- END STOP -->
                    if (legIndex == noLegs - 1) {
                        var position = new google.maps.LatLng(leg.to.lat, leg.to.lon);
                        mainMarkersIds.push(leg.to.stopId);
                        markers[leg.to.stopId] = new google.maps.Marker({
                            position: position,
                            title: leg.to.name,
                            id: leg.to.stopId,
                            data: leg.to,
                            stopIndex: legIndex + 1,
                            stopType: 'last',
                            zIndex: 5,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 1,
                                fillOpacity: 0,
                                strokeOpacity: 0,
                                fillColor: color['LEAF'],
                                strokeWeight: 1,
                                strokeColor: '#fff'
                            }
                        });
                        markers[leg.to.stopId].addListener('click', function() {
                            service.infoWindowMainStop(this, 'to');
                        });
                        marker.to.addListener('click', function() {
                            google.maps.event.trigger(markers[leg.to.stopId], 'click');
                        });
                    }

                    // INTER STOPS
                    if (leg.legMode != 'WALK') {
                        angular.forEach(leg.interStops, function(interStop, interID) {
                            var position = new google.maps.LatLng(interStop.lat, interStop.lon)
                            var interMarker = new google.maps.Marker({
                                position: position,
                                title: interStop.name,
                                zIndex: 2,
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 4,
                                    fillColor: '#fff',
                                    fillOpacity: 1,
                                    strokeWeight: 3,
                                    strokeColor: color[leg.mode]
                                }
                            });

                            interMarker.addListener('click', function() {
                                service.infoWindowInterStop(interMarker);
                            });

                            markers[interStop.stopId] = interMarker;
                        });
                    }

                });
                service.itineraries[itinerary.ID] = { polylines: polylines, markers: markers, mainMarkersIds: mainMarkersIds };
            });
            console.log(processID);
            service.showItinerary(processID); //Process Last Itinerary ID for to show polyline
        };


        service.triggerMainMarkerClick = function(itineraryId, index) {
            var itinerary = service.itineraries[itineraryId];
            var stopId = itinerary.mainMarkersIds[index];
            var marker = itinerary.markers[stopId];

            setTimeout(function() {
                $rootScope.map.panTo(marker.getPosition());
            }, 100);
            setTimeout(function() {
                google.maps.event.trigger(marker, 'click');
            }, 200);
        }


        service.infoWindowInterStop = function(marker) {
            var content = marker.title;
            infoWindow.interStop.setContent(content);
            infoWindow.interStop.open($rootScope.map, marker);
        }
        service.infoWindowMainStop = function(marker, fromTo) {
            var info1 = new google.maps.InfoWindow();
            var content = '<div style="font-weight: bold;">' + marker.title + '</div>';
            if (fromTo == 'from') {
                content += '<b> Departure </b>: <span>' + common.unixtimeToHumantime(marker.data.departure) + '</span>';
            } else {
                content += '<b> Arrival: </b>  <span>' + common.unixtimeToHumantime(marker.data.arrival) + '</span>';
            }
            infoWindow.mainStop.setContent(content);
            infoWindow.mainStop.open($rootScope.map, marker);
        }


        service.zoomPolyline = function(itineraryID, legId) {
            var polyline = service.itineraries[itineraryID].polylines[legId];
            var bounds = new google.maps.LatLngBounds();
            var path = polyline.getPath();
            for (var i = 0; i < path.getLength(); i++) {
                bounds.extend(path.getAt(i));
            }
            $rootScope.map.$rootScopefitBounds(bounds);
        };

        service.zoomMainMarker = function(itineraryID, stopId) {
            var marker = service.itineraries[itineraryID].markers[stopId];
            $rootScopepanTo(marker.getPosition());
            setTimeout(function() { $rootScope.map.setZoom(mapMaxZoom); }, 500);
        };

        service.showItinerary = function(itineraryID) {

            var polylines = service.itineraries[itineraryID].polylines;
            var markers = service.itineraries[itineraryID].markers;
            var bounds = new google.maps.LatLngBounds();

            service.showJourneyMarkers();
            service.hideAllItinerary();

            angular.forEach(polylines, function(item, id) {
                item.setMap($rootScope.map);
            });
            angular.forEach(markers, function(item, id) {
                item.setMap($rootScope.map);
                bounds.extend(item.getPosition());
            });
            $rootScope.map.fitBounds(bounds);
        }

        service.hideAllItinerary = function() {
            angular.forEach(service.itineraries, function(itinerary, itineraryID) {
                var polylines = itinerary.polylines;
                var markers = itinerary.markers;
                angular.forEach(polylines, function(item, id) {
                    item.setMap(null);
                });
                angular.forEach(markers, function(item, id) {
                    item.setMap(null);
                });
            });
        }

        service.deleteAllItinerary = function() {
            service.hideAllItinerary();
            service.itineraries = {};
        }

        service.hideJourneyMarkers = function() {
            marker.from.setMap(null);
            marker.to.setMap(null);
        }
        service.showJourneyMarkers = function() {
            marker.from.setMap($rootScope.map);
            marker.to.setMap($rootScope.map);
        }

        return service;
    }]);
})();
