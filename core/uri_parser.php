<?php

$pathArray = array_filter(explode("/", $_GET['uri_parser_res']));
if (end($pathArray) == "ajax_request") {
	$tempPathArray = $pathArray;
	array_pop($tempPathArray);
	$path = implode("/", $tempPathArray);
} else {
	$path = implode("/", $pathArray);
}

$_URIPARSER = array(
	'path' => $path,
	'pathArray' => $pathArray,
);

?>