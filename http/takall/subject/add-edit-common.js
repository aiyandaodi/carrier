// JavaScript Document
/**************************************************
 *    新建 & 编辑页面通用的js文件 add-edit-common.js
 *
 *        有关主题新建和编辑页 类型、标签、目录 的操作，时间的换算
 *
 **************************************************/
//=====================================================Parameter=============================
var DIC_OBJECT = "Subject";    // 默认字典对象名
var TAG_OBJECT = "Subject";    // 默认标签对象名

var groupId;    // 所属小组标识

var selected_tags_sum = 0;	//已经选中标签数总和
var selected_tags = ""; //存储主题的标签，用于新建、编辑主题
//=====================================================Function===============================
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
        dictionary_targetObject: DIC_OBJECT,
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


//获取发布频道分类
function getkeywordsType(subjectKeywords) {

    if (!$("#subject_keywords_ul").length)
        return;
    var setting = {operateType: ""};
    var sendData = {
        objectName: "ObjectDictionary",
        action: "getList",
        dictionary_targetObject: DIC_OBJECT
    };
    var callback = {
        success: function (data) {
            $("#subject_keywords_ul").empty();	//清空

            var records = data["record"];
            if (records) {
                records = !records.length ? [records] : records;
                for (var i in records)
                    showSubjectkeywordsType(records[i], subjectKeywords, i);
            } else {
                $("#subject_keywords_ul").html("字典配置(ObjectDictionary)中未配置！");
            }
        },
        error: function (data, errorMsg) {
            $("#subject_keywords_ul").html(errorMsg);
        },
        complete: function () {
            //隐藏或显示
            isShowSubjectkeywordsForStartAndEnd();
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示主题类型
function showSubjectType(record, subjectType, index) {
    if (!record || !record.name)
        return;

    var typeName = record.name;
    var typevalue = record['dictionary_property'] && record['dictionary_property'].value || '';

    var html = "<li>"
        + "<input name='subject_type' type='radio' onchange=\"changeSubjectType('" + typeName
        + "');\" id='subject_type_" + index + "' value='" + typeName + "' ";
    if (subjectType) {
        if (parseInt(subjectType) == parseInt(typevalue))
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

//显示发布频道类型
function showSubjectkeywordsType(record, subjectKeywords, index) {
    if (!record || !record.name)
        return;

    var typeName = record.name;

    var html = "<li>"
        + "<input name='subject_keywords' type='radio' onchange=\"changeSubjectKeywords('" + typeName
        + "');\" id='subject_keywords_" + index + "' value='" + typeName + "' ";
    if (subjectKeywords) {
        if (subjectKeywords === typeName)
            html += "checked";
    } else {
        if (parseInt(index) == 0)
            html += "checked";
    }
    html += " />"
    + "<label class='form-horizontal' for='subject_keywords_" + index + "' >" + typeName + "</label>"
    + "</li>";

    $("#subject_keywords_ul").append(html);
}
//刷新类型下的标签
function changeSubjectType(tagType) {
    if (!tagType)
        return;

    //隐藏或显示 开始结束时间
    isShowSubjectForStartAndEnd(tagType);
    isShowSubjectkeywordsForStartAndEnd(tagType);
}

//隐藏或显示 目录分类
function isShowSubjectForStartAndEnd(tagType) {
    if (!tagType) {
        tagType = $("div#subject_type_form input:checked").val();

        if (!tagType)
            return;
    }

    if (tagType == "问答") {
        $("div#zhutimulu").removeClass("hidden"); //目录列表

    } else {
        $("div#zhutimulu").addClass("hidden");
        //$("div#subject_end_form").addClass("hidden");
    }
    if (tagType == "问答") {
        $("div#subject_start_form").removeClass("hidden");
        $("div#subject_end_form").removeClass("hidden");
    } else {
        $("div#subject_start_form").addClass("hidden");
        $("div#subject_end_form").addClass("hidden");
    }

}

function isShowSubjectkeywordsForStartAndEnd(tagType) {

    if (!tagType) {
        tagType = $("div#subject_type_form input:checked").val();

        if (!tagType)
            return;
    }

    /*if (tagType == "需求信息") {
        $("div#subject_keywords_form").removeClass("hidden"); //需求信息三类
    }
    if (tagType == "信息百科") {
        $("div#subject_keywords_form").addClass("hidden"); //会展类型三类
    }
    if (tagType == "会展信息") {
        $("div#subject_keywords_form").addClass("hidden"); //会展类型三类
    }
    if (tagType == "攻略") {
        $("div#subject_keywords_form").addClass("hidden"); //会展类型三类
    }
    if (tagType == "会展信息") {
        $("div#subject_start_form").removeClass("hidden");
        $("div#subject_end_form").removeClass("hidden");
    } else {
        $("div#subject_start_form").addClass("hidden");
        $("div#subject_end_form").addClass("hidden");
    }*/
	if (tagType == "问答") {
        $("div#subject_start_form").removeClass("hidden");
        $("div#subject_end_form").removeClass("hidden");
    }

}
//隐藏或显示 发布时间
/*function isShowSubjectForDate(isShow) {
 if(isShow == true) {
 $("div#subject_date_form").removeClass("hidden");
 } else {
 $("div#subject_date_form").addClass("hidden");
 }
 }*/

//------------------------------------------------------标签分类-------------------------------------------
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
            //检测是否可以添加自定义标签
            if (tek.tag.isCanCreate(myId))
                $("#subject_tags_ul").append(getAddCustomTagHTML());
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

//显示标签列表
function showSubjectTags(tags, subjectTags) {
    if (!tek.type.isArray(tags) || tags.length <= 0){
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
        if (tek.type.isEmpty(id) || tek.type.isEmpty(name)){
            continue;
        }
        var type = (owner == "0") ? 0 : 1; // 公共或个人标签，0-公共 1-个人

        showSubjectTag(id, name, type, isSubjectTagChecked(subjectTagArr, name));
    }
}

//显示标签
function showSubjectTag(id, name, type, isChecked) {
    if (tek.type.isEmpty(id) || tek.type.isEmpty(name))
        return;

    var html = "<li>"
        + "<input name='subject_tags' type='checkbox' id='tag_" + id + "' value='" + tek.dataUtility.stringToHTML(name)
        + "' onchange='countSelectedTagsTotal(this)'" + (isChecked ? " checked" : "") + " />"
        + "<label class='form-horizontal " + ((type == 0) ? "tag-public" : "tag-owner")
        + "' for='tag_" + id + "' title='" + (type == 0 ? "公共标签" : "个人标签") + "'>" + tek.dataUtility.stringToHTML(name) + "</label>"
        + "</li>";

    $("#subject_tags_ul").append(html);
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

            if(selected_tags.length == 0){
                selected_tags = newTag.name;
            }else{
                selected_tags += ';' + newTag.name;
            }

            //添加新增显示
            var parent = target.parentNode;
            //恢复添加
            parent.removeChild(target);
            //添加新增的
            showSubjectTag(newTag.id, newTag.name, 1, true);
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
        + "<button class='btn btn-success' type='button' onclick=\"removeSubjectTagBtn('" + parent.id + "','remove_custom_tags');\"> 确 定</button>"
        + "<span style='padding:0 10px;'></span>"
        + "<button class='btn btn-danger' type='button' onclick=\"cancelRemoveSubjectTagBtn('" + parent.id + "');\"> 取 消</button>"
        + "</div>"
        + "</div>";

    tek.macCommon.waitDialogShow("删除自定义标签", html, null, 1);
}

//确认删除标签按钮
function removeSubjectTagBtn(parentId, ulId) {
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
            cancelRemoveSubjectTagBtn(parentId);
        },
        function (errorMsg) {
            tek.macCommon.waitDialogShow(null, "<font color='red'>" + errorMsg + "</font>");
            setTimeout(cancelRemoveSubjectTagBtn, 3000, parentId);
        });
}

//撤销删除自定义标签
function cancelRemoveSubjectTagBtn(parentId) {
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
//获取目录分类（当前目录:subjectCatalog，编辑时用）
function getCatalog(subjectCatalog) {

    if (!$("#object_catalog_ztree").length)
        return;
	//alert("subjectType="+subjectType);
	var catalogType;
	/*switch (parseInt(subjectType)){
		case 1:catalogType="SubjectQuestion";
		//alert("1");
			break;
		case 2:catalogType="SubjectPhotos";
			break;
        case 3: catalogType="SubjectBaike";
            break;
        case 4: catalogType="SubjectNotice";
            break;
	}*/
	catalogType = "Subject";
    var params = {
        object: catalogType,
        owner: "0",
    };

    var setting = {
        callback: {
            success: function (nodes) {
                //显示主题目录树
                if(curCatalog){
                    var newNodes = tek.catalog.getNodesByParam('code', curCatalog);
                    showSubjectCatalog(newNodes, subjectCatalog);
                }else{
                    showSubjectCatalog(nodes, subjectCatalog);
                }
                // console.log(subjectCatalog);

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
    //console.log(nodes);
    // var nodes1 = tek.catalog.getNodesByParam('code', curCatalog);
    // console.log(nodes1);

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
        // 点击的是节点，响应选中目录
        hideCatalogModal();
        selectCatalog(treeNode.code, treeNode.namee);
    }
}

//打开目录选择模态框
function openCatalogModal() {
    $("#catalog-modal-dialog").modal("show");
}

function hideCatalogModal() {
    $("#catalog-modal-dialog").modal("hide");
}

//选中目录
function selectCatalog(code, name) {
    code = code || "";
    name = name || "";
    var fieldName = "subject_catalog";

    var fieldValue = document.getElementById(fieldName);
    if (fieldValue && fieldValue.nodeName)
        fieldValue.value = code;
    var fieldText = document.getElementById(fieldName + "Text");
    if (fieldText && fieldValue.nodeName)
        fieldText.value = name;
}

//----------------------------------------------------主题状体改变----------------------------------------------
//主题状态改变，判断发布时间是否显示
function subjectStatusOnChange(selectedStatus) {
    //发布时间
    /*var tagType = $("div#subject_type_form input:checked").val(); //主题类型
     if(tagType == "活动" && parseInt(selectedStatus) == 1) { //状态：发布-1
     isShowSubjectForDate(true);
     } else {
     isShowSubjectForDate(false);
     }*/
}

//----------------------------------------------------通用方法--------------------------------------------------
//将序列化字符串转化为JSON参数
function strToJSON(str) {
    var mydata = {};


    var array = str.split("&");
    for (var i = 0; i < array.length; i++) {
        var array2 = array[i].split("=");
        if (mydata.subject_tags && mydata.subject_tags != "" && array2[0] == "subject_tags") {
            mydata[array2[0]] = mydata.subject_tags + ";" + array2[1].replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
        } else {
            mydata[array2[0]] = array2[1].replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
        }
    }

    return mydata;
}

//-----------------------------------------------------------End------------------------------------------