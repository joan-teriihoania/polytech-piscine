<?php

$view = $model;
append_view_js_script("calendarInit()");

if ($isAjax) {
	foreach (array(
		'CUSTOM_JS' => "calendarInit()",
	) as $key => $value) {
		$view = str_replace("{{ $key }}", $value, $view);
	}
} else {
	foreach (array(
		'CUSTOM_JS' => "",
	) as $key => $value) {
		$view = str_replace("{{ $key }}", $value, $view);
	}
}

?>