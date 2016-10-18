//  controller.js

// 
// userController
//
angular.module("awApp").controller("userController", function($scope,$http,dbService){
    $scope.users = [];
    $scope.tempUserData = {};
	
	$scope.getRecords = function() {
		$scope.users = dbService.getRecords('users');
	}; // getRecords
	
	$scope.deleteUser = function(user) {
	var conf = confirm('Are you sure to delete the user?');
        if(conf === true){
			// params: record variable, table name string
			dbService.deleteRecord(user,'users')
        }
	}; // deleteUser
	
	$scope.saveUser = function(type,index){
		var tempData = $scope.tempUserData;
		dbService.saveRecord(tempData,type,'users',index);
		$scope.userForm.$setPristine();
        $scope.tempUserData = {};
        $('.formData').slideUp();
	}; // saveUser
        
    $scope.addUser = function(){
        $scope.saveUser('add');
    }; // addUser
    
    $scope.editUser = function(user){
        $scope.tempUserData = {
            id:user.id,
            name:user.name,
            email:user.email,
        };
        $scope.index = $scope.users.list.indexOf(user);
        $('.formData').slideDown();
    }; // editUser
    
    $scope.updateUser = function(index){
		// include in function call in html; passes index to saveUser()
        $scope.saveUser('edit',index);
    }; //
   
}); // userController

// searchController for Apache Solr
angular.module("awApp").controller("searchController", function($scope,$http){
    $scope.results = [];
    // function to get search results
    $scope.getResults = function(){
		var query = 'http://awjs.local/solr/cwils/select?q=' + $scope.keywords + '&wt=json';
        $http.get(query).success(function(response){
                $scope.results = response.response.docs;
				console.log($scope.results);
        });
    };
});	// Apache Solr controller

// formController
angular.module("awApp").controller("formController", function($scope,$http){
	$scope.upload = function () {
		var file_data = $('#file').prop('files')[0];
		var arkid = $('#arkid').val();
		var form_data = new FormData();                  
		form_data.append('file', file_data);
		form_data.append('arkid', arkid);
		$.ajax({
                url: '/php/upload.php', // point to server-side PHP script 
                dataType: 'text',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,                         
                type: 'post',
                success: function(response) {
				var msg = 'File sucessfully uploaded.';
				console.log(response);
				$('.alert-success > p').html(msg);
				$('.alert-success').show();
				$('.alert-success').delay(5000).slideUp(function(){
				$('.alert-success > p').html('');
					});
				}		
		});
	};
}); // formController

//
// ARK controller
//
angular.module("awApp").controller("arkController", function($scope,$http,dbService,msgService){
	
	// get records
	$scope.getRecords = function(tableName) {
		$scope.records = dbService.getRecords(tableName);		
	};
	
	// success message
	$scope.messageSuccess = msgService.messageSuccess;
	
	// error message
	$scope.messageSuccess = msgService.messageError;
	
// function to generate ARK request
    $scope.arkRequest = function(){
			var data = $.param({
            'data': $scope.temp,
            'type':'ark',
			'table':'docs'
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post("/php/action.php", data, config).success(function(response){
            if(response.status == 'OK'){
                $scope.messageSuccess(response.msg);
            }else{
                $scope.messageError(response.msg);
            }
        });
    };
	
	
	// function to view document
    $scope.viewDoc = function(){
		console.log($scope.temp);
		var docpath = '/upload/' + $scope.temp.ark.docname;
        $http.get(docpath).success(function(response){
			$('#docview > pre').html(response);
			$('#docview').show();
        });
    };

}); // ARK controller