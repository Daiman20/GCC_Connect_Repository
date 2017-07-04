  angular.module('app.controllers', ['ionic','ngCordova','pascalprecht.translate','cfp.loadingBar'])
  
.controller('invoiceRecordCtrl', ['$scope','$state','$ionicHistory','$cordovaBarcodeScanner','services','cfpLoadingBar','BlankFactory','$cordovaToast','$translate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope,$state,$ionicHistory, $cordovaBarcodeScanner,services,cfpLoadingBar,BlankFactory,$cordovaToast,$translate) {
    // Load Date today 
  $scope.input_date = new Date();

/*
  Method that performs reading the bar code.
*/
  $scope.readCode = function(){
   // window.localStorage.removeItem('Invoice');
    $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
           $scope.input_invoice= barcodeData.text;
      }, function(error) {
          
      });

  };

   /*This function save the invoices in the localStorage
   */
   $scope.saveLocalInvoice = function(){
     if(BlankFactory.saveInvoices($scope.input_invoice,$scope.input_date,$scope.flagTemporal)){
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

   $scope.sendInvoice = function(){   
        cfpLoadingBar.start();
        cfpLoadingBar.inc(); 
           if($scope.input_invoice){
                services.sendInvoice($scope.input_invoice,$scope.input_date,$scope.flagTemporal).then(function(data){  
                             if(data){
                                      $scope.input_invoice='';
                                        $scope.input_date = new Date();
                                        if($scope.flagTemporal=='S'){
                                               $translate('SAVE_TEMPORAL').then(function (translatedValue) { 
                                               BlankFactory.showToast(translatedValue, 'long', 'center');
                                          });
                                               cfpLoadingBar.complete();
                                        }else{
                                           $translate('SAVED').then(function (translatedValue) { 
                                               BlankFactory.showToast(translatedValue, 'long', 'center');
                                          });
                                           cfpLoadingBar.complete();
                                        }       
                              }else{
                                      $translate('NOT_SAVED').then(function (translatedValue) { 
                                           BlankFactory.showToast(translatedValue, 'long', 'center');
                                         });
                                         cfpLoadingBar.complete(); 
                              }
                       },function(err){

                                $translate('NOT_SAVED').then(function (translatedValue) { 
                                    BlankFactory.showToast(translatedValue, 'long', 'center');
                                 });
                               cfpLoadingBar.complete();
                             }
                      );
           }else{
                $translate('NOT_EMPTY_INVOICE').then(function (translatedValue) { 
                                    BlankFactory.showToast(translatedValue, 'long', 'center');
                                 });
                               cfpLoadingBar.complete();
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
   
.controller('queuedInvoicesCtrl', ['$scope','$state','$ionicHistory', '$stateParams','services','BlankFactory','$translate','cfpLoadingBar','$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$state,$ionicHistory, $stateParams,services,BlankFactory,$translate,cfpLoadingBar,$location) { 
   var LOCAL_USER_KEY='userLocal';
   var localInvoices='Invoices'+window.localStorage.getItem(LOCAL_USER_KEY ); 
 
   $scope.list_invoice= JSON.parse(window.localStorage.getItem(localInvoices));

   $scope.load= function(){
    var getAllInvoice = JSON.parse(window.localStorage.getItem(localInvoices)); 
    if(getAllInvoice != null){ 
      $ionicHistory.nextViewOptions({
         disableBack: true
      }); 
      $ionicHistory.clearCache().then(function(){ $state.go('menu.queuedInvoices');});
      $scope.list_invoice= window.localStorage.getItem(localInvoices);
    }else{
       $translate('MSG_ALERT_NOT_INVOICE').then(function (translatedValue) { 
             BlankFactory.showToast(translatedValue, 'long', 'center');
        });
    }
    
    
    }

      $scope.isConnected = function(){
    return BlankFactory.validateConnection() ? false : true;
  }
     
    $scope.viewInvoice = function(dato,date,flag){    
     
      $('#factura').val(dato);
      document.getElementById("factura").value = dato;
      document.getElementById("DatePicker").valueAsDate = new Date(date);
      
    }

    $scope.sendAll = function(){
      var LOCAL_USER_KEY='userLocal';
      var localInvoices='Invoices'+window.localStorage.getItem(LOCAL_USER_KEY ); 
      var sendConfirm = $translate('MSG_CONFIRM_SEND_ALL_INVOICES').then(function (translatedValue) { 
                             var confrm = confirm(translatedValue);
                             if (confrm){
        cfpLoadingBar.start();
        cfpLoadingBar.inc();
        var getAllInvoice = JSON.parse(window.localStorage.getItem(localInvoices));
        var error=false;
        getAllInvoice.forEach( function(valor, indice, array) {
                
                 var dateTemp= new Date(valor.Date);
                
                 services.sendInvoice(valor.Invoice,dateTemp,valor.Flag).then(function(data){ 
                             
                             BlankFactory.deleteInvoice(localInvoices,valor.Invoice);
                             
                       },function(err){
                               
                                error=true;
                             }
                      );
           });
        
         if(error){
           $translate('NOT_SAVED').then(function (translatedValue) { 
                                           BlankFactory.showToast(translatedValue, 'long', 'center');
                                         });
           cfpLoadingBar.complete();
        } else{
          window.localStorage.removeItem(localInvoices);
           $translate('SAVED').then(function (translatedValue) { 
                                           BlankFactory.showToast(translatedValue, 'long', 'center');
                                         }); 
             $ionicHistory.nextViewOptions({
                disableBack: true
              }); 
            $ionicHistory.clearCache().then(function(){ $state.go('menu.home');});
            //}
           
         
          cfpLoadingBar.complete();
        }
        
      }
                         });
      
    }
  
   

}])

      .controller('menuCtrl', ['$scope','$state', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])


.controller('loginCtrl', ['$scope','$state','$ionicHistory', '$stateParams','$rootScope','$translate','cfpLoadingBar', 'services','BlankFactory',
function ($scope,$state,$ionicHistory, $stateParams,$rootScope,$translate,cfpLoadingBar,services,BlankFactory) {
  $scope.changeLanguage = function (key) { 
    $translate.use(key);
  };

  $scope.lenguageLocalUser = function (){
    var currentLanguage=window.localStorage.getItem($scope.user);
    if(currentLanguage){
      $translate.use(currentLanguage);
    }
    
  }

  $scope.logout=function(){
       services.destroyUserCredentials();
       $scope.password='';
       $ionicHistory.nextViewOptions({
              disableBack: true
           }); 
       $ionicHistory.clearCache().then(function(){ $state.go('login');});                     
                       
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
                            
                             if(services.isAuthenticated()){
                               
                                      var currentLanguage=$translate.use();
                                      window.localStorage.setItem($scope.user,currentLanguage);
                                      cfpLoadingBar.complete(); 
                                      $ionicHistory.nextViewOptions({
                                        disableBack: true
                                      });
                                      $ionicHistory.clearCache().then(function(){ $state.go('menu.home');});
                                      
                              }else{
                                 
                                      cfpLoadingBar.complete();
                                      $scope.valid = {}
                                      $scope.valid.show = true; 
                              }
                       },function(err){
                                cfpLoadingBar.complete();
                               $scope.error_server_connection = {}
                               $scope.error_server_connection.show = true; 
                             }
                      );
                }else{
                   var valid=services.validLocalCredentials($scope.user,$scope.password);
                   
                   if(valid){
                                 cfpLoadingBar.complete(); 
                                 $ionicHistory.nextViewOptions({
                                  disableBack: true
                                 });
                              $ionicHistory.clearCache().then(function(){ $state.go('menu.home');});
                   }else{
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
 