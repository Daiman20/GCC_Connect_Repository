// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','ngCordova','pascalprecht.translate','angular-loading-bar', 'ngAnimate'])

.config(function($ionicConfigProvider, $sceDelegateProvider,$translateProvider,cfpLoadingBarProvider){
  $ionicConfigProvider.tabs.position('bottom'); 
  cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
  cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner"> </div>';
 $translateProvider.translations('en', {
    LOGIN: 'Login',
    LABEL_PASSWORD: 'Password',
    LABEL_USER: 'User',
    LABEL_LENGUAGE: 'Select a language',
    LABEL_SEND_ALL_INVOICE: 'Send All',
    TITTLE_INVOICE_RECORD:'Invoice record',
    LABEL_INVOICE :'N° Invoice',
    LABEL_DATE :'Date',
    BUTTON_SEND :'Send',
    BUTTON_QUEUED :'Store Queued',
    TITTLE_INVOICE_NOT_SEND:'Invoices not sent',
    MSG_ERROR_PASSWORD_INVALID: '* Password is invalid',
    MSG_ERROR_PASSWORD_LENGTH: '* Password length is invalid',
    MSG_ERROR_AUTENTIFICATION: '* User/password invalid',
    MSG_ALERT_NOT_INVOICE: 'Does Not Have Invoices Stores',
    MSG_ERROR_USER_INVALID: '* User is invalid',
    MSG_ERROR_USER_LENGTH: '* User length is invalid',
    MSG_CONFIRM_SEND_ALL_INVOICES: 'Do you want to send all invoices?',
    LABEL_LENGUAGE_ENGLISH :'English',
    LABEL_LENGUAGE_EPANISH :'Spanish',
    SAVE_QUEUED : 'Was saved in queue',
    NOT_SAVE_QUEUED: 'Failed to save in queue',
    NOT_CONNECTION :'There is no internet connection',
    LABEL_RIGHTS :'All rights reserved.',
    LABEL_PHONE : 'Phone',
    LABEL_EMAIL : 'Email'
      });
  $translateProvider.translations('es', {
    LOGIN: 'Ingresar',
    LABEL_PASSWORD: 'Contraseña',
    LABEL_USER: 'Usuario',
    LABEL_LENGUAGE: 'Seleccione un lenguaje',
    LABEL_SEND_ALL_INVOICE: 'Enviar Todas',
    TITTLE_INVOICE_RECORD:'Registro de factura',
    LABEL_INVOICE :'N° Factura',
    LABEL_DATE :'Fecha',
    BUTTON_SEND :'Enviar',
    BUTTON_QUEUED :'Almacenar en cola',
    TITTLE_INVOICE_NOT_SEND:'Facturas no enviadas',
    MSG_ERROR_PASSWORD_INVALID: '* Contraseña invalida',
    MSG_ERROR_PASSWORD_LENGTH: '* El tamaño de es incorrecto',
    MSG_ERROR_AUTENTIFICATION: '* Usuario/Contraseña son incorrectos',
    MSG_ALERT_NOT_INVOICE: 'No posee facturas almacenadas',
    MSG_ERROR_USER_INVALID: '* Usuario incorrecto',
    MSG_ERROR_USER_LENGTH: '* El tamaño de es incorrecto',
    MSG_CONFIRM_SEND_ALL_INVOICES: '¿Usted quiere enviar todas las facturas?',
    LABEL_LENGUAGE_ENGLISH :'Ingles',
    LABEL_LENGUAGE_EPANISH :'Español',
    SAVE_QUEUED : 'Se guardo en cola',
    NOT_SAVE_QUEUED: 'No se pudo guardar en cola',
    NOT_CONNECTION :'No hay conexión de internet',
    LABEL_RIGHTS :'Todos los derechos reservados.',
    LABEL_PHONE : 'Teléfono',
    LABEL_EMAIL : 'Email'

  });
  $translateProvider.preferredLanguage('en');
  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",  
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });
      
      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});