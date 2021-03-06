angular.module('app.services', ['ionic','ngCordova','app.constants'])

.factory('BlankFactory', ['$cordovaNetwork','$cordovaBarcodeScanner','$cordovaToast',
	function($cordovaNetwork,$cordovaBarcodeScanner,$cordovaToast, $rootScope){
	
		var validateConnection = function(){
		    var isOnline = $cordovaNetwork.isOnline();
		    return isOnline;
	    };

	    var readCode = function(){
		    $cordovaBarcodeScanner
            .scan()
            .then(function(barcodeData) {
             // Success! Barcode data is here
                   alert('Bien: '+barcodeData.text);
                   return barcodeData.text;
             }, function(error) {
              // An error occurred
                   alert('Mal: '+error);
                   return error;
             });
	    };

	    var saveInvoices = function(num_invoice,date,flag){ 
        var LOCAL_USER_KEY='userLocal';
        var localInvoices='Invoices'+window.localStorage.getItem(LOCAL_USER_KEY );
	    if('localStorage' in window && window['localStorage'] !== null) {
              //alert('Genial, tenemos un navegador decente que soporta LocalStorage');
	    	if (window.localStorage.getItem(localInvoices) != null){
	    		var arraysInvoices = JSON.parse(window.localStorage.getItem(localInvoices));
	    	    if (num_invoice != null && date != null){
	        	  var arrInvoice = { 'Invoice':num_invoice, 'Date':date,'Flag':flag};
	        	   arraysInvoices.push(arrInvoice);
                   window.localStorage.removeItem(localInvoices);
	        	   window.localStorage.setItem(localInvoices,JSON.stringify(arraysInvoices));
	            }else{
	        	  return false;
	            }
	    	}else{
	    		if (num_invoice != null && date != null){
	        	  var arr = [{'Invoice':num_invoice, 'Date':date,'Flag':flag}];
	        	  window.localStorage.setItem(localInvoices,JSON.stringify(arr));
	            }else{
	        	  return false;
	            }
	    	}
	    	return true;
	    }
	    	 
	    };
      
	    var showToast = function(message, duration, location) {
          $cordovaToast
          .show(message, duration, location)
          .then(function(success) {
            console.log("The toast was shown");
           },function (error) {
            console.log("The toast was not shown due to " + error);
          });
         };
         var getKey= function(){
         var date = new Date();
         var month = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
         var key=month[date.getMonth()] + "" + date.getFullYear()+date.getDate();

         return key;
    };	
  var encryData=function(data){
  	var encrypted = CryptoJS.AES.encrypt(data, getKey());
    return encrypted;
  };

  var dencryData=function(data){
     var bytes  = CryptoJS.AES.decrypt(data.toString(), getKey());
      return bytes.toString(CryptoJS.enc.Utf8);
  };

   var deleteInvoice = function(key,num_invoice){
            if (window.localStorage.getItem(key) != null){        
              var getAllInvoice = JSON.parse(window.localStorage.getItem(key));
                for (var i=0; i< getAllInvoice.length; i++)
                  {
                     var copy =[];
                     var invoice = getAllInvoice[i].Invoice;
                     console.log(JSON.stringify(invoice));
                     if(invoice == num_invoice){
                      getAllInvoice.splice( i, 1 );
                      copy = getAllInvoice;
                      window.localStorage.setItem( key,JSON.stringify(copy));
                       }
                   }
               }
             };
         var deleteAllInvoice = function(key){
            window.localStorage.removeItem(key);
         };

    	return{
    		validateConnection : validateConnection,
    		readCode           : readCode,
    		saveInvoices       : saveInvoices,
    		showToast          : showToast,
    		encryData          : encryData,
        deleteAllInvoice   : deleteAllInvoice,
        deleteInvoice      : deleteInvoice 
    	}
	        

}])



.service('services', ['$q','$http',function($q, $http,USER_ROLES){
var LOCAL_USER_KEY='userLocal';
var LOCAL_PASSWORD_KEY='passwordLocal';
var LOCAL_ROLE_USER='role_user';
var isAuthenticated=false;
var authToken;  
var role='';

function loadUserCredentials(){
  var user = window.localStorage.getItem(LOCAL_USER_KEY);
  if(user){
    useCredentials(user);
  }
}

function storeUserCredentials(user,password,arrayRole){
  window.localStorage.setItem(LOCAL_USER_KEY, user);
  window.localStorage.setItem(LOCAL_PASSWORD_KEY, password);
  useCredentials(user,arrayRole);
}

function useCredentials(user,arrayRole){
  isAuthenticated =true;
  authToken = user;
  window.localStorage.setItem(LOCAL_ROLE_USER, arrayRole);      
  $http.defaults.headers.common['X-Auth-Token'] = user;
}

function destroyUserCredentials(){
  authToken=undefined;
  isAuthenticated=false; 
}

function validLocalCredentials(user,password){
  var userLocal     =  window.localStorage.getItem(LOCAL_USER_KEY);
  var passwordLocal =  window.localStorage.getItem(LOCAL_PASSWORD_KEY);
 
  if(userLocal==user && password==passwordLocal ){
          isAuthenticated=true;
          return true; 
    }else
     {
          return false;                    
    }
}

var isAuthorized = function(authorizedRoles) {
    role=  window.localStorage.getItem(LOCAL_ROLE_USER); 
    return (isAuthenticated && role.indexOf(authorizedRoles) !== -1);
  };




var authenticate=function(user, pas){
  	var DataToSend = {
                    iduser:user,
                    password:pas
   };   
return $.ajax({
	        headers: { "Accept": "application/json"},           
            url: "http://216.177.206.4:8000/api/users/authenticate",
            type: "POST",
            crossDomain: true,
            data: DataToSend,
            headers:{},
            dataType: "json",
            accept: "application/json",
            beforeSend: function(xhr){
                xhr.withCredentials = true;
          },
            success: function (response) { 
              var valid=response.CADENA;
              var arrayData=valid.split('!'); 
              if(arrayData[0]==='Y'){ 
                 storeUserCredentials(user,pas,arrayData);
                 return true;
              }else{ 
                 return false;
              }                
            },
            error: function (xhr, status) { 
                return false;
            }
        });
};
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


var sendInvoice=function(num_invoice,date,flag){  
  var dateFormat=date.getFullYear()+""+(addZero(date.getMonth()+1))+""+addZero(date.getDate())+"";
  var h = addZero(date.getHours());
  var m = addZero(date.getMinutes());
  var s = addZero(date.getSeconds());
  var hour=h+""+m+""+s;
  authToken=window.localStorage.getItem(LOCAL_USER_KEY);
    var DataToSend = {
                    idInvoice:num_invoice,
                    date: dateFormat,
                    pHour : hour,
                    idUser:authToken,
                    flag:flag
   };  
return $.ajax({
          headers: { "Accept": "application/json"},           
            url: "http://216.177.206.4:8000/api/invoices/invoiceDelivery",
            type: "POST",
            crossDomain: true,
            data: DataToSend,
            headers:{},
            dataType: "json",
            accept: "application/json",
            beforeSend: function(xhr){
                xhr.withCredentials = true;
          },
            success: function (response) {  
                if(response.result==='0'){
                  return true;
                }else{
                  return false;
                }
                
            },
            error: function (xhr, status) {  
                return false;
            }
        });   
};
return {
    authenticate : authenticate,
    sendInvoice : sendInvoice,
    isAuthenticated : function() { return isAuthenticated; },
    destroyUserCredentials : destroyUserCredentials,
    validLocalCredentials : validLocalCredentials,
    getUser : function(){return authToken;},
    isAuthorized: isAuthorized
  }
}]);


 