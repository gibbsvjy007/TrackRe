'use strict';
app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/modules/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    })
    $stateProvider.state('itineraryList', {
        url: '/itineraryList',
        templateUrl: 'app/templates/itinerary-list.html',
        controller: 'ItineraryListCtrl'
    });;
}]).run(['$state', '$rootScope', function($state, $rootScope) {
    //Run method to handle state change and root methods	
    $rootScope.map = {};
}]);
