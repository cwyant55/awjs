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
$date = date('Y-m-d H:i:s');
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
$ch = curl_init("http://localhost:8983/solr/awjs/update?commit=true");

//$data = file_get_contents($targetFile);
$data = '<add><doc>';

$xml = simplexml_load_file($targetFile);

function pretty($str) {
  $string = trim($str);
  $string = str_replace("\n", '', $string);
  $string = str_replace("\r", '', $string);
  $string = str_replace("\t", '', $string);
  $string = str_replace(PHP_EOL, '', $string);
  return $string;
}

// get titleproper
foreach ($xml->xpath('//titleproper') as $title) {
    $data .= '<field name="title">' . pretty($title) . '</field>';
}

// get ARK ID
$data .= '<field name="id">' . $xml->eadheader->eadid->attributes()->identifier . '</field>';

// get subject headings
foreach ($xml->archdesc->controlaccess->controlaccess as $ca) {
  $data .= '<field name="subject">' . pretty($ca->subject) . '</field>';
}

foreach ($xml->archdesc->dsc->c01 as $c01) {

  // series title
  $data .= '<field name="c01 title">' . pretty($c01->did->unittitle) . '</field>';

  // get files
  foreach ($c01->c02 as $c02) {
    $data .= '<field name="c02 title">' . pretty($c02->did->unittitle) . '</field>';
    $data .= '<field name="c02 date">' . pretty($c02->did->unitdate) . '</field>';
    $data .= '<field name="c02 container">' . pretty($c02->did->container) . '</field>';
  }

  $data .= '<field name="subject">' . pretty($ca->subject) . '</field>';
}

$data .= '</doc></add>';

curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: text/xml'));
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($ch);

// get response status
//$xml = simplexml_load_string($response);
echo $response;
?>
