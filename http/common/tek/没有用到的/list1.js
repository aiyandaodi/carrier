/* ��list.dwt.jspģ�崴����table�����ʽ���б�ʹ�õ�ͨ�ò��� */

/**
 * �������ȣ�ÿ��li��Ϊ�������߶ȡ��������ڣ���ҳ����غ���ã�
 */
function computeTable() {
  var ul=document.getElementById("listorder");
  if(!ul)
    return;
 
  // 1����������
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
  
  // 1������������
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
