(function() {
  'use strict';
  app.factory('$utils','spinnerService', function() {
    var utils = {};
    utils.hideLoading = function() {
      spinnerService.hide('html5spinner');
    };
    utils.showLoading = function() {
      spinnerService.show('html5spinner');
    };
    utils.notBlank = function(val) {
      return val === undefined || val === "undefined" || val === "NULL" || val === "UNDEFINED" || val === "null" || val === '{}' || val === null || (typeof val === "string" && val.trim() === "") ? false : true;
    };
    utils.params = function(obj) {
      var p = [];
      for (var key in obj) {
        p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    };
    utils.toTitleCase = function(str) {
      if (utils.notBlank(str)) {
        return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      } else {
        return '';
      }
    };
    /**
     * Get all the timings
     */
    utils.getTimings = function() {
      var timings = [{ id: 'now', name: 'Now' }];
      for (var i = 0; i <= 23; i++) {
        for (var j = 0; j <= 59; j += 30) {
          var min = j <= 9 ? '0' + j : j;
          var hr = i <= 9 ? '0' + i : i;
          var tt = hr + ':' + min;
          timings.push({ id: tt, name: tt });
        }
      }
      return timings;
    };
    utils.getDirections = function() {
      var directions = [
        { id: 'depart', name: 'Depart' },
        { id: 'arrive', name: 'Arrive' }
      ];
      return directions;
    };

    return utils;
  }).factory('$localstorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      clear: function() {
        $window.localStorage.clear();
      }
    }
  }]);
})();

