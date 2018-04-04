var treeSelected = null;//选中的树节点

var imgPlus = new Image();
imgPlus.src = "images/tree-right.gif";
var imgMinus = new Image();
imgMinus.src = "images/tree-down.gif";

//父节点展开事件
function expandCollapse(el, event) {
    //如果父节点有字节点（class 属性为treeSubnodesHidden），展开所有子节点
    if (el.className != "treeNode") {
        return;    //判断父节点是否为一个树节点，如果树节点不能展开，请检查是否节点的class属性是否为treeNode
    }
    var child;
    var imgEl;//图片子节点，在树展开时更换图片
    for (var i = 0; i < el.childNodes.length; i++) {
        child = el.childNodes[i];
        if (child.src) {
            imgEl = child;
        }
        else if (child.className == "treeSubnodesHidden") {
            child.className = "treeSubnodes";//原来若隐藏，则展开
            imgEl.src = imgMinus.src;//更换图片
            break;
        }
        else if (child.className == "treeSubnodes") {
            child.className = "treeSubnodesHidden";//原来若展开，则隐藏
            imgEl.src = imgPlus.src;//更换图片
            break;
        }
    }
	return false;
    event.stopPropagation();
}

//子节点点击事件，设置选中节点的样式
function clickAnchor(el) {
    selectNode(el.parentNode);
    //选中或移除选中目录（叶子目录分类）
    selectOrRemoveCatalog(el);

    el.blur();
}

function selectNode(el) {
    if (el != treeSelected || !treeSelected) {
        setEndNodeClass(el, 'A', 'treeSelected');

        if (treeSelected)
            setEndNodeClass(treeSelected, 'A', 'treeUnselected');

        treeSelected = el;
    } else {
        setEndNodeClass(treeSelected, 'A', 'treeUnselected');
        treeSelected = null;
    }

}

function setEndNodeClass(el, nodeName, className) {
    var child;
    for (var i = 0; i < el.childNodes.length; i++) {
        child = el.childNodes[i];
        if (child.nodeName == nodeName) {
            child.className = className;
            break;
        }
    }
}