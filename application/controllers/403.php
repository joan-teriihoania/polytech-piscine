<?php

$view = $model;
$view_title = "403 - Page: " . $_URIPARSER['path'];


foreach (array(
	'PAGE_DENIED' => $_URIPARSER['path'],
) as $key => $value) {
	$view = str_replace("{{ $key }}", $value, $view);
}


?>