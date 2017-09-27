<?php
/**
 * phpunit
 *
 * @author Farmer.Li <me@farmerli.com>
 */
define('RUN_PATH', dirname(__FILE__));
//define('TEST_LIB_PATH', dirname(RUN_PATH));
define('TEST_LIB_PATH', dirname(dirname(dirname(RUN_PATH))) . DIRECTORY_SEPARATOR . 'resttest');
define('TEST_TMP_PATH', TEST_LIB_PATH . DIRECTORY_SEPARATOR . 'tmp');

include_once TEST_LIB_PATH . DIRECTORY_SEPARATOR . 'loader.php';

$loader = new Loader(TEST_LIB_PATH);

$loader->addRule('Resttest', TEST_LIB_PATH)
    ->addRule('Tests', dirname(__FILE__) . DIRECTORY_SEPARATOR . 'src');

spl_autoload_register([$loader, 'autoload']);

/**
 * 获取配置
 * 
 * @return array
 * @author Farmer.Li <me@farmerli.com>
 */
function getConfig()
{
    static $config = null;
    if ($config === null) {
        $configFile = RUN_PATH . DIRECTORY_SEPARATOR . 'config.local.php';
        if (!file_exists($configFile)) {
            $configFile = RUN_PATH . DIRECTORY_SEPARATOR . 'config.php';
        }
        $config = include $configFile;
    }
    return $config;
}