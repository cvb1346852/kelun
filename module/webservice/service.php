<?php

/**
 * Class webserviceService
 * create by lvison by 2017-01-05
 */

class webserviceService extends service{

    /**
     * Desc:失败的 webserivce请求 重试
     * @Author Lvison
     * @return bool
     */
    public function tryWebservice(){
        $list = $this->dao->selectList('webservice.selectList',array('function'=>'sendSMS'));
        foreach($list as $key=>$value){
            //短信接口 不进行重试
            if($value->function == 'sendSMS'){
                continue;
            }
            $this->dao->update('webservice.updateWebRequest',array('id'=>$value->id,'times'=>1,'update_time'=>date('Y-m-d H:i:s'),'status'=>$value->status));
            $value->params = json_decode($value->params,true);
            $this->loadService('client')->webServiceRequest($value->function,$value->params,$value->id);
        }
        return true;
    }

    /**
     * Desc: 重试机制控制方法
     * @param $type
     * @param $id
     * @param $data
     * @Author Lvison
     */
    public function controlWebservice($type,$id,$data){
        //webservice 发送请求入库
        if($type == 'insert'){
            $id = $this->dao->insert('webservice.insertWebRequest',array('function'=>$data['function'],
                    'params'=>$data['params'],
                    'response' => !empty($data['response']) ? json_encode($data['response'],JSON_UNESCAPED_UNICODE) : '',
                    'status'=>0,
                    'times'=>1,
                    'create_time'=>date('Y-m-d H:i:s'),
                    'update_time'=>date('Y-m-d H:i:s'),
                )
            );
            return $id['id'];
        }else if($type == 'update'){//请求发生错误则失败
            $this->dao->update('webservice.updateWebRequest',array(
                    'update_time'=>date('Y-m-d H:i:s'),
                    'status' => 0,
                    'id' =>$id,
                    'response' => !empty($data['response']) ? json_encode($data['response'],JSON_UNESCAPED_UNICODE) : ''
                )
            );
        }else if($type == 'succeed'){//请求成功，更新数据
            $this->dao->update('webservice.updateWebRequest',array(
                    'update_time'=>date('Y-m-d H:i:s'),
                    'status'=>1,
                    'id' =>$id,
                    'response'=>json_encode($data['response'],JSON_UNESCAPED_UNICODE)
                )
            );
        }

    }

}