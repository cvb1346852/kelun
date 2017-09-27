<?php
/**
 * @author zsq
 * The service file of carrier module.
 */
class appealService extends service
{

    public function searchList($fixer)
    {
        $params = fixer::input($fixer)->get();
        if($params->create_time){
           $timeArr = explode(' - ',$params->create_time);
           $params->fromtime = $timeArr[0];
           $params->totime = $timeArr[1];
        }
        $result = $this->dao->selectPage('appeal.searchList',$params);
        if($result->result){
            foreach($result->result as $key=>$value){
                if($value->result == 0){
                    $value->result_str = '未判定';
                }elseif($value->result == 1){
                    $value->result_str = '成立';
                }elseif($value->result == 2){
                    $value->result_str = '不成立';
                }
                if($value->responsible_type == 1){
                    $value->responsible_type_str = '承运商';
                }elseif($value->responsible_type == 2){
                    $value->responsible_type_str = '基地';
                }
            }
        }
        return $result;
    }
    /*获取责任方名称*/
    public function getResultName($fixer)
    {
        $params = fixer::input($fixer)->get();
        if($params->result_type){
            if($params->result_type){
                $params->chart_name = $params->result_type == 1 ? 'carrier' : ($params->result_type == 2 ? 'warehouse' : 'truck_source'); //查找的表
                $params->filed = $params->result_type == 1 ? 'carrier_name,id' : ($params->result_type == 2 ? 'name' : 'carnum'); //查找的字段
                $params->type_warehouse = $params->result_type == 2 ? 'ok' : ''; //类型为2的是基地
                if( $params->result_type == 1 ){
                    $params->carrier_name = $params->responsible_name;
                    $params->carrier_status = true;
                }else if( $params->result_type == 2 ){
                    $params->name = $params->responsible_name;
                }
                $result = $this->dao->selectList('appeal.getResultName',$params);
            }
            return $result;
        }else{
            return false;
        }

    }
    /*更新仲裁信息*/
    public function updateAppeal($fixer)
    {
        $params = fixer::input($fixer)->get();
        if($params->appeal_id){
            $params->date = date('Y-m-d H:i:s');
            $result = $this->dao->update('appeal.update',$params);
            if($result > 0){
                return true;
            }else{
                return false;
            }
        }

    }
    /**
     * 微信端获取当前角色投诉列表
     *
     */
     public function getAppeallList($fixer)
    {
        $params = fixer::input($fixer)->get();
        $result = $this->dao->selectPage('appeal.getAppeallList',$params);
        if($result){
        	return array('code' => 0, 'data' => $result);;
        }else{
        	return array('code' => 1, 'data' => '无投诉列表');
        }
        
    }
    /**
     * 逻辑删除投诉
     *
     */
    public function deletedAppeal($fixer)
    {
        $params = fixer::input($fixer)->get();
        $params->date = date('Y-m-d H:i:s');
        $params->deleted = 1;
        $params->appeal_id = intval($params->id );
        $params->ids = explode(',',$params->ids);
        $result = $this->dao->update('appeal.deletedAppeal',$params);
        if($result > 0){
            return true;;
        }else{
            return false;
        }
    }

    /**
     * 添加投诉信息
     *
     */
     public function saveAppeal($fixer)
    {
        $params = fixer::input($fixer)->get();
        $params->create_time=date('Y-m-d H:i:s',time());
        $result = $this->dao->insert('appeal.saveAppeal',$params);
        if($result){
        	return array('code' => 0, 'msg' => '投诉成功');
        }else{
        	return array('code' => 1, 'msg' => '投诉失败');
        }
        
    }
}