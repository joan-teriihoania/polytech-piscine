<?php

$pathArray = array_filter(explode("/", $_GET['uri_parser_res']));

$_URIPARSER = array(
	'path' => implode("/", $pathArray),
	'pathArray' => $pathArray,
);

?>