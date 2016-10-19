//////////////////////
//Created By: vijay //
//////////////////////
(function() {
    'use strict';
    app.controller('ItineraryListCtrl', ['$scope', '$rootScope', '$utils', '$service', '$mdDialog', '$log', '$q', '$itinerary', '$gmap','$state', function($scope, $rootScope, $utils, $service, $mdDialog, $log, $q, $itinerary, $gmap, $state) {
        var self = $scope;
        self.itineraries = $itinerary.getItinerary();
        console.log(self.itineraries);
    }]);
})();