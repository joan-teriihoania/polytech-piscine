<?php

/*

@Desc
	Routing assoc table working with uri_parser
	to load appropriate views to the user
	from the uri inputted

	@Note
		Empty uri will load default controller
		specified in settings

		You can also specify an empty route in the
		routes to overwrite the default controller

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
	'salut/tout' => 'yo',
);


/*
	Check if route exists or not and specify
	the controller or the default one

	Also check if the controller specified
	truly exists
*/

if (array_key_exists($_URIPARSER['path'], $routes)) {
	$tempController = $routes[$_URIPARSER['path']];

	if (file_exists("$__CONTROLLERS_DIR__/$tempController.php")) {
		$controllerName = $tempController;
	} else {
		$controllerName = $_SETTINGS['404Controller'];
	}
} else {
	$controllerName = $_SETTINGS['defaultController'];
}

$controllerFile = "$__CONTROLLERS_DIR__/$controllerName.php";
print($controllerName);
print($controllerFile);

?>