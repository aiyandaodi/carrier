/* 以list.dwt.jsp模板创建的table表格样式的列表使用的通用操作 */

/**
 * 计算表格宽度，每行li设为该行最大高度。（适用于，在页面加载后调用）
 */
function computeTable() {
  var ul=document.getElementById("listorder");
  if(!ul)
    return;
 
  // 1、计算列名
  var maxH=0;
  var child=ul.childNodes;
  for(var i in child) {
    if(child[i].tagName && child[i].tagName.toLowerCase()=="li") {
      if(child[i].scrollHeight>maxH)
        maxH=child[i].scrollHeight;
      }
  }
  
  if(maxH>0) {
    for(var i in child) {
      if(child[i].tagName && child[i].tagName.toLowerCase()=="li")
        child[i].style.height=maxH+"px";
    }
  }
  
  // 1、计算行数据
  while((ul=ul.nextSibling)) {
    if(!ul.className
        || (ul.className!="item1" && ul.className!="item2"))
    continue;
    
    maxH=0;
    child=ul.childNodes;
    for(var i in child) {
      if(child[i].tagName && child[i].tagName.toLowerCase()=="li") {
        if(child[i].scrollHeight>maxH)
	      maxH=child[i].scrollHeight;
  	  }
    }
  
    if(maxH>0) {
      for(var i in child) {
	    if(child[i].tagName && child[i].tagName.toLowerCase()=="li")
          child[i].style.height=maxH+"px";
      }
    }
  }
}
