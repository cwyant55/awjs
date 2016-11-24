<?php

$data = '<add><doc>';

$xml = simplexml_load_file('/var/www/public/awjs/tmp/MTLakers.xml');

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
echo $data;

?>
