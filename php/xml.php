<?php
$xmlFile = $_REQUEST['file'];
$xslFile = '/xsl/nwda.mod.dsc.xsl';
if(isset($_REQUEST['file']) && !empty($_REQUEST['file'])){
	
$xml = new DOMDocument();
$xml->load(sprintf($xmlFile, getenv("HOME")));
 
$xsl = new DOMDocument;
$xsl->load($xslFile);
 
$proc = new XSLTProcessor();
$proc->importStyleSheet($xsl);
 
echo $proc->transformToXML($xml);
}