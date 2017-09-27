<?php
/**
 * @author Ivan
 * The service file of consignee module.
 */
class consigneeService extends service
{
    public function __construct()
    {
        parent::__construct();
        $this->group =['name','phone'];
    }

    /**
     * 从wechat_connect表中查询获取收货人信息
     *
     */
    public function search ($fixer)
    {
        $params = fixer::input($fixer)->getArray(); 
        $result=$this->dao->selectPage('consignee.selectPage',$params);
        $bindtime='';
        $unbindtime='';
        //处理数组获得收货人信息
        if($result->result){
            foreach($result->result as $key=>$val){
                $res=$this->dao->selectList('consignee.getRecivedTime',array('user_phone'=>$val->phone));
                $result->result[$key]->bctime=$res[0]->create_time;
            }
            foreach($result->result as $key=>$val){
                //将json格式的erp账号密码转换成数组并取值
                if($val->base_erp!=''){
                    $param=json_decode($val->base_erp);
                    $result->result[$key]->base_erp=$param->username;
                }
                if($val->area_erp!=''){
                    $param=json_decode($val->area_erp);
                    $result->result[$key]->area_erp=$param->username;
                }
            }
        }
        return $result;
    }
    //销售人员解绑erp
    public function unbind($fixer)
    {
        $params = fixer::input($fixer)->get();
        $params->unbind_time=date('Y-m-d H:i:s',time());
        $count=count($params->erp);
        if($count==1){
            if($params->erp[0]=='base_erp'){
              $result=$this->dao->update('consignee.unbindbase',$params);  
            }else{
               $result=$this->dao->update('consignee.unbindarea',$params); 
            }
        }else{
            $result=$this->dao->update('consignee.unbindboth',$params);
        }
        $erp=$this->dao->selectOne('consignee.geterp',$params);
        if($erp->base_erp=='' && $erp->area_erp==''){
            $re=$this->dao->update('consignee.updateUserType',$params);
        }
        if($result){
            return true;
        }else{
            return false;
        }
    }
    /**
     * 获取收货人电话号
     * Author ivan
     * 2016-8-10
     */
    public function getPhone($args) {
        $params = fixer::input($args)->get();
        $rt = $this->dao->selectList('consignee.getPhone', $params);
        return $rt;
    }
    /**
     * 删除收货人
     * Author ivan
     * 2016-8-16
     */
    public function del ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        $ids = explode(',',$fixer->id);

        foreach($ids as $v){
            $this->dao->update('consignee.del',['id'=>$v]);
        }
        return true;
    }
    /**
     * 获取erp账号
     * Author ivan
     * 2016-8-10
     */
    public function geterp($args) {
        $params = fixer::input($args)->get();
        $rt = $this->dao->selectOne('consignee.geterp', $params);
        return $rt;
    }
}