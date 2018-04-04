// JavaScript Document
/**************************************************
 *	主题首页面 index.js
 *	
 *	
 *	
 **************************************************/
//=====================================================Parameter=============================
var group_id;
var group_name;

var order;
var desc;
var count = 10;
var isGroup;	//是否指定小组
var request = tek.common.getRequest();
var isContinueLoad = false; 
var currentPage;
var totalPage;
var skip = 0;
var currentSelectedTagsCount = 0;	//当前选中的标签数
var maxSelectedTagsCount = 5;		//最大允许选中的标签数
var params = {};
var currentSelectedCatalog = "";	//当前选中的主题目录
var currentSelectedCatalogRoute = {}; //记录当前展开的父目录结构的路径（键值对形式，key表示当前父目录层级level，value表示节点Node对象）
var currentSelectedCatalog ;	//当前选中的主题目录var EVERY_ROW_SHOW = 5;	//每行显示的个数

//=====================================================Function===============================

function init(){
	if(request){
		if(!group_id){
			group_id = request["group_id"];
		}
		isGroup = group_id ? true : false;
	}
	
	//获取主题信息
	getSubjectsList(skip);
	
	
	
	//请求有主题标签时直接获取主题列表
	/*if(!request["subject_tags"]){
		tek.macList.getList();
	}*/
	//列表所有类型
	//getAllType();
	
	
	getCatalog();	//获取目录
	getTags();	//获取标签
}

//获取主题信息
function getSubjectsList(skip){
	var ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	var setting = {operateType: "获取主题信息"};
	
	params["objectName"] = "Subject";
	params["action"] = "getList";
	params["skip"] = skip;
	params["group_is"] = group_id;
	params["order"] = "createTime";
	params["desc"] = 1;
	params["icon"] = 1;
	params["count"] = count;
	if(request["subject_type"]){
		params["subject_type"] = request["subject_type"];
	}
	
	var callback = {
		beforeSend: function(){
			$("#subject_content").append("<div id='waiting-img' class='col-md-12 text-center col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />正在加载数据...</div>");
		},
		success: function(data){
			//alert($("#subject_content").html())
			if(data.code == 0){
				var record = data["record"];
				if(record){
					$("#waiting-img").remove();
					record = !record.length ? [record] : record;
					for(var i in record){
						//显示主题信息
						showSubjectInfo(record[i]);
					}
					//刷新瀑布流布局显示
					flowFlushDisplay();	
					//显示分页
                	showCustomListTurn(skip,data);
				}else{
					$("#subject_content").html("<div class='col-md-12 col-sm-12 center'>没有主题信息！</div>");
				}
			}
		},
		error: function(data, errorMsg){
			$("#subject_content").html(errorMsg);
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
	//瀑布流参数初始化
	flowInitParams("subject_content");
}


//显示主题信息
function showSubjectInfo(record){
	if(!record){
		return ;
	}
	
	var html = "";
	var field;
	//主题类型
	if(record["subject_type"]){
		var url = tek.common.getRootPath();
		field = record["subject_type"].value;
		if(field == SUBJECT_TYPE["question"]){
			url += "http/takall/subject/read-qa.html?subject_id=" + record.id;
		}else if(field == SUBJECT_TYPE["photos"]){
			url += "http/takall/subject/read-photos.html?subject_id=" + record.id + "&subject_type=" + field;
		}else if(field == SUBJECT_TYPE["baike"]){
			url += "http/takall/subject/read-wiki.html?subject_id=" + record.id;
		}else if(field == SUBJECT_TYPE["notice"]){
			url += "http/takall/subject/read-notice.html?subject_id=" + record.id;
		}else {
			url = "javascript:;";
		}
	}
	
	html += '<div class="col-md-2 col-sm-2 col-xs-12 flow-item-box">'
		+ '<div class="item">';
	if(record.icon){
		
		html += '<a href="' + url + '" target="_blank"><img src="' + record.icon + '" alt="" class="img-responsive" /></a>'
	};
	html += '<div class="content">';
	if(record.name){
		html += '<h2><a href="' + url + '" target="_blank">' + tek.dataUtility.stringToHTML(record.name) + '</a></h2>'
	}
	html += '<div class="ui-tag">';
	if(record['subject_tags']){
		field = record['subject_tags'].show || "";
		if(field){
//			var target = document.querySelector('.tag');
			var tags = field.split(";");
			for(var i in tags){
				if(tags[i]){
					if(isTagSelected(tags[i])){
						html += '<a class="btn tag-ball tag-selected" href="javascript:;" onclick=selectTag(\'' + tags[i] + '\',this.innerHTML)>' + tags[i] + '</a>';
					}else{
						html += '<a class="btn tag-ball" href="javascript:;" onclick=selectTag(\'' + tags[i] + '\',this.innerHTML)>' + tags[i] + '</a>';
					}
					
				}                
			}
		}
	}
	if(record['subject_summary']){
		field = record['subject_summary'].show || '';
		html += '<p>' + tek.dataUtility.stringToHTML(field) + '</p>' 
	}
	html += '<div class="text-right">';
	if(record['createTime']){
		field = record['createTime'].show || '';
		html += '<div style="float: left;">' + tek.dataUtility.stringToHTML(field) + '</div>'
	}
	if(record["subject_group"]){
		field = record['subject_group'].show || '';
		html += '<a target="_blank" href="../group/read.html">' + tek.dataUtility.stringToHTML(field) + '</a>';
	};
	
	html += '</div></div></div></div>';
	
	var target = document.getElementById("subject_content");
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
	}
}

/**
 * 显示默认的列表翻页按钮
 *
 * @param data
 *           检索结果
 */
function showCustomListTurn(skip,data) {
    var elem=document.getElementById("page");
    if (!elem)
        return;

    elem.innerHTML="";
    count=parseInt(count);
    if(!count)
        count=0;
    var total=parseInt(data.value);
    if(!total)
        total=0;

    //显示页码html信息文本
    elem.innerHTML = tek.turnPage.getPagination(skip,count,total);

    currentPage = tek.turnPage.getCurrentPageNumber(skip,count);
    totalPage = tek.turnPage.getTotalPageNumber(total,count);

    if(currentPage<totalPage){
        isContinueLoad = true;
        $("#more_page").removeClass("hidden");   //加载瀑布流完成后显示下一页按
        $("#ajax-load-div").addClass("hidden");
    }else{
        isContinueLoad = false;
        $("#more_page").addClass("hidden");
        $("#ajax-load-div").removeClass("hidden");
    }
	
	//刷新瀑布流显示
	setTimeout("flowFlushDisplay()", 500);
}


//下一页按钮，翻到下一页
function morePage(){
	if(currentPage<totalPage) {
		if(!$("#subject-content").is(":visible"))
			$(".wminimize").click();
		
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
		$("#more_page").addClass("hidden");
		changePage(null,(currentPage*count));
	}else{
		$("#ajax-load-div").removeClass("hidden");
		$("#more_page").addClass("hidden");
	}
}

function changePage(id, skip){
    //questionData["skip"]=skip;
    getSubjectsList(skip);
}

//获取所有的类型
function getAllType(){
	var target = document.getElementById('tag_menu');
	if(!target){
		return ;
	}
	var mydata = {};
	mydata["objectName"] = "SubjectTag";
	mydata["action"] = "getAllTypes";
	mydata["tag_object"] = "Subject";
	
	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/subjecttag",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			target.innerHTML = "";	//清空
		},
		success: function(data) {
			if(data){
				if (data.code==0){
					var target1=document.getElementById("tag_menu_content");
					if(target1)
						target1.innerHTML = "";	//清空
					var record=data["record"];
					if (record) {
						if (record.length) {
							for (var i in record){
								showSubjectType(record[i],parseInt(i),target);
								showSubjectTags(record[i].tag_type.value,parseInt(i));
							}
						}else{
							showSubjectType(record,0,target);
							showSubjectTags(record.tag_type.value,0);
						}
					} //end if (record)
				}else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#tag_menu_content").html(error.toString());
				}//end if (data.code==0)
			}else{
            	$("#tag_menu_content").html("<font color='red'>执行失败</font>");
            } //end if (data)
		} ,//end success: function(data)
		error: function() {
			$("#tag_menu_content").html("<font color='red'>操作失败</font>");
        }
	});
}
//显示标签
/*
function showSubjectTags(subjectType,index){
	var target=document.getElementById("tag_menu_content");
	if(!target)
		return;

	var ulObj = document.createElement("ul");
	if(index == 0)
		ulObj.style.display = "block";
	else
		ulObj.style.display = "none";
	target.appendChild(ulObj);	//新建ul
	
	var mydata={};
	mydata["objectName"]="SubjectTag";
	mydata["action"]="getList";
	mydata["tag_object"]="Subject";
	mydata["tag_type"]=subjectType;
	
	$.ajax({
		async: false,
		type: "post",
		url: getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
		},
		success: function(data) {
			if (data) {
				 if(data.code==0){
				 	var record=data["record"];
					if(record){
						if(record.length){ 
							for (var i in record) {
								showSubjectTagsContent(record[i],subjectType,ulObj);	
						    }
						}else{
							showSubjectTagsContent(record,subjectType,ulObj);
						}
					} //end if (record)
				 }else{
					var error=new StringBuffer();
					error.append("<font color='red'>");
					error.append(data.code);
					error.append(" - ");
					error.append(stringToHTML(data.message));
					error.append("</font>");
					//showReadMessage(error.toString(),"subject-type-ul");
					$("#tag_menu_content").html(error.toString());
				}//end if(data.code==0)
			}else{
           		$("#tag_menu_content").html("<font color='red'>执行失败</font>");
          } //end if(data)
		},//end success: function(data)
		error: function() {
			$("#tag_menu_content").html("<font color='red'>操作失败</font>");
        }
	});
}
*/

//获取标签分类（当前标签:subjectTags，编辑时用）
function getTags(subjectTags) {
    if (!$("#subject_tags_ul").length)
        return;

    var params = {
        object: TAG_OBJECT
    };
    var callback = {
        success: function (tags) {
            $("#subject_tags_ul").empty();	//清空
            //显示标签列表
            showSubjectTags(tags, subjectTags);
           
        },
        error: function (errorMsg) {
            $("#subject_tags_ul").html("<div style='text-align:center;color:red;'>" + errorMsg + "</div>");
        }
    };

    var re = tek.tag.init(params);
    if (re.flag) {
        tek.tag.getTags(callback);
    } else {
        $("#subject_tags_ul").html("<div style='text-align:center;color:red;'>" + re.message + "</div>");
    }
}
//显示标签
function showSubjectTag(id, name, type, isChecked) {
    if (tek.type.isEmpty(id) || tek.type.isEmpty(name)){
		return;
	}
        
    var html = '<li class="">'
		+ '<a href="javascript:;"  onclick=selectTag(\'' + name + '\',this.innerHTML)>' + tek.dataUtility.stringToHTML(name) + '</a>'                    
        + '</li>';

    $("#subject_tags_ul").append(html);
	
	
}
//选择标签
function selectTag(subjectType, subjectTag){	
	if(!subjectType || !subjectTag){
		return ;
	}	
	if(currentSelectedTagsCount >= maxSelectedTagsCount){
		alert("最多允许选择["+maxSelectedTagsCount+"]个标签！");
		return ;	
	}

	var ulObj = document.getElementById('subject_tags_ul');
	if(!ulObj){
		return;
	}
		
	var lis = ulObj.getElementsByTagName("li");
	var isExist = false;	//判断是否存在
	if(lis && lis.length > 0){
		for(var i=0;i < lis.length;i++){
			
			//alert(lis[i].getElementsByTagName('a')[0].innerHTML);
			if(lis[i].getElementsByTagName('a')[0].innerHTML == subjectTag){
				if(lis[i].className == 'active'){
					isExist = true;
					return ;
				}else{
					lis[i].className = 'active';
					lis[i].innerHTML = '<i class="fa fa-times" onclick=removeTag(\'' + subjectTag + '\')></i><a href="javascript:;"  onclick=selectTag(\'' + subjectTag + '\',this.innerHTML)>' + subjectTag + '</a>' 
					currentSelectedTagsCount++;		//选中标签数+1
					
					
				}
			}
		}	
		resetWholeVariable();	//重置全局变量
	}
	
}

//移除标签
function removeTag(subjectTag){
	if(!subjectTag){
		return ;
	}
		
	var ulObj = document.getElementById('subject_tags_ul');
	if(!ulObj)
		return;
	var lis = ulObj.getElementsByTagName("li");
	var liCount = 0;
	if(lis && lis.length > 0){
		
		for(var i=0;i < lis.length;i++){
			if(lis[i].className == 'active'){
				if(lis[i].getElementsByTagName('a')[0].innerHTML == subjectTag){
					lis[i].className = '';
					lis[i].innerHTML = '<a href="javascript:;"  onclick=selectTag(\'' + subjectTag + '\',this.innerHTML)>' + subjectTag + '</a>';
					currentSelectedTagsCount--;		//选中标签数-1
				}
			}		
		}
	}
	
	
	resetWholeVariable();	//重置全局变量
}

//重置的变量
function  resetWholeVariable(){
	params["skip"]=0;
	
	$("#subject_content").html("");
	
	var selectedTags = getAllSelectedTags();	//获取选中的标签
	if(selectedTags && selectedTags.length > 0){
		params["subject_tags"] = selectedTags;
	}else{
		params["subject_tags"] = selectedTags;
	}
	
	if(currentSelectedCatalog && currentSelectedCatalog.length >0){
		params["subject_catalog"] = currentSelectedCatalog;	//选中的目录编码
	}
	else{
		params["subject_catalog"] = currentSelectedCatalog;
	}
	getSubjectsList();
}

/**
*	获取所有选中的标签
*
*	@return 返回所有选中的标签，多个标签用';'隔开
*	
*/
function getAllSelectedTags(){
	var tags = new StringBuffer();	//
	var ulObj = document.getElementById('subject_tags_ul');
	if(!ulObj)
		return;
	
	var lis = ulObj.getElementsByTagName("li");
	var flag = true;
	if(lis && lis.length > 0){
		currentSelectedTagsCount = 0;	//重新计算标签个数
		for(var i=0;i < lis.length;i++){
			/*if(typeof lis[i] == "object"){
				var attr = lis[i].getAttribute("data-attr");
				if(!attr)
					continue;
				
			}	*/
			if(lis[i].className == 'active'){
				currentSelectedTagsCount++;	//当前选中的标签数
				if(flag){	
					tags.append(lis[i].getElementsByTagName('a')[0].innerHTML);
					
					flag = false;
				}else{
					tags.append(";");
					tags.append(lis[i].getElementsByTagName('a')[0].innerHTML);
				}
			}
			
		}	
	}
	return tags.toString();
}


//判断标签是否被选中
function isTagSelected(tag){
	var ulObj = document.getElementById('subject_tags_ul');
	if(!ulObj)
		return false;
		
	var lis = ulObj.getElementsByTagName("li");
	var isExist = false;	//判断是否存在
	if(lis && lis.length > 0){
		for(var i=0;i < lis.length;i++){
			/*if(lis[i] && typeof lis[i] == "object"){
				var attr = lis[i].getAttribute("data-attr");
				if(!attr)
					continue;
				if(tag && tag == attr){
					isExist = true;
					break;
				}
			}*/
			
			if(lis[i].className == 'active'){
				if(tag && tag == lis[i].getElementsByTagName('a')[0].innerHTML){
					isExist = true;
					break;
				}
			}
		}
	}
	
	return isExist;	
}


//获取目录分类
function getCatalog() {
	if (!$("#catalog_menu").length){
		return;
	}

	var catalogType = "Subject";
	/*switch (subject_type){
		case 1:catalogType="SubjectQuestion";
		//alert("1");
			break;
		case 2:catalogType="SubjectPhotos";
			break;
		case 3:catalogType="SubjectBaike";
			break;
		case 4:catalogType="SubjectNotice";
			break;
	}*/

	if(catalogType && catalogType.length>3){
		var params = {
			object: catalogType,
			owner: "0"
		};
		var setting = {
			callback: {
				success: function (nodes) {
                    //初始化展开的目录结构路径
                    initSelectedCatalogRoute();
                    //显示主题目录树
                    showSubjectCatalog(nodes);
                    //显示主题目录树路径
                    showSubjectCatalogRoute();
				},
				error: function (errorMsg) {
					$("#catalog_menu").html("<div style='text-align:center;color:red;'>" + errorMsg + "</div>");
				}
			}
		};
		var re = tek.catalog.init(params, setting);
		if (re.flag) {
			tek.catalog.getNodes();
		} else {
			$("#catalog_menu").html("<div style='text-align:center;color:red;'>" + re.message + "</div>");
		}
	}
}

//初始化展开的目录结构路径
function initSelectedCatalogRoute() {
    currentSelectedCatalogRoute = {};
    if (!currentSelectedCatalog){
		return;
	}

    //逆向向上查找
    var searchNode = function (nodeCode) {
        var childNode = tek.catalog.getNodeByParam("code", nodeCode);
		
        if (!childNode){
			return;
		}
            
        currentSelectedCatalogRoute[childNode.level] = childNode;

        if (childNode.level > 1){
			searchNode(childNode.pCode);
		}
            
    };
    searchNode(currentSelectedCatalog);
	
	
}

//显示主题目录
function showSubjectCatalog(nodes) {
    if (!nodes)
        return;

    nodes = !nodes.length ? [nodes] : nodes;

    var html = '';

    var recursion = function (ns) {
        if (!tek.type.isArray(ns))
            return;

        for (var i = 0; i < ns.length; i++) {
            var n = ns[i];
            if (!n)
                return;

            var isOpen = currentSelectedCatalogRoute[n.level] ? currentSelectedCatalogRoute[n.level].code == n.code : false; // 是否展开

            if (n.isParent) {
                html += '<div class="treeNode">' +
                '<img src="images/tree-' + (isOpen ? 'down' : 'right') + '.gif" onclick="expandCollapse(this.parentNode, event);return false;" class="treeLinkImage">&nbsp;' +
                '<span onclick="expandCollapse(this.parentNode)" class="category bold" title="' + n.code + '"> '+ n.name+' </span>' +
                '<div class="' + (isOpen ? 'treeSubnodes' : 'treeSubnodesHidden') + '">';

                recursion(n.children);

                html += '</div></div>'
            } else {
                html += '<div class="treeNode">' +
                '<a href="#" class="' + (n.code == currentSelectedCatalog ? "treeSelected" : 'treeUnselected') +
                '" data-code="' + n.code + '" onclick="clickAnchor(this)" title="' + n.code + '"> '+ n.name+' </a>' +
                '</div>'
            }
        }
    };
    recursion(nodes);

    $('#tree_root').html(html);
}

//显示主题目录路径
function showSubjectCatalogRoute() {
    //获取目录分类总的层级（深度）
    var LEVEL = parseInt(tek.catalog.option["depth"]);
    if (!isFinite(LEVEL) || LEVEL <= 0)
        return;

    var html = ''; // 目录路径html

    for (var level = 1; level <= LEVEL; level++) {
        var node = currentSelectedCatalogRoute[level];
        if (!node)
            break;

        if (node.isParent) {
            //显示父层级
            html += "<li class='parents' level=" + level + ">"
            + "<a class='' title='" + node.code + " - " + node.name + "'>" + node.name + "&nbsp;>&nbsp;</a>";
            + "</li>";
        } else {
            //显示叶子（末端）目录
            html += "<li class='leaves" + "' data-code='" + node.code + "' title='" + node.code + " - " + node.name + "'>" + node.name + "</li>";
        }
    }

    $("#catalog_route").html(html);
}

//展开目录树（监听鼠标移入事件）
function spreadTree() {
    var $treeRoot = $('#tree_root');

    $treeRoot.toggle('normal');
    //if ($treeRoot.is('.spread')) {
    //    $treeRoot.removeClass('spread');
    //} else {
    //    $treeRoot.addClass('spread');
    //}
}

//选中或移除选中目录（叶子目录分类）---- index-tree.js 中的 clickAnchor(el) 方法调用
function selectOrRemoveCatalog(catalogEle) {
    var originCatalog = currentSelectedCatalog;
    if (tek.type.isElement(catalogEle)) {
        var catalogCode = $(catalogEle).attr("data-code");
        if (!catalogCode){
			return;
		}
            

        var isSelect = /treeSelected/g.test(catalogEle.className);

        currentSelectedCatalog = isSelect ? catalogCode : '';
    }
    if (currentSelectedCatalog != originCatalog) {
        initSelectedCatalogRoute(); //初始化展开的目录结构路径
        showSubjectCatalogRoute(); //显示主题目录树路径
        resetWholeVariable();	//重置全局变量
    }
	spreadTree();
}

























