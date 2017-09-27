<?php
/**
 * 微信相关配置
 */
$config->wechat = new stdClass();
$config->wechat->type = new stdClass();
//微信公众号版本 物流版、货主版
$config->wechat->type->shipment = 'shipment';//物流版
$config->wechat->type->consign = 'consign';//货主版

$config->wechatType = array(
    $config->wechat->type->shipment,
    $config->wechat->type->consign
);

//账号信息
$config->wechat->account = array(
    $config->wechat->type->shipment => array('appId'=>'wx21e1ad7180ba84a3','appSecret'=>'31df7512a9cb30c3eab04be6bb2fd39f'),//物流版
    $config->wechat->type->consign => array('appId'=>'wx9ca4ae93066b85c4','appSecret'=>'6ccc85d04128cc1a78e70d1e818feafb')//货主版
);

$config->wechat->allTempMessage = array(
    //待签收通知
    'sign_notice'=>array(
        'template_id'=>'4cKCqLAEAYg3VpfAvHHewrz-RzAZ6IMrLQAxeZTWoO4',
        'data' => array(
            'first'=>array('value'=>'您有一个订单签收','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//订单号
            'keyword2'=>array('value'=>'','color'=>'#000000'),//送货人电话
            'keyword3'=>array('value'=>'','color'=>'#000000'),//预计送达时间
            'keyword4'=>array('value'=>'','color'=>'#000000'),//预计送达地址
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
    //异常签收通知
    'sign_unusual'=>array(
        'template_id'=>'hOj-we4VO_9s3e3LWP_1Uaxtx9aXpVZs2IBESWa4CFM',
        'data' => array(
            'first'=>array('value'=>'订单签收发生异常','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//订单号
            'keyword2'=>array('value'=>'','color'=>'#000000'),//签收人
            'keyword3'=>array('value'=>'','color'=>'#000000'),//签收地址
            'keyword4'=>array('value'=>'','color'=>'#000000'),//异常签收情况
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
    //运货提醒
    'shipment_notice'=>array(
        'template_id'=>'Qo7T_VIx43tsVAGOZik1gL7h3RBFh3bsNQVRc1MBias',
        'data' => array(
            'first'=>array('value'=>'新一批货等待您的运输','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//订单号
            'keyword2'=>array('value'=>'','color'=>'#000000'),//提货点
            'keyword3'=>array('value'=>'','color'=>'#000000'),//预计发车时间
            'keyword4'=>array('value'=>'','color'=>'#000000'),//预计送达时间
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
    //招标通知
    'SenTenderPush'=>array(
        'template_id'=>'erVpBQBAvciXo2q2sKyvRazZxIum2icOHtTy9LMQ4so',
        'data' => array(
            'first'=>array('value'=>'你收到一条车车招标信息，请尽快查看！','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//货源内容
            'keyword2'=>array('value'=>'','color'=>'#000000'),//要求
            'keyword3'=>array('value'=>'','color'=>'#000000'),//备注
            'keyword4'=>array('value'=>'','color'=>'#000000'),//竞标截止
            'keyword5'=>array('value'=>'','color'=>'#000000'),// 装车要求
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
    //打开提醒
    'signNotice'=>array(
        'template_id'=>'wRBnLteW0Y2dRN8RrNkzO-7fS6KLnh0XXHsDUEihE-o',
        'data' => array(
            'first'=>array('value'=>'打卡免费获取当地货源信息','color'=>'#000000'),
            'keyword1'=>array('value'=>'打卡获得当前最新货源','color'=>'#000000'),//内容
            'keyword2'=>array('value'=>'','color'=>'#000000'),//时间
            'remark'=>array('value'=>'打卡领积分，积极参与！','color'=>'#000000')//备注
        )
    ),
);

//菜单配置
$config->wechat->menu = array(
    $config->wechat->type->shipment => array(
        'button' => array(
            array(
                'name' => '要货宝',
                'sub_button' => array(
                    array(
                        'name' => '最新货源',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/orderSource.html'
                    ),
                    array(
                        'name' => '车车竞标',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/bidList.html'
                    ),
                    array(
                        'name' => '信息小黑板',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/order.html'
                    ),
                    array(
                        'name' => '科伦车场',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/order.html'
                    )
                )
            ),
            array(
                'name' => '在途',
                'sub_button' => array(
                    array(
                        'name' => '零担转包',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/subcontract.html'
                    ),
                    array(
                        'name' => '事件上报',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/report.html'
                    ),
                    array(
                        'name' => '申请签收',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/applyForConsign.html'
                    )
                )
            ),
            array(
                'name' => '我',
                'sub_button' => array(
                    array(
                        'name' => '我的投标',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/tender.html'
                    ),
                    array(
                        'name' => '我的运单',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/pickUp.html'
                    ),
                    array(
                        'name' => '我的车队',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/myTruckSource.html'
                    ),
                    array(
                        'name' => '运力认证',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/addTruckSource.html'
                    ),
                    array(
                        'name' => '投诉',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/demo.html'
                    )
                )
            )
        )
    ),
    $config->wechat->type->consign => array(
        'button' => array(
            array(
                'name' => '收货',
                'type' => 'view',
                'url' => $config->webHost.'/wechat/orderReceipt.html'
            ),
            array(
                'name' => '发货',
                'sub_button' => array(
                    array(
                        'name' => '要货计划',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/order.html'
                    ),
                    array(
                        'name' => '我的运单',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/shipment.html'
                    ),array(
                        'name' => '价格审批',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/tender_audit.html'
                    ),

                )
            ),
            array(
                'name' => '我',
                'sub_button' => array(
                    array(
                        'name' => '登录',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/login.html?weChatType=consign'
                    )
                )
            )
        )
    )
);

//auth2地址
$config->wechat->auth2 = new stdClass();
$config->wechat->auth2->url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=123#wechat_redirect';
$config->wechat->auth2->accessToken = 'sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code';
$config->wechat->auth2->callBack = array(
    $config->wechat->type->shipment => $config->webHost.'/wechat.php?method=shipment.wechat.auth2Callback',
    $config->wechat->type->consign => $config->webHost.'/wechat.php?method=consign.wechat.auth2Callback',
);

//微信接口配置
$config->wechat->domain = 'https://api.weixin.qq.com/';
$config->wechat->api = new stdClass();
$config->wechat->api->accessToken = 'cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s';
$config->wechat->api->createMenu = 'cgi-bin/menu/create?access_token=%s';
$config->wechat->api->createQrcode = 'cgi-bin/qrcode/create?access_token=%s';
$config->wechat->api->showQrcode = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=%s';
$config->wechat->api->getTicket = 'cgi-bin/ticket/getticket?access_token=%s&type=jsapi';

//模板消息api地址
$config->wechat->api->template = new stdClass();
$config->wechat->api->template->setIndustry = 'cgi-bin/template/api_set_industry?access_token=%s';
$config->wechat->api->template->getIndustry = 'cgi-bin/template/get_industry?access_token=%s';
$config->wechat->api->template->addTemplate = 'cgi-bin/template/api_add_template?access_token=%s';
$config->wechat->api->template->getAllPrivateTemplate = 'cgi-bin/template/get_all_private_template?access_token=%s';
$config->wechat->api->template->deletePrivateTemplate = 'cgi-bin/template/delete_private_template?access_token=%s';
$config->wechat->api->template->sendTemplateMessage = 'cgi-bin/message/template/send?access_token=%s';

