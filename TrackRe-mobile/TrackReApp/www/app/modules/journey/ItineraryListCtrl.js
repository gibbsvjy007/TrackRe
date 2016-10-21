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
       	$rootScope.map = null;
        self.showItineraryDetails = function($event, itineraryID) {            
        	$rootScope.map = null;
        	self.showMap = false;
            var $target = $event.currentTarget;            
            self.itineraryID = itineraryID;            
            $('.itinerary-list').find('.itinerary-detail').removeClass('active');
            $($target).parents('.itinerary-summary').siblings('.itinerary-detail').addClass('active').slideDown('slow');
            setTimeout(function() {            	
                //if($rootScope.map === null){
                	var $element = $($($target).parents('.itinerary-summary').siblings('.itinerary-detail').find('#itinerary-map'))[0];
                	$rootScope.map = new google.maps.Map($element, mapOptions);	
                //}                
                google.maps.event.addListenerOnce($rootScope.map, 'idle', function() {
                    // do something only the first time the map is loaded
                    $gmap.showItinerary(self.itineraryID);
                });
            }, 3000);
            // $rootScope.$emit("callInitiMap", {});            
            //$($target).parents('.itinerary-summary').siblings('.itinerary-detail').slideToggle('slow');
            //$($target).parents('.md-3-line').siblings('.itinerary-summary').find('.itinerary-detail').slideUp('slow');
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
