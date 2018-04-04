// JavaScript 触屏事件
// 调用参数
//判断是否支持触摸事件 

//滑动该距离以上，才引发操作
var _SLIDE_LENGTH=100;

//触控开始坐标
var touch_start_x= 0,touch_start_y = 0;

function isTouchScreenDevice(){
	try {
		document.createEvent("TouchEvent");
		//showMessage("支持TouchEvent事件");
		bindTouchScreenEvent(); //绑定事件
	}catch (e) {
		//showMessage("不支持TouchEvent事件！" + e.message);
	}
} 

//touchstart事件 
function touchScreenStart(e) {
	try{
		//e.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
		var touch = e.targetTouches[0]; //获取第一个触点
		touch_start_x = Number(touch.pageX); //页面触点X坐标
		touch_start_y = Number(touch.pageY); //页面触点Y坐标  
        
		//showMessage("ouchStart事件触发：x="+touch_start_x+";y="+touch_start_y);
	}catch (e) {
		//showError('无法捕获触屏开始事件：' + e.message);  
    }  
}

//touchend事件
function touchScreenEnd(e) {
	try {
		//e.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
		var touch = e.changedTouches[0]; //获取第一个触点
		var x = Number(touch.pageX); //页面触点X坐标
		var y = Number(touch.pageY); //页面触点Y坐标  
		
		if(x>(touch_start_x+_SLIDE_LENGTH)){//左滑
			if(typeof touchScreenRightToLeft == "function"){
				touchScreenRightToLeft();
			}
		}else if(x<(touch_start_x-_SLIDE_LENGTH)){//右滑
			if(typeof touchScreenLeftToRight == "function"){
				touchScreenLeftToRight();
			}
		}else if(y<(touch_start_y-_SLIDE_LENGTH)){//上滑
			if(typeof touchScreenUp == "function"){
				touchScreenUp();
			}
		}else if(x>(touch_start_x+_SLIDE_LENGTH)){//下滑
			if(typeof touchScreenDown == "function"){
				touchScreenDown();
			}
		}
		//showMessage('TouchEnd事件触发- start='+touch_start_x+","+touch_start_y+";npw="+x+","+y);
	}catch (e){
		//showError('无法捕获触屏结束事件：' + e.message);   
    }  
}

//绑定事件
function bindTouchScreenEvent() {
	
	if(typeof touchScreenStart == "function"){
		document.addEventListener('touchstart', touchScreenStart, false); 
	}
	if(typeof touchScreenEnd == "function"){
		document.addEventListener('touchend', touchScreenEnd, false);
	}
	if(typeof touchScreenMove == "function"){
		document.addEventListener('touchmove', touchScreenMove, false);
	}
}