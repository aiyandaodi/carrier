// JavaScript Document
var userId;

var options;
var cropper;
var cropPos;

/**
* 初始化
*/
function init(){
userId=request["user_id"];
if(!userId){
  if(request["my"])
	userId=myId;
}

cropPos={
	x:0,    //
	y:0,
	width:0,    //裁剪部分的宽和高
	height:0,
	picW:0,    //图片原来的宽和高
	picH:0,
	zoom:1
}

var url="";
options={
	thumbBox: '.thumbBox',
	spinner: '.spinner',
	imgSrc:url
};

cropper = $('.imageBox').cropbox(options);
setTimeout(function(){preview();},90);//设置时间暂停是为了解决由于程序执行太快导致cropper还没完全形成就preview的问题

$('#user_icon').on('change', function(){
	var reader = new FileReader();
	reader.onload = function(e) {
		var tgt = document.getElementById("user_icon");
		$("#user_icon").html(tgt.value);
		$("#upload-file-name").html(tgt.value);
		options.imgSrc = e.target.result;//上传图像要显示在左侧
		cropper = $('.imageBox').cropbox(options);//将左侧原图进行裁剪
		setTimeout(function(){preview();},90);
	}
	reader.readAsDataURL(this.files[0]);
});
}
//预览图片
function preview() {
	var img = cropper.getDataURL();
	document.getElementById("sma").src = img;
	document.getElementById("mid").src = img;
	document.getElementById("big").src = img;
}

//点击选择文件
function uploadFileBtn() {
	$("#user_icon").click();
}

//头像提交
function uploadIcon() {
	if (cropPos.x < 5) {
		cropPos.width += cropPos.x;
		cropPos.x = 0;
	}
	if (cropPos.y < 5) {
		cropPos.height += cropPos.y;
		cropPos.y = 0;
	}
	if (cropPos.width > cropPos.picW)
		cropPos.width = cropPos.picW;
	if (cropPos.height > cropPos.picH)
		cropPos.height = cropPos.picH;

	if (cropPos.width == 0) {
		tek.macCommon.waitDialogShow(null, "请先选定裁剪区域", null, 2);
		tek.macCommon.waitDialogHide(3000);

	} else {
		var target = document.getElementById('user_icon');
		if (target.value) {
			var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>  正在提交...";
			tek.macCommon.waitDialogShow(null, html, null, 2);

			var pm = {};
			pm["objectName"] = "User";
			pm["action"] = "setIcon";
			pm["input-stream"] = "user_icon";
			pm["file-name"] = target.value;
			pm["user_id"] = userId;
			pm["cut-x"] = cropPos.x;
			pm["cut-y"] = cropPos.y;
			pm["cut-width"] = cropPos.width;
			pm["cut-height"] = cropPos.height;
			pm["cut-zoom"] = cropPos.zoom;
			pm["my"] = 1;

			$.ajaxFileUpload({
				async: false,
				url: tek.common.getRootPath() + "servlet/tobject",
				dataType: "json",
				secureuri: false,
				fileElementId: "user_icon",
				data: pm,

				success: function (data) {
					if (data) {
						if (data.code == 0) {
							tek.refresh.refreshOpener();

							var timerMsg = "页面<font id='counter' color='red'></font>秒后自动关闭";
							tek.macCommon.waitDialogShow(null, "操作成功!", timerMsg, 2);
							tek.macCommon.waitDialogHide(3000, "window.close()");
						} else {
							// 操作错误
							var error = "<font color='red'>" + (data.code || "") + " - "
								+ (!!data.message ? tek.dataUtility.stringToHTML(data.message) : "")
								+ "</font>";
							tek.macCommon.waitDialogShow(null, error, null, 2);
							tek.macCommon.waitDialogHide(3000);
						} //end if(data.code==0)
					} else {
						tek.macCommon.waitDialogShow(null, "<font color='red'>操作失败![data=null]</font>", null, 2);
						tek.macCommon.waitDialogHide(3000);
					} //end if(data)
				}, //end success:function(data)
				error: function (request) {
					var error = "<font color='red'>操作错误!["
						+ (request.status || "") + " - "
						+ (request.response || request.statusText)
						+ "]</font>";
					tek.macCommon.waitDialogShow(null, error, null, 2);
					tek.macCommon.waitDialogHide(3000);
				},
                complete:function(){
                    $('#user_icon').on('change', function(){
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var tgt = document.getElementById("user_icon");
                            $("#user_icon").html(tgt.value);
                            $("#upload-file-name").html(tgt.value);
                            options.imgSrc = e.target.result;//上传图像要显示在左侧
                            cropper = $('.imageBox').cropbox(options);//将左侧原图进行裁剪
                            setTimeout(function(){preview();},90);
                        }
                        reader.readAsDataURL(this.files[0]);
                    });
                }
			});
		} else {//这步应该默认用户原来头像裁剪的结果
			tek.macCommon.waitDialogShow(null, "请先上传头像", null, 2);
			tek.macCommon.waitDialogHide(3000);
		}
	}
}

//关闭窗口
function closeWin() {
	if (confirm("确定关闭页面？")) {
		window.opener = null;
		window.open('', '_self');
		window.close();
	}
}
