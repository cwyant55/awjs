<?php
$ds          = DIRECTORY_SEPARATOR;  //1
 
$storeFolder = '/var/www/public/awjs/upload';   //2
 
if (!empty($_FILES)) {
     
    $tempFile = $_FILES['file']['tmp_name'];          //3             
      
#    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;  //4
    $targetPath = $storeFolder . $ds;  //4
     
    $targetFile =  $targetPath. $_FILES['file']['name'];  //5
 
    move_uploaded_file($tempFile,$targetFile); //6
     
}


// index and commit file to Solr
$ch = curl_init("http://localhost:8983/solr/awjs/update?commit=true");

$data = file_get_contents($targetFile);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/csv'));
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($ch);

// get response status
$xml = simplexml_load_string($response);
echo $xml->lst->int;
?>