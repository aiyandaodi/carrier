// JavaScript Document
function init(){
	
	slider_pages();
	
	/**加入统计代码**/
	//addCnzzYmeng();
	//addBaiduTongji();
	
}

function slider_pages(){
	$(function() {
		'use strict';
		$('#fullpage').fullpage({
			responsiveWidth: 992,
			paddingTop: '100px',
			sectionsColor : ['#f1f1f1', '#f1f1f1', '#f1f1f1'],
			menu: '#main-nav-container',
			anchors:['firstPage', 'secondPage', 'thirdPage']
		});
    });
}
