var configDate;
(function() {
  'use strict';
  app.constant('CONFIG', {
    'APP_NAME': 'Trackre',
    'APP_VERSION': '0.1',
    'FIRST_URL': 'http://www.google.com',
    'SERVERADDRESS': 'http://159.203.255.10:1337/'
  });
  app.constant('modeColor', {
    'WALK': '#57849e',
    'BUS': '#daa520',
    'TRAM': '#45B29D',
    'RAIL': '#c954b7',
    'LEAF': '#c954b7'
  });

  //configuration of date to load
  configDate = {
    year: '2016',
    month: '01',
    date: '01',
    hour: '10',
    minute: '8',
    second: '0'
  };
})();

