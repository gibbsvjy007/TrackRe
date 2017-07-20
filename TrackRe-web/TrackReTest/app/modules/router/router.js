'use strict';
app.config(['$urlRouterProvider', '$stateProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/about', {
            templateUrl: 'views/about/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .otherwise({
            redirectTo: '/'
        });
}]).run(['$state', '$rootScope', function($state, $rootScope) {
    //Run method to handle state change and root methods
    $rootScope.map = {};
}]);
