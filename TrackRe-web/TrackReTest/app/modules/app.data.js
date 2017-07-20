app.factory('SideBar', function() {
  var data = {};
  data.items = [{
    title: 'Route search',
    datahref: 'search',
    icon: 'ion-search'
  }, {
    title: 'Favorites',
    datahref: 'profile',
    icon: 'ion-android-star'
  }];

  data.version = 'v1.0.0'; //Version of the application
  return data;
});

