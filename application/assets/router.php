<?php

include("../../core/settings.php");
include("../../core/env_variables.php");
$routerjs = file_get_contents("router.js");
$routerjs = str_replace("/{{ BASE_URL }}", $_SETTINGS['baseUrl'], $routerjs);
echo $routerjs;

?>