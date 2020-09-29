<?php

/*

@Desc
	Routing assoc table working with uri_parser
	to load appropriate views to the user
	from the uri inputted

	@Note
		URI that are not in routes
		will load 404 page specified in settings

@Format
	'{route}' => array('{Controller name}', array({Authorization needed})),

	Example :
	'/students' => array('studentList', array()),

	@Note
		 - No '/' at the end of a route
		 - Space in controller name will be automatically
		   replace with '_'
		 - Routes should be lower case
		 - Controller names are case sensitive depending
		   on the server operating system
		 - You do not have to specify an extension to the
		   controller (.php is automatically added)

	@Vocab
		{d} A numeric value (of any length) [excluding 0]
		{l} A lowercased alphabetic value (of any length)
		{L} An uppercased alphabetic value (of any length)
		{s} An alphanumeric value (of any length)
*/

$loggedIn = true;
$routes = array(
	'contact' => array('contact', array('user')),
	'planning' => array('planning', array()),
	'erreur' => array('erreur', array()),
	'salut/tout' => array('yo', array()),
	'page/with/{d}' => array("page_with_id", array('admin')),
);

function array_key_replace($oldKey, $newKey, &$array){
	if ($oldKey == $newKey) return;
	$array[$newKey] = $array[$oldKey];
	unset($array[$oldKey]);
}

foreach ($routes as $route => $value) {
	$controller = $value[0];
	$routes[$route][0] = str_replace(" ", "_", $controller);
	array_key_replace($route, str_replace("{d}", "[0-9]*", $route), $routes);
	array_key_replace($route, str_replace("{l}", "[a-z]*", $route), $routes);
	array_key_replace($route, str_replace("{L}", "[A-Z]*", $route), $routes);
	array_key_replace($route, str_replace("{s}", "[a-zA-Z0-9]*", $route), $routes);
}


/*
	Check if route exists or not and specify
	the controller or the default one

	Also check if the controller specified
	truly exists
*/



function getController($path, $routes) {
	foreach ($routes as $route => $value) {
	    if (preg_match("/^" . str_replace("/", "\\/", $route) . "$/", $path)) {
			return $value[0];
	    }
	}

	return null;
}

function getControllerAccess($path, $routes) {
	foreach ($routes as $route => $value) {
	    if (preg_match("/^" . str_replace("/", "\\/", $route) . "$/", $path)) {
			return $value[1];
	    }
	}

	return null;
}

function user_has_access_to_route(){
	return true;
}


function getPageController($tempController){
	global $__CONTROLLERS_DIR__;
	global $_SETTINGS;
	global $controllerName;

	if (file_exists("$__CONTROLLERS_DIR__/$tempController.php")) {
		$controllerName = $tempController;
	} else {
		$controllerName = $_SETTINGS['404Controller'];
	}
}

$isAjax = (end($_URIPARSER['pathArray']) == "ajax_request");

if ($_URIPARSER['path'] != "") {
	$tempController = getController($_URIPARSER['path'], $routes);
	$access = getControllerAccess($_URIPARSER['path'], $routes);

	if (!is_null($tempController)) {
		if (!empty($access)) {
			if ($loggedIn) {
				if (user_has_access_to_route()) {
					getPageController($tempController);
				} else {
					if(!$isAjax) http_response_code(403);
					$controllerName = $_SETTINGS['403Controller'];
				}
			} else {
				if(!$isAjax) http_response_code(401);
				$controllerName = $_SETTINGS['loginController'];
			}
		} else {
			getPageController($tempController);
		}
	} else {
		if(!$isAjax) http_response_code(404);
		$controllerName = $_SETTINGS['404Controller'];
	}
} else {
	$controllerName = $_SETTINGS['defaultController'];
}

$controllerFile = "$__CONTROLLERS_DIR__/$controllerName.php";
$controllerModel = "$__MODELS_DIR__/$controllerName.html";
include("$__APPLICATION_DIR__/controller_core.php");

?>