<?php
/**
 * The config file of ZenTaoPHP.  Don't modify this file directly, copy the item to my.php and change it.
 *
 * The author disclaims copyright to this source code.  In place of
 * a legal notice, here is a blessing:
 * 
 *  May you do good and not evil.
 *  May you find forgiveness for yourself and forgive others.
 *  May you share freely, never taking more than you give.
 */
/* Basic settings. */
$config = new stdClass();
$config->version     = '2.1';             // The version of zentaophp. Don't change it.
$config->encoding    = 'UTF-8';           // The encoding of znetaopms.
$config->cookieLife  = time() + 2592000;  // The cookie life time.
$config->timezone    = 'Asia/Shanghai';   // The time zone setting, for more see http://www.php.net/manual/en/timezones.php
$config->debug = true;                    //开启debug
$config->useService = true;              //开启service

/* 日志设置 */
$config->log = new stdClass();
$config->log->record = true;						// 开启日志记录
$config->log->level = 'INFO,ERROR,SQL';		// 只记录指定的级别
$config->log->type = 'file';

/* 缓存设置 */
$config->cache = new stdClass();
$config->cache->type = 'File';
$config->cache->expire = 60;

$config->cache->redishost='127.0.0.1';
$config->cache->redisport='6379';
$config->cache->redistimeout=0;
$config->cache->dbname=0;
$config->cache->prefix= 'dev_';

 $config->cache->alimemcachedhost = 'e88bbef90bc711e4.m.cnhzalicm10pub001.ocs.aliyuncs.com';
 $config->cache->alimemcachedport = '11211';
 $config->cache->alimemcacheduser = 'e88bbef90bc711e4';
 $config->cache->alimemcachedpassword = 'G7sHyr_mem';


/* The request settings. */
$config->requestType = 'GET';       // The request type: PATH_INFO|GET, if PATH_INFO, must use url rewrite.
$config->pathType    = 'clean';           // If the request type is PATH_INFO, the path type.
$config->requestFix  = '-';               // The divider in the url when PATH_INFO.
$config->moduleVar   = 'm';               // requestType=GET: the module var name.
$config->methodVar   = 'f';               // requestType=GET: the method var name.
$config->viewVar     = 't';               // requestType=GET: the view var name.
$config->sessionVar  = 'sid';             // requestType=GET: the session var name.
$config->strictParams = true;

/* Views and themes. */
$config->webRoot = './';
$config->views  = ',html,json,';          // Supported view formats.
$config->themes = 'default';              // Supported themes.

/* Supported languages. */
$config->langs['zh-cn'] = '简体';
//$config->langs['en']  = 'En';

/* Default settings. */
$config->default = new stdClass();
$config->default->view   = 'html';		  // Default view.
$config->default->lang   = 'zh-cn';          // Default language.
$config->default->theme  = 'default';     // Default theme.
$config->default->module = 'index';       // Default module.
$config->default->method = 'index';       // Default method.

/* Database settings. */
$config->db = new stdClass();
$config->db->persistant = false;           // Pconnect or not.
$config->db->driver     = 'mysql';         // Must be MySQL. Don't support other database server yet.
$config->db->encoding   = 'UTF8';          // Encoding of database.
$config->db->strictMode = false;           // Turn off the strict mode of MySQL.
$config->db->prefix     = '';              // The prefix of the table name.

/* Slave database settings. */
$config->dbSlave = new stdClass();
$config->dbSlave->persistant = false;      
$config->dbSlave->driver     = 'mysql';    
$config->dbSlave->encoding   = 'UTF8';     
$config->dbSlave->strictMode = false;      

/* Slave database settings. */
$config->dbTenant = new stdClass();
$config->dbTenant->persistant = false;
$config->dbTenant->driver     = 'mysql';
$config->dbTenant->encoding   = 'UTF8';
$config->dbTenant->strictMode = false;

/* Slave database settings. */
$config->dbTenantSlave = new stdClass();
$config->dbTenantSlave->persistant = false;
$config->dbTenantSlave->driver     = 'mysql';
$config->dbTenantSlave->encoding   = 'UTF8';
$config->dbTenantSlave->strictMode = false;

/* Include the custom config file. */
$myConfig = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'my.php';
if(file_exists($myConfig)) include $myConfig;
$weChatConfig = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'weChat.php';
if(file_exists($myConfig)) include $weChatConfig;