// JavaScript Document
/*******************************************************
 * 本文件用于文件的上传
 *        支持文件拖拽自动长传 和 手动添加自动上传
 *
 *        包括文件的编辑或者新增
 *        通过 DOCUEMNT_UPLOAD_TYPE.action 来判断是否是新增还是编辑
 *
 * 需要加载 ajaxfileupload.js
 *
 *******************************************************/
//=====================================================Parameter=============================
var MAX_DROP_UPLOAD_COUNT_PER = 10;	//拖拽一次允许的大多文件数

//=====================================================Function===============================
//拖拽上传完文件
$(function ($) {

	//覆盖显示样式
	$('#drop_zone_home').hover(function () {
		$(this).children('[id*="dtb-msg"]').stop().animate({top: '0px'}, 200);
	}, function () {
		$(this).children('[id*="dtb-msg"]').stop().animate({top: '-44px'}, 200);
	});

	var browser = tek.common.getBrowser(); //获取浏览器类型 调用common.js中的方法//如果是ie 返回IE版本(ie9以上支持拖拽上传)
	if (browser.safari || browser.firefox || browser.chrome || browser.ie > 9) {

		//功能实现
		$(document).on({
			dragleave: function (e) {
				e.preventDefault();
				$('.dashboard_target_box').removeClass('over');
			},
			drop: function (e) {
				e.preventDefault();
				//$('.dashboard_target_box').removeClass('over');
			},
			dragenter: function (e) {
				e.preventDefault();
				$('.dashboard_target_box').addClass('over');
			},
			dragover: function (e) {
				e.preventDefault();
				$('.dashboard_target_box').addClass('over');
			}
		});

		//拖入监听
		var box = document.getElementById("target_box");
		if (box) {
			box.addEventListener("drop", function (e) {
				e.preventDefault();

				//获取文件列表
				var fileList = e.dataTransfer.files;
				if (!fileList) {
					return alert("浏览器不支持拖拽!");
				}

				var length = fileList.length;
				if (DOCUEMNT_UPLOAD_TYPE.action == "setInfo") {
					if (length > 1) {
						alert("编辑文档只允许拖拽1个文件!");
						$('.dashboard_target_box').removeClass('over');
						return;
					}
				}
				if (length > MAX_DROP_UPLOAD_COUNT_PER) {
					alert("一次最多允许拖拽上传 " + MAX_DROP_UPLOAD_COUNT_PER + " 个文件!");
					$('.dashboard_target_box').removeClass('over');
					return;
				}
				//检测是否是拖拽文件到页面的操作
				if (length == 0) {
					$('.dashboard_target_box').removeClass('over');
					return;
				}

				//-----------ajax准备----------
				var xhr = new XMLHttpRequest();
				xhr.onloadstart = function (e) {
					var waitImg = "<p class='text-center'><img src='"
						+ tek.common.getRootPath() + "http/images/waiting-small.gif'/> 文档"
						+ ((DOCUEMNT_UPLOAD_TYPE.action == "setInfo") ? "编辑" : (DOCUEMNT_UPLOAD_TYPE.action == "setInfo") ? "新建" : "")
						+ "保存中，请稍候!</p>";
					tek.macCommon.waitDialogShow(null, waitImg);

					$("#dtb-msg4").children('span').show().eq(1).css({width: '0'});
				};
				xhr.onprogress = function (e) {
					if (e.lengthComputable)
						$("#dtb-msg4").children('progress').val(e.loaded / e.total);
				};
				xhr.onload = function (e) {
					var errorMsg = "";
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
						var data = jQuery.parseJSON(xhr.responseText || xhr.response);
						if (data) {
							if (data.code == 0) {
								var msg = "<p class='text-center'>" + data.message + "</p>";

								/*if (typeof updateOpener != "undefined" && !!updateOpener) {
									// 刷新父页面
									tek.refresh.refreshOpener();
								}

								if (typeof showClose != "undefined" && !!showClose) {
									// 关闭
									var timerMsg = "页面<font id='counter' color='red'></font>秒后自动关闭";
									tek.macCommon.waitDialogShow(null, msg, timerMsg, 2);
									tek.macCommon.waitDialogHide(3000, "window.close()");

								} else if (typeof callbackURL != "undefined" && !!callbackURL) {
									// 跳转
									var timerMsg = "页面<font id='counter' color='red'></font>秒后自动跳转";
									tek.macCommon.waitDialogShow(null, msg, timerMsg, 2);
									tek.macCommon.waitDialogHide(3000, "location.href='" + callbackURL + "'");

								} else {
									tek.macCommon.waitDialogShow(null, msg);
									tek.macCommon.waitDialogHide(3000);
								}*/
								tek.macCommon.waitDialogShow(null, msg);
								tek.macCommon.waitDialogHide(1500);
								setTimeout(function(){
									location.reload();
								},1500)
							} else {
								errorMsg = data.code + " - " + tek.dataUtility.stringToHTML(data.message);
							}
						} else {
							errorMsg = "执行失败！[data=null]";
						}
					} else {
						errorMsg = "操作失败！[" + xhr.status + " - " + xhr.response + "]";
					}
					if (errorMsg) {
						tek.macCommon.waitDialogShow(null, "<p class='text-center'><font color='red'>" + errorMsg + "</font></p>");
						tek.macCommon.waitDialogHide(3000);
					}
				};
				xhr.onerror = function (e) {
					var error = "<p class='text-center'><font color='red'>操作失败！[" + xhr.status + " - " + xhr.response + "]</font></p>";
					showError(error);
				};
				xhr.onloadend = function (e) {
					$(".dashboard_target_box").removeClass('over');
					$("#dtb-msg4").children('progress').val(0);
				};
				//-----------end ajax准备----------

				var fd = new FormData();
				fd.append("objectName", "Document");
				fd.append("action", DOCUEMNT_UPLOAD_TYPE.action);	//action

				if (DOCUEMNT_UPLOAD_TYPE.action == "setInfo") {	//编辑
					fd.append("doc_id", DOCUEMNT_UPLOAD_TYPE.id);
					fd.append("doc_blob", fileList[0]);
				} else {											//新增
					fd.append('file-name', fileList[0].name);
					fd.append('clear-temp', "1");
					fd.append('subject_id', subjectId);

					var uploadIds = "";
					for (var i = 0; i < length; i++) {
						if (!fileList[i])
							continue;
						fd.append('uploadFile' + i, fileList[i]);
						uploadIds += i + ";";
					}//end for(var i = 0 ;i< length;i++)

					fd.append('uploadIds', uploadIds);
				}//end if(DOCUEMNT_UPLOAD_TYPE.action == "setInfo") else

				//输入字段值
				var form = document.getElementById("document_form");
				if (form) {
					if (form.doc_code && form.doc_code.value != "")
						fd.append("doc_code", form.doc_code.value);
					if (form.doc_name && form.doc_name.value != "")
						fd.append("doc_name", form.doc_name.value);
					if (form.doc_author && form.doc_author.value != "")
						fd.append("doc_author", form.doc_author.value);
					if (form.doc_keywords && form.doc_keywords.value != "")
						fd.append("doc_keywords", form.doc_keywords.value);
					if (form.doc_summary && form.doc_summary.value != "")
						fd.append("doc_summary", form.doc_summary.value);
				}//end if(form)

				xhr.open("POST", tek.common.getRootPath() + "servlet/document", true);

				xhr.send(fd);

				//window.URL.revokeObjectURL (file); ///////////
			}, false);	//end box.addEventListener("drop",function(e)
		}
	} else {
		//不支持拖动，点击上传
		$("#dtb-msg1").html("浏览器不支持拖动上传<br>点击这里上传");
	}
});

//-----------------------------------------------------------------------
// ajax 手动上传文件
// 包括文件的编辑或者新增
// 通过DOCUEMNT_UPLOAD_TYPE.action来判断是否是新增还是编辑
function uploadFileBtn() {
	var form = document.getElementById("edit-form");
	if (!form)
		return;

	//点击触发上传空间，移除上传触发事件，防止重复上传
	$("#uploadFile0").attr("onchange", "");

	var myFileElementId = "uploadFile0";

	var mydata = {};
	mydata["objectName"] = "Document";
	mydata["action"] = DOCUEMNT_UPLOAD_TYPE.action;	//action

	var typeShow = "新建";
	if (DOCUEMNT_UPLOAD_TYPE.action == "setInfo") {	//编辑
		myFileElementId = "doc_blob";
		typeShow = "编辑";
		mydata["doc_id"] = DOCUEMNT_UPLOAD_TYPE.id;
	} else {	//新增
		mydata["uploadIds"] = "0";
		mydata["file-name"] = getFileName($("#uploadFile0").val());
		mydata["clear-temp"] = 1;
		mydata["subject_id"] = subjectId;
	}//end if(DOCUEMNT_UPLOAD_TYPE.action == "setInfo") else


	if (form.doc_code && form.doc_code.value)
		mydata["doc_code"] = form.doc_code.value;
	/*var content = $('#document_content').summernote('code');
	if (content)
		mydata["document_input"] = content.replace(/"/g, "'");*/
	if (form.doc_name && form.doc_name.value)
		mydata["doc_name"] = form.doc_name.value.replace(/"/g, "'");
	if (form.doc_author && form.doc_author.value)
		mydata["doc_author"] = form.doc_author.value.replace(/"/g, "'");
	if (form.doc_summary && form.doc_summary.value)
		mydata["doc_summary"] = form.doc_summary.value.replace(/"/g, "'");

	//上传进度条
	var int = setInterval(function () {
		var $p = $("#dtb-msg4").children('progress');
		var v = parseFloat($p.val()) + 0.004;
		$p.val(v);
		if (v >= 0.6)
			window.clearInterval(int);
	}, 10);

	//显示等待图标
	var waitImg = "<p class='text-center'><img src='"
		+ tek.common.getRootPath() + "http/images/waiting-small.gif'/> 文档"
		+ ((DOCUEMNT_UPLOAD_TYPE.action == "setInfo") ? "编辑" : (DOCUEMNT_UPLOAD_TYPE.action == "setInfo") ? "新建" : "")
		+ "保存中，请稍候!</p>";
	tek.macCommon.waitDialogShow(null, waitImg);

	$.ajaxFileUpload({
		url: tek.common.getRootPath() + 'servlet/document', //上传文件的服务端
		secureuri: false,  //是否启用安全提交
		dataType: 'json',   //数据类型
		type: 'post',
		fileElementId: myFileElementId, //表示文件域ID
		data: mydata,
		success: function (data, status) {
			var errorMsg = "";
			if (data) {
				if (data.code == 0) {
					var int = setInterval(function () {
						var $p = $("#dtb-msg4").children('progress');
						var v = parseFloat($p.val()) + 0.008;
						$p.val(v > 1 ? 1 : v);
						if (v >= 1)
							window.clearInterval(int);
					}, 10);

					var msg = "<p class='text-center'>" + data.message + "</p>";

					if (typeof updateOpener != "undefined" && !!updateOpener) {
						// 刷新父页面
						tek.refresh.refreshOpener();
					}

					/*if (typeof showClose != "undefined" && !!showClose) {
						// 关闭
						var timerMsg = "页面<font id='counter' color='red'></font>秒后自动关闭";
						tek.macCommon.waitDialogShow(null, msg, timerMsg, 2);
						tek.macCommon.waitDialogHide(3000, "window.close()");

					} else if (typeof callbackURL != "undefined" && !!callbackURL) {
						// 跳转
						var timerMsg = "页面<font id='counter' color='red'></font>秒后自动跳转";
						tek.macCommon.waitDialogShow(null, msg, timerMsg, 2);
						tek.macCommon.waitDialogHide(3000, "location.href='" + callbackURL + "'");

					} else {
						tek.macCommon.waitDialogShow(null, msg);
						tek.macCommon.waitDialogHide(3000);
					}*/
					setTimeout(function(){
						location.reload();
					},1500)
					// tek.macCommon.waitDialogHide(3000);
				} else {
					errorMsg = "执行失败！[" + data.code + " - " + tek.dataUtility.stringToHTML(data.message) + "]";
				}
			} else {
				errorMsg = "执行失败！[data=null]";
			}
			if (errorMsg) {
				var int = setInterval(function () {
					var $p = $("#dtb-msg4").children('progress');
					var v = parseFloat($p.val()) - 0.008;
					$p.val(v > 0 ? v : 0);
					if (v <= 0)
						window.clearInterval(int);
				}, 10);

				tek.macCommon.waitDialogShow(null, "<p class='text-center'><font color='red'>" + errorMsg + "</font></p>");
				tek.macCommon.waitDialogHide(3000);
			}
		},
		error: function (xhr) {
			var error = "<p class='text-center'><font color='red'>操作失败！[" + xhr.status + " - " + xhr.response + "]</font></p>";
			showError(error);
		},
		complete: function () {
			//点击触发上传空间，恢复上传触发事件
			$("#uploadFile0").attr("onchange", "uploadFileBtn()");
		}
	});
}


//--------------------------------------------功能方法（仅为本js文件内部使用）--------------------------------------
//获取文件名
function getFileName(filePath) {
	if (!filePath)
		return filePath;
	var loc = filePath.lastIndexOf("\\");
	if (loc > -1) {
		return filePath.substring(loc + 1, filePath.length);
	}
	return filePath
}


//--------------------------------------------------------END-------------------------------------------------