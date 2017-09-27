<?php
/**
 * @author sunjie
 * The control file of carrier module.
 */
class dispatch_set extends control
{
    /**
     * The search page of carrier module.
     *
     */
    public function search ()
    {
        $params = fixer::input('request')->getArray();
        $data = $this->dispatch_setService->search($params);
        $this->view->pager = $data;
        $this->display();
    }

    public function findUser ()
    {
        $params = fixer::input('request')->get();
        $data = $this->dispatch_setService->findUser($params);
        $this->view->pager = $data;
        $this->display();
    }

    public function searchWarehouse ()
    {
        $params = fixer::input('request')->get();
        $data = $this->dispatch_setService->searchWarehouse($params);
        $this->view->pager = $data;
        $this->display();
    }

    public function save ()
    {
        $params = fixer::input('request')->get();
        $data = $this->dispatch_setService->save($params);
        $this->view->pager = $data;
        $this->display();
    }

    public function del ()
    {
        $params = fixer::input('request')->get();
        $data = $this->dispatch_setService->del($params);
        $this->view->pager = $data;
        $this->display();
    }

    public function changeDispatch(){
        $params = fixer::input('request')->getArray();
        $data = $this->dispatch_setService->changeDispatch($params);
        $this->view->data = $data;
        $this->display();
    }

    public function getDispatchInfo(){
        $params = fixer::input('request')->getArray();
        $data = $this->dispatch_setService->getDispatchInfo($params);
        $this->view->data = $data;
        $this->display();
    }


    public function update(){
        $params = fixer::input('request')->getArray();
        $data = $this->dispatch_setService->update($params);
        $this->view->data = $data;
        $this->display();
    }
    
    
}