// JavaScript Document
/**************************************************
 *    新建 & 编辑页面通用的js文件 add-edit-common.js
 *
 *        有关题库新建和编辑页 标签的操作
 *
 **************************************************/
//=====================================================Parameter=============================
var TAG_OBJECT = "ExamsLibrary";    // 默认标签对象名
var selected_tags_sum = 0;	//已经选中标签数总和
var selected_tags = ""; //存储会展的标签，用于新建、编辑主题
//=====================================================Function===============================
//------------------------------------------------------标签分类-------------------------------------------
//获取标签分类（当前标签:libTags，编辑时用）
function getTags(libTags) {
	if (!$("#lib-common-tags-ul").length)
		return;
	var params = {
		object: TAG_OBJECT
	};
	var callback = {
		success: function (tags) {
			$("#lib-common-tags-ul").empty();	//清空
			//显示标签列表
			showProTags(tags, libTags);
			//检测是否可以添加自定义标签
			if (tek.tag.isCanCreate())
				$("#lib-common-tags-ul").append(getAddCustomTagHTML());
		},
		error: function (errorMsg) {
			$("#lib-common-tags-ul").html("<div style='text-align:center;color:red;'>" + errorMsg + "</div>");
		}
	};

	var re = tek.tag.init(params);
	if (re.flag) {
		tek.tag.getTags(callback);
	} else {
		$("#lib-common-tags-ul").html("<div style='text-align:center;color:red;'>" + re.message + "</div>");
	}
}

//显示标签列表
function showProTags(tags, libTags) {
	if (!tek.type.isArray(tags) || tags.length <= 0)
		return;

	var libTagArr = libTagsTolibTagArr(libTags);	//转换为数组
	selected_tags_sum = libTagArr.length;  //保存已选中的标签数

	for (var i in tags) {
		var tag = tags[i];
		if (tek.type.isEmpty(tag))
			continue;

		var id = tag.id;
		var name = tag.name;
		var owner = tag.owner;
		if (tek.type.isEmpty(id) || tek.type.isEmpty(name))
			continue;
		var type = (owner == "0") ? 0 : 1; // 公共或个人标签，0-公共 1-个人

		showProTag(id, name, type, isProTagChecked(libTagArr, name));
	}
}

//显示标签
function showProTag(id, name, type, isChecked) {
	if (tek.type.isEmpty(id) || tek.type.isEmpty(name))
		return;

	var html = "<li>"
		+ "<input name='exams_question_tags' type='checkbox' id='tag_" + id + "' value='" + tek.dataUtility.stringToHTML(name)
		+ "' onchange='countSelectedTagsTotal(this)'" + (isChecked ? " checked" : "") + " />"
		+ "<label class='form-horizontal " + ((type == 0) ? "tag-public" : "tag-owner")
		+ "' for='tag_" + id + "' title='" + (type == 0 ? "公共标签" : "个人标签") + "'>" + tek.dataUtility.stringToHTML(name) + "</label>"
		+ "</li>";

	$("#lib-common-tags-ul").append(html);
}

//将多个标签转换为标签数组
function libTagsTolibTagArr(libTags) {
	var libTagArr = [];
	if (libTags) {
		var tempArr = libTags.split(";");
		if (tempArr && tempArr.length > 0) {
			for (var i = 0; i < tempArr.length; i++) {
				if (!tempArr[i])
					continue;
				libTagArr.push(tempArr[i]);
			}
		}//end if(tempArr && tempArr.length > 0)
	}//end if(libTags)

	return libTagArr;
}

//判断主题标签中是否存在指定的主题标签数组中
function isProTagChecked(libTagArr, libTag) {
	var isChecked = false;
	if (libTagArr && libTagArr.length > 0 && libTag) {
		for (var i = 0; i < libTagArr.length; i++) {
			if (libTagArr[i] && libTagArr[i] == libTag) {
				isChecked = true;
				break;
			}//end for(var i=0;i< libTagArr.length;i++)
		}//end for(var i=0;i< libTagArr.length;i++)
	}//end if(libTagArr && libTagArr.length > 0 &&　libTag)

	return isChecked;
}

//自定义标签按钮
function getAddCustomTagHTML() {
	var html = "<li id='custom-personal-tag-link'>"
		+ "<a href='javascript:;' onclick=\"addProTag('custom-personal-tag-link');\">添加标签</a>"
		+ "<a>  |  </a>"
		+ "<a href='javascript:;' onclick=\"removeProTag('custom-personal-tag-link');\">删除标签</a>"
		+ "</li>";

	return html;
}

//新增标签
function addProTag(targetId) {
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
		+ "<input name='addTagBtn' id='addTagBtn' type='button' onclick=\"addProTagBtn('" + targetId + "')\" value='确定' />"
		+ "<input name='cancelTagBtn' id='cancelTagBtn' type='button' onclick=\"cancelAddProTagBtn('" + targetId + "');\" value='取消' />"
		+ "</div>";

	parent.insertAdjacentHTML('beforeEnd', html);

	$("#" + targetId + "-addTagName").focus();
}

//确认添加标签按钮
function addProTagBtn(targetId) {
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
			showProTag(newTag.id, newTag.name, 1, true);
			//添加自定义标签按钮
			parent.insertAdjacentHTML('beforeEnd', getAddCustomTagHTML());
		},
		function (errorMsg) {
			$("#" + targetId + "-loading").html("<font color='red'>" + errorMsg + "</font>");
		});
}

//取消新增标签按钮
function cancelAddProTagBtn(targetId) {
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
function removeProTag(targetId) {
	var target = document.getElementById(targetId);
	if (!target)
		return;
	var parent = target.parentNode;
	if (!parent)
		return;

	parent.removeChild(target);
	//获取被选中的标签对象
	var $li = $(parent).children("li").children("label[title='个人标签']").parent();
	var strHtml = "";
	$li.each(function (index, thisDom) {
		var domStr = $(thisDom).html();
		var attrId = $(thisDom).children("input").attr("id").substr(4);
		domStr = domStr.replace(/onchange=\"countSelectedTagsTotal\(.*\);\"/g, "").replace(/tag_\d*/g, attrId).replace(/checked=\"\w*?\"/g, "");

		strHtml += "<li>" + domStr + "</li>";
	});

	var html = "<div class='row'>"
		+ "<style type='text/css'>#remove_custom_tags{text-align:left;}#remove_custom_tags li{padding: 8px 10px;display: inline-block;}</style>"
		+ "<ul id='remove_custom_tags' class='form-group col-xs-12'>" + strHtml + "</ul>"
		+ "<div class='col-xs-12 center'>"
		+ "<button class='btn btn-success' type='button' onclick=\"removeProTagBtn('" + parent.id + "','remove_custom_tags');\"> 确 定</button>"
		+ "<span style='padding:0 10px;'></span>"
		+ "<button class='btn btn-danger' type='button' onclick=\"cancelRemoveProTagBtn('" + parent.id + "');\"> 取 消</button>"
		+ "</div>"
		+ "</div>";

	tek.macCommon.waitDialogShow("删除自定义标签", html, null, 1);
}

//确认删除标签按钮
function removeProTagBtn(parentId, ulId) {
	var parent = document.getElementById(parentId);
	if (!parent)
		return;
	if (!$("#" + ulId)[0])
		return;

	var $tagsLi = $("#" + ulId).children("li").children("input:checked").parent();
	if ($tagsLi.length == 0) {
		alert("你还没有选择要删除的标签！");
		return;
	}

	//询问是否删除
	if (!window.confirm("你确定要删除这些标签？")) {
		return;
	}

	//存储用户要删除的自定义的标签id
	var tagIds = [];
	for (var i = 0; i < $tagsLi.length; i++) {
		var selectedId = $($tagsLi[i]).children("input").attr("id");
		if (selectedId && selectedId > 0)
			tagIds.push(selectedId);
	}

	tek.macCommon.waitDialogShow(null, "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在删除...");

	tek.tag.removes(tagIds,
		function (deleteTags) {
			tek.macCommon.waitDialogShow(null, "删除成功");

			//移除自定义标签
			for (var i = 0; i < deleteTags.length; i++) {
				$(parent).children("li").children("input[id*=" + deleteTags[i].id + "]").parent().remove();
			}

			//改变已选标签数目
			for (var i = 0; i < deleteTags.length; i++) {
				var tags = selected_tags.split(";");
				for (var j = 0; j < tags.length; j++) {
					if (tags[j] == deleteTags[i]) {
						selected_tags_sum--;
						var regExp = new RegExp(";?" + deleteTags[i], "g");
						selected_tags = selected_tags.replace(regExp, "");
						if (selected_tags.substr(0, 1) == ";")
							selected_tags = selected_tags.substr(1);
						break;
					}
				}
			}

			//关闭选项卡
			cancelRemoveProTagBtn(parentId);
		},
		function (errorMsg) {
			tek.macCommon.waitDialogShow(null, "<font color='red'>" + errorMsg + "</font>");
			setTimeout(cancelRemoveProTagBtn, 3000, parentId);
		});
}

//撤销删除自定义标签
function cancelRemoveProTagBtn(parentId) {
	tek.macCommon.waitDialogHide();

	var parent = document.getElementById(parentId);
	if (!parent) return;
	//添加自定义标签按钮
	parent.insertAdjacentHTML('beforeEnd', getAddCustomTagHTML());
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

//------------------------------------------------------目录分类-------------------------------------------
//获取目录分类（当前目录:libraryCatalog，编辑时用）
function getCatalog(libraryCatalog) {
	if (!$("#object_catalog_ztree").length)
		return;

	var params = {
		object: "ExamsLibrary",
		owner: "0"
	};
	var setting = {
		callback: {
			success: function (nodes) {
				//显示主题目录树
				showProductCatalog(nodes, libraryCatalog);
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
function showProductCatalog(nodes, libraryCatalog) {
	if (!tek.type.isArray(nodes) || nodes.length <= 0)
		return;

	// ztree的setting配置
	var setting = {
		view: {
			fontCss: {}
		},
		callback: {
			onClick: catalogNodeClick,
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

				if (libraryCatalog && libraryCatalog == oc[i].code)
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

//选中目录
function selectCatalog(code, name) {
	code = code || "";
	name = name || "";
	var fieldName = "exams_library_catalog";

	var fieldValue = document.getElementById(fieldName);
	if (fieldValue && fieldValue.nodeName)
		fieldValue.value = code;
	var fieldText = document.getElementById(fieldName + "Text");
	if (fieldText && fieldValue.nodeName)
		fieldText.value = name;
}


//----------------------------------------------------通用方法--------------------------------------------------
//将序列化字符串转化为JSON参数
function strToJSON(str) {
	var mydata = {};

	var array = str.split("&");
	for (var i = 0; i < array.length; i++) {
		var array2 = array[i].split("=");
		if (mydata.lib_tags && mydata.lib_tags != "" && array2[0] == "lib_tags") {
			mydata[array2[0]] = mydata.lib_tags + ";" + array2[1].replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
		} else {
			mydata[array2[0]] = array2[1].replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
		}
	}

	return mydata;
}

//-----------------------------------------------------------End------------------------------------------
