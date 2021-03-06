// define main CRUD application
var awApp = angular.module("awApp", []);
awApp.controller("userController", function($scope,$http){
    $scope.users = [];
    $scope.tempUserData = {};
    // function to get records from the database
    $scope.getRecords = function(tableName){
        $http.get('/php/action.php', {
            params:{
                'type':'view',
				'table':tableName
            }
        }).success(function(response){
            if(response.status == 'OK'){
                $scope.users = response.records;
				console.log($scope.users);
            }
        });
    };
    
    // function to insert or update user data to the database
    $scope.saveUser = function(type){
        var data = $.param({
            'data':$scope.tempUserData,
            'type':type,
			'table':'users'
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post("/php/action.php", data, config).success(function(response){
            if(response.status == 'OK'){
                if(type == 'edit'){
                    $scope.users[$scope.index].id = $scope.tempUserData.id;
                    $scope.users[$scope.index].name = $scope.tempUserData.name;
                    $scope.users[$scope.index].email = $scope.tempUserData.email;
                }else{
                    $scope.users.push({
                        id:response.data.id,
                        name:response.data.name,
                        email:response.data.email,
                    });
                    
                }
                $scope.userForm.$setPristine();
                $scope.tempUserData = {};
                $('.formData').slideUp();
                $scope.messageSuccess(response.msg);
            }else{
                $scope.messageError(response.msg);
            }
        });
    };
    
    // function to add user data
    $scope.addUser = function(){
        $scope.saveUser('add');
    };
    
    // function to edit user data
    $scope.editUser = function(user){
        $scope.tempUserData = {
            id:user.id,
            name:user.name,
            email:user.email,
        };
        $scope.index = $scope.users.indexOf(user);
        $('.formData').slideDown();
    };
    
    // function to update user data
    $scope.updateUser = function(){
        $scope.saveUser('edit');
    };
    
    // function to delete user data from the database
    $scope.deleteUser = function(user){
        var conf = confirm('Are you sure to delete the user?');
        if(conf === true){
            var data = $.param({
                'id': user.id,
                'type':'delete',
				'table':'users'
            });
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }    
            };
            $http.post("./php/action.php",data,config).success(function(response){
                if(response.status == 'OK'){
                    var index = $scope.users.indexOf(user);
                    $scope.users.splice(index,1);
                    $scope.messageSuccess(response.msg);
                }else{
                    $scope.messageError(response.msg);
                }
            });
        }
    };
    
    // function to display success message
    $scope.messageSuccess = function(msg){
        $('.alert-success > p').html(msg);
        $('.alert-success').show();
        $('.alert-success').delay(5000).slideUp(function(){
            $('.alert-success > p').html('');
        });
    };
    
    // function to display error message
    $scope.messageError = function(msg){
        $('.alert-danger > p').html(msg);
        $('.alert-danger').show();
        $('.alert-danger').delay(5000).slideUp(function(){
            $('.alert-danger > p').html('');
        });
    };
	
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
	
}); // user controller

// Apache Solr
awApp.controller("searchController", function($scope,$http){
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

// form controller
awApp.controller("formController", function($scope,$http){
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
}); // form controller