angular.module('app.i18',[])

.config(function($translateProvider){
   
 $translateProvider.translations('en', {
    LOGIN: 'Login',
    LABEL_PASSWORD: 'Password',
    LABEL_USER: 'User',
    LABEL_LENGUAGE: 'Select a language',
    LABEL_SEND_ALL_INVOICE: 'Send All',
    TITTLE_INVOICE_RECORD:'Invoice Delivery Notification',
    LABEL_INVOICE :'Invoice key',
    LABEL_DATE :'Delivery Date',
    BUTTON_SEND :'Send',
    BUTTON_QUEUED :'Save For Later',
    TITTLE_INVOICE_NOT_SEND:'Invoice Notification Queue',
    MSG_ERROR_PASSWORD_INVALID: '* Password is invalid',
    MSG_ERROR_PASSWORD_LENGTH: '* Password length is invalid',
    MSG_ERROR_AUTENTIFICATION: '*Invalid user name or password',
    MSG_ALERT_NOT_INVOICE: 'Does Not Have Invoices Stores',
    MSG_ERROR_USER_INVALID: '* User is invalid',
    MSG_ERROR_USER_LENGTH: '* User length is invalid',
    MSG_CONFIRM_SEND_ALL_INVOICES: 'Do you want to send all invoices?',
    LABEL_LENGUAGE_ENGLISH :' English',
    LABEL_LENGUAGE_EPANISH :' Spanish',
    SAVE_QUEUED : 'Saved in Queue',
    NOT_SAVE_QUEUED: 'Failed to save in queue',
    NOT_CONNECTION :'There is no internet connection',
    LABEL_RIGHTS :'All rights reserved.',
    LABEL_PHONE : 'Phone',
    LABEL_EMAIL : 'Email',
    TEXT_INFO:'*Scan the invoice barcode',
    LABEL_TEMPORARY:'Partial delivery',
    SAVE_TEMPORAL:'Invoice Partially Delivered',
    SAVED:'Invoice Delivered',
    NOT_SAVED:'Invoice not saved',
    MENU_LABEL_SCAN_INVOICE:'Scan Invoice',
    MENU_LABEL_INVOICE_QUEUED:'Queued invoices',
    MENU_LABEL_EXIT:'Exit',
    NOT_EMPTY_INVOICE:'You must enter the invoice number',
    NOT_ACCESS_URL:'You do not have the necessary permissions to perform this action',
    ERROR_SERVER:'Connection error with server'
      });
  $translateProvider.translations('es', {
    LOGIN: 'Ingresar',
    LABEL_PASSWORD: 'Contraseña',
    LABEL_USER: 'Usuario',
    LABEL_LENGUAGE: 'Seleccione un lenguaje',
    LABEL_SEND_ALL_INVOICE: 'Enviar Todas',
    TITTLE_INVOICE_RECORD:'Notificación de entrega de facturas',
    LABEL_INVOICE :'Clave de factura',
    LABEL_DATE :'Fecha de entrega',
    BUTTON_SEND :'Enviar',
    BUTTON_QUEUED :'Guardarla para mas tarde',
    TITTLE_INVOICE_NOT_SEND:'Lista facturas no enviadas',
    MSG_ERROR_PASSWORD_INVALID: '* Contraseña invalida',
    MSG_ERROR_PASSWORD_LENGTH: '* El tamaño de es incorrecto',
    MSG_ERROR_AUTENTIFICATION: '*Usuario o contraseña invalido',
    MSG_ALERT_NOT_INVOICE: 'No posee facturas almacenadas',
    MSG_ERROR_USER_INVALID: '* Usuario incorrecto',
    MSG_ERROR_USER_LENGTH: '* El tamaño de es incorrecto',
    MSG_CONFIRM_SEND_ALL_INVOICES: '¿Usted quiere enviar todas las facturas?',
    LABEL_LENGUAGE_ENGLISH :' Ingles',
    LABEL_LENGUAGE_EPANISH :' Español',
    SAVE_QUEUED : 'Guardado en la cola',
    NOT_SAVE_QUEUED: 'No se pudo guardar en cola',
    NOT_CONNECTION :'No hay conexión de internet',
    LABEL_RIGHTS :'Todos los derechos reservados.',
    LABEL_PHONE : 'Teléfono',
    LABEL_EMAIL : 'Email',
    TEXT_INFO:'* Escanear el código de barras de la factura',
    LABEL_TEMPORARY:'Entrega parcial',
    SAVE_TEMPORAL:'Factura parcialmente entregada',
    SAVED:'Factura Entregada',
    NOT_SAVED:'No se guardó la factura',
    MENU_LABEL_SCAN_INVOICE:'Escanear Factura',
    MENU_LABEL_INVOICE_QUEUED:'Facturas en cola',
    MENU_LABEL_EXIT:'Salir',
    NOT_EMPTY_INVOICE:'Debe ingresar el número de factura',
    NOT_ACCESS_URL:'No posee los permisos necesarios para realizar esta acción',
    ERROR_SERVER:'Error de conexión con el servidor'
  });
  var LOCAL_LENGUAGE='lenguageLocal';
  var lenguageLocal= window.localStorage.getItem(LOCAL_LENGUAGE);
  if(lenguageLocal){
    $translateProvider.preferredLanguage(lenguageLocal);
  }else{
    $translateProvider.preferredLanguage('en');
  }
  
  

})