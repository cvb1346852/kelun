<?php
$config->debug        = true;  
$config->requestType  = 'GET';    // PATH_INFO or GET.
$config->requestFix   = '-';
$config->webRoot      = '/'; 

$config->db->host     = '127.0.0.1';
$config->db->port     = '3306';
$config->db->name     = 'kl_project';
$config->db->user     = 'root';
$config->db->password = 'root';

/* To use master and slave database feature, uncomment this. */
$config->dbSlave->host     = '127.0.0.1';//从库
$config->dbSlave->port     = '3306';
$config->dbSlave->name     = 'kl_project';
$config->dbSlave->user     = 'root';
$config->dbSlave->password = ''; 

/* getResourceUlr */
$config->ResourceUrl = new stdClass();
$config->ResourceUrl->Url = "http://g7s.resources.huoyunren.com/";

$config->webHost = 'http://kl.eyao56.com';

/* 短信模板 */
$config->messageModel =  new stdClass();
$config->messageModel->smsAuthCode = '您的验证码%s请在5分钟内使用有效';//微信端绑定用户，短信验证码
$config->messageModel->smsAccredit = '您已经被授权签收一笔订单，请点击%s进行电子签收，欢迎关注微信公众号:“医药物流服务”';//订单授权短信通知
$config->messageModel->smsContract = '合同编号为%s的合同%s将到期，请尽快处理！';//合同到期短信通知
$config->messageModel->smsConfirm = '您好，有来自%s的运输任务，请在%s前到%s装车。请微信关注"药货宝"服务号,进入我的运单查看详情';//
$config->Barcode = '/barCode/html/image.php?filetype=PNG&dpi=72&scale=2&rotation=0&font_family=0&font_size=8&text=%s&thickness=20&start=NULL&code=BCGcode128';

//$config->tmpRoot = '/home/www/industry_log';