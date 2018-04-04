// 防报错。该文件用到了jQuery的gMap插件，这里定义一个空插件，防止因为没有资源而在控制台报错
// gMap是一个轻量级jQuery插件，能够轻松将Google Maps集成到网页面中。可以设置经度/纬度，默认缩放级别，地图操作控件关闭/隐藏，做标记，弹出消息框，自定标记图片。
// 如果在以后的项目中用到gMap插件，请将下面几行插件定义的代码删除并引用正确的插件内容
// --------------------------
// 定义空插件gMap开始
(function($){
	$.fn.extend({
		gMap : $.noop
	});
})(jQuery);
// 定义空插件gMap结束
// --------------------------

/* Real State JS  */

// GMAP JS

$('#my_map').gMap({
	address: "Rainham Marshes RSPB Nature Reserve, London",
	zoom: 13,
	markers:[
		{
			address: "Rainham Marshes RSPB Nature Reserve, London",
			html: "<h5>Charlie</h5><p>19 Kummy Street<br />Kanchepuram<br />Chennai - 625003</p>",
			popup: true
		}
	]
});

 $('#property_map').gMap({
	controls: false,
	zoom: 11,
	markers:[
		{
			latitude: 28.6100,
			longitude: 77.2300,
			html: "<h5>New Delhi</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Lotus Temple",
			html: "<h5>Lotus Temple</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Qutb Minar",
			html: "<h5>Qutb Minar</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "India Gate",
			html: "<h5>India Gate</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Rashtrapati Bhavan",
			html: "<h5>Rashtrapati Bhavan</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Indian Institute of Technology New Delhi",
			html: "<h5>IIT-DELHI</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Jawaharlal Nehru University New Delhi",
			html: "<h5>JNU-Delhi</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Laxmi Nagar",
			html: "<h5>Laxmi Nagar</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Patel Nagar",
			html: "<h5>Patel Nager</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Pratap Vihar",
			html: "<h5>Pratap Vihar</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "Noida",
			html: "<h5>Noida</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		},
		{
			address: "University of Delhi New Delhi",
			html: "<h5>UD</h5><p>19 Kummy Street<br />Kanchepuram<br />New Delhi - 625003</p>"
		}
	]
});