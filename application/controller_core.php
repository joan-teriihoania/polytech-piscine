<?php


function file_model($file){
	if (!file_exists($file)) {
		return "";
	}

	$model = file_get_contents($file);
	return string_model($model);
}

function string_model($model){
	global $__ASSETS_DIR_RENDER__;
	$replace = array(
		'{{ MODEL_ASSETS_DIR }}' => $__ASSETS_DIR_RENDER__,
	);

	foreach ($replace as $key => $value) {
		$model = str_replace($key, $value, $model);
	}

	return $model;
}


function append_view_js_file($url){
	global $view_js_file;
	$view_js_file = $view_js_file . "\n<script src=\"".$url."\"></script>";
}

function append_view_js_script($script){
	global $view_js_script;
	echo $script;
	$view_js_script = $view_js_script . $script;
}

$model = file_model($controllerModel);
$mainframeModel = file_model("$__MODELS_DIR__/mainframe.html");
$view = "";
$view_js_file = "";
$view_js_script = "";
$view_title = $_SETTINGS['defaultTitle'];

ob_start();
include("$__CONTROLLERS_DIR__/$controllerName.php");
ob_end_clean();


if (empty($_URIPARSER['pathArray']) || !$isAjax) {
	$display = $mainframeModel;
	$mainframe_element = array(
		'{{ NAV_BAR }}' => "",
		'{{ SIDEBAR }}' => "",
		'{{ MAIN_CONTENT }}' => $view,
		'{{ FOOTER }}' => "",
		'{{ PAGE_TITLE }}' => $view_title,
		'{{ VIEW_JS_FILE }}' => $view_js_file,
		'{{ VIEW_JS_SCRIPT }}' => $view_js_script,
	);

	foreach ($mainframe_element as $key => $value) {
		$display = str_replace($key, $value, $display);
	}

	echo string_model($display);
} else {
	echo "<title>$view_title</title>";
	echo $view;
}

?>