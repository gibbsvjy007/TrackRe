(function() {
    'use strict';
    app.controller('ItineraryListCtrl', ['$scope', '$rootScope', '$utils', '$gmap', '$state', '$itinerary', function($scope, $rootScope, $utils, $gmap, $state, $itinerary) {
        var self = $scope;
        $scope.title_head = 'Journey Detail';
        var stopIndex = 0;
        self.showMap = false;
        self.initialize = function() {
            $scope.itineraries = $itinerary.getItinerary();
            self.fromTo = $itinerary.getItineraryFromTo();
        };
        self.showItineraryDetails = function($event, itineraryID) {
            var $target = $event.currentTarget;
            self.itineraryID = itineraryID;
            $rootScope.map = null;
            setTimeout(function() {
                $rootScope.map = new google.maps.Map(document.getElementById('itinerary-map'), mapOptions);
                google.maps.event.addListenerOnce($rootScope.map, 'idle', function() {
                    // do something only the first time the map is loaded
                    $gmap.showItinerary(self.itineraryID);
                });
            }, 4000);
            // $rootScope.$emit("callInitiMap", {});
            $($target).parents('.itinerary-summary').siblings('.itinerary-detail').slideToggle('slow');
        };
        self.showItineraryMap = function($event) {
            $event.preventDefault();
            self.showMap = true;
        };
        self.showItineraryList = function($event) {
            $event.preventDefault();
            self.showMap = false;
        }
        $scope.showNextInfoWindow = function($event, itineraryID, legLength) {
            $event.preventDefault();
            $gmap.triggerMainMarkerClick(itineraryID, stopIndex);
            stopIndex = stopIndex == legLength ? 0 : stopIndex + 1;
        };
    }]);
})();
