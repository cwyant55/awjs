// define main CRUD application
var awApp = angular.module("awApp", []);
awApp.controller("userController", function($scope,$http){
    $scope.users = [];
    $scope.tempUserData = {};
    // function to get records from the database
    $scope.getRecords = function(tableName){
        $http.get('./php/action.php', {
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
        $http.post("./php/action.php", data, config).success(function(response){
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
});

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
		
	// Submit and index document
	 $scope.upload = function(){
        $http.get('./php/upload.php').success(function(response){
                $scope.results = response;
				console.log($scope.results);
               if(response == '0'){
					$scope.messageSuccess('Submit successful!');
                }else{
					var error = 'Submit failed: ' + response;
                    $scope.messageError(error);
                }

        });
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
	
});

// Dropzonejs stuff
$(document).ready(function(){
	
Dropzone.autoDiscover = false; // keep this line if you have multiple dropzones in the same page

var uploadForm = new Dropzone('#uploadform', {

//	acceptedFiles: "text/csv",
	autoProcessQueue: false,
	url: './php/upload.php',
//	maxFiles: 5, // Number of files at a time
	maxFilesize: 10, //in MB
	maxfilesexceeded: function(file)
		{ alert('You have uploaded more than 1 Image. Only the first file will be uploaded!'); },
	
	success: function (response) {
	var x = JSON.parse(response.xhr.responseText);
	this.removeAllFiles(); // This removes all files after upload to reset dropzone for next upload
	console.log(response); // Just to return the JSON to the console.
		if (response.status == 'success') {
		var msg = 'File ' + response.name + ' sucessfully uploaded.';
		$('.alert-success > p').html(msg);
        $('.alert-success').show();
        $('.alert-success').delay(5000).slideUp(function(){
            $('.alert-success > p').html('');
        });
	}
	},
	addRemoveLinks: true,
	removedfile: function(file) {
	var _ref; // Remove file on clicking the 'Remove file' button
	return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
}
});

$('#add').click(function(){
	uploadForm.processQueue();
});

});