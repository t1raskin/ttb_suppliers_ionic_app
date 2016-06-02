angular.module('ttb_suppliers.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, AuthService) {
})

.controller('LoginCtrl', function($scope, $ionicPopup, $state, DataServiceHTTP, AuthService) {
  //$scope.data = {};

  //$scope.login = function() {
  //  var loginApplicationUserPromise = DataServiceHTTP.loginApplicationUser($scope.data.phone_number, $scope.data.password);
  //  loginApplicationUserPromise.then(function(response) {
  //    if(response.data.status == 'true'){
  //      $rootScope.phone_number = response.data.phone_number;
  //      $rootScope.business_id = response.data.business_id;
  //      $rootScope.type = response.data.type;
  //      $rootScope.name = response.data.name;
  //      $rootScope.role = response.data.role;
  //      $state.go('app.lead_module');
  //    }
  //    else{
  //      var alertPopup = $ionicPopup.alert({
  //        title: 'הזדהות נכשלה!',
  //        template: 'בדוק את פרטי הכניסה ונסה שוב'
  //      });
  //    }
  //  });
  //}

  $scope.data = {};

  $scope.login = function(data) {
    AuthService.login($scope.data.phone_number, $scope.data.password).then(function(authenticated) {
      $state.go('app.lead_module', {}, {reload: true});
      //$scope.setCurrentUsername($scope.data.phone_number);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'אימות נכשל!',
        template: 'אנא בדוק את הפרטים ונסה שנית!'
      });
    });
  };
})

.controller('NavigationCtrl', function($scope, $state, $ionicModal, $ionicHistory, AuthService) {
  $scope.go = function(path){
		$state.go(path);
	}

	$scope.goBackAStep = function(){
		$ionicHistory.goBack();
	}

  $scope.isAdmin = function(){
    if(AuthService.role() == '250'){// 250 = admin, 100 = user
      return true
    }
    return false;
  }

    $scope.isLeadsModule = function(){
      if($state.current.name == "app.my_leads" || $state.current.name == "app.my_points" || $state.current.name == "app.new_lead"){
        return true;
      }
      return false;
    }

    $scope.logout = function() {
      AuthService.logout();
      $state.go('login');
    };

    $scope.performValidRequest = function() {
      $http.get('http://localhost:8100/valid').then(
        function(result) {
          $scope.response = result;
        });
    };

    $scope.performUnauthorizedRequest = function() {
      $http.get('http://localhost:8100/notauthorized').then(
        function(result) {
          // No result here..
        }, function(err) {
          $scope.response = err;
        });
    };

    $scope.performInvalidRequest = function() {
      $http.get('http://localhost:8100/notauthenticated').then(
        function(result) {
          // No result here..
        }, function(err) {
          $scope.response = err;
        });
    };
})

.controller('NewLeadCtrl', function($scope, DataServiceHTTP, $filter) {
  $scope.supplierCategories = [];
  $scope.formView = true;

	var buildingStagesPromise = DataServiceHTTP.getBuildingStages();
		buildingStagesPromise.then(function(response) {
		$scope.buildingStages = response.data;
		$scope.buildingStage = $scope.buildingStages[0];
	});

	var needsPromise = DataServiceHTTP.getNeeds();
		needsPromise.then(function(response) {
		$scope.needs = response.data;
	});

	$scope.showNeedCategories = false;
	$scope.getNeedCategories = function(){
		var needCategoriesPromise = DataServiceHTTP.getNeedCategories($scope.need.id);
		needCategoriesPromise.then(function(response) {
			$scope.needCategories = response.data;
      for(var i=0 ; i < $scope.needCategories.length; i++) {
        //$scope.needCategories[i].businesses.unshift({business_id: '1', name: 'כל הספקים'});
        $scope.needCategories[i].selectedBusiness = {business_id: '1', name: 'כל הספקים'};
      }
			//console.log('got the categories');
			$scope.showNeedCategories = true;
		});
	};

	$scope.currentCategories = [];
  $scope.isChecked = function(id){
    var match = false;
    for(var i=0 ; i < $scope.currentCategories.length; i++) {
      if($scope.currentCategories[i].id == id){
        match = true;
      }
    }
    return match;
  };
	$scope.sync = function(bool, item){
		if(bool){
			// add item
			$scope.currentCategories.push(item);
		} else {
			// remove item
			for(var i=0 ; i < $scope.currentCategories.length; i++) {
				if($scope.currentCategories[i].id == item.id){
					$scope.currentCategories.splice(i,1);
				}
			}
		}
	};

  $scope.selectedCatBusiness = [];
  $scope.updateSelectedBusiness = function(category, j){
    for(var i=0 ; i < $scope.currentCategories.length; i++) {
      if($scope.currentCategories[i].id == category.id){
        $scope.currentCategories[i].selectedBusiness = $scope.selectedCatBusiness[j];
      }
    }
  };

  $scope.leadFormData = {};
	$scope.showErrors = false;
	$scope.formSend = function(leadData){
		$scope.showErrors = true;
		if($scope.leadForm.$invalid){
			console.log('form has errors ');
			//console.log('$scope.leadFormData.lead_details.username.$error.required '+$scope.leadFormData.lead_details.username.$error.required);
			console.log('$scope.showErrors '+$scope.showErrors);
		}
		else{
			$scope.leadFormData.lead_details.buildingStage = $scope.buildingStage.name;
			$scope.leadFormData.lead_details.need = $scope.need.name;
			$scope.leadFormData.categories = $scope.currentCategories;
      $scope.leadFormData.lead_recipients = [];
      $scope.leadFormData.lead_source = {};

      for (var i=0; i<$scope.leadFormData.categories.length; i++){
        // in case all businesses in category
        if($scope.leadFormData.categories[i].selectedBusiness.business_id == 1){
          for (var j=0; j<$scope.leadFormData.categories[i].businesses.length; j++){
            if($scope.leadFormData.categories[j].selectedBusiness.business_id != 1){
              var tmpVar = {};
              tmpVar.business_id = $scope.leadFormData.categories[i].businesses[j].business_id;
              tmpVar.name = $scope.leadFormData.categories[i].businesses[j].name;
              tmpVar.email = $scope.leadFormData.categories[i].businesses[j].email;
              tmpVar.index_active = $scope.leadFormData.categories[i].businesses[j].index_active;
              tmpVar.payment_status = $scope.leadFormData.categories[i].businesses[j].payment_status;
              tmpVar.sub_category = $scope.leadFormData.categories[i].businesses[j].sub_category;
              tmpVar.lead_log = [];
              var leadLogObj = {
                timestamp: $filter('date')(new Date(), 'dd/MM/yyyy HH:mm:ss'),
                lead_status: 'חדש',
                comments: ''
              };
              tmpVar.lead_log[0] = leadLogObj;
              $scope.leadFormData.lead_recipients.push(tmpVar);
            }
          }
        }
        // in case only 1 business selected
        else{
          for (var j=0; j<$scope.leadFormData.categories[i].businesses.length; j++){
            if($scope.leadFormData.categories[i].businesses[j].business_id == $scope.leadFormData.categories[i].selectedBusiness.business_id){
              var tmpVar = {};
              tmpVar.business_id = $scope.leadFormData.categories[i].businesses[j].business_id;
              tmpVar.name = $scope.leadFormData.categories[i].businesses[j].name;
              tmpVar.email = $scope.leadFormData.categories[i].businesses[j].email;
              tmpVar.index_active = $scope.leadFormData.categories[i].businesses[j].index_active;
              tmpVar.payment_status = $scope.leadFormData.categories[i].businesses[j].payment_status;
              tmpVar.sub_category = $scope.leadFormData.categories[i].businesses[j].sub_category;
              tmpVar.lead_log = [];
              var leadLogObj = {
                timestamp: $filter('date')(new Date(), 'dd/MM/yyyy HH:mm:ss'),
                lead_status: 'חדש',
                comments: ''
              };
              tmpVar.lead_log[0] = leadLogObj;
              $scope.leadFormData.lead_recipients.push(tmpVar);
            }
          }
        }
        // from who the lead came from
        $scope.leadFormData.lead_source.phone_number = AuthService.username();
        $scope.leadFormData.lead_source.name = AuthService.role();
        $scope.leadFormData.lead_source.business_id = AuthService.business_id();
      }

			console.log($scope.leadFormData);
			var formSendPromise = DataServiceHTTP.sendLeadData($scope.leadFormData);
			formSendPromise.then(function(response) {
				//console.log('sent the form data ' + response.data);
				//console.log('');
        $scope.formView = false;
				if (response.data == false){
          $scope.thxMessage = 'בעיה בשליחת הליד, אנא נסו שנית';
        }
        else{
          $scope.thxMessage = 'תודה על השיתוף.  המידע הועבר למיזם לבדיקה – הודעה תישלח אליך חשבון הנקודות שלך יזוכה ב  ' + response.data + 'נקודות';
        }
			});
		}
	};
})

.controller('MyPointsCtrl', function($scope, $state, DataServiceHTTP) {
  $scope.isShown = function(group) {
    return $scope.shownGroup === group;
  };
  $scope.toggle = function(group) {
    if ($scope.isShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  var getUserPointsDetailsPromise = DataServiceHTTP.getUserPointsDetails(AuthService.username());
  getUserPointsDetailsPromise.then(function(response) {
    $scope.pointsSum = 0;
    for(var i=0; i<response.data.length; i++){
      //$scope.pointsSum += parseInt(response.data[i].points_action_points,10);
      $scope.pointsSum += parseInt(response.data[i].points_action_points,10);
      //console.log(response.data[i].points_action_points);
      //console.log($scope.pointsSum);
    }
    $scope.pointsDetails = response.data;
    console.log(response.data);
  });

  $scope.rewardsVisible = false;
  var getAllRewardsPromise = DataServiceHTTP.getAllRewards();
  getAllRewardsPromise.then(function(res){
    $scope.rewards = res.data;
  });
})

.controller('MyLeadsCtrl', function($scope, $state, DataServiceHTTP, $ionicPopup, $filter) {
  $scope.isShown = function(group) {
    return $scope.shownGroup === group;
  };
  $scope.toggle = function(group) {
    if ($scope.isShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  var getUserLeadsPromise = DataServiceHTTP.getUserLeads(AuthService.business_id());
  getUserLeadsPromise.then(function(response) {
    $scope.myLeads = response.data;
    for(var i=0; i<$scope.myLeads.length; i++){
      $scope.myLeads[i].lead_details = JSON.parse($scope.myLeads[i].lead_details);
      //console.log(response.data[i].lead_details);
      $scope.myLeads[i].lead_recipients = JSON.parse($scope.myLeads[i].lead_recipients);
      $scope.myLeads[i].lead_source = JSON.parse($scope.myLeads[i].lead_source);
      $scope.myLeads[i].lead_type = JSON.parse($scope.myLeads[i].lead_type);

      // special formatting of data for display in view
      if($scope.myLeads[i].lead_type.name == 'ttb_supplier_application'){
        $scope.myLeads[i].lead_source.name = AuthService.supplierName();
        $scope.myLeads[i].lead_source.type = AuthService.userType();
        for(var j=0; j<$scope.myLeads[i].lead_recipients.length; j++){
          if($scope.myLeads[i].lead_recipients[j].business_id == AuthService.business_id()){
            // the details of the lead for the current business only, first row is the latest status
            $scope.myLeads[i].lead_log = $scope.myLeads[i].lead_recipients[j].lead_log;
          }
        }
      }
    }
    console.log($scope.myLeads);
  });

  $scope.statusUpdatePopup = function(lead) {
    var getLeadStatusesPromise = DataServiceHTTP.getLeadStatuses();
    getLeadStatusesPromise.then(function(res){
      //console.log(res);
      $scope.data = {
        status: ''
      }
      for (var i=0; i<res.data.length; i++){
        if(res.data[i].name == lead.lead_log[0].lead_status){
          $scope.data.status = res.data[i];
        }
      }
      console.log($scope.data.status);
      $scope.leadStatuses = res.data;
      // lead status update popup
      var myPopup = $ionicPopup.show({
        //template: '<input type = "text" ng-model = "data.model">',
        template: '' +
        '<label class="item item-input">' +
        '<select ng-model="data.status" ng-options="option.name for option in leadStatuses"></select>' +
        '</label>' +
        '<label class="item item-input">' +
        '<textarea ng-model="data.comments" height="4" placeholder="הערות"></textarea>' +
        '</label>',
        title: 'עדכון סטטוס ליד',
        //subTitle: 'Subtitle',
        scope: $scope,

        buttons: [
          {
            text: 'ביטול'
          },
          {
            text: '<b>שמירה</b>',
            type: 'button-positive',
            onTap: function(e) {
              // if not changed status or enter comments do not allow to save.
              if (!$scope.data.status && ($scope.data.status != lead.lead_current_stage.lead_status && !$scope.data.comments)) {
                //e.preventDefault();
                // do nothing
                return $scope.data;
              }
              else {
                // save new record iin lead log of the current supplier
                var leadLogObj = {
                  timestamp: $filter('date')(new Date(), 'dd/MM/yyyy HH:mm:ss'),
                  lead_status: $scope.data.status.name,
                  comments: $scope.data.comments
                };
                for(var j=0; j<lead.lead_recipients.length; j++){
                  if(lead.lead_recipients[j].business_id == AuthService.business_id()){
                    // the details of the lead for the current business only
                    lead.lead_recipients[j].lead_log.unshift(leadLogObj);
                  }
                }

                return lead;
              }
            }
          }
        ]
      });

      myPopup.then(function(lead) {
        //console.log('Tapped!', lead);
        var updateLeadRecipientsDataPromise = DataServiceHTTP.updateLeadRecipientsData(lead);
        updateLeadRecipientsDataPromise.then(function(res){
          console.log(res);
        });
      });
    });
  };
})

.controller('ProjectFormCtrl', function($scope, DataServiceHTTP, $ionicPopup, Camera, $localstorage, $cordovaFileTransfer, $http) {
  $scope.projectTypes = [
    {id: 1, name: 'דירה'},
    {id: 2, name: 'בית'},
    {id: 3, name: 'דירת גן'},
    {id: 4, name: 'פנטהאוז'},
    {id: 5, name: 'אחר'}
  ];

  $scope.project = {};
  $scope.project.photos = [];
  $scope.project.photosDisplay = [];
  $scope.getPhotoFromCamera = function() {
    var picOptions = {
      quality: 100,
      destinationType: navigator.camera.DestinationType.DATA_URL,
      sourceType: navigator.camera.PictureSourceType.CAMERA
    };
    Camera.getPicture(picOptions).then(
      function(imageURI) {
        $scope.lastPhoto = "data:image/jpeg;base64,"+imageURI;
        $scope.lastPhotoOriginal = imageURI;
        $scope.project.photos.push($scope.lastPhotoOriginal);
        $scope.project.photosDisplay.push($scope.lastPhoto);
        $scope.ftLoad = true;
        $localstorage.set('fotoUp', imageData);
        $ionicLoading.show({template: 'מעבד נתונים', duration:500});
      },
      function(err) {
        console.err(err);
        $ionicLoading.show({template: 'שגיאה', duration:500});
      }
    );
  };
  $scope.getPhotoFromGallery = function() {
    var picOptions = {
      quality: 100,
      destinationType: navigator.camera.DestinationType.DATA_URL,
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    };
    try{
      Camera.getPicture(picOptions).then(function(imageURI) {
          console.log(imageURI);
          $scope.lastPhoto = "data:image/jpeg;base64,"+imageURI;
          $scope.lastPhotoOriginal = imageURI;
          $scope.project.photos.push($scope.lastPhotoOriginal);
          $scope.project.photosDisplay.push($scope.lastPhoto);
          $scope.dataurl = imageURI;
          $ionicLoading.show({template: 'מעבד נתונים', duration:500});
        },
        function(err){
          $ionicLoading.show({template: 'שגיאה', duration:500});
        })
    }catch(e){
      console.log('e - '+e);
      console.log('e stack - '+e.stack);
      console.log('e line - '+e.line);
    }
  };

  $scope.sendProject = function(){
    $ionicLoading.show({template: '<ion-spinner></ion-spinner><br><p>שולח טופס</p>'});
    $scope.project.type = $scope.project.type.name;
    var sendProjectFormPromise = DataServiceHTTP.sendProjectForm($scope.project);
    sendProjectFormPromise.then(function(response) {
      if(response.data) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'הטופס נשלח בהצלחה',
          template: ''
        });
      }
      else{
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'בעיה בשליחת הטופס',
          template: ''
        });
      }
    });
  };
})

.controller('LeadVerificationCtrl', function($scope, DataServiceHTTP, $ionicPopup) {
  $scope.noNewLeads = false;

  var getAllUnverifiedLeadsPromise = DataServiceHTTP.getAllUnverifiedLeads();
    getAllUnverifiedLeadsPromise.then(function(response) {
      $scope.response = response.data;
      for(var i=0; i<$scope.response.length; i++) {
        $scope.response[i].lead_source = JSON.parse($scope.response[i].lead_source);
      }
      $scope.newLeads = $scope.response;
      if($scope.newLeads.length == 0){
        $scope.noNewLeads = true;
      }
      else{
        $scope.noNewLeads = false;
      }
      //console.log($scope.noNewLeads);
  });

  $scope.updateLeadList = function(lead_id){
    for(var i=0; i<$scope.newLeads.length; i++) {
      if($scope.newLeads[i].id == lead_id){
        $scope.newLeads.splice(i, 1);
        break;
      }
    }
    if($scope.newLeads.length == 0){
      $scope.noNewLeads = true;
    }
    else{
      $scope.noNewLeads = false;
    }
  };

  $scope.updateVerificationStatus = function(lead_id) {
    $scope.verificationStatuses = [
      {id: 1, name: 'חדש', value: '0'},
      {id: 2, name: 'מאושר', value: '1'},
      {id: 3, name: 'לא מאושר', value: '2'}
    ];
    $scope.data = {
      verificationStatus: $scope.verificationStatuses[0]
    };
    //$scope.data.verificationStatus = $scope.verificationStatuses[0];

    // lead status update popup
    var verificationPopup = $ionicPopup.show({
      //template: '<input type = "text" ng-model = "data.model">',
      template: '' +
      '<label class="item item-input">' +
      '<select ng-model="data.verificationStatus" ng-options="option.name for option in verificationStatuses"></select>' +
      '</label>',
      title: 'עדכון סטטוס אישור ליד חדש',
      //subTitle: 'Subtitle',
      scope: $scope,

      buttons: [
        {
          text: 'ביטול'
        },
        {
          text: '<b>שליחה</b>',
          type: 'button-positive',
          onTap: function(e) {
            // if not changed status or enter comments do not allow to save.
            if ($scope.data.verificationStatus == $scope.verificationStatuses[0]) {
              //e.preventDefault();
              // do nothing
              console.log($scope.data.verificationStatus);
              return $scope.data.verificationStatus.value;
            }
            else {
              // save new record in lead log of the current supplier
              console.log($scope.data.verificationStatus);
              return $scope.data.verificationStatus.value;
            }
          }
        }
      ]
    });

    verificationPopup.then(function(verificationStatus) {
      var updateLeadVerificationStatusPromise = DataServiceHTTP.updateLeadVerificationStatus(lead_id, verificationStatus);
      updateLeadVerificationStatusPromise.then(function(res){
        console.log(res);
        $scope.updateLeadList(lead_id);
      });
    });
  };
})
;


