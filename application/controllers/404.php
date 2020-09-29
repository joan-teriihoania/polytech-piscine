<?php

$view = $model;
$view_title = "404 - Page: " . $_URIPARSER['path'];


foreach (array(
	'PAGE_NOT_FOUND' => $_URIPARSER['path'],
) as $key => $value) {
	$view = str_replace("{{ $key }}", $value, $view);
}


?>