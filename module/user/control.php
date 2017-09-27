<?php
/** 
 * 用户操作类
 * Author Zhm
 * 2016-07-12
 */

class user extends control{
	/**
     * 2016-7-18
     * 发送短信验证码
     * Author：ZHM
     */
    public function sendMsg(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('user')->sendMsg($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 微信登录
     * 2016-7-18
     * Author ZHM
     */
    public function wechatLogin(){
    	$params = fixer::input('request')->get();
    	$data = $this->loadService('user')->wechatLogin($params);
    	$this->view->result = $data;
    	$this->display();
    }

    /**
     * Desc:根据openid获取用户信息
     * @Author Lvison
     */
    public function getUserInfoByOpenid(){
        $fixer = fixer::input('request')->getArray();
        $data = $this->userService->getUserInfoByOpenid($fixer);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * Desc:根据auth2回调code获取用户信息
     * @Author Lvison
     */
    public function getUserInfoByCode(){
        $fixer = fixer::input('request')->getArray();
        $data = $this->userService->getUserInfoByCode($fixer);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 2016-7-27
     * Author ZHm
     * 绑定erp账号
     */
    public function erpBind(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('user')->erpBind($params); 
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 2016-7-27
     * Author ZHM
     * 检查是否绑定
     */
    public function bindCheck(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('user')->bindCheck($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 2016-7-28
     * Author ZHM
     * 解除绑定ERP账号
     */
    public function erpUnbind(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('user')->erpUnbind($params);
        $this->view->result = $data;
        $this->display();
    }


    /**
     * Desc:获取基地调度人员列表
     * @Author Lvison
     */
    public function getDispatchUser(){
        $param = fixer::input('request')->getArray();
        $data = $this->userService->getDispatchUser($param);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * Desc:删除调度人员账号
     * @Author Lvison
     */
    public function delDispatchUser(){
        $param = fixer::input('request')->getArray();
        $data = $this->userService->delDispatchUser($param);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * Desc:新增调度
     * @Author Lvison
     */
    public function addDispatch(){
        $param = fixer::input('request')->getArray();
        $data = $this->userService->addDispatch($param);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 检查登录（微信账号是否绑定）
     * 2016-9-1
     * ZHM
     */
    public function checkLogin(){
        $param = fixer::input('request')->getArray();
        $data = $this->userService->checkLogin($param);
        $this->view->result = $data;
        $this->display();
    }
     /**
     * Desc:获取微信用户类型
     * @Author Ivan
     */
     public function getUserType(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->userService->getUserType($fix);
        $this->display();
    }

    /**
     * Desc:发送打卡提醒模板消息
     * @Author Lvison
     */
    public function sendSignNotice(){
        $this->view->result = $this->userService->sendSignNotice();
        $this->display();
    }

    /**
     * Desc:微信端退出
     * @Author Lvison
     */
    public function wechatLogout(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->userService->wechatLogout($fix);
        $this->display();
    }
}