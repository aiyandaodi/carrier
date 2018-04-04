function setUploadArea(){
	$("#upload_certificates_area").html("");
	
	/*if(TYPE_INFO["file_count"] === 2){
		// 在表单中添加文件上传控件
		var html_str = uploadHTMLStr("上传身份证正面","图片大小保证在500k以内，格式为*.jpg,*.png,*.gif");
		var btn_id1 = html_str.btn;
		$("#upload_certificates_area").append(html_str.html);
		loadAImg(btn_id1,0);
		// FILE_CODE_ARR.push(TYPE_INFO["file_code"] + btn_id1);

		var html_str1 = uploadHTMLStr("上传身份证反面","图片大小保证在500k以内，格式为*.jpg,*.png,*.gif");
		var btn_id2 = html_str1.btn;
		$("#upload_certificates_area").append(html_str1.html);
		loadAImg(btn_id2,1);
		// FILE_CODE_ARR.push(TYPE_INFO["file_code"] + btn_id2);
	}else{*/
		// 在表单中添加文件上传控件
		var html_str = uploadHTMLStr("上传证件扫描件","图片大小保证在500k以内，格式为*.jpg,*.png,*.gif");
		var btn_id1 = html_str.btn;
		$("#upload_certificates_area").append(html_str.html);
		loadAImg(btn_id1,0);
		// FILE_CODE_ARR.push(TYPE_INFO["file_code"] + btn_id1);
	/*}*/
}

function uploadHTMLStr(title,tips){
	var btn_id = "addAndUpload"+ UPLOAD_TAG;
	var str = '';
	str += "<div id='upload" + 	UPLOAD_TAG + "-form-group' class='form-group upload-img-wrap'>"
	str += "<label class='col-xs-3'>"+ title +"</label>"
	str += "<div class='col-xs-9'>";
	str += "<div class='upload-img-tips'>"+ tips +"</div>";
	str += "<div id='"+ btn_id +"' class='upload-a-image'></div>";
	// str += "<div onclick='removeStr(this);'>点击移除</div>";
	str += "</div>";
	str += "</div>";
	UPLOAD_TAG++;

	return {
		html : str,
		btn : btn_id
	}
}



// 参数是【选择文件按钮】的ID
function loadAImg(btn_id,index){
	if(UPLOAD_BTN_INIT[btn_id]){
		UPLOAD_BTN_INIT[btn_id] = false;
		return;
	}else{
		UPLOAD_BTN_INIT[btn_id] = true;
	}
	// 初始化文件上传
	var params = {
		add : btn_id,						//身份证照片信息,上传到专家的头像，icon
		params_all : {								//定义传递到后端的参数
			action : "uploadTempFile",
		},
		url : TempPATH,

		FileUploaded : function(uploader,file,res){
			var data = JSON.parse(res["response"]);
			var img_path = data["value"];

			$("#" + btn_id).css({
				backgroundImage : 'url(images/holder-img-ok.png)'
			});

			console.info("文件上传成功");
		},

		Added : function(uploader,file){
			// 文件添加后立即开始上传
			if(!TYPE_INFO){
				alert("没有选择所属资质");
				return;
			}

			uploader.start();
		},

		BeforeUpload : function(uploader,file){
			// --------------------------
			//这里设置参数
			var send_param = uploader.getOption()["multipart_params"];
			send_param["input-stream"] = "file";
			// send_param["file-name"] = file.name;
			send_param["file-name"] = TYPE_INFO + file.name.substring(file.name.lastIndexOf("."));

			uploader.setOption({
				multipart_params: send_param
			});
			// --------------------------
		},

		uploading : function(uploader,file){
			console.log("文件正在上传");
		}
	};

	var obj = plupLoadParams(params);
	loadFile(obj);
}

// 文件上传
var filesize = "1536M";
function plupLoadParams(params){
	return {
		browse_button : params["add"], 					//这个是点击上传的html标签的id,可以a,button等等
		multipart_params: params.params_all,
		FileUploaded : params.FileUploaded,
		uploading : params.uploading,
		BeforeUpload : params.BeforeUpload,
		Added : params.Added,

		filters: {
  			mime_types : [
							{ title : "img files",extensions : "bmp,gif,png,jpg"},
						],
  			max_file_size : params.size, 				//最大只能上传400kb的文件
  			prevent_duplicates : false 					//不允许选取重复文件
		},
		max_file_size : filesize, 						//这是文件的最大上传大小，得跟IIS结合使用
		runtimes : 'html5',  							//官网上默认是gears,html5,flash,silverlight,browserplus
		url : params.url , 								//服务器页面地址，后面跟你想传递的参数
		file_data_name : "file",
		multi_selection : false,
	};
}

//错误信息优化
function loadFile(obj,callbacks){
	var uploader = new plupload.Uploader(obj);
	uploader.init();

	uploader.bind('FilesAdded',function(uploader,files){
		if(obj.Added && typeof obj.Added === "function"){
			obj.Added(uploader,files);
		}
    });

	uploader.bind('BeforeUpload',function(uploader,file){
		if(obj.BeforeUpload && typeof obj.BeforeUpload === "function"){
			obj.BeforeUpload(uploader,file);
		}
    });

	uploader.bind('UploadProgress',function(uploader,file){
		if(obj.uploading && typeof obj.uploading === "function"){
			obj.uploading(uploader,file);
		}
    });

    uploader.bind('FileUploaded',function(uploader,file,res){
		if(obj.FileUploaded && typeof obj.FileUploaded === "function"){
			obj.FileUploaded(uploader,file,res);
		}
    });

    uploader.bind('Error',function(uploader,errObject){
    	// 格式化错误信息
		var err_msg = errMsg(errObject.code);
    	showInfo(err_msg);
    });
}

function showInfo(msg){
	var message=new StringBuffer();
	message.append("<font color='red'>");
	message.append(msg);
	message.append("</font>");
	tek.macCommon.waitDialogShow("提示",message.toString());
	// $("#waiting-modal-dialog").modal("show");
}

function errMsg(code){
	var code = code || 1000;
	switch(errObject.code){
		case  -100 :
			return "通用错误";
		case -200 :
			return "http网络错误";
		case -300 :
			return "磁盘读写错误";
		case -400 :
			return "因安全问题产生错误代码";
		case -500 :
			return "初始化错误";
		case -600 :
			return "所选择文件太大";
		case -601 :
			var filetype = uploader.getOption();
			var type = filetype.filters.mime_types;
			var num = type.length;
			var str = '';
			for(var i = 0; i < num; i++){
				str += type[i].extensions;
			}
			return "文件类型不符合要求,支持" + str + "格式的文件";
		case -602 :
			return "选择了重复的文件";
		case -700 :
			return "图片格式错误";
		case -702 :
			return "文件大小超过程序所能处理的最大值";
		default:
			return "出错了";
	}
}

function SendAjax(obj, fn) {
	var callback = {
		success: function(data) {
			if (fn && typeof fn === "function") {
				fn(data);
			}
		}
	}
	tek.common.ajax(AjaxURL, null, obj, callback);
}

function normalDate(){
	//因为报错了，定义一个空函数。防止报错
	// 或者是在字符串拼接的地方去掉onfocus这一个事件
}

// 获取资质
function getQualificationType(id,fn){
	var sendData = {
		objectName : "Qualification",
		action : "readInfo",
		qualification_id : id
	}

	SendAjax(sendData,function(data){
		// 这里能够查询到资质的列表
		if(data.record){
			var record = data.record;
			// if(record.length){
			// 	console.log("多条数据，进行选择");
			// 	var sum = record.length;
			// 	// 构建列表
			// }else{
			// 	console.log("只有一条数据，不用选择，直接确定");
			// 	CERTIFICATES_QUALIFICATION = record["id"];
			// 	// qualification_name,显示
			// }
			
			if(fn && typeof fn === "function"){
				fn(record["qualification_type"]["value"]);
			}
		}
	});
}

