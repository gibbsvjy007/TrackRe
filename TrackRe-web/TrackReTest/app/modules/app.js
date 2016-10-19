'use strict';
var app = app || {};
(function() {
  'use strict';
  //All angular modules which are used in the application
  var ngModules = ['ngMaterial', 'ui.router', 'ngCordova', 'ngMessages', 'ngAnimate', 'ng-slide-down'];
  app = angular.module('trackre', ngModules);
  /**
   * [onDeviceReady description]
   * @return {[type]} [description]
   */
  var onDeviceReady = function() {};
  document.addEventListener("deviceready", onDeviceReady, false);

})();
/**
 * @ngdoc overview
 * @name trackReTestApp
 * @description
 * # trackReTestApp
 *
 * Main module of the application.
 */
var ngModules = ['ngAnimate','ngCookies','ngMessages','ngResource','ngRoute','ngSanitize','ngTouch', 'angularSpinners'];
app = angular.module('trackReTestApp', ngModules);

