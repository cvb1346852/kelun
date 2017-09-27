<?php
/**
 * 测试的测试用例。。。。
 *
 * @author Farmer.Li <me@farmerli.com>
 */
namespace Tests\test;

use Resttest\Request\CatRequest,
    Resttest\User;
    
/**
 * 测试的测试用例
 *
 * @author Farmer.Li <lixu@huoyunren.com>
 */
class DemoTest extends \Resttest\CatTestCase
{
    /**
     * test run
     *
     * @return void
     */
    public function testMutlParam()
    {
        User::getInstance()->login('admin', '123456');
        $r = new CatRequest('demo', 'test');
        $response = $r->setMethod('GET')
            ->addParams([
                'name' => 'test_driver',
                'params' => ['a' => 1,'b' => 2]
            ])->send();
        $this->assertEquals($response->getCode(), '200');
        $this->assertEquals($response->getBody()['code'], 0);
    }
}