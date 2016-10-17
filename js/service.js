//
// service.js
//

// create, retrieve, update, delete records from database
angular.module("awApp").factory('dbService', function($http) {
	var records = {};
	
	return {
		getRecords : function(tableName) {
        $http.get('/php/action.php', {
            params:{
                'type':'view',
				'table':tableName
            }
        }).success(function(response){
			records.list = response.records;
			console.log(records.list);
        });
		return records;
    }, // getRecords
	
	getRecords : function(tableName) {
        $http.get('/php/action.php', {
            params:{
                'type':'view',
				'table':tableName
            }
        }).success(function(response){
			records.list = response.records;
			console.log(records.list);
        });
		return records;
    }, // 
	
	
	
		} // return
});


angular.module("awApp").factory('msgService', function() {
	var msg = {};
	
	return {
		
    messageSuccess : function(msg){
        $('.alert-success > p').html(msg);
        $('.alert-success').show();
        $('.alert-success').delay(5000).slideUp(function(){
        $('.alert-success > p').html('');
        });
    }, // messageSuccess
	
	messageError : function(msg){
        $('.alert-danger > p').html(msg);
        $('.alert-danger').show();
        $('.alert-danger').delay(5000).slideUp(function(){
            $('.alert-danger > p').html('');
        });
    }
	
	} // return
	
});
    