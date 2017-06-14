  angular.module('app.controllers', ['ionic','ngCordova','pascalprecht.translate','cfp.loadingBar'])
  
.controller('invoiceRecordCtrl', ['$scope','$cordovaBarcodeScanner','services','cfpLoadingBar','BlankFactory','$cordovaToast','$translate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope, $cordovaBarcodeScanner,services,cfpLoadingBar,BlankFactory,$cordovaToast,$translate) {
    // Load Date today 
  $scope.input_date = new Date();
/*
  Method that performs reading the bar code.
*/
  $scope.readCode = function(){
    window.localStorage.removeItem('Invoice');
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
   
     
   }
    
  // This functions  hide the buttons according connection
  $scope.isConnected = function(){
    return BlankFactory.validateConnection() ? false : true;
  }
  $scope.isNoConnected = function(){
    return BlankFactory.validateConnection() ? true : false;
  }

}])
   
.controller('queuedInvoicesCtrl', ['$scope', '$stateParams','services','BlankFactory','$translate','cfpLoadingBar','$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,services,BlankFactory,$translate,cfpLoadingBar,$location) {
   var keySession = 'Invoice'; 
   console.log("Entro al controler");
   var getAllInvoice = JSON.parse(window.localStorage.getItem(keySession));
   $scope.list_invoice= getAllInvoice;
   $scope.load= function(){
    var getAllInvoice = JSON.parse(window.localStorage.getItem(keySession));
    if(getAllInvoice != null){
      $scope.list_invoice= getAllInvoice;
      window.location="#/side-menu21/page7";
    }else{
       $translate('MSG_ALERT_NOT_INVOICE').then(function (translatedValue) { 
             BlankFactory.showToast(translatedValue, 'long', 'center');
        });
    }
    
    
    }
     
    $scope.viewInvoice = function(dato,date,flag){    
     
      $('#factura').val(dato);
      document.getElementById("factura").value = dato;
      document.getElementById("DatePicker").valueAsDate = new Date(date);
      
    }

    $scope.sendAll = function(){
      var sendConfirm = $translate('MSG_CONFIRM_SEND_ALL_INVOICES').then(function (translatedValue) { 
                             var confrm = confirm(translatedValue);
                             if (confrm){
        cfpLoadingBar.start();
        cfpLoadingBar.inc();
        //BlankFactory.deleteAllInvoice(keySession);
        var getAllInvoice = JSON.parse(window.localStorage.getItem(keySession));
        var error=false;
        getAllInvoice.forEach( function(valor, indice, array) {
                
                 var dateTemp= new Date(valor.Date);
                
                 services.sendInvoice(valor.Invoice,dateTemp,valor.Flag).then(function(data){ 
                             
                             BlankFactory.deleteInvoice(keySession,valor.Invoice);
                             
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
           $translate('SAVED').then(function (translatedValue) { 
                                           BlankFactory.showToast(translatedValue, 'long', 'center');
                                         });
           var getAllInvoice = JSON.parse(window.localStorage.getItem(keySession));
          
           $scope.list_invoice= getAllInvoice;
          
          window.location="#/page6";
          cfpLoadingBar.complete();
        }
        
      }
                         });
      
    }
  
   

}])

      .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])


.controller('loginCtrl', ['$scope', '$stateParams','$rootScope','$translate','cfpLoadingBar', 'services','BlankFactory',
function ($scope, $stateParams,$rootScope,$translate,cfpLoadingBar,services,BlankFactory) {
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
       window.location="#/page5";
                               
                       
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
                                      var currentLanguage=$translate.use();
                                      window.localStorage.setItem($scope.user,currentLanguage);
                                      cfpLoadingBar.complete();
                                      window.location="#/side-menu21/page6";
                              }else{
                                      cfpLoadingBar.complete();
                                      $scope.valid = {}
                                      $scope.valid.show = true; 
                              }
                       },function(err){
                                cfpLoadingBar.complete();
                               $scope.valid = {}
                               $scope.valid.show = true; 
                             }
                      );
                }else{
                   var valid=services.validLocalCredentials($scope.user,$scope.password);
                   
                   if(valid){
                                 cfpLoadingBar.complete();
                                 window.location="#/side-menu21/page6";
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
 