angular.module('ttb_suppliers', ['ionic', 'ttb_suppliers.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.navBar.alignTitle('center');
    //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

    $stateProvider
		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl'
		})
		.state('login', {
			url: '/login',
      templateUrl: "templates/login.html"
		})
    .state('app.lead_module', {
			url: '/lead_module',
			views: {
				'menuContent': {
					templateUrl: 'templates/lead_module.html'
				}
			}
		})
		.state('app.new_lead', {
			url: '/new_lead',
			views: {
				'menuContent': {
					templateUrl: 'templates/new_lead.html'
				}
			}
		}).state('app.my_points', {
			url: '/my_points',
			views: {
				'menuContent': {
					templateUrl: 'templates/my_points.html'
				}
			}
		})
		.state('app.my_leads', {
			url: '/my_leads',
			views: {
				'menuContent': {
					templateUrl: 'templates/my_leads.html'
				}
			}
		})
    .state('app.project_form', {
			url: '/project_form',
			views: {
				'menuContent': {
					templateUrl: 'templates/project_form.html'
				}
			}
		})
    .state('app.verify_new_leads', {
			url: '/verify_new_leads',
			views: {
				'menuContent': {
					templateUrl: 'templates/verify_new_leads.html'
				}
			}
		});
	$urlRouterProvider.otherwise('/login');
})

.factory('DataServiceHTTP', function($http){
  return {
    getBuildingStages : function(){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/getAllBuildingStages',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal'
        }
      });
    },
    getNeeds : function(){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/getAllNeeds',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal'
        }
      });
    },
    getNeedCategories : function(needId){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/getNeedCategories',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal',
          need_id: needId
        }
      });
    },
    sendLeadData : function(leadData){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/saveNewProjectBidLeadTTBFromApplication',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal',
          leadData: leadData
        }
      });
    },
    loginApplicationUser : function(phone_number, password){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/loginApplicationUser',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: {
          api_key: 'designportal',
          phone_number: phone_number,
          password: password
        }
      });
    },
    getUserPointsDetails : function(phone_number){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/getUserPointsDetails',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal',
          phone_number: phone_number
        }
      });
    },
    getUserLeads : function(business_id){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/getUserLeads',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal',
          business_id: business_id
        }
      });
    },
    getLeadStatuses : function(){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/getLeadStatuses',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal'
        }
      });
    },
    getAllRewards : function(){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/getAllRewards',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal'
        }
      });
    },
    updateLeadRecipientsData : function(lead){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/updateLeadRecipientsData',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          api_key: 'designportal',
          lead: lead
        }
      });
    },
    sendProjectForm : function(project){
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/sendNewProjectFormToEmail',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;' },
        data: {
          api_key: 'designportal',
          project: project
        }
      });
    },
    getAllUnverifiedLeads : function(){ // get al new unverified leads
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/getAllUnverifiedLeads',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;' },
        data: {
          api_key: 'designportal'
        }
      });
    },
    updateLeadVerificationStatus : function(lead_id, verification_status){ // get al new unverified leads
      return $http( {
        method: 'POST',
        url: 'http://letuknow.co.il/api/updateLeadVerificationStatus',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;' },
        data: {
          api_key: 'designportal',
          lead_id: lead_id,
          verification_status: verification_status
        }
      });
    }
  }
})

.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.run(function($location, $state, $rootScope, AuthService, $window) {
  $rootScope.$on( "$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if($window.localStorage.getItem('ttb_supplier_auth_token') !== undefined){
      //
    }
    else{
      if(toState.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }


  });
})

.service('AuthService', function($q, $http, DataServiceHTTP, $window) {
  var LOCAL_TOKEN_KEY = 'ttb_supplier_auth_token';
  var username = ''; // phone number
  var supplierName = ''; // name
  var userType = ''; // type
  var business_id = ''; // business_id
  var role = ''; // admin or user
  var authToken;

  function loadUserCredentials() {
    var token = $window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    $window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    username = token.split('.')[0];
    supplierName = token.split('.')[1];
    userType = token.split('.')[2];
    business_id = token.split('.')[3];
    role = token.split('.')[4];
    authToken = token.split('.')[5];
    isAuthenticated = true;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    supplierName = '';
    userType = '';
    business_id = '';
    role = '';
    isAuthenticated = false;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(name, pw) {
    return $q(function(resolve, reject) {
      var loginApplicationUserPromise = DataServiceHTTP.loginApplicationUser(name, pw);
      loginApplicationUserPromise.then(function(response) {
        if(response.data.status == 'true'){
          storeUserCredentials(response.data.phone_number + '.' + response.data.name + '.' + response.data.type + '.' + response.data.business_id + '.' + response.data.role + '.yourServerToken');

          resolve('Login success.');
        }
        else{
          reject('Login Failed.');
        }
      });
    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  var checkCredentials = function() {
    loadUserCredentials();
    console.log('checkCredentials '+ isAuthenticated);
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;}, // phone number
    role: function() {return role;},
    business_id: function() {return business_id;},
    userType: function() {return userType;},
    supplierName: function() {return supplierName;}
  };
})

;
