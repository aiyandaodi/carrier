// JavaScript Document
/***************************************************************************************************
 * 说明：                                                                               
 *   该JS文件用于使用瀑布流显示页面的布局。                                     
 *-------------------------------------------------------------------------------------------------
 * 页面需要初始化的参数：
 *     margin - 设置外边距；例如： margin = 8
 * 	   firstTop - 第一行距离顶部的值；例如：firstTop = 0
 *	   CurrentTotalComnNums - 存储当前列数
 *     isOnResizeFlag = false - 是否是重置窗口大小。
 *------------------------------------------------------------------------------------------------
 * 函数：
 *     function showWarterFlow ();  -  显示瀑布流布局。
 *
 ***************************************************************************************************/
//瀑布流变量定义、初始化
var margin = 8;	//设置外边距
var firstTop = 0;//第一行距离顶部的值
var CurrentTotalComnNums;	//存储当前列数
var isOnResizeFlag = false;	//是否是重置窗口大小标记
//var isFirstLoad = true;
//var isContinueLoad = true;		//是否可以继续
//var isThisLoadComplete = true;	//是否加载完成
/**
*	显示瀑布流布局
*/
function showWarterFlow () {  
	//获取主内容显示图层
	var container = document.getElementById('table-infos');
	if(!container)
		return ;
	//获取所有的box
	var boxes;
	
	if(typeof($(container).find(".subject-content-col")) == "object"){
		boxes = $(container).find(".subject-content-col"); 
	}else
		boxes = getElementsByClassName(container,'subject-content-col col-md-4 col-sm-4');
	if(!boxes || boxes.length <= 0)
		return;

	//获取一列宽度
	var boxWidth = boxes[0].offsetWidth+margin;	

	var columnHeight=[];  //存储所有列的高度（每次改变布局，重新初始化）
	var containerWidth = container.offsetWidth+1;//
	var n = parseInt(containerWidth/boxWidth);

	var columnNum =(n == 0? 1:n);	//获取列数
	//瀑布流到两边的距离
	var offWidth = (containerWidth-columnNum*boxWidth)/2;                 
	
	//container.style.width = (columnNum*parseInt(boxWidth))+"px";
	
	if(!CurrentTotalComnNums)	//记录
		CurrentTotalComnNums = columnNum;
	//记录是否需要改变列数
	if(CurrentTotalComnNums != columnNum){
		CurrentTotalComnNums = columnNum;
		if(isOnResizeFlag)
			isOnResizeFlag = false;	//标记不是重置窗口大小
	}else{	//为改变列数，不重置
		if(isOnResizeFlag){ //重置窗口大小
			isOnResizeFlag = false;	//标记不是重置窗口大小
			if(CurrentTotalComnNums != 1)
				return ; //重置窗口大小,列数不变
		}//end if(isOnResizeFlag)
	}//end if(CurrentTotalComnNums != columnNum)
	container.style.height=(parseInt(container.style.height)+400)+'px';
	for (var i = 0,l= parseInt(boxes.length); i <l ; i++) {
		if((boxes[i].offsetWidth+margin) != boxWidth)	//保证一样宽
			boxes[i].style.width = (boxWidth-margin)+"px";
		if (i<columnNum) {	//第一行，直接添加到指定位置  
			columnHeight[i]=boxes[i].offsetHeight+firstTop+margin; //存储当前的box的高度
			boxes[i].style.top = firstTop+'px';
			boxes[i].style.left = i*boxWidth+margin+offWidth+'px'; //设置距离左边的位置
			//	boxes[i].style.left = i*boxWidth+margin+'px'; //设置距离左边的位置
		} else{	//不是第一行，通过找到所存储的最小高度的box的序号，来找到其位置，从而找到当前应该放的位置
			var minBoxHeightIndex = getMinBoxHeightFromColumnHeight(columnHeight);	//获取最小高度box的序号
			var thisBoxHeight = boxes[i].offsetHeight+margin;	//当前要放置的box的高度值
			boxes[i].style.top = columnHeight[minBoxHeightIndex]+'px';
			boxes[i].style.left = minBoxHeightIndex*boxWidth+margin+offWidth+'px';
			//	boxes[i].style.left = minBoxHeightIndex*boxWidth+margin+'px';
			columnHeight[minBoxHeightIndex] +=thisBoxHeight; //重新存储最小box的高度(并非实际高度，只用于标记-因为其下面添加了新的box)
		}//end if (i<columnNum) 
	}//end for (var i = 0,l= parseInt(boxes.length); i <l ; i++) 
	
	var containerHeight =  getMaxBoxHeightFromColumnHeight(columnHeight);
	if(containerHeight > 0)
		container.style.height = containerHeight+"px";	//改变高度

}
/**
*  
*  根据类名取元素的方法
*  @param obj  -  对象
*		  classname - 类名
*         tag  -  标签
*         elm - 元素
**/
function getElementsByClassName(obj,className, tag, elm) {  
	if(!obj)
		return;
	var testClass = new RegExp("(^|\s)" + className + "(\s|$)");   
	var tag = tag || "*";   
	var elm = elm || obj;   
	var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);   
	var returnElements = [];   
	var current;   
	var length = elements.length;   
	for(var i=0; i<length; i++){   
		current = elements[i];  
		if(testClass.test(current.className)){   
			returnElements.push(current);   
		}   
	}   
	return returnElements;   
};	




/**
*  获取当前存储的所有高度的最小值所在的序号
*  //交换法找到当前最小的高度的序号
*　@param heightArry  -  各类的高度数组
**/
function getMinBoxHeightFromColumnHeight(heightAarry){
	var minBoxHeightIndex = 0; //最小高度box的序号
	var minHeight = heightAarry[minBoxHeightIndex];	//记录第一个
	for (var i = 1,len=heightAarry.length; i < len; i++) {
		var temp = heightAarry[i];
		var temp1 = temp;
		if (temp < minHeight) { //当前的值的高度为最小值，交换
			minBoxHeightIndex = i;
			minHeight = temp;
		}
	}
	return minBoxHeightIndex;
}


/*
*  获取最大高度值
*　@param heightArry  -  各类的高度数组
**/
function getMaxBoxHeightFromColumnHeight(heightAarry){
	if(!heightAarry || heightAarry.length <= 0)
		return;
	var maxHeight = heightAarry[0];	
	for (var i = 1,len=heightAarry.length; i < len; i++) {
		var temp = heightAarry[i];
		if(temp > maxHeight)
			maxHeight = temp;
	}
	return maxHeight;
}

//调用瀑布流
window.onresize = function(){
	setTimeout("showWarterFlow()",100);
};

var wikiContentheight = 0;	//记录高度
var fereshId = window.setInterval(function (){ 
	var obj = document.getElementById('table-infos');
	if(!obj)
	   return;

	if(wikiContentheight > 0 && parseInt(obj.style.height) == wikiContentheight)
		window.clearInterval(fereshId);
	else{
		wikiContentheight = parseInt(obj.style.height);
		showWarterFlow();
	}
},1000);
