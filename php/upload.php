<?php
include 'DB.php';
$ds = DIRECTORY_SEPARATOR;
$storeFolder = '/var/www/public/awjs/upload';

if (!empty($_FILES)) { 
    $tempFile = $_FILES['file']['tmp_name'];
    $targetPath = $storeFolder . $ds;
    $targetFile =  $targetPath. $_FILES['file']['name'];
    move_uploaded_file($tempFile,$targetFile);
}

// insert into database
$db = new DB();
$tblName = 'docs';
$date = $date = date('Y-m-d H:i:s');
				// arkid must exist in docs table before uploading file
                $arkData = array(
                    'docname' => $_FILES['file']['name'],
					'created' => $date
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