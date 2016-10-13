<?php
$target_dir = "/var/www/public/awjs/upload/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}
// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" ) {
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}


// index and commit file to Solr

#$ch = curl_init("http://localhost:8983/solr/awjs/update?commit=true");

#$data = file_get_contents('/var/www/public/awjs/upload/SampleLog.csv');

#curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
#curl_setopt($ch, CURLOPT_POST, TRUE);
#curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/csv'));
#curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

#$response = curl_exec($ch);

// get response status
#$xml = simplexml_load_string($response);
#echo $xml->lst->int;
?>