<?php
/**
 * The control file of common module of ZenTaoPHP.
 *
 * The author disclaims copyright to this source code.  In place of
 * a legal notice, here is a blessing:
 * 
 *  May you do good and not evil.
 *  May you find forgiveness for yourself and forgive others.
 *  May you share freely, never taking more than you give.
 */
class common extends AbstractCommon
{
    /**
     * 不被权限控制的方法列表
     * 
     * @return array
     */
    protected function ignoreMethods()
    {
        return [
            ['index', '*'],
            ['demo', '*']
        ];
    }
}
