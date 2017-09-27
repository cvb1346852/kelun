<?php
/**
 * 接口入口文件
 *
 * @author Farmer.Li <me@farmerli.com>
 */
error_reporting(E_ERROR | E_WARNING | E_PARSE ^ E_NOTICE);

/* Load the framework. */
include '../../../framework/cat.php';

try {
    define('IS_RESTFULL', true);
    /* Instance the app. */
    $app = router::createApp('demo', dirname(dirname(__FILE__)));
    
    /* Run the app. */
    $common = $app->loadCommon();

    $methods = explode('.', $_REQUEST['method']);
    $accountType = $methods[0];
    $moduleName = $methods[1];
    $methodName = $methods[2];
    $format = isset($_REQUEST['format']) ? $_REQUEST['format'] : 'json';
    $_GET[$config->moduleVar] = $moduleName; 
    $_GET[$config->methodVar] = $methodName; 
    $_GET[$config->viewVar] = $format;

    $config->weChatType = $accountType;
//    define('WECHAT_TYPE', $accountType);
    $app->parseRequest();

    $app->loadModule();
} catch (Exception $e) {

    $ecode = $e->getCode();
    $result = array(
            'code' => $ecode,
            'message' => sprintf( "Exception:  %s", $e->getMessage() )
    );
    header("Content-Type:   application/json");
    $errorstring = json_encode($result);
    log::error('Code : ' . $e->getCode() . 'Exception: ' . $e->getMessage(), true, true);
    $errorstring = str_replace(array('60.28.206.72','60.28.206.69','ips','221','gps','211.100.54.133','330','gprs'), array(), $errorstring);
    echo $errorstring;
}   
session_write_close();