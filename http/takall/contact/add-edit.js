


//将序列化字符串转化为JSON参数
function strToJSON(str){
	var mydata={};
	var array = str.split("&");
	for(var i=0;i<array.length;i++){
		var array2 = array[i].split("=");
		if(mydata.org_tags && mydata.org_tags != "" && array2[0] == "org_tags"){
			mydata[array2[0]] = mydata.org_tags+";"+array2[1].replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
		}else{
			mydata[array2[0]] = array2[1].replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
		}
	}
	return mydata;
}


//------------------------------------------------------标签分类-------------------------------------------
var TAG_OBJECT="Contact";    // 默认标签对象名

var groupId;    // 所属小组标识

var isRightForAddTag = false;    // 是否允许新建标签

var selected_tags_sum = 0;	//已经选中标签数总和
var selected_type_tags = ""; //存储主题的类型和标签，用于编辑主题

//获取标签分类
function getTags(subjectTags) {
	if(!$("#coantact-common-tags-ul")[0])
		return;

	var mydata={};
	mydata["objectName"] = "ObjectTag";
	mydata["action"] = "getList";
	mydata["tag_object"] = TAG_OBJECT;
	mydata["tag-choose"] = 1;

	mydata["order"] = "tag_owner,tag_code";

	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend: function() {
			$("#coantact-common-tags-ul").empty();	//清空
		},
		success: function(data) {
			if(data){
				if (data.code==0) {
					var records = data["record"];
					records = tek.type.isArray(records) ? records : (tek.type.isObject(records) ? [records] : []);

					showSubjectTags(records, subjectTags);

					//检测是否可以添加自定义标签
					checkIsCanAddTag();
				}else{
					var errorMsg = "<font color='red'>" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "</font>";
					$("#coantact-common-tags-ul").html(errorMsg);
				}//end if (data.code==0)
			}else{
				$("#coantact-common-tags-ul").html("<font color='red'>执行失败![data=null]</font>");
			} //end if (data)
		} ,//end success: function(data)
		error: function(request) {
			var errorMsg = "<font color='red'>操作失败![" + request.status + " - " + request.statusText + "]</font>";
			$("#coantact-common-tags-ul").html(errorMsg);
		}
	});
}

//显示标签列表
function showSubjectTags(records, subjectTags) {
	if (!tek.type.isArray(records) || records.length <= 0)
		return;

	var subjectTagArr = subjectTagsTosubjectTagArr(subjectTags);	//转换为数组
	selected_tags_sum = subjectTagArr.length;  //保存已选中的标签数

	for (var i in records) {
		var record = records[i];
		if (tek.type.isEmpty(record))
			continue;

		var id = record.id;
		var name = !!record.tag_name ? record.tag_name.value : null;
		var owner = !!record.tag_owner ? record.tag_owner.value : null;
		if (tek.type.isEmpty(id) || tek.type.isEmpty(name))
			continue;
		var type = (owner == "0") ? 0 : 1; // 公共或个人标签，0-公共 1-个人

		showSubjectTag(id, name, type, isSubjectTagChecked(subjectTagArr, name));
	}
}

//显示标签
function showSubjectTag(id, name, type, isChecked) {
	if (tek.type.isEmpty(id) || tek.type.isEmpty(name))
		return;

	var tags = "";

	tags += "<li>";
	tags += "<input name='org_tags' type='checkbox' id='tag_" + id + "' value='" + name + "' "
		+ "onchange='countSelectedTagsTotal(this)'";
	if (isChecked)
		tags += " checked "; // 是否选中
	tags += " />";
	tags += "<label class='form-horizontal ";
	tags += (type == 0) ? "tag-public" : "tag-owner";
	tags += "' for='tag_" + id + "' title='" + (type == 0 ? "公共标签" : "个人标签") + "'>"
		+ name + "</label>";
	tags += "</li>";

	if (!tek.type.isEmpty(tags))
		$("#coantact-common-tags-ul").append(tags);
}

//将多个标签转换为标签数组
function subjectTagsTosubjectTagArr(subjectTags){
	var subjectTagArr = [];
	if(subjectTags){
		var tempArr = subjectTags.split(";");
		if(tempArr && tempArr.length > 0){
			for(var i = 0;i<tempArr.length;i++){
				if(!tempArr[i])
					continue;
				subjectTagArr.push(tempArr[i]);
			}
		}//end if(tempArr && tempArr.length > 0)
	}//end if(subjectTags)

	return subjectTagArr;
}

//判断主题标签中是否存在指定的主题标签数组中
function isSubjectTagChecked(subjectTagArr, subjectTag){
	var isChecked = false;
	if(subjectTagArr && subjectTagArr.length > 0 &&　subjectTag){
		for(var i=0;i< subjectTagArr.length;i++){
			if(subjectTagArr[i] && subjectTagArr[i]==subjectTag){
				isChecked = true;
				break;
			}//end for(var i=0;i< subjectTagArr.length;i++)
		}//end for(var i=0;i< subjectTagArr.length;i++)
	}//end if(subjectTagArr && subjectTagArr.length > 0 &&　subjectTag)

	return isChecked;
}

//检测是否可以添加自定义标签
function checkIsCanAddTag() {
	if(isRightForAddTag){
		// 允许自定义标签
		$("#coantact-common-tags-ul").append(getAddCustomTagHTML());
	} else {
		// 取得权限
		var mydata={};
		mydata["objectName"]="ObjectTag";
		mydata["action"]="getRight";
		mydata["tag_object"]=TAG_OBJECT;

		$.ajax({
			async: true,
			type: "post",
			url: tek.common.getRootPath()+"servlet/subjecttag",
			dataType: "json",
			data: mydata,
			beforeSend:function(){
			},
			success: function(data) {
				if(data){
					if (data.code==0 && (data.value&4==4)){
						// 有创建权限
						isRightForAddTag = true;
						$("#coantact-common-tags-ul").append(getAddCustomTagHTML());
					}else{
						isRightForAddTag=false;

						var errorMsg = "<font color='red'>" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "</font>";
						$("#coantact-common-tags-ul").html(errorMsg);
					}//end if(data.code==0)
				}else{
					$("#coantact-common-tags-ul").html("<font color='red'>执行失败![data=null]</font>");
				}//end if(data)
			}, //end success: function(data)
			error: function(request) {
				var errorMsg =  "<font color='red'>操作失败！[" + request.status + "-" + request.statusText + "]</font>";
				$("#coantact-common-tags-ul").html(errorMsg);
			},
			complete:function(){
			}
		});
	}
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
	if(!target)
		return ;
	var parent = target.parentNode;
	if(!parent)
		return;

	parent.removeChild(target);

	var html = "<div id='" + targetId + "-form' class='alert-info padd'>"
		+ "<input name='" + targetId + "-addTagName' id='" + targetId + "-addTagName' type='text' placeholder='请输入标签名' />"
		+ "<input name='" + targetId + "-addTagType' id='" + targetId + "-addTagType' type='hidden' value=''/>"
		+ "<span id='" + targetId + "-loading'></span>"
		+ "<input name='addTagBtn' id='addTagBtn' type='button' onclick=\"addSubjectTagBtn('" + targetId + "')\" value='确定' />"
		+ "<input name='cancelTagBtn' id='cancelTagBtn' type='button' onclick=\"cancelAddSubjectTagBtn('" + targetId +"');\" value='取消' />"
		+ "</div>";

	parent.insertAdjacentHTML('beforeEnd', html);

	$("#"+targetId+"-addTagName").focus();
}

//确认添加标签按钮
function addSubjectTagBtn(targetId) {
	var target = document.getElementById(targetId+"-form");
	if(!target)
		return ;
	var tagName = document.getElementById(targetId+"-addTagName").value;

	if(tagName == ""){
		document.getElementById(targetId+"-addTagName").placeholder = "请输入标签名";
		return;
	}

	var mydata={};
	mydata["objectName"] = "ObjectTag";
	mydata["action"] = "addInfo";
	mydata["tag_name"] = tagName;
	mydata["tag_object"] = TAG_OBJECT;
	mydata["tag_owner"] = myId;

	$.ajax({
		async: true,
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: mydata,
		beforeSend:function(){
			$("#"+targetId+"-loading").html("<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' />");
		},
		success: function(data) {
			$("#"+targetId+"-loading").empty();
			if(data)
			{
				if (data.code==0){
					$("#"+targetId+"-loading").html("<font color='red'>添加成功！</font>");

					//添加新增显示
					var parent = target.parentNode;

					var id = data.value.split("=")[1];
					//恢复添加
					parent.removeChild(target);
					//添加新增的
					showSubjectTag(id, tagName, 1, false);
					//添加自定义标签按钮
					parent.insertAdjacentHTML('beforeEnd',getAddCustomTagHTML());
				}else{
					var errorMsg = "<font color='red'>" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "</font>";
					$("#"+targetId+"-loading").html(errorMsg);
				} //end if (data.code==0)
			}else{
				$("#"+targetId+"-loading").html("<font color='red'>执行失败![data=null]</font>");
			}//end if(data)
		}, //end success: function(data)
		error: function(request) {
			var errorMsg = "<font color='red'>操作失败！[" + request.status + "-" + request.statusText + "]</font>";
			$("#"+targetId+"-loading").html(errorMsg);
		},
		complete:function(){
		}
	});
}

//取消新增标签按钮
function cancelAddSubjectTagBtn(targetId) {
	var target = document.getElementById(targetId+"-form");
	if(!target)
		return ;
	var parent =target.parentNode;
	if(!parent)
		return;

	parent.removeChild(target);
	parent.insertAdjacentHTML('beforeEnd', getAddCustomTagHTML());
}

//删除自定义标签
function removeSubjectTag(targetId) {
	var target = document.getElementById(targetId);
	if(!target)
		return ;
	var parent = target.parentNode;
	if(!parent)
		return;

	parent.removeChild(target);
	//获取被选中的标签对象
	var $li = $(parent).children("li").children("label[title='个人标签']").parent();
	var strHtml = new StringBuffer();
	$li.each(function(index,thisDom){
		strHtml.append("<li>");
		var domStr = $(thisDom).html();
		var attrId = $(thisDom).children("input").attr("id").substr(4);
		domStr = domStr.replace(/onchange=\"countSelectedTagsTotal\(.*\);\"/g, "").replace(/tag_\d*/g, attrId).replace(/checked=\"\w*?\"/g, "");
		strHtml.append(domStr);
		strHtml.append("</li>");
	});

	var sb = new StringBuffer();
	sb.append("<div class='row'>");

	sb.append("<style type='text/css'>#remove_custom_tags{text-align:left;}#remove_custom_tags li{padding: 8px 10px;display: inline-block;}</style>");
	sb.append("<ul id='remove_custom_tags' class='form-group col-xs-12'>");
	sb.append(strHtml.toString());
	sb.append("</ul>");

	sb.append("<div class='col-xs-12 center'>");
	sb.append("<button class='btn btn-success' type='button' onclick=\"removeSubjectTagBtn('");
	sb.append(parent.id);
	sb.append("','remove_custom_tags');\"> 确 定</button>");
	sb.append("<span style='padding:0 10px;'></span>");
	sb.append("<button class='btn btn-danger' type='button' onclick=\"cancelRemoveSubjectTagBtn('");
	sb.append(parent.id);
	sb.append("');\"> 取 消</button>");
	sb.append("</div>");

	sb.append("</div>");

	$("#waiting-modal-dialog").modal("show",null,1);
	$("#waiting-modal-dialog-title").html("删除自定义标签");
	$("#waiting-modal-dialog-body").html(sb.toString());
}

//确认删除标签按钮
function removeSubjectTagBtn(parentId, ulId) {
	var parent = document.getElementById(parentId);
	if(!parent)
		return;
	if(!$("#"+ulId)[0])
		return;

	var $tagsLi = $("#"+ulId).children("li").children("input:checked").parent();
	if($tagsLi.length == 0){
		alert("你还没有选择要删除的标签！");
		return;
	}

	//询问是否删除
	if(!window.confirm("你确定要删除这些标签？")){
		return;
	}

	//存储用户要删除的自定义的标签id
	var objectIds=new StringBuffer();
	for (var i=0; i<$tagsLi.length; i++) {
		var selectedId = $($tagsLi[i]).children("input").attr("id");
		if (selectedId && selectedId>0){
			if(i>0)
				objectIds.append(";");
			objectIds.append(selectedId);
		}
	}

	var ajaxParams = {};
	ajaxParams["objectName"] = "ObjectTag";
	ajaxParams["action"] = "removeList";
	ajaxParams["object-ids"] = objectIds.toString();

	$.ajax({
		type: "post",
		url: tek.common.getRootPath()+"servlet/tobject",
		dataType: "json",
		data: ajaxParams,
		beforeSend: function() {
			$("#waiting-modal-dialog-title").html("<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif'/>  正在删除...");
		},
		success: function(data) {
			if(data){
				if (data.code==0) {
					$("#waiting-modal-dialog-title").html("删除成功");

					//移除自定义标签
					if(data.value == 1) {
						$(parent).children("li").children("input[id*="+objectIds+"]").parent().remove();
					}else if(data.value > 1){
						var removeId = objectIds.toString().split(";");
						for(var i=0; i<data.value; i++){
							$(parent).children("li").children("input[id*="+removeId[i]+"]").parent().remove();
						}
					}

					//改变已选标签数目
					for (var i=0; i<$tagsLi.length; i++) {
						var selectedTag = $($tagsLi[i]).children("label").text();
						var tags = selected_type_tags.split(";");
						for (var j=0; j < selected_type_tags.length; j++)　{
							if(tags[j] == selectedTag) {
								selected_tags_sum--;
								var regExp = new RegExp(";?"+selectedTag, "g");
								selected_type_tags = selected_type_tags.replace(regExp, "");
								if(selected_type_tags.substr(0,1) == ";")
									selected_type_tags = selected_type_tags.substr(1);
								break;
							}
						}
					}

					//关闭选项卡
					cancelRemoveSubjectTagBtn(parentId);
				} else {
					var errorMsg= "<font color='red'>" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "</font>";
					$("#waiting-modal-dialog-title").html(errorMsg);
				}
			} else {
				$("#waiting-modal-dialog-title").html("<font color='red'>删除失败![data=null]</font>");
			} // end if(data) else
		},
		error: function(request) {
			var errorMsg = "<font color='red'>删除失败![" + request.status + " - " + request.statusText + "]</font>";
			$("#waiting-modal-dialog-title").html(errorMsg);
		},
		complete:function(){
			setTimeout(function(){
				$("#waiting-modal-dialog").modal("hide");
			}, 3000);
		}
	});
}

//撤销删除自定义标签
function cancelRemoveSubjectTagBtn(parentId) {
	$('#waiting-modal-dialog').modal('hide');

	var parent = document.getElementById(parentId);
	if(!parent) return;
	//添加自定义标签按钮
	parent.insertAdjacentHTML('beforeEnd', getAddCustomTagHTML());
}

//统计用户选择的标签总数 --限制在5个以内
function countSelectedTagsTotal(dom) {
	if(dom) {
		if(!$(dom)[0])
			return;

		var bl = $(dom).is(":checked");
		if (bl) {
			selected_tags_sum++;
			if (!!selected_type_tags) selected_type_tags += ";";
			selected_type_tags += $(dom).val();
		} else {
			selected_tags_sum--;
			var regExp = new RegExp(";?"+$(dom).val(), "g");
			selected_type_tags = selected_type_tags.replace(regExp, "");
			if(selected_type_tags.substr(0,1) == ";")
				selected_type_tags = selected_type_tags.substr(1);
		}

		//判断是否超过5个
		if(selected_tags_sum > 5){
			$("#waiting-modal-dialog").modal("show",null,0);
			$("#waiting-modal-dialog-title").html(" ");
			$("#waiting-modal-dialog-body").html("<p class='text-center' >标签最多只能选 <span style='color:red;'>5</span> 个</p>");
			setTimeout(function(){
				selected_tags_sum--;
				var regExp = new RegExp(";?"+$(dom).val(), "g");
				selected_type_tags = selected_type_tags.replace(regExp, "");

				$("#waiting-modal-dialog").modal("hide");
				$(dom).removeAttr("checked");
			}, 1000);
		}//end if(selected_tags_sum > 5)

	}//end if(dom)
}


//------------------------------------------------------目录分类-------------------------------------------
//获取目录分类

function getCatalog() {
	if (!$("#object_catalog_ztree")[0])
		return;

	var params = {
		object: "Contact",
		owner: "0"
	};
	console.log("走到了这里吧");
	var setting = {
		callback: {
			success: function (nodes) {
				showSubjectCatalog(nodes);
				openCatalogModal();
				console.log("这里好像也是走到了");
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
function showSubjectCatalog(nodes) {
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
	var zTreeNodes = (function() {
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

				if (oc[i].children.length > 0){
					transform(n.children, oc[i].children);
				}

				tc.push(n);
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
	// alert("点击了");
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
	var fieldName = "contact_catalog";

	var fieldValue = document.getElementById(fieldName);
	if (fieldValue && fieldValue.nodeName){
		fieldValue.value = code;
	}
	var fieldText = document.getElementById(fieldName + "Text");
	if (fieldText && fieldValue.nodeName){
		fieldText.value = name;
	}
}
