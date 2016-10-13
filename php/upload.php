<?php

// script to index and commit file to Solr

$ch = curl_init("http://localhost:8983/solr/awjs/update?commit=true");

$data = file_get_contents('/var/www/public/awjs/upload/SampleLog.csv');

curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/csv'));
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($ch);

// convert response to json
$xml = simplexml_load_string($response);
echo $xml->lst->int;
?>