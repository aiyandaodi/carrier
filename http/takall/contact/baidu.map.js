function showMap(record){
    var province = record.address_state.value;
    var city = record.address_city.value;

    var province_reg = new RegExp(province);
    var city_reg = new RegExp(city);

    var street = record.address_street.value;

    // 添加百度地图
    var locate;

    street = street.replace(province_reg,"");
    street = street.replace(city_reg,"");

    locate = "" + province + city + street;
    
    ShowBaiDuMap(locate, "allmap");
}
// 添加百度地图map
/*
* 参数说明：
* location:地图上要显示的地址，包含省、市、县区、街道
* wraper:包裹地图的div
*/
function ShowBaiDuMap(location, wraper) {
    var location = location || "";
    // 百度地图API功能
    var map = new BMap.Map(wraper);
    var point = new BMap.Point(116.331398,39.897445);
    map.centerAndZoom(point, 12);
    //启用滚轮放大缩小，地图接口默认是禁用
    map.enableScrollWheelZoom();
    //启用地图惯性拖拽，地图接口默认是禁用
    map.enableContinuousZoom();
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    var menu = new BMap.ContextMenu();

    // 添加右键菜单
    var txtMenuItem = [{
        text: '放大',
        callback: function() {
            map.zoomIn()
        }
    }, {
        text: '缩小',
        callback: function() {
            map.zoomOut()
        }
    }, {
        text: '去百度地图',
        callback: function() {
            window.open("http://map.baidu.com/?l=&s=s%26wd%3D" + location);
        }
    }];
    for (var i = 0; i < txtMenuItem.length; i++) {
        menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
    }
    map.addContextMenu(menu);
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(location, function(point) {
        if (point) {
            map.centerAndZoom(point, 16);
            map.addOverlay(new BMap.Marker(point));
        } else {
            // alert("您选择地址没有解析到结果!");
            console.log("您机构的地址没有解析到结果!请录入完整的省份、城市、社区、街道的名称");
        }
    }, "北京市");
    // 百度地图结束
}