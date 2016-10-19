/**
 * Created by vijay on 17/04/2016.
 */
(function() {
  app.factory('$service', ['$q', '$http', '$log', '$timeout', function($q, $http, $log, $timeout) {
    var service = {},
      baseUrl = {
        'otp': 'http://5.189.168.220:8080/otp/routers/default/',
        'node': 'http://5.189.168.220:3000/otp/routers/default/',
        'spark': 'http://5.189.168.220:4567/',
        'gapi': 'https://maps.googleapis.com/maps/api/'
      },
      method = {
        GET: 'GET',
        POST: 'POST'
      };
    service.getUrl = function(action, params) {
      switch (action) {
        case 'getStops':
          return baseUrl.otp + 'index/stops';
          break;

        case 'searchItineraries':
          return baseUrl.otp + 'plan';
          break;

        case 'routeStops':
          return baseUrl.otp + 'index/trips';
          break;

        case 'tripStops':
          return baseUrl.otp + 'index/trips/VBB:' + params.tripId + '/stops';
          break;

        case 'tripStopTimes':
          return baseUrl.otp + 'index/trips/VBB:' + params.tripId + '/stoptimes';
          break;

        case 'autocompleteGoogleApi':
          return baseUrl.gapi + 'place/queryautocomplete/json';
          break;

        case 'getTripRealTimeInfo':
          return baseUrl.spark + 'GetRealtimeTripInfo';
          break;

        case 'tripTimetable':
          return baseUrl.spark + 'TimesOfStopsInTrip';
          break;

        case 'stopsInTrip':
          return baseUrl.spark + 'StopsInTrip';
          break;

        case 'tripsFromStop':
          return baseUrl.spark + 'StopToTrips';
          break;

        case 'routesFromStop':
          return baseUrl.spark + 'RoutesFromStop';
          break;

        case 'sparkAutoComplete':
          return baseUrl.spark + 'AutocompleteStopsName';
          break;

        case 'findClosestStops':
          return baseUrl.spark + 'FindClosestStops';
          break;

        default:
          console.log('No api url found');
      }
    }

    service.httpGet = function(url, params) {
      return $http({
        method: method.GET,
        url: url,
        params: params || {}
      });
    };

    service.httpGetRespData = function(url, params, method) {
      var d = $q.defer();
      $http({
        method: method,
        url: url,
        params: params || {},
        header: { 'Content-Type': 'application/json; charset=UTF-8' }
      }).then(
        function(resp) {
          d.resolve(resp.data);
        },
        function(resp) {
          d.reject(resp);
        });
      return d.promise;
    };

    // -------------------------- PRE LOADED STOPS --------------------------
    service.preLoadStops = function(noStops) {
      var d = $q.defer(),
        stops = [];
      noStops = noStops || 200;
      service.httpGet(service.getUrl('getStops')).then(function(resp) {
        stops = resp.data;
        stops = stops.slice(0, noStops);
        stops = stops.map(function(stop) {
          stop.value = stop.name.toLowerCase();
          stop.lng = stop.lon;
          return stop;
        });
        d.resolve(stops);
      }, function() {
        d.resolve(stops);
      });

      return d.promise;
    }


    // ----------------- END ------------------------------

    var filterForAutocomplete = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) >= 0);
      };
    };

    /**
     * [autoCompletePlace return all the stops based on the search query]
     * @return {[type]} [description]
     */

    service.autoCompletePlace = function(query, preLoadedStops) {
      var d = $q.defer(),
        results = query ? preLoadedStops.filter(filterForAutocomplete(query)) : preLoadedStops;
      d.resolve(results);
      return d.promise;
    };
    return service;
  }]);
})();

