angular.module('app.services', ['ionic','ngCordova'])

.factory('BlankFactory', ['$cordovaNetwork','$cordovaBarcodeScanner','$cordovaToast',
	function($cordovaNetwork,$cordovaBarcodeScanner,$cordovaToast){
	
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

	    var saveInvoices = function(num_invoice,date){
	    if('localStorage' in window && window['localStorage'] !== null) {
              //alert('Genial, tenemos un navegador decente que soporta LocalStorage');
	    	if (window.localStorage.getItem( 'Invoice' ) != null){
	    		var arraysInvoices = JSON.parse(window.localStorage.getItem( 'Invoice' ));
	    	    if (num_invoice != null && date != null){
	        	  var arrInvoice = { 'Invoice':num_invoice, 'Date':date};
	        	   arraysInvoices.push(arrInvoice);
                   window.localStorage.removeItem('Invoice');
	        	   window.localStorage.setItem( 'Invoice',JSON.stringify(arraysInvoices));
	            }else{
	        	  return false;
	            }
	    	}else{
	    		if (num_invoice != null && date != null){
	        	  var arr = [{'Invoice':num_invoice, 'Date':date}];
	        	  window.localStorage.setItem( 'Invoice',JSON.stringify(arr));
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

.service('services', [function(){
var authenticate=function(user, pas){
  	var DataToSend = {
                    iduser:user,
                    password:pas
   };

return $.ajax({
	        headers: { "Accept": "application/json"},
            url: "https://as400-daiman20.c9.io:8080/api/users/authenticate",
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
                return true;
            },
            error: function (xhr, status) { 
                return false;
            }
        });
};
return {
    authenticate : authenticate 
  }
}]);
