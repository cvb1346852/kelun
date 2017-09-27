<?php
/**
 * @author sunjie
 * The control file of carrier module.
 */
class driver_map extends control
{
    /**
     * The search page of carrier module.
     *
     */
    public function search ()
    {
        $params = fixer::input('request')->get();
        $data = $this->driver_mapService->search($params);
        $this->view->pager = $data;
        $this->display();
    }

}