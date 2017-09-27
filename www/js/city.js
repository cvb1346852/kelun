var china = [
	['四川省','阿坝藏族羌族自治州','巴中市','成都市','达州市','德阳市','甘孜藏族自治州','广安市','广元市','乐山市','凉山彝族自治州','泸州市','眉山市','绵阳市','南充市','内江市','攀枝花市','遂宁市','雅安市','宜宾市','资阳市','自贡市'],
	['安徽省','安庆市','蚌埠市','亳州市','巢湖市','池州市','滁州市','阜阳市','毫州市','合肥市','淮北市','淮南市','黄山市','六安市','马鞍山市','铜陵市','芜湖市','宿州市','宣城市'],
	['北京市','北京市'],
	['福建省','福州市','龙岩市','南平市','宁德市','莆田市','泉州市','三明市','厦门市','漳州市'],
	['甘肃省','白银市','定西市','甘南藏族自治州','嘉峪关市','金昌市','酒泉市','兰州市','临夏回族自治州','陇南市','平凉市','庆阳市','天水市','武威市','张掖市'],
	['广东省','潮州市','东莞市','东沙群岛','佛山市','广州市','河源市','惠州市','江门市','揭阳市','茂名市','梅州市','清远市','汕头市','汕尾市','韶关市','深圳市','阳江市','云浮市','湛江市','肇庆市','中山市','珠海市'],
	['广西壮族自治区','百色市','北海市','崇左市','防城港市','贵港市','桂林市','河池市','贺州市','来宾市','柳州市','南宁市','钦州市','梧州市','玉林市'],
	['贵州省','安顺市','毕节地区','贵阳市','六盘水市','黔东南苗族侗族自治州','黔南布依族苗族自治州','黔西南布依族苗族自治州','铜仁地区','遵义市'],
	['海南省','白沙黎族自治县','保亭黎族苗族自治县','昌江黎族自治县','澄迈县','儋州市','定安县','东方市','海口市','乐东黎族自治县','临高县','陵水黎族自治县','琼海市','琼中黎族苗族自治县','三沙市','三亚市','屯昌县','万宁市','文昌市','五指山市'],
	['河北省','保定市','沧州市','承德市','邯郸市','衡水市','廊坊市','秦皇岛市','石家庄市','唐山市','邢台市','张家口市'],
	['河南省','安阳市','鹤壁市','焦作市','开封市','洛阳市','漯河市','南阳市','平顶山市','濮阳市','三门峡市','商丘市','新乡市','信阳市','许昌市','郑州市','周口市','驻马店市'],
	['黑龙江省','大庆市','大兴安岭地区','哈尔滨市','鹤岗市','黑河市','鸡西市','佳木斯市','牡丹江市','七台河市','齐齐哈尔市','双鸭山市','绥化市','伊春市'],
	['湖北省','鄂州市','恩施土家族苗族自治州','黄冈市','黄石市','荆门市','荆州市','潜江市','神农架林区','十堰市','随州市','天门市','武汉市','仙桃市','咸宁市','襄樊市','襄阳市','孝感市','宜昌市'],
	['湖南省','常德市','郴州市','衡阳市','怀化市','娄底市','邵阳市','湘潭市','湘西土家族苗族自治州','益阳市','永州市','岳阳市','张家界市','长沙市','株洲市'],
	['吉林省','白城市','白山市','吉林市','辽源市','龙井市','四平市','松原市','通化市','延边朝鲜族自治州','长春市'],
	['江苏省','常州市','淮安市','连云港市','南京市','南通市','苏州市','泰州市','无锡市','宿迁市','徐州市','盐城市','扬州市','镇江市'],
	['江西省','抚州市','赣州市','吉安市','景德镇市','九江市','南昌市','萍乡市','上饶市','新余市','宜春市','鹰潭市'],
	['辽宁省','鞍山市','本溪市','朝阳市','大连市','丹东市','抚顺市','阜新市','葫芦岛市','锦州市','辽阳市','盘锦市','沈阳市','铁岭市','营口市'],
	['内蒙古自治区','阿拉善盟','巴彦淖尔市','包头市','赤峰市','鄂尔多斯市','呼和浩特市','呼伦贝尔市','通辽市','乌海市','乌兰察布市','锡林郭勒盟','兴安盟'],
	['宁夏回族自治区','固原市','石嘴山市','吴忠市','银川市','中卫市'],
	['青海省','果洛藏族自治州','海北藏族自治州','海东地区','海东市','海南藏族自治州','海西蒙古族藏族自治州','黄南藏族自治州','西宁市','玉树藏族自治州'],
	['山东省','滨州市','德州市','东营市','菏泽市','济南市','济宁市','莱芜市','聊城市','临沂市','青岛市','日照市','泰安市','威海市','潍坊市','烟台市','枣庄市','淄博市'],
	['山西省','大同市','晋城市','晋中市','临汾市','吕梁市','朔州市','太原市','忻州市','阳泉市','运城市','长治市'],
	['陕西省','安康市','宝鸡市','汉中市','商洛市','铜川市','渭南市','西安市','咸阳市','延安市','榆林市'],
	['上海市','上海市'],
	['天津市','静海县','天津市'],
	['西藏自治区','阿里地区','昌都地区','拉萨市','林芝地区','那曲地区','日喀则地区','山南地区'],
	['香港特别行政区','香港特别行政区'],
	['新疆维吾尔自治区','阿克苏地区','阿拉尔市','阿勒泰地区','巴音郭楞蒙古自治州','博尔塔拉蒙古自治州','昌吉回族自治州','哈密地区','和田地区','喀什地区','克拉玛依市','克孜勒苏柯尔克孜自治州','石河子市','塔城地区','图木舒克市','吐鲁番地区','乌鲁木齐市','五家渠市','伊犁哈萨克自治州'],
	['云南省','保山市','楚雄彝族自治州','大理白族自治州','德宏傣族景颇族自治州','迪庆藏族自治州','红河哈尼族彝族自治州','昆明市','丽江市','临沧市','怒江傈僳族自治州','普洱市','曲靖市','瑞丽市','文山壮族苗族自治州','西双版纳傣族自治州','玉溪市','昭通市'],
	['浙江省','杭州市','湖州市','嘉兴市','金华市','丽水市','宁波市','衢州市','绍兴市','台州市','温州市','舟山市'],
	['重庆市','重庆市'],
	['阿拉木图市','阿拉木图市']
];

function BindProvince(){
    var opt0 = "请选择";
    var ProvinceCount=china.length;
    var ddlProvince = document.getElementById("ddlProvince");
    ddlProvince.innerHTML = "";
    ddlProvince.options[0] = new Option(opt0,"");
    for(var i=0; i<ProvinceCount; i++){
        ddlProvince.options[i+1] = new Option(china[i][0],china[i][0]);
    }
}

function BindCity(City){
    var opt0 = "请选择";
    var ProvinceCount=china.length;
    var ddlProvince = document.getElementById("ddlProvince");
    ddlProvince.innerHTML = "";
    ddlProvince.options[0] = new Option(opt0,"");

    var opt0City = "请选择";
    var ddlCity = document.getElementById("ddlCity");
    ddlCity.innerHTML = "";
    ddlCity.options[0] = new Option(opt0City,"");


    var flag=false;
    var chose=true;
    var selectProvinceIndex=0;
    for(var i=0; i<ProvinceCount; i++){
        if(!flag){
            var cityCount = china[i].length;
            for(var j=1; j<cityCount; j++){
                if(china[i][j]==City)
                {
                    flag=true;
                    selectProvinceIndex=i;
                    break;
                }
            }
        }
        ddlProvince.options[i+1] = new Option(china[i][0],china[i][0]);
        if(flag && chose){
            ddlProvince.options[i+1].selected = true;
            chose=false;
        }
    }
    var cityCount = china[selectProvinceIndex].length;
    for(var i=0; i<cityCount; i++){
        if(cityCount == 1 && i == 0){
            ddlCity.options[i+1] = new Option(china[selectProvinceIndex][i],china[selectProvinceIndex][i]);
            i = 1;
        }
        else if(cityCount > 1 && i == 0){
            i = 1;
            ddlCity.options[i] = new Option(china[selectProvinceIndex][i],china[selectProvinceIndex][i]);
        }
        else{
            ddlCity.options[i] = new Option(china[selectProvinceIndex][i],china[selectProvinceIndex][i]);
        }
        if(china[selectProvinceIndex][i]==City){
            ddlCity.options[i].selected=true;
        }
    }

    if($("#ddlProvince option:selected").val() === ""){
        $('#ddlCity').html('<option value="" selected>请选择</option>')
    }
}

function selectMoreCity(sbj){
    var opt0 = "请选择";
    if(sbj.selectedIndex==0){
        var ddlCity = document.getElementById("ddlCity");
        ddlCity.innerHTML = "";
        ddlCity.options[0] = new Option(opt0,"");
        return;
    }
    var selectProvince = sbj.options[sbj.selectedIndex].value;
    var ProvinceCount = china.length;
    for(var i=0; i<ProvinceCount; i++){
        if(china[i][0] == selectProvince){
            var cityCount = china[i].length;
            var ddlCity = document.getElementById("ddlCity");
            ddlCity.innerHTML = "";
            ddlCity.options[0] = new Option(opt0,"");
            for(var j=0; j<cityCount; j++){
                if(cityCount == 1 && j == 0){
                    ddlCity.options[j+1] = new Option(china[i][j],china[i][j]);
                    j = 1;
                }
                else if(cityCount > 1 && j == 0){
                    j = 1;
                    ddlCity.options[j] = new Option(china[i][j],china[i][j]);
                }
                else{
                    ddlCity.options[j] = new Option(china[i][j],china[i][j]);
                }
                if(j == 1){
                    ddlCity.options[1].selected = true;
                }
            }
            break;
        }
    }
}