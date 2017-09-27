<?php
/** sunjie
 * The service file of carrier module.
 */
class dispatch_setService extends service
{
    /**
     * The search page of carrier module.
     *
     */
    public function search ($fixer)
    {
        $params = fixer::input($fixer)->get();
        $result = $this->dao->selectPage('dispatch_set.dispatch_set_selectPage', $params);

        foreach($result->result AS $key=>$val){
            $warehouseList = $this->dao->selectList('dispatch_set.searchWarehouse',array('orgcode'=>json_decode($val->warehouse)));
            foreach($warehouseList as $key2=>$val2){
                if($key2 == '0'){
                    $val->warehouseName = $val2->platform_code.$val2->name;
                }
                else{
                    $val->warehouseName .= ','.$val2->platform_code.$val2->name;

                }
            }
        }

        return $result;
    }

    public function findUser ($fixer)
    {
        $params = fixer::input($fixer)->get();
        $args = array(
            'orgroot'=> $this->app->user->organ->orgroot,
            'username'=>$params->username
        );
        $result = $this->loadService('ucenter.user')->findUser($args);

        return $result;
    }

    public function searchWarehouse ()
    {
        $warehouseList = $this->dao->selectList('dispatch_set.searchWarehouse');
        return $warehouseList;
    }

    public function save ($fixer)
    {
        $params = fixer::input($fixer)->get();

        if(empty($params->user_id)){
            return array('code'=>'1','message'=>'请选择管理员账号');
            return false;

        }
        if(empty($params->warehouse)){
            return array('code'=>'1','message'=>'请选择归属基地');
            return false;
        }

        $user = explode(',',$params->user_id);
        $warehouse = json_encode($params->warehouse);

        $check = $this->dao->selectPage('dispatch_set.dispatch_set_selectPage', array('user_name'=>$user['1']));
        if($check->totalCount != '0'){
            return array('code'=>'1','message'=>'改用户已经有归属基地');
            return false;
        }

        $result = $this->dao->insert('dispatch_set.save', array('user_id'=>$user['0'],'user_name'=>$user['1'],'roleids'=>$user['2'],'warehouse'=>$warehouse));
        return array('code'=>'0','message'=>'设置成功');
    }

    public function del ($fixer)
    {
        $params = fixer::input($fixer)->get();
        $result = $this->dao->delete('dispatch_set.del',array('id'=>$params->id));

        return $result;
    }
    //改变当前用户的orgcode
    public function changeDispatch($fixer){
        $params = fixer::input($fixer)->get();
        
        tools::datalog('request__'.var_export($params,true),'__');
        $user = $this->loadService('Client')->g7sRequest("ucenter.user.findUser", array("id"=>$params->id));
        //tools::datalog('response__'.var_export($user['data']['result'][0]['roleids'],true),'__');
        $params->roleids = $user['data']['result'][0]['roleids'];
        
        $result = $this->loadService('Client')->g7sRequest("ucenter.user.updateUser", array("id"=>$params->id,"orgcode"=>$params->orgcode,"roleids"=>$params->roleids));
        
        $param = array('username' => '', '_ismock' => false, '_TOKEN' => $params->_tk);
        $cacheKey = 'ucenter_' . md5('user' . 'getUserByUsername' . json_encode($param));
        S($cacheKey, null);
        tools::datalog('cacheKey'.var_export($params->_tk,true),'cachekey_');
        return $result;
    }
    
    
    
    //设置详情
    public function getDispatchInfo($fixer){
        $params = fixer::input($fixer)->get();
        $result = $this->dao->selectList('dispatch_set.dispatch_set_selectPage',array('id'=>$params->id));
        return $result;
    }

    //修改
    public function update($fixer){
        $params = fixer::input($fixer)->get();
        $result = $this->dao->update('dispatch_set.update',array('id'=>$params->dispatch_id,'warehouse'=>json_encode($params->warehouse)));
         if($result == '0'){
             return array('code'=>'0','message'=>'设置成功');

         }
        else{
            return array('code'=>'0','message'=>'设置失败');
        }

    }

}