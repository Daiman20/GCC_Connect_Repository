  angular.module('app.controllers', ['ionic','ngCordova','pascalprecht.translate','cfp.loadingBar'])
  
.controller('registroFacturaCtrl', ['$scope', '$cordovaBarcodeScanner','BlankFactory','$cordovaToast','$translate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $cordovaBarcodeScanner,BlankFactory,$cordovaToast,$translate) {
    // Load Date today 
  $scope.input_date = new Date();

  $scope.readCode = function(){
    window.localStorage.removeItem('Invoice');
    $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
           $scope.input_invoice= barcodeData.text;
      }, function(error) {
          
      });

  };

   // This function save the invoices in the localStorage
   $scope.saveLocalInvoice = function(){
     //window.localStorage.removeItem('Invoice');
     if(BlankFactory.saveInvoices($scope.input_invoice,$scope.input_date)){
      $scope.input_invoice=null;
      $scope.input_date = new Date();
       $translate('SAVE_QUEUED').then(function (translatedValue) { 
             BlankFactory.showToast(translatedValue, 'long', 'center');
        });
     
     }else{
      $translate('NOT_SAVE_QUEUED').then(function (translatedValue) { 
             BlankFactory.showToast(translatedValue, 'long', 'center');
        });
     }
     
   }
    
  // This functions  hide the buttons according connection
  $scope.isConnected = function(){
    return BlankFactory.validateConnection() ? false : true;
  }
  $scope.isNoConnected = function(){
    return BlankFactory.validateConnection() ? true : false;
  }

}])
   
.controller('queuedInvoicesCtrl', ['$scope', '$stateParams','BlankFactory','$translate','cfpLoadingBar','$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,BlankFactory,$translate,cfpLoadingBar,$location) {
   var keySession = 'Invoice'; 
   console.log("Entro al controler");
   var getAllInvoice = JSON.parse(window.localStorage.getItem('Invoice'));
   $scope.list_invoice= getAllInvoice;
   $scope.load= function(){
    var getAllInvoice = JSON.parse(window.localStorage.getItem('Invoice'));
    if(getAllInvoice != null){
      $scope.list_invoice= getAllInvoice;
      window.location.href="#/side-menu21/page7";
    }else{
       $translate('MSG_ALERT_NOT_INVOICE').then(function (translatedValue) { 
             BlankFactory.showToast(translatedValue, 'long', 'center');
        });
    }
    
    
    }

    $scope.viewInvoice = function(dato,date){
      window.localStorage.setItem( 'SelectInvoice',dato);
      window.localStorage.setItem( 'SelectDate',date);
      $('#factura').val(dato);
      document.getElementById("DatePicker").valueAsDate = new Date(date);
    }

    $scope.sendAll = function(){
      var sendConfirm = $translate('MSG_CONFIRM_SEND_ALL_INVOICES').then(function (translatedValue) { 
                             var confrm = confirm(translatedValue);
                             return confrm;
                         });
      if (sendConfirm){
        cfpLoadingBar.start();
        cfpLoadingBar.inc();
        BlankFactory.deleteAllInvoice(keySession);
        cfpLoadingBar.complete();
          window.location="#/page1/page2";
      }
    }
  
   

}])
   
.controller('cloudTabDefaultPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
      .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
      .controller('invoiceRecordCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

      .controller('homeCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
.controller('loginCtrl', ['$scope', '$stateParams','$rootScope', '$cordovaNetwork','$translate','cfpLoadingBar', 'services','BlankFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$rootScope,$cordovaNetwork,$translate,cfpLoadingBar,services,BlankFactory) {

  $scope.changeLanguage = function (key) { 
    $translate.use(key);
  };

 $scope.authenticate= function(){
            //get data for view
            cfpLoadingBar.start();
            cfpLoadingBar.inc();
            var user=   $scope.user;
            var password=   $scope.password; 
    
            if($scope.user && $scope.password){
                var userEncryp=BlankFactory.encryData($scope.user);
                var passwordEncryp=BlankFactory.encryData($scope.password);

                //Solo se tiene que cambiar por los parametros encriptados
             
                if(BlankFactory.validateConnection()){
                         services.authenticate($scope.user,$scope.password).then(function(data){ 
                             if(data){
                                      window.localStorage.removeItem( 'user');
                                      window.localStorage.removeItem( 'password');
                                      window.localStorage.setItem( 'user',$scope.user);
                                      window.localStorage.setItem( 'password',$scope.password);
                                      cfpLoadingBar.complete();
                                      window.location="#/side-menu21/page6";
                              }else{
                                      cfpLoadingBar.complete();
                                      $scope.valid = {}
                                      $scope.valid.show = true; 
                              }
                       }).fail(function(err){
                                cfpLoadingBar.complete();
                               $scope.valid = {}
                               $scope.valid.show = true; 
                      });
                }else{

                  var userLocal     =  window.localStorage.getItem('user');
                  var passwordLocal =  window.localStorage.getItem('password');
                  if(userLocal==user && password==passwordLocal){
                    cfpLoadingBar.complete();
                       window.location="#/side-menu21/page6";
                  }else
                  {
                    $translate('NOT_CONNECTION').then(function (translatedValue) { 
                                  BlankFactory.showToast(translatedValue, 'long', 'center');
                         });
                    cfpLoadingBar.complete();
                    
                  }

                }
 
    }else{
      cfpLoadingBar.complete();
      $scope.valid = {}
      $scope.valid.show = true;
    }   
};
}])
 