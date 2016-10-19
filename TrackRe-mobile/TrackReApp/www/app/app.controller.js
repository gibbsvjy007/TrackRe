/////////////////////
//Created By Vijay //
/////////////////////
app.controller('AppCtrl', function($scope, $mdSidenav, $state, SideBar) {
  //go back function -- go back to revious state
  $scope.goBackSingle = function() {
    window.history.back();
  };
  // sidebar toggle function
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
  // array menu sidebar
  $scope.links = SideBar.items;
  $scope.sublinks = SideBar.subItems;
  $scope.version = SideBar.version;

  // swipe left to close sidebar menu
  $scope.onSwipeLeftMenu = function() {
    $scope.toggleSidenav('left');
  };
  // open link items from side bar -- close menu on link click
  $scope.openLinkMaterial = function(sidelink) {
    $scope.toggleSidenav('left');
    $state.go(sidelink);
  };
});

