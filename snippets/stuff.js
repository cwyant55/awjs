// Submit and index document
	 $scope.upload = function(){
        $http.get('/php/upload.php').success(function(response){
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