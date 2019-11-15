<?php

$dsn      = 'mysql:dbname=k-oauth2-tp5;host=localhost'; // my_oauth2_db
$username = 'root';
$password = 'root';

// error reporting (this is a demo, after all!)
ini_set('display_errors',1);error_reporting(E_ALL);

// Autoloading (composer is preferred, but for this example let's just do this)
require_once('oauth2-server-php/src/OAuth2/Autoloader.php');
OAuth2\Autoloader::register();

// $dsn is the Data Source Name for your database, for exmaple "mysql:dbname=my_oauth2_db;host=localhost"
$storage = new OAuth2\Storage\Pdo(array('dsn' => $dsn, 'username' => $username, 'password' => $password));

// Pass a storage object or array of storage objects to the OAuth2 server class
// $server = new OAuth2\Server($storage);
$server = new OAuth2\Server($storage, array(
  'always_issue_new_refresh_token' => true,
  'refresh_token_lifetime'         => 2419200, // 28 days Default: 1209600 (14 days)
));

// Add the "Client Credentials" grant type (it is the simplest of the grant types)
// $server->addGrantType(new OAuth2\GrantType\ClientCredentials($storage));

// Add the "Authorization Code" grant type (this is where the oauth magic happens)
// $server->addGrantType(new OAuth2\GrantType\AuthorizationCode($storage));

$server->addGrantType(new OAuth2\GrantType\UserCredentials($storage));

// create the grant type
// $grantType = new OAuth2\GrantType\UserCredentials($storage);

// create the grant type
// $grantType = new OAuth2\GrantType\RefreshToken($storage);

// the refresh token grant request will have a "refresh_token" field
// with a new refresh token on each request
$grantType = new OAuth2\GrantType\RefreshToken($storage, array(
  'always_issue_new_refresh_token' => true,
));
//$grantType = new OAuth2\GrantType\RefreshToken($storage);

// add the grant type to your OAuth server
$server->addGrantType($grantType);
