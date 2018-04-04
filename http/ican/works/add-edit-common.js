// JavaScript Document
/**************************************************
 *    新建 & 编辑页面通用的js文件 add-edit-common.js
 *
 *        有关专家新建和编辑页 类型、标签、目录 的操作，时间的换算
 *            --类型暂时没有到，后面看是否删除
 **************************************************/
//=====================================================Parameter=============================
var TAG_OBJECT = "Works";    // 默认标签对象名
var COLOR_OBJECT = "Works"	 //默认颜色对象名
var groupId;    // 所属小组标识
var isDeleting = false; // 是否正在删除
var selected_tags_sum = 0;	//已经选中标签数总和
var selected_tags = ""; //存储主题的标签，用于新建、编辑主题

// 以下三个全局变量用于organization_remark字段
var REMARK_VALUE = "";//edit.html
// 用来记录organization_remark
var RANGE_OBJ = {};
// 该序号每添加一次增加1，
var COMMON_INDEX = 0;
//=====================================================Function===============================
$(document).ready(function(){
		
	$('#tag-modal-dialog').on('hidden.bs.modal', function (e) {
	  $("#works-common-tags-ul").append(getAddCustomTagHTML());
	})	
})
//-----------------------------------------------------时间格式转化------------------------------------------------
//将long行时间转化成的时分秒对象
function getHourMinSecFromLongDate(longDate) {
	var result = {"ymd": "2015-01-01", "hh": "00", "mm": "00", "ss": "00"};
	if (!longDate)
		return result;

	var date = new Date(longDate);
	if (date) {
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1).toString();
		var day = date.getDate().toString();
		var hour = date.getHours().toString();
		var minu = date.getMinutes().toString();
		var sec = date.getSeconds().toString();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		if (hour < 10) hour = "0" + hour;
		if (minu < 10) minu = "0" + minu;
		if (sec < 10) sec = "0" + sec;

		result["ymd"] = year + "-" + month + "-" + day;
		result["hh"] = hour;
		result["mm"] = minu;
		result["ss"] = sec;
	}

	return result;
}

//将字符串日期转换为long型
function getLongDateByStringDate(stringDate) {
	var newStringDate = stringDate;
	if (newStringDate) {
		newStringDate = replaceMyString(newStringDate, "-", "/");
		if (newStringDate) {
			if (newStringDate.indexOf(":") <= 0)
				newStringDate += " 00:00:00"
		} else {
			newStringDate = stringDate;
		}
	}

	var dateDate = new Date(newStringDate);
	return dateDate.getTime();
}

//字符串替换
function replaceMyString(str, oldStr, newStr) {
	var ns = str;
	if (str) {
		do {
			ns = ns.replace(oldStr, newStr);
		} while (ns.indexOf(oldStr) > -1);
	}
	return ns;
}

//--------------------------------------------------------类型--------------------------------------
//获取主题类型（当前类型:subjectType，编辑时用）
function getAllType(subjectType) {
	if (!$("#subject_type_ul").length)
		return;

	var setting = {operateType: ""};
	var sendData = {
		objectName: "ObjectDictionary",
		action: "getList",
		dictionary_targetObject: TAG_OBJECT,
		dictionary_targetFields: "subject_type"
	};
	var callback = {
		success: function (data) {
			$("#subject_type_ul").empty();	//清空

			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				for (var i in records)
					showSubjectType(records[i], subjectType, i);
			} else {
				$("#subject_type_ul").html("字典配置(ObjectDictionary)中未配置！");
			}
		},
		error: function (data, errorMsg) {
			$("#subject_type_ul").html(errorMsg);
		},
		complete: function () {
			//隐藏或显示 开始结束时间
			isShowSubjectForStartAndEnd();
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示主题类型
function showSubjectType(record, subjectType, index) {
	if (!record || !record.name)
		return;

	var typeName = record.name;

	var html = "<li>"
	+ "<input name='subject_type' type='radio' onchange=\"changeSubjectType('" + typeName
		+ "');\" id='subject_type_" + index + "' value='" + typeName + "' ";
	if (subjectType) {
		if (subjectType === typeName)
			html += "checked";
	} else {
		if (parseInt(index) == 0)
			html += "checked";
	}
	html += " />"
	 + "<label class='form-horizontal' for='subject_type_" + index + "' >" + typeName + "</label>"
	 + "</li>";

	$("#subject_type_ul").append(html);
}

//刷新类型下的标签
function changeSubjectType(tagType) {
	if (!tagType)
		return;

	//隐藏或显示 开始结束时间
	isShowSubjectForStartAndEnd(tagType);
}

//隐藏或显示 开始结束时间
function isShowSubjectForStartAndEnd(tagType) {
	if (!tagType) {
		tagType = $("div#subject_type_form input:checked").val();
		if (!tagType)
			return;
	}

	if (tagType == "活动") {
		$("div#subject_start_form").removeClass("hidden"); //开始时间
		$("div#subject_end_form").removeClass("hidden");	//结束时间
	} else {
		$("div#subject_start_form").addClass("hidden");
		$("div#subject_end_form").addClass("hidden");
	}

	//发布时间
	var dateDiv = document.getElementById("subject_date_form");
	var statusDiv = document.getElementById("subject_status_form");
	var selectedStatus = $("div#subject_status_form input:checked").val(); //状态：发布-1
	/*if(tagType == "活动" && dateDiv && (typeof(selectedStatus)=="undefined" || selectedStatus==1)) {
	 isShowSubjectForDate(true);
	 } else {
	 isShowSubjectForDate(false);
	 }*/
}


//------------------------------------------------------标签分类-------------------------------------------
//获取标签分类（当前标签:subjectTags，编辑时用）
function getTags(subjectTags) {
	if (!$("#works-common-tags-ul").length)
		return;

	var params = {
		object: TAG_OBJECT
	};
	var callback = {
		success: function (tags) {
			$("#works-common-tags-ul").empty();	//清空
			//显示标签列表
			showSubjectTags(tags, subjectTags);
			//检测是否可以添加自定义标签
			if (tek.tag.isCanCreate(myId))
				$("#works-common-tags-ul").append(getAddCustomTagHTML());
		},
		error: function (errorMsg) {
			$("#works-common-tags-ul").html("<div style='text-align:center;color:red;'>" + errorMsg + "</div>");
		}
	};

	var re = tek.tag.init(params);
	if (re.flag) {
		tek.tag.getTags(callback);
	} else {
		$("#works-common-tags-ul").html("<div style='text-align:center;color:red;'>" + re.message + "</div>");
	}
}

//显示标签列表
function showSubjectTags(tags, subjectTags) {
	if (!tek.type.isArray(tags) || tags.length <= 0){
		if(!tek.tag.isCanCreate(myId)){
				$("#works_tag-form-group").empty();
			}
		return;
	}

	var subjectTagArr = subjectTagsTosubjectTagArr(subjectTags);	//转换为数组
	selected_tags_sum = subjectTagArr.length;  //保存已选中的标签数

	for (var i in tags) {
		var tag = tags[i];
		if (tek.type.isEmpty(tag)){
			continue;
		}

		var id = tag.id;
		var name = tag.name;
		var owner = tag.owner;
		if (tek.type.isEmpty(id) || tek.type.isEmpty(name))
			continue;
		var type = (owner == "0") ? 0 : 1; // 公共或个人标签，0-公共 1-个人

		showSubjectTag(id, name, type, isSubjectTagChecked(subjectTagArr, name));
	}
}

//显示标签
function showSubjectTag(id, name, type, isChecked) {
	if (tek.type.isEmpty(id) || tek.type.isEmpty(name)){
		return;
	}

	var html = "<li>"
		+ "<input name='organization_tags' type='checkbox' id='tag_" + id + "' value='" + tek.dataUtility.stringToHTML(name)
		+ "' onchange='countSelectedTagsTotal(this)'" + (isChecked ? " checked" : "") + " />"
		+ "<label class='form-horizontal " + ((type == 0) ? "tag-public" : "tag-owner")
		+ "' for='tag_" + id + "' title='" + (type == 0 ? "公共标签" : "个人标签") + "'>" + tek.dataUtility.stringToHTML(name) + "</label>"
		+ "</li>";

	$("#works-common-tags-ul").append(html);
}

//将多个标签转换为标签数组
function subjectTagsTosubjectTagArr(subjectTags) {
	var subjectTagArr = [];
	if (subjectTags) {
		var tempArr = subjectTags.split(";");
		if (tempArr && tempArr.length > 0) {
			for (var i = 0; i < tempArr.length; i++) {
				if (!tempArr[i])
					continue;
				subjectTagArr.push(tempArr[i]);
			}
		}//end if(tempArr && tempArr.length > 0)
	}//end if(subjectTags)

	return subjectTagArr;
}

//判断主题标签中是否存在指定的主题标签数组中
function isSubjectTagChecked(subjectTagArr, subjectTag) {
	var isChecked = false;
	if (subjectTagArr && subjectTagArr.length > 0 && subjectTag) {
		for (var i = 0; i < subjectTagArr.length; i++) {
			if (subjectTagArr[i] && subjectTagArr[i] == subjectTag) {
				isChecked = true;
				break;
			}//end for(var i=0;i< subjectTagArr.length;i++)
		}//end for(var i=0;i< subjectTagArr.length;i++)
	}//end if(subjectTagArr && subjectTagArr.length > 0 &&　subjectTag)

	return isChecked;
}

//自定义标签按钮
function getAddCustomTagHTML() {
	var html = "<li id='custom-personal-tag-link'>"
		+ "<a href='javascript:;' onclick=\"addSubjectTag('custom-personal-tag-link');\">添加标签</a>"
		+ "<a>  |  </a>"
		+ "<a href='javascript:;' onclick=\"removeSubjectTag('custom-personal-tag-link');\">删除标签</a>"
		+ "</li>";

	return html;
}

//新增标签
function addSubjectTag(targetId) {
	var target = document.getElementById(targetId);
	if (!target)
		return;
	var parent = target.parentNode;
	if (!parent)
		return;

	parent.removeChild(target);

	var html = "<div id='" + targetId + "-form' class='alert-info padd'>"
		+ "<input name='" + targetId + "-addTagName' id='" + targetId + "-addTagName' type='text' placeholder='请输入标签名' />"
		+ "<input name='" + targetId + "-addTagType' id='" + targetId + "-addTagType' type='hidden' value=''/>"
		+ "<span id='" + targetId + "-loading'></span>"
		+ "<input name='addTagBtn' id='addTagBtn' type='button' onclick=\"addSubjectTagBtn('" + targetId + "')\" value='确定' />"
		+ "<input name='cancelTagBtn' id='cancelTagBtn' type='button' onclick=\"cancelAddSubjectTagBtn('" + targetId + "');\" value='取消' />"
		+ "</div>";

	parent.insertAdjacentHTML('beforeEnd', html);

	$("#" + targetId + "-addTagName").focus();
}

//确认添加标签按钮
function addSubjectTagBtn(targetId) {
	var target = document.getElementById(targetId + "-form");
	if (!target)
		return;
	var tagName = document.getElementById(targetId + "-addTagName").value;

	if (!tagName) {
		document.getElementById(targetId + "-addTagName").placeholder = "请输入标签名";
		return;
	}

	$("#" + targetId + "-loading").html("<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />");

	tek.tag.addTag(tagName,
		function (newTag) {
			$("#" + targetId + "-loading").html("<font color='red'>添加成功！</font>");

			//添加新增显示
			var parent = target.parentNode;
			//恢复添加
			parent.removeChild(target);
			//添加新增的
			showSubjectTag(newTag.id, newTag.name, 1, false);
			//添加自定义标签按钮
			parent.insertAdjacentHTML('beforeEnd', getAddCustomTagHTML());
		},
		function (errorMsg) {
			$("#" + targetId + "-loading").html("<font color='red'>" + errorMsg + "</font>");
		});
}

//取消新增标签按钮
function cancelAddSubjectTagBtn(targetId) {
	var target = document.getElementById(targetId + "-form");
	if (!target)
		return;
	var parent = target.parentNode;
	if (!parent)
		return;

	parent.removeChild(target);
	parent.insertAdjacentHTML('beforeEnd', getAddCustomTagHTML());
}

//删除自定义标签
function removeSubjectTag(targetId) {
	
	$(".modal-body").removeClass("center");
	var target = document.getElementById(targetId);
	if (!target)
		return;
	var parent = target.parentNode;
	if (!parent)
		return;
	// parent.removeChild(target);
	//获取被选中的标签对象
	var nodes = $(parent).children("li").children("label[title='个人标签']").parent();
	var strHtml = "";
	var nodeId = "";
	var tagsStr = '';
	var tags_id_arr = [];
	for(var i = 0, len = nodes.length; i < len; i++){
		var node = nodes[i].childNodes;
		var checkNode = node[0];

		nodeId = checkNode.id.split("_")[1]; 
		strHtml =  checkNode.value;
		isChecked = checkNode.checked;

		if(isChecked){
			// 要删除的标签的ID
			tags_id_arr.push(nodeId);
			continue;
		}

		
		tagsStr += '<li>';
		tagsStr += '<input name="org_tags" type="checkbox" id="tag_'+ nodeId +'" value="'+ tek.dataUtility.stringToHTML(strHtml) +'" onchange="countSelectedTagsTotal(this)">';
		tagsStr += '<label class="form-horizontal tag-owner" for="tag_'+ nodeId +'" title="个人标签">'+ tek.dataUtility.stringToHTML(strHtml) +'</label>';
		tagsStr += '</li>';
	}
	

	removeTagBtn(tags_id_arr[0]);

	// if(tags_id_arr.length > 1){
	// 	// alert('一次只能删除一个');
	// 	// return;
	// }else{
	// 	removeTagBtn(tags_id_arr.join(','));
	// }
	
	$("#works-common-tags-ul").html('');
	$("#works-common-tags-ul").append($(tagsStr)).append(getAddCustomTagHTML());

	// getAddCustomTagHTML();



	// var html = '<div class="tags-content" id="tags_content">';
	// for(var i=0;i<nodes.length;i++){
	// 	var node = nodes[i].childNodes;
	// 	for(var j in node){
	// 		nodeId = node[0].id.split("_")[1]; 
	// 		strHtml =  node[0].value ;
	// 		break;
	// 	}
	// 	html += '<div class="wrapTag">';
	// 	html += '<span class="badge badge-blue tag-ball" id="' + nodeId +'"';
	// 	html += 'data-id="' + nodeId + '">' + tek.dataUtility.stringToHTML(strHtml) + '</span>'
	// 	html += '<span class="remove-btn" title="删除" onclick="removeSubjectTagBtn(\''+ nodeId +'\')"></span>';
	// 	html += '</div>';
	
	// };
	// html += "</div>"
	// html += "<p class='text-center'><button class='btn btn-success' type='button' onclick=\"cancelRemoveSubjectTagBtn();\"> 关闭</button></p>"
	// //tek.macCommon.waitDialogShow("删除自定义标签", html, null,0);
	// $("#tag-content").html(html);
	// $("#tag-modal-dialog").modal("show");
}
function removeTagBtn(id){

    var isUDeleteIt = confirm('你确定删除此标签吗');
    if(!isUDeleteIt){
        return; 
    }

    if (!id){
        return;
    }

    if (isDeleting){
        return;
    }else{
        isDeleting = true;
    }

    var setting = {operateType: '删除标签'};
    var sendData = {objectName: 'ObjectTag', action: 'removeInfo', 'tag_id': id};
    var callback = {
        success: function (data) {
			
            $('#'+id).parent('.wrapTag').remove();
			$("#tag_"+ id).parent('li').remove();
          /*  var curTypeSum = $('#tags_content').children();
            if(curTypeSum.length == 0){
                //$('#tags_content').text('该分类下没有公共标签记录'); 
            }*/
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        },
        complete: function () {
			//关闭选项卡
			//cancelRemoveSubjectTagBtn();
            isDeleting = false;
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
	
	
}


//确认删除标签按钮
function removeSubjectTagBtn(id) {
	
	if (!$("#" + id)){
		return;
	}
	//询问是否删除
	if (!window.confirm("你确定要删除这些标签？")) {
		return;
	}

	tek.macCommon.waitDialogShow(null, "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在删除...");

	tek.tag.remove(id,
		function (deleteTags) {
			tek.macCommon.waitDialogShow(null, "删除成功");
		 	tek.macCommon.waitDialogHide(1000);

            $('#'+id).parent('.wrapTag').remove();
			$("#tag_"+ id).parent('li').remove();
			
		},
		function (errorMsg) {
			tek.macCommon.waitDialogShow(null, "<font color='red'>" + errorMsg + "</font>");
			setTimeout(cancelRemoveSubjectTagBtn, 3000);
		});
}

//撤销删除自定义标签
function cancelRemoveSubjectTagBtn() {
	$('#tag-modal-dialog').modal("hide");	
	/*var parent = document.getElementById(parentId);
	if (!parent) return;
	//添加自定义标签按钮
	parent.insertAdjacentHTML('beforeEnd', getAddCustomTagHTML());*/
}

//统计用户选择的标签总数 --限制在5个以内
function countSelectedTagsTotal(ele) {
	if (!tek.type.isElement(ele) || !$(ele).length)
		return;

	var bl = $(ele).is(":checked");
	if (bl) {
		selected_tags_sum++;
		if (!!selected_tags) selected_tags += ";";
		selected_tags += $(ele).val();
	} else {
		selected_tags_sum--;
		var regExp = new RegExp(";?" + $(ele).val(), "g");
		selected_tags = selected_tags.replace(regExp, "");
		if (selected_tags.substr(0, 1) == ";")
			selected_tags = selected_tags.substr(1);
	}

	//判断是否超过5个
	if (selected_tags_sum > 5) {
		var html = "标签最多只能选 <span style='color:red;'>5</span> 个";
		tek.macCommon.waitDialogShow(null, html, null, 0);

		setTimeout(function () {
			selected_tags_sum--;
			var regExp = new RegExp(";?" + $(ele).val(), "g");
			selected_tags = selected_tags.replace(regExp, "");

			tek.macCommon.waitDialogHide();
			$(ele).removeAttr("checked");
		}, 2000);
	}//end if(selected_tags_sum > 5)
}


//------------------------------------------------------颜色分类-------------------------------------------
//获取标颜色分类（当前标签:subjectTags，编辑时用）
function getColors(worksColors) {
	if (!$("#works-common-color-ul").length)
		return;

	var params = {
		object: COLOR_OBJECT
	};
	var callback = {
		success: function (colors) {
			$("#works-common-color-ul").empty();	//清空
			//显示标签列表
			showSubjectColors(colors, worksColors);
			//检测是否可以添加自定义标签
			/*if (tek.color.isCanCreate(myId))
				$("#works-common-color-ul").append(getAddCustomTagHTML());*/
		},
		error: function (errorMsg) {
			$("#works-common-color-ul").html("<div style='text-align:center;color:red;'>" + errorMsg + "</div>");
		}
	};

	var re = tek.color.init(params);
	if (re.flag) {
		tek.color.getColors(callback);
	} else {
		$("#works-common-color-ul").html("<div style='text-align:center;color:red;'>" + re.message + "</div>");
	}
}

//显示颜色列表
function showSubjectColors(colors, worksColors) {
	if (!tek.type.isArray(colors) || colors.length <= 0){
		if(!tek.color.isCanCreate(myId)){
				$("#works_color-form-group").empty();
			}
		return;
	}

	var subjectTagArr = subjectTagsTosubjectTagArr(worksColors);	//转换为数组
	selected_tags_sum = subjectTagArr.length;  //保存已选中的标签数

	for (var i in colors) {
		var color = colors[i];
		if (tek.type.isEmpty(color)){
			continue;
		}

		var id = color.id;
		var name = color.name;
		var owner = color.owner;
		var value = color.value;
		if (tek.type.isEmpty(id) || tek.type.isEmpty(name))
			continue;
		var type = (owner == "0") ? 0 : 1; // 公共或个人标签，0-公共 1-个人

		showSubjectColor(id, name, type, value, isSubjectTagChecked(subjectTagArr, name));
	}
}

//显示颜色
function showSubjectColor(id, name, type, value, isChecked) {
	if (tek.type.isEmpty(id) || tek.type.isEmpty(name)){
		return;
	}

	/*var html = "<li>"
		+ "<input name='organization_tags' type='checkbox' id='tag_" + id + "' value='" + tek.dataUtility.stringToHTML(name)
		+ "' onchange='countSelectedTagsTotal(this)'" + (isChecked ? " checked" : "") + " />"
		+ "<label class='form-horizontal " + ((type == 0) ? "tag-public" : "tag-owner")
		+ "' for='tag_" + id + "' title='" + (type == 0 ? "公共标签" : "个人标签") + "'>" + tek.dataUtility.stringToHTML(name) + "</label>"
		+ "</li>";*/
	var html = "<li onclick=selectedColor('" + name + "','" + value + "')><span style='background: #" + value + "'></span><strong>" + name + "</strong></li>"

	$("#works-common-color-ul").append(html);
}

//------------------------------------------------------目录分类-------------------------------------------
//获取目录分类（当前目录:subjectCatalog，编辑时用）
function getCatalog(subjectCatalog) {
	if (!$("#object_catalog_ztree").length)
		return;

	var params = {
		object: "Organization",
		owner: "0"
	};
	var setting = {
		callback: {
			success: function (nodes) {
				//显示主题目录树
				showSubjectCatalog(nodes, subjectCatalog);
			},
			error: function (errorMsg) {
				$("#object_catalog_ztree").html("<div style='text-align:center;color:red;'>" + errorMsg + "</div>");
			}
		}
	};

	var re = tek.catalog.init(params, setting);
	if (re.flag) {
		tek.catalog.getNodes();
	} else {
		$("#object_catalog_ztree").html("<div style='text-align:center;color:red;'>" + re.message + "</div>");
	}
}

//显示主题目录树
function showSubjectCatalog(nodes, subjectCatalog) {
	if (!tek.type.isArray(nodes) || nodes.length <= 0)
		return;

	// ztree的setting配置
	var setting = {
		view: {
			fontCss: {}
		},
		callback: {
			onClick: catalogNodeClick
		}
	};
	// 初始化zTree
	var zTreeObj = $.fn.zTree.init($("#object_catalog_ztree"), setting, null);
	// 转化节点数据
	var zTreeNodes = (function () {
		var ns = [];
		var transform = function (tc, oc) {
			for (var i in oc) {
				var n = {};
				n.id = oc[i].id;
				n.code = oc[i].code;
				n.pCode = oc[i].pCode;
				n.name = oc[i].code + ":" + oc[i].name;
				n.namee = oc[i].name;
				n.isParent = oc[i].isParent;
				n.open = true;
				n.children = [];

				if (oc[i].children.length > 0)
					transform(n.children, oc[i].children);

				tc.push(n);

				if (subjectCatalog && subjectCatalog == oc[i].code)
					selectCatalog(oc[i].code, oc[i].name);
			}
		};
		transform(ns, nodes);
		return ns;
	})();
	// 添加几点数据
	zTreeObj.addNodes(null, zTreeNodes);
}

//目录树节点被点击
function catalogNodeClick(e, treeId, treeNode, clickFlag) {
	if (treeNode.isParent) {
		var zTreeObj = $.fn.zTree.getZTreeObj("object_catalog_ztree");
		zTreeObj.expandNode(treeNode, !treeNode.open)
	} else {
		//点击的是叶子节点，响应选中目录
		selectCatalog(treeNode.code, treeNode.namee);
	}
}

//打开目录选择模态框
function openCatalogModal() {
	$("#catalog-modal-dialog").modal("show");
}
// 隐藏目录选择模态框
function hideCatalogModal(){
    $("#catalog-modal-dialog").modal("hide");
}
//选中目录
function selectCatalog(code, name) {
	code = code || "";
	name = name || "";
	var fieldName = "organization_catalog";

	var fieldValue = document.getElementById(fieldName);
	if (fieldValue && fieldValue.nodeName){
		fieldValue.value = code;
	}
	var fieldText = document.getElementById(fieldName + "Text");
	if (fieldText && fieldValue.nodeName){
		fieldText.value = name;
	}
	hideCatalogModal();
}


//----------------------------------------------------通用方法--------------------------------------------------
//将序列化字符串转化为JSON参数
function strToJSON(str) {
	var mydata = {};

	var array = str.split("&");
	for (var i = 0; i < array.length; i++) {
		var array2 = array[i].split("=");
		if (mydata.org_tags && mydata.org_tags != "" && array2[0] == "org_tags") {
			mydata[array2[0]] = mydata.org_tags + ";" + array2[1].replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
		} else {
			mydata[array2[0]] = array2[1].replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
		}
	}

	return mydata;
}

