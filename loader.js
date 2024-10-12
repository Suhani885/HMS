app.service('loaderService', function() {
    this.isLoading = false;
    
    this.show = function() {
      this.isLoading = true;
    };
    
    this.hide = function() {
      this.isLoading = false;
    };
});

app.directive('loader', function() {
    return {
      restrict: 'E',
      template: '<div ng-show="loader.isLoading" class="simple-loader">Loading...</div>',
      controller: function(loaderService) {
        this.isLoading = loaderService.isLoading;
      },
      controllerAs: 'loader'
    };
});
  
app.run(function($rootScope, loaderService) {
    $rootScope.$on('$stateChangeStart', function() {
      loaderService.show();
    });
  
    $rootScope.$on('$stateChangeSuccess', function() {
      loaderService.hide();
    });
  
    $rootScope.$on('$stateChangeError', function() {
      loaderService.hide();
    });
});