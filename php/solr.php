<?php
#curl http://localhost:8983/solr/cwils/update?commit=true -H "Content-Type: text/csv" --data-binary @/var/www/public/awjs/upload/SampleLog.csv

$ch = curl_init('http://localhost:8983/solr/cwils/update?commit=true -H "Content-Type: text/csv" --data-binary @/var/www/public/awjs/upload/SampleLog.csv');

#$data = array(
#    "add" => array( 
#        "doc" => array(
#            "id"   => "HW2212",
#            "title" => "Hello World 2"
#        ),
#        "commitWithin" => 1000,
#    ),
#);
#$data_string = json_encode($data);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_POST, TRUE);
#curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: text/csv'));
#curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);

$response = curl_exec($ch);
?>