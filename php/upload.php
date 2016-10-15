<?php
include 'DB.php';
$ds = DIRECTORY_SEPARATOR;
$storeFolder = '/var/www/public/awjs/upload';

if (!empty($_FILES)) { 
    $tempFile = $_FILES['file']['tmp_name'];
#    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;  //4
    $targetPath = $storeFolder . $ds;
    $targetFile =  $targetPath. $_FILES['file']['name'];
    move_uploaded_file($tempFile,$targetFile);
}

// insert into database
$db = new DB();
$tblName = 'docs';
                $arkData = array(
                    'docname' => $_FILES['file']['name']
                );
                $condition = array('arkid' => $_REQUEST['arkid']);
                $update = $db->update($tblName,$arkData,$condition);
                if($update){
                    $data['status'] = 'OK';
                    $data['msg'] = 'Data has been updated successfully.';
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.';
                }

// index and commit file to Solr
$ch = curl_init("http://localhost:8983/solr/cwils/update?commit=true");

$data = file_get_contents($targetFile);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/csv'));
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($ch);

// get response status
//$xml = simplexml_load_string($response);
echo $response;
?>