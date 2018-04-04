// JavaScript Document
/**************************************************
 *	主题首页面 answer-waterFlow.js
 *	
 *	   功能：辅助index-icon.js用于 瀑布流 显示
 * 	   用法：显示瀑布流的区域配置css .flow-container{position: relative;display: block;}
 * 			瀑布流的卡片配置css .flow-container .flow-item-box {background-color: #FAFAFA;position: absolute;border: #CCC solid 1px;border-radius: 5px;width: 305px !important;}
 * 			卡片宽度手动记录给 var flow_itemBoxWidth
 * 			在需要的地方注入显示瀑布流的区域的id，flowInitParams(containerDomId)
 * 			在需要的地方注flowFlushDisplay()刷新瀑布流显示
 *		
 *-------------------------------------
 *	列容器对象 flow_containerObject
 *			参数：
 *				columnTotal --存储瀑布流列数
 *				columnObject --存储瀑布流列对象数组
 *			方法：
 *				add(obj)  --向this中添加列对象，obj类型为flow_columnObject
 *				clear()   --清除this中数据
 *				updateItemBox(itemBoxs)  --用瀑布流容器中的itemBox卡片对象更新this中数据
 *				getMaxHeight()  --获取this中列对象最大高度值
 *	列对象 flow_columnObject
 *			参数：
 *				left --存储每一列对象坐标的left值
 *				height --存储每一列对象的高度height值
 *				objCount --存储每一列对象中itemBox卡片个数
 *				itemBoxArray --存储每一列对象中itemBox卡片对象
 *			方法：
 *				add(obj)  --向this中添加itemBox卡片对象 
 *				clear()   --清除this中数据
 *	itemBox卡片对象 flow_itemBox
 *			参数：
 *				left --存储itemBox卡片对象坐标的left值
 *				top --存储itemBox卡片对象坐标的top值
 *				width --存储itemBox卡片对象的width值
 *				height --存储itemBox卡片对象height值
 *
 *---------------------------------------
 *	函数：
 *		flowInitParams(containerDomId)  //初始化瀑布流参数 --containerDomId:瀑布流容器div的id名
 *		flowFlushDisplay()  //刷新瀑布流显示
 *	
 **************************************************/
//=====================================================Parameter=============================
var flow_container_dom;  //显示 瀑布流 的 dom 对象

var flow_itemBoxWidth = 305;  //每个itemBox卡片的宽度，手动记录 CSS .flow-container .flow-item-box 定义
var flow_itemBoxMargin = 8;   //itemBox卡片之间的间距
var flow_containerWidth = 0;  //记录瀑布流容器的宽度

var flow_containerObject = new function(){ //列容器对象
		constructor = flow_containerObject;
		this.columnTotal = 0;
		this.columnObject = new Array();
		this.add=function(obj){
				if(obj.constructor === flow_columnObject){
					this.columnObject.push(obj);
					this.columnTotal = this.columnObject.length;
				}
			};
		this.clear=function(){
				this.columnTotal = 0;
				this.columnObject.splice(0, this.columnObject.length);
			};
		this.updateItemBox=function(itemBoxs){
				clearColumnObject(this.columnObject);
				
				if(!itemBoxs.length || itemBoxs.length<=0 || this.columnTotal==0)
					return;
				
				var left, top, width, height;
				for(var i=0; i<itemBoxs.length; i++){
					var minHeightIndex = getMinHeightColumnIndex(this);
					left = this.columnObject[minHeightIndex].left;
					top = this.columnObject[minHeightIndex].height + ((this.columnObject[minHeightIndex].objCount>0) ? flow_itemBoxMargin : 0);
					width = itemBoxs[i].offsetWidth;
					height = itemBoxs[i].offsetHeight;
					this.columnObject[minHeightIndex].add(new flow_itemBox(left, top, width, height));
					
					itemBoxs[i].style.top = top + "px";
					itemBoxs[i].style.left = left + "px";
				}
			};
		this.getMaxHeight=function(){
				var maxHeightIndex = getMaxHeightColumnIndex(this);
				return (this.columnObject.length==0) ? 0 : this.columnObject[maxHeightIndex].height;
			};
			
		function clearColumnObject(obj){
			if(!(obj instanceof Array))
				return;
				
			for(var i=0; i<obj.length; i++)
				obj[i].clear();
		}
			
		function getMinHeightColumnIndex(obj){
			var index=0;
			if(obj.columnTotal>0){
				var height=obj.columnObject[0].height;
				for(var i=0; i<obj.columnTotal; i++){
					if(obj.columnObject[i].height < height){
						height = obj.columnObject[i].height;
						index = i;
					}
				}
			}
			return index;
		}
		function getMaxHeightColumnIndex(obj){
			var index=0;
			if(obj.columnTotal>0){
				var height=obj.columnObject[0].height;
				for(var i=0; i<obj.columnTotal; i++){
					if(obj.columnObject[i].height > height){
						height = obj.columnObject[i].height;
						index = i;
					}
				}
			}
			return index;
		}
	};

var flow_columnObject = function(left){   //列对象，存放于 列容器对象属性 中
		constructor = flow_columnObject;
		this.left=(left || left==0)? left : -1;
		this.height=0;
		this.objCount=0;
		this.itemBoxArray=new Array();
		this.add=function(obj){
				if(obj.constructor === flow_itemBox){
					this.itemBoxArray.push(obj);
					flush(this);
				}
			};
		this.clear=function(){
				this.height=0;
				this.objCount=0;
				this.itemBoxArray.splice(0, this.itemBoxArray.length);
			};
			
		function flush(obj){
			obj.objCount = obj.itemBoxArray.length;
			obj.height = 0;
			for(var i=0; i<obj.objCount; i++){
				if(obj.itemBoxArray[i].height!=(-1)){
					if(i>0) obj.height += flow_itemBoxMargin;
					obj.height += obj.itemBoxArray[i].height;
				}
			}
		}
	};
var flow_itemBox = function(left, top, width, height){  //itemBox卡片对象，存放于 列对象 的itemBoxArray属性中
		constructor = flow_itemBox;
		this.left=(left || left==0)? left : -1;
		this.top=(top || top==0)? top : -1;
		this.width=(width || width==0)? width : -1;
		this.height=(height || height==0)? height : -1;
	};
//=====================================================Function===============================
//初始化瀑布流参数 --containerDomId:瀑布流容器div的id名
function flowInitParams(containerDomId){
	//获取瀑布流容器dom对象
	if(containerDomId) {
		flow_container_dom = document.getElementById(containerDomId);
	}
	if(!flow_container_dom) return;
	
	//列数 和 居中偏移宽度
	var cols = parseInt(flow_container_dom.clientWidth / (flow_itemBoxWidth + flow_itemBoxMargin));
	var centerOffset = flow_container_dom.clientWidth % (flow_itemBoxWidth + flow_itemBoxMargin); //itemBox卡片居中，左右偏移距离
	if(centerOffset >= flow_itemBoxWidth){
		cols++;
		centerOffset -= flow_itemBoxWidth;
		centerOffset = parseInt(centerOffset / 2);
	}else{
		centerOffset = parseInt((centerOffset+flow_itemBoxMargin) / 2);
	}
	//保存列数组对象flow_columnObject
	flow_containerObject.clear();
	for(var i=0; i<cols; i++){
		var left = centerOffset + i*flow_itemBoxWidth + i*flow_itemBoxMargin;
		var col = new flow_columnObject(left);
		flow_containerObject.add(col);
	}
	//存储瀑布流容器宽度，用于判断窗口大小发生变化
	flow_containerWidth = flow_container_dom.clientWidth;
}

//刷新瀑布流显示
function flowFlushDisplay() {
	if(!flow_container_dom) return;
	//获取所有的itemBox卡片对象
	var itemBoxs;
	if(typeof($(flow_container_dom).find(".flow-item-box")) == "object"){
		itemBoxs = $(flow_container_dom).find(".flow-item-box");
	}else{
		itemBoxs = getElementsByClassName(flow_container_dom,'flow-item-box col-md-4 col-sm-4');
	}
	
	//是否刷新初始参数
	if(itemBoxs && itemBoxs.length > 0) {
		if(itemBoxs[0].offsetWidth != flow_itemBoxWidth){
			flow_itemBoxWidth = itemBoxs[0].offsetWidth;
			flowInitParams();//瀑布流参数初始化
		}
		if(flow_container_dom.clientWidth != flow_containerWidth){
			flowInitParams();//瀑布流参数初始化
		}
	}
	
	//更新itemBox卡片对象
	flow_containerObject.updateItemBox(itemBoxs);
	
	//重置显示瀑布流容器高度
	if (flow_container_dom.style)
		flow_container_dom.style.height = flow_containerObject.getMaxHeight() + "px";
	
	//显示itemBox卡片对象
}

//根据类名获取obj中的所有元素对象
function getElementsByClassName(obj,className, tag, elm) {  
	if(!obj)
		return;
	var testClass = new RegExp("(^|\s)" + className + "(\s|$)", 'g');   
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


//-----------------------------------------监听事件函数-------------------------------------------------
//window窗口大小发生变化调用瀑布流
window.onresize = function(){
		//刷新瀑布流显示
		flowFlushDisplay();
	};

//监听滚动条
$(window).scroll(function(){
		if(!isContinueLoad)
			return ;
	
		if(($(this).scrollTop() + 2) >= ($(document).height()-$(this).height())){
			//根据需要在此做些什么
			isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
			$("#more_page").addClass("hidden");
			changePage(null,(currentPage*count));
		}//end  if...
	});
	

//-----------------------------------------------------End-------------------------------------