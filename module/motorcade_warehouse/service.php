<?php
/**
 * @author zsq
 * The service file of motorcadeService module.
 */
class motorcade_warehouseService extends service
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * The search page of motorcadeService module.
     *
     */
    public function search ($fixer)
    {
        $params = fixer::input($fixer)->get();
        $warehouseId = $this->loadService('truck_source')->_getWarehouse();
        if(!$warehouseId) return [];
        $params->warehouse_id =  $warehouseId;
        if (!property_exists($params, 'sortColumns')) {
            $params->sortColumns = 'update_time DESC';
        }
        return $this->dao->selectPage('motorcade_warehouse.selectPage',$params);
    }


    /**
     * The save page of motorcade module.
     *
     */
    public function save ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();
        // array_map(function($i){if($i==='')throw new RuntimeException('请将表单填写完整', 2); },$fixer);
        $base = ['name','contact','phone']; 
        foreach($base as $v){
            if(!isset($fixer[$v]) || empty(trim($fixer[$v])))
                throw new RuntimeException('红色部分为必填', 2);
        }
        if(!preg_match("/^1[34578]\d{9}$/", $fixer['phone'])){
            throw new RuntimeException('请输入正确的联系电话', 2);
        }
        $warehouseId = $this->loadService('truck_source')->_getWarehouse();
        if(!$warehouseId) throw new RuntimeException('未查询到对应的基地信息', 2);
        $fixer['warehouse_id'] = $warehouseId;
        $fixer['last_update'] = $this->app->user->id;
        if(isset($fixer['id'])){
            $this->dao->update('motorcade_warehouse.updateRelation2',$fixer);
            return  $this->dao->update('motorcade_warehouse.update',$fixer);
        } else {
            //检查车队名是否重复
            if ($this->dao->selectOne('motorcade_warehouse.getIdByName',array('name' => $fixer['name'], 'warehouse_id' => $fixer['warehouse_id']))) {
                throw new RuntimeException('此基地下已有此车队，无法添加', 2);
            }
            $fixer['id'] =  guid();
            return  $this->dao->insert('motorcade_warehouse.insert',$fixer);
        }
    }

    /**
     * The getById page of motorcade module.
     *
     */
    public function getById ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        return $this->dao->selectOne('motorcade_warehouse.getById',$fixer);
    }

    /**
     * The del page of motorcade module.
     *
     */
    public function del ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        $ids = explode(',',$fixer->id);
        foreach($ids as $v){
             $this->dao->update('motorcade_warehouse.update',['id'=>$v,'deleted'=>1,'last_update'=> $this->app->user->id]);
             $this->dao->update('motorcade_warehouse.updateRelation',['id'=>$v,'last_update'=> $this->app->user->id]);
        }
        return true;
    }

    /**
     * The getByGroup page of motorcade module.
     *
     */
    public function getByGroup ($fixer)
    {
        $name = fixer::input($fixer)->get('name');
        $warehouseId = $this->loadService('truck_source')->_getWarehouse();
        if(!isset($warehouseId))  return [];
        return  $this->dao->selectList('motorcade_warehouse.getByGroup',['name'=>$name,'warehouse_id'=>$warehouseId,'group'=>1]);
    }


}