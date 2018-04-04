ajaxfileupload

ajaxFileUpload 是一个异步上传文件的jQuery插件。

---------------------------------------------------
使用ajaxfileupload.js插件的大致方法：

$.ajaxFileUpload({
	url: '/upload.aspx', //用于文件上传的服务器端请求地址
	secureuri: false, //是否需要安全协议，一般设置为false
	fileElementId: 'file1', //文件上传域的ID
	dataType: 'json', //返回值类型 一般设置为json
	success: function (data, status) { //服务器成功响应处理函数
		$("#img1").attr("src", data.imgurl);
		if (typeof (data.error) != 'undefined') {
			if (data.error != '') {
				alert(data.error);
			} else {
				alert(data.msg);
			}
		}
	},
	error: function (data, status, e) { //服务器响应失败处理函数
		alert(e);
	},
	complete: function () { //只要完成即执行，最后执行
	}
})