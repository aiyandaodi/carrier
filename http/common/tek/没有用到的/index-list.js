// JavaScript Document

/**
 * 切换菜单（显示/隐藏）
 *
 * @param elem
 *           当前菜单节点<h2>元素
 */
function transferTree(elem) {
  if (!elem)
    return ;
	
  var ul=elem.nextSibling;
  do {
    if (ul) {
      if (ul.tagName && ul.tagName.toLowerCase()=="ul") {
        if (ul.style.display=="none") {
          ul.style.display="";
		  elem.childNodes[0].src="images/arrow2.png";
		} else {
          ul.style.display="none";
		  elem.childNodes[0].src="images/arrow1.png";
		}
		
		break;
      }
	} else
	  break;
  } while (ul=ul.nextSibling);
}

/**
 * 显示<span>
 */
function slideOnly(elem) {
  if(elem.nextSibling.nextSibling.style.display!="none")
    return;
  
  $("#transfer-index-list>li").hide();
  $(elem.nextSibling.nextSibling).slideDown();
}  

/**
 * 选中节点
 *
 * @param elem
 *           节点
 * @param url
 *           链接URL
 */
function selectElem(elem, url) {
  $("ul li ul li").css("backgroundImage","");
  if(elem && elem.style)
    elem.style.backgroundImage="url(images/index-list3.png)";
  
  openContent(url);
}
