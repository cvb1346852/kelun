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
    $config->wechat->type->shipment => array('appId'=>'wx0f55368774065775','appSecret'=>'6663eba505f6f545173bfc14eb78db6a'),//物流版
    $config->wechat->type->consign => array('appId'=>'wx8e78f977ed42c25b','appSecret'=>'89eba632f4197f2cd7200e722d746150')//货主版
);
$config->wechat->allTempMessage = array(
    //订单签收通知-申请签收通知
    'sign_notice'=>array(
        'template_id'=>'6i0gUCoerSMxo1VctXfjLpAtWWEubBbc2n7RYtxE5VU',
        'data' => array(
            'first'=>array('value'=>'您有一个订单,请注意查收','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//订单编号
            'keyword2'=>array('value'=>'','color'=>'#000000'),//车牌号码
            'keyword3'=>array('value'=>'','color'=>'#000000'),//司机姓名
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
    //签收通知
    'sign_unusual'=>array(
        'template_id'=>'kbwhs66qjLn219vrdAVL_aCezkUKvemYHmgbi5XRYMs',
        'data' => array(
            'first'=>array('value'=>'您有一条订单签收异常通知','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//订单编号
            'keyword2'=>array('value'=>'','color'=>'#000000'),//签收时间
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
    //装货提醒
    'shipment_notice'=>array(
        'template_id'=>'P4Pzu7c_TOuJdJ39VBezqS0cBTDfZ8B0mFjjW1SMoEA',
        'data' => array(
            'first'=>array('value'=>'您好，您有一条装货提醒','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//货运线路
            'keyword2'=>array('value'=>'','color'=>'#000000'),//装货时间
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
	//运输招标发布通知
    'SenTenderPush'=>array(
        'template_id'=>'RkEcP_KX9R-9uDap6G_oDB8BsmyzwJI1C4Ibn0DhM00',
        'data' => array(
            'first'=>array('value'=>'你收到一条车车招标信息,请尽快查看！','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//发布方
            'keyword2'=>array('value'=>'','color'=>'#000000'),//达到站点
            'keyword3'=>array('value'=>'','color'=>'#000000'),//收货地址
            'keyword4'=>array('value'=>'','color'=>'#000000'),//运输要求
            'keyword5'=>array('value'=>'','color'=>'#000000'),//要求送到时间
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
	//打卡提醒
	'sign_in'=>array(
		'template_id'=>'wRBnLteW0Y2dRN8RrNkzO-7fS6KLnh0XXHsDUEihE-o',
        'data' => array(
            'first'=>array('value'=>'打卡免费获取当地货源信息！','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//内容
            'keyword2'=>array('value'=>'','color'=>'#000000'),//时间
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
	),
	//评标通知
	'approve_notice'=>array(
		'template_id'=>'wVNAuhEPVbRlaZKfad1mDwQgAgQQLA4ORvJoKPR3vpg',
        'data' => array(
            'first'=>array('value'=>'您的竞标结果已公布！','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//竞标项目
            'keyword2'=>array('value'=>'','color'=>'#000000'),//竞标人
            'keyword3'=>array('value'=>'','color'=>'#000000'),//竞标结果
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
	),
	//仲裁结果通知
	'arbitration_result'=>array(
		'template_id'=>'sgSPuIvJ5rptcRpsufuxEl9qUDu3j-h_YBa0pHhiy4Y',
        'data' => array(
            'first'=>array('value'=>'您投诉仲裁结果如下:','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//投诉时间
            'keyword2'=>array('value'=>'','color'=>'#000000'),//投诉主体
            'keyword3'=>array('value'=>'','color'=>'#000000'),//投诉内容
            'keyword4'=>array('value'=>'','color'=>'#000000'),//仲裁结果
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
	),
	//价格审批通知
	'tenderAudit'=>array(
		'template_id'=>'SOlKjx97Zfz0bUwRA0OWixgDmnLE5Vc-vcwXjmR-k0Y',
        'data' => array(
            'first'=>array('value'=>'您有一条分级运价审批通知','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//提交人
            'keyword2'=>array('value'=>'','color'=>'#000000'),//提交时间
            'keyword3'=>array('value'=>'','color'=>'#000000'),//说明
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
	),
	//申请签收
    'apply_notice'=>array(
        'template_id'=>'6i0gUCoerSMxo1VctXfjLpAtWWEubBbc2n7RYtxE5VU',
        'data' => array(
			'first'=>array('value'=>'申请签收','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//订单编号
            'keyword2'=>array('value'=>'','color'=>'#000000'),//车牌号码
            'keyword3'=>array('value'=>'','color'=>'#000000'),//司机姓名
            'remark'=>array('value'=>'','color'=>'#000000')//订单编号
        )
    ),
	//授权签收申请
    'order_auth'=>array(
        'template_id'=>'6i0gUCoerSMxo1VctXfjLpAtWWEubBbc2n7RYtxE5VU',
        'data' => array(
            'first'=>array('value'=>'您有一个订单，请注意查收','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//订单编号
            'keyword2'=>array('value'=>'','color'=>'#000000'),//车牌号码
            'keyword3'=>array('value'=>'','color'=>'#000000'),//司机姓名
            'remark'=>array('value'=>'','color'=>'#000000')//订单编号
        )
    ),
	//装货提醒
    'shipment_overdue'=>array(
        'template_id'=>'P4Pzu7c_TOuJdJ39VBezqS0cBTDfZ8B0mFjjW1SMoEA',
        'data' => array(
            'first'=>array('value'=>'您好，您有一条装货提醒','color'=>'#000000'),
            'keyword1'=>array('value'=>'','color'=>'#000000'),//货运线路
            'keyword2'=>array('value'=>'','color'=>'#000000'),//装货时间
            'remark'=>array('value'=>'','color'=>'#000000')//备注
        )
    ),
);

//菜单配置
$config->wechat->menu = array(
    $config->wechat->type->shipment => array(
        'button' => array(
            array(
                'name' => '药货宝',
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
                    //array(
                        //'name' => '信息小黑板',
                        //'type' => 'view',
                        //'url' =>  $config->webHost.'/wechat/order.html'
                    //),
                    //array(
                        //'name' => '科伦车场',
                        //'type' => 'view',
                        //'url' =>  $config->webHost.'/wechat/order.html'
                    //)
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
                        'url' =>  $config->webHost.'/wechat/appRecived.html'
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
                    //array(
                        //'name' => '运力认证',
                        //'type' => 'view',
                        //'url' =>  $config->webHost.'/wechat/addTruckSource.html'
                    //),
                    array(
                        'name' => '我的面板',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/me.html?wechattype=shipment'
                    )
                )
            )
        )
    ),
    $config->wechat->type->consign => array(
        'button' => array(
            array(
                'name' => '收货',
'sub_button' => array(
										array(
												'name' => '签收',
												'type' => 'view',
												'url' => $config->webHost.'/wechat/orderList.html'
										),
										array(
												'name' => '要货计划',
												'type' => 'view',
												'url' => $config->webHost.'/wechat/authOrderList.html'
										)
								)
            ),
            array(
                'name' => '发货',
                'sub_button' => array(
                    //array(
                        //'name' => '要货计划',
                        //'type' => 'view',
                        //'url' =>  $config->webHost.'/wechat/order.html'
                    //),
                    array(
                        'name' => '我的运单',
                        'type' => 'view',
                        'url' =>  $config->webHost.'/wechat/shipment.html'
                    ),
					//array(
                        //'name' => '价格审批',
                        //'type' => 'view',
                        //'url' =>  $config->webHost.'/wechat/tender_audit.html'
                    //),

                )
            ),
			array(
                'name' => '我',
                'type' => 'view',
                'url' => $config->webHost.'/wechat/me.html?wechattype=consign'
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

