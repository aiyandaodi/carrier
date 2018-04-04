// JavaScript Document
/****************************************
 * 用于主题编辑页面 "附件列表" 列文档的操作
 *        文档操作有：查看、编辑、删除、添加（自己编辑的文本）
 *
 ***************************************/
//=====================================================Parameter=============================
var SKIP = 0;				//当前列表显示数量，列表查询起始值
var COUNT = 7;				//每页显示的个数
var TOTAL = 0;				//文件总数
var isContinueLoad = true;	//是否可以继续

//=====================================================Function===============================
//--------------------------------附件列表中 显示文档Icons列表----------------------------
//监听滚动条 为document-list
function docScroll(ele) {
	//判断是否可以读取
	if (!isContinueLoad)
		return;

	if ((ele.scrollLeft + 2) >= (ele.scrollWidth - ele.clientWidth)) {
		getDocumentIcons();
	}//end  if...
}

//【下一页】按钮
function nextPageDocList() {
	//判断是否可以读取
	if (!isContinueLoad)
		return;

	getDocumentIcons();
}

//取得待选的图标
function getDocumentIcons() {
	if (!subjectId)
		return;

	if (!isContinueLoad)	//加载未完成 禁止加载
		return;
	else
		isContinueLoad = false;

	var setting = {operateType: "获取文档图标"};
	var sendData = {
		objectName: "Document",
		action: "getList",
		subject_id: subjectId,
		order: "doc_code",
		skip: SKIP,
		count: COUNT,
		desc: 0
	};
	var callback = {
		beforeSend: function () {
			//【下一页】隐藏按钮
			buttonHide();

			//重置 文件总数标识
			TOTAL = 0;
		},
		success: function (data) {
			//保存文档总数
			TOTAL = parseInt(data.value);

			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				for (var i in records)
					showDocumentIcons(records[i]);
			}
		},
		error: function (data, errorMsg) {
			$("#document-list").html(errorMsg);
		},
		complete: function () {
			//设置 页面显示的数据条数
			if (SKIP < TOTAL && SKIP + COUNT < TOTAL)
				SKIP += COUNT;
			else
				SKIP = TOTAL;

			//判断文件是否全部读取，设置可继续加载标志
			if ((SKIP >= TOTAL && TOTAL > 0) || (TOTAL == 0)) {
				isContinueLoad = false;	//文件全部读取，停止加载
			} else {
				isContinueLoad = true;//文件未全部读取，可以继续加载
			}

			//按钮是否显示
			isButtonShow();
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


//显示图标 刷新读取：operate=undefined；新建：operate="addInfo"；编辑:operate="setInfo"；
function showDocumentIcons(record, operate) {
	if (record) {
		var docMime;
		if (record.doc_mime)
			docMime = record.doc_mime.show;

		var id = record.id;
		var name = record.name;

		var html = "<li id='document" + id + "' doc-data='" + id + "'>"
			+ "<a doc-data='" + id + "' class='' ";

		var isInput = "noinput";

		if (docMime && docMime.length > 0) {
			var fileName;    // 文件名
			var loc = docMime.indexOf("name=");
			if (loc >= 0) {
				fileName = docMime.substring(loc + 5);
				loc = fileName.indexOf(";");
				if (loc > 0)
					fileName = fileName.substring(0, loc);
			}

			var url = !!record.doc_path ? record.doc_path.show : "";

			//MIME
			docMime = tek.dataUtility.getMimeType(docMime);

			if (!docMime || (docMime.indexOf("text") > -1 || docMime.indexOf("html") > -1)) {
				//文本、网页
				if (url == "") {
					// BLOB数据
					if (fileName && fileName.endsWith(".html")
						&& (fileName.startsWith("input") || fileName.startsWith("subject")))
						isInput = "input";
				}

				html += " title='" + name + "' onclick=\"openDocument('" + id + "','" + name + "','" + fileName + "','" + url + "','" + isInput + "',this);\" doc-type='text' >"
					+ "<img src='images/text.png'/>";

			} else if (docMime.indexOf("image") > -1) {
				//图片
				url = url || "download/download.jsp?doc_id=" + id;
				url = tek.common.appendRandomParam(url);

				html += " title='" + name + "' onclick=\"openDocument('" + id + "','" + name + "','" + fileName + "','" + url + "','" + isInput + "',this);\" doc-type='image'>"
					+ "<img src='" + url + "'/>";

			} else if (docMime.indexOf("audio/") >= 0) {
				html += " title='" + name + "' onclick=\"openDocument('" + id + "','" + name + "','" + fileName + "','" + url + "','" + isInput + "',this);\" doc-type='audio'>"
					+ "<img src='images/audio.png'/>";
			} else if (docMime.indexOf("video/") >= 0) {
				html += " title='" + name + "' onclick=\"openDocument('" + id + "','" + name + "','" + fileName + "','" + url + "','" + isInput + "',this);\" doc-type='video'>"
					+ "<img src='images/video.png'/>";
			} else if (docMime.indexOf("application/vnd.rn-realmedia") >= 0) {
				html += " title='" + name + "' onclick=\"openDocument('" + id + "','" + name + "','" + fileName + "','" + url + "','" + isInput + "',this);\" doc-type='application/vdn'>"
					+ "<img src='images/video.png'/>";
			} else if (docMime.indexOf("application/x-shockwave-flash") >= 0 || docMime.indexOf("video/x-flv") > -1) {
				html += " title='" + name + "' onclick=\"openDocument('" + id + "','" + name + "','" + fileName + "','" + url + "','" + isInput + "',this);\" doc-type='application/x' >"
					+ "<img src='images/video.png'/>";
			} else {
				html += " title='" + name + "' onclick=\"openDocument('" + id + "','" + name + "','" + fileName + "','" + url + "','" + isInput + "',this);\" doc-type='other' >"
					+ "<img src='images/other.png'/>";
			}
		} else {
			html += " title='" + name + "' onclick=\"openDocument('" + id + "','" + name + "','" + fileName + "','" + url + "','" + isInput + "',this);\" doc-type='text' >"
				+ "<img src='images/text.png'/>";
		}//end if(docMime && docMime.length > 0)
		html += "</a>"

			+ "<div class='a-span'>"
			+ "<span><i class='fa fa-sort-down'></i></span>"
			+ "<div class='toggle-a-span'>"
		if(!docMime || (docMime.indexOf("text") > -1 || docMime.indexOf("html") > -1)){
			html +=  "<div class='toggle-a-span-a'>"
				+ "<a id='list-doc-edit-" + id + "' class='fa fa-edit' title='编辑文档' onclick=\"editDocumentBtn('" + id + "','" + record.name + "','" + isInput + "',this);\">编辑</a>"
				+ "</div>"
		}
			/*+ "<a id='list-doc-edit-" + id + "' class='fa fa-edit' title='编辑文档' onclick=\"editDocumentBtn('" + id + "','" + record.name + "','" + isInput + "',this);\">编辑</a>"
			+ "</div>"*/
		html += "<div class='toggle-a-span-a'>"
			+ "<a id='list-doc-" + id + "' class='fa fa-times' title='移除文档' onclick=\"removeDocument('" + id + "','" + record.name + "',this);\"> 删除</a>"
			+ "</div>"
			+ "</div>"	//end.toggle-a-span
			+ "</div>"	//end.a-span

			+ "</li>";

		if (operate) {
			if (operate == "addInfo") {
				$("#document-list").append(html); //添加
			} else if (operate == "setInfo") {
				$("#document" + id).replaceWith(html); //替换
			}
		} else {
			var $docListEnd = $("#document-list-button");
			if ($docListEnd)//结尾添加
				$docListEnd.before(html);
			else
				$("#document-list").append(html);
		}
	}
}


//-----------------------------------------------预览文档---------------------------------
//打开指定文档
function openDocument(docId, docName, fileName, url, isInput, ele) {
	var docType = $(ele).attr("doc-type");
	url = url || "download/download.jsp?doc_id=" + docId;
	url = tek.common.appendRandomParam(url);
    docName=tek.dataUtility.stringToHTML(docName);
	
	$("#opendoc-modal-dialog-button>button:first").attr("onclick", "editDocumentBtn('" + docId + "','" + docName + "','" + isInput + "',this);");
	$("#opendoc-modal-dialog-button>button:last").attr("onclick", "removeDocument('" + docId + "','" + docName + "',this);");

	if (docType) {
		if (docType == "text") {
			$.get(url, function (data) {
				data = checkText(data, fileName);

				if (data != null) {
					var html = "<div class='text-content padding-s' style='overflow:auto;'>" + data + "</div>";
					opendocDialogShow(docName, html); //预览文档图层显示
				}//end if(data != null)
			});
		} else {
			var html = setDocumentContent(docType, url); //装备非文本文件显示域
			opendocDialogShow(docName, html);//预览文档图层显示
		}
	}
}

//修正text字符串  text:字符串;fileName:文件名
function checkText(text, fileName) {
	if (!text)
		return text;

	if (typeof text == "string") {
		// 字符串
		if (fileName && !tek.dataUtility.isWebPage(fileName)) {
			text = tek.dataUtility.stringToHTML(text);
		} else {
			text = tek.dataUtility.checkLoadHTML(text);
		}
	} else if (typeof(text) == "") {
		// XML
		text = xmlToString(text);
		text = tek.dataUtility.stringToHTML(text);
	}

	return text;
}

//装备非文本文件显示域
function setDocumentContent(docType, url) {
	var html = "";

	if (docType == "image") {
		html += "<div class='text-content text-center padding-s'><img class='doc-img' width='100%' src='" + url + "' /></div>";
	} else if (docType == "video" || docType == "audio") {
		html += "<div class='text-content text-center padding-s'>"
			+ "<embed style='width:100%' type='video/quicktime' pluginspage='http://www.apple.com/quicktime/download/' target='quicktimeplayer' src='" + url + "' href='" + url + "' ></embed>"
			+ "</div>";
	} else if (docType == "application/vdn") {
		html += "<div class='text-content text-center padding-s'>"
			+ "<object style='width:100%' class='bottom-border' classid='clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA'>"
			+ "<param name='AUTOSTART' value=1 />"
			+ "<param name='SRC' value='" + url + "' />"
			+ "<param name='CONTROL' value='ImageWindow,ControlPanel,StatusBar' />"
			+ "<embed src='" + url + "' CONTROLS='ImageWindow,ControlPanel,StatusBar' type='audio/x-pn-realaudio-plugin' autostart='true' ></embed>"
			+ "</object>"
			+ "</div>";
	} else if (docType == "application/x") {
		html += "<div class='text-content text-center padding-s'>"
			+ "<object style='width:100%' class='bottom-border' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab' >"
			+ "<param name='movie' value='" + url + "' />"
			+ "<param name='PLAY' value='true' />"
			+ "<param name='quality' value='high' />"
			+ "<embed src='" + url + "' pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' type='application/x-shockwave-flash' loop='true' play='true' ></embed>"
			+ "</object>"
			+ "</div>";
	} else {
		html += "<div class='text-content text-center padding-s'></div>";
	}

	return html;
}

//预览文档图层显示
function opendocDialogShow(title, msg) {
	if (title)
		$("#opendoc-modal-dialog-title").html(title);

	if (msg)
		$("#opendoc-modal-dialog-body").html(msg);

	if ($("#opendoc-modal-dialog").is(":hidden")) {
		$("#opendoc-modal-dialog").modal("show", null, 0);
	}
}

//预览文档图层隐藏
function opendocDialogHide() {
	if ($("#opendoc-modal-dialog").is(":visible")) {
		$("#opendoc-modal-dialog").modal("hide");

		$("#opendoc-modal-dialog-title").empty();
		$("#opendoc-modal-dialog-body").empty();
	}
}

//---------------------------------------------------删除文档--------------------------------
//移除文档
function removeDocument(docId, docName, ele) {
	if (!ele)
		return;

	var html = "确定移除文档[" + docName + "]? <a type='button' class='btn' onclick='removeDocumentBtn(\"" + docId + "\");' >确定</a>"
		+ "<a type='button' class='btn' onclick='cancelRemoveDocumentBtn();'>取消</a>";
	//等待图层显示
	tek.macCommon.waitDialogShow("移除文档-" + docName, html);
}


//移除文档提交
function removeDocumentBtn(docId) {
	var target = document.getElementById('list-doc-' + docId);
	if (!target)
		return;

	var setting = {operateType: "确认删除文档"};
	var sendData = {
		objectName: "Document",
		action: "removeInfo",
		doc_id: docId
	};
	var callback = {
		beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");

			var $parent = $("#list-doc-" + docId).parents("li");
			if ($parent) {
				$parent.remove(); //删除页面上已不存在的文档
				TOTAL--;	//文档总数减一
				SKIP--;	//显示数量减一
			}
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogHide();
			showError(errorMsg);
		},
		complete: function () {
			if (TOTAL == 0)
				isContinueLoad = false;

			//判断一次是否显示按钮
			isButtonShow();

			setTimeout(function () {
				//等待图层隐藏
				tek.macCommon.waitDialogHide();
				//预览文档图层隐藏
				opendocDialogHide();
			}, 200);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//取消提交
function cancelRemoveDocumentBtn() {
	//等待图层隐藏
	tek.macCommon.waitDialogHide();
}

//---------------------------------------------------新建文档域------------------------------------------------------------
//新增文档
function addDocumentPlusBtn() {
	if (!subjectId)
		return;

	var url = tek.common.getRootPath() + "http/takall/subject/document.html?subject_id=" + subjectId
		+ "&refresh-opener=1"
		+ (!!request["refresh-opener-func"] ? "&refresh-opener-func=" + request["refresh-opener-func"] : "")
		+ "&callback-url=" + encodeURIComponent(location.href);
	window.open(url);
}
//--------------------------------------------------编辑文档域---------------------------------------------
//编辑文档按钮

function editDocumentBtn(id, name, input) {
	if (!subjectId)
		return;

	var url = tek.common.getRootPath() + "http/takall/subject/document.html?subject_id=" + subjectId + "&document_id=" + id + "&input_type=" + input
		+ "&refresh-opener=1"
		+ (!!request["refresh-opener-func"] ? "&refresh-opener-func=" + request["refresh-opener-func"] : "")
		+ "&callback-url=" + encodeURIComponent(location.href);
	window.open(url);
}
//-----------------------------------------------------通用函数(仅限于当前js文件中)--------------------------------
//【下一页】隐藏按钮
function buttonHide() {
	if ($("#document-list-button")[0]) {
		$("#document-list-button > a").removeAttr("onclick");
		$("#document-list-message > span:first").hide();
		//数据加载等待框
		$("#document-list-message > span:last").show().html("<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />");
	}
}

//【下一页】按钮是否显示
function isButtonShow() {
	if (isContinueLoad) {
		if ($("#document-list-button")[0]) {
			//显示按钮域
			if ($("#document-list-button").is(":hidden"))
				$("#document-list-button").show();
			//显示按钮
			$("#document-list-button > a").attr("onclick", "nextPageDocList();");
			$("#document-list-message > span:first").show();
			//隐藏加载等待图标
			//$("#document-list-message > span:last").hide();
		}
	} else {
		if ($("#document-list-button")[0]) {
			//隐藏按钮
			if (TOTAL == 0) {
				$("#document-list-button").show();
				$("#document-list-button > a").removeAttr("onclick");
				$("#document-list-message > span:first").hide();
				//	$("#document-list-message > span:last").show().html("没有数据");
				$("#document-list-message > span:last").show().html("");
			} else {
				$("#document-list-button").hide();
			}
		}
	}
}
//--------------------------------------------------------END-------------------------------------------------