angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  
.state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })
 
 
 
  
.state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

.state('menu.invoiceRecord', {
    url: '/page4',
    views: {
      'side-menu21': {
        templateUrl: 'templates/invoiceRecord.html',
        controller: 'invoiceRecordCtrl'
      }
    }
  })

 .state('menu.queuedInvoices', {
    url: '/page7',
    views: {
      'side-menu21': {
        templateUrl: 'templates/queuedInvoices.html',
        controller: 'queuedInvoicesCtrl'
      }
    }
  })
 .state('menu.home', {
    url: '/page6',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
    abstract:true
      }
    }
  })
$urlRouterProvider.otherwise('/page5')

  

});