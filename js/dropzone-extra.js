// Dropzonejs stuff
$(document).ready(function(){
	
Dropzone.autoDiscover = false; // keep this line if you have multiple dropzones in the same page

var uploadForm = new Dropzone('#uploadform', {
//	acceptedFiles: "text/csv",
	autoProcessQueue: false,
	url: '/php/upload.php',
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