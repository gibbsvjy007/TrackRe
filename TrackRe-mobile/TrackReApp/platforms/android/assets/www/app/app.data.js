app.factory('SideBar', function() {
  var data = {};
  data.items = [{
    title: 'Route search',
    datahref: 'dashboard',
    icon: 'ion-search'
  }, {
    title: 'Favorites',
    datahref: 'profile',
    icon: 'ion-android-star'
  }, {
    title: 'Settings',
    datahref: 'profile',
    icon: 'ion-android-settings'
  }, {
    title: 'Journey',
    datahref: 'dashboard',
    icon: 'ion-android-subway'
  }, {
    title: 'Departure',
    datahref: 'depature',
    icon: 'ion-clock'
  }];

  //Bottom Items of application contact us, about us etc
  data.subItems = [{
    title: 'Contact us'
  }, {
    title: 'About us'
  }];
  data.version = 'v1.0.0'; //Version of the application
  return data;
});

