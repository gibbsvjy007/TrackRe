/**
 * [Trackre Application - This is the test application]
 * @type {[phonegap application]}
 */
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

