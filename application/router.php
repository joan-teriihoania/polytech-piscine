<?php

/*

@Desc
	Routing assoc table working with uri_parser
	to load appropriate views to the user
	from the uri inputted

	@Note
		URI that are empty will load the default
		controller specified in settings

		URI that are not empty and not in routes
		will load 404 controller specified in settings
		You can specify an empty route in the routes
		to overwrite this behaviour

@Format
	'{route}' => '{controller name}',

	Example :
	'/students' => 'studentList',

	@Note
		 - No '/' at the end of a route
		 - Routes should be lower case
		 - Controller names are case sensitive depending
		   on the server operating system
		 - You do not have to specify an extension to the
		   controller (.php is automatically added)
*/

$routes = array(
	'erreur' => 'erreur',
	'salut/tout' => 'yo',
	'page/with/[0-9]*' => "page_with_id",
);


/*
	Check if route exists or not and specify
	the controller or the default one

	Also check if the controller specified
	truly exists
*/



function route_exists($path, $routes) {
	foreach ($routes as $route => $controller) {
	    if (preg_match("/^" . str_replace("/", "\\/", $route) . "$/", $path)) {
	    	return $controller;
	    }
	}

	return null;
}

switch ($_URIPARSER['path']) {
	case '':
		$controllerName = $_SETTINGS['defaultController'];
		break;
	default:
		if (!is_null(route_exists($_URIPARSER['path'], $routes))) {
			$tempController = route_exists($_URIPARSER['path'], $routes);

			if (file_exists("$__CONTROLLERS_DIR__/$tempController.php")) {
				$controllerName = $tempController;
			} else {
				$controllerName = $_SETTINGS['404Controller'];
			}
		} else {
			$controllerName = $_SETTINGS['404Controller'];
		}
		break;
}

$controllerFile = "$__CONTROLLERS_DIR__/$controllerName.php";
include($controllerFile);

?>