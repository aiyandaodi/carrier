// JavaScript Document
//显示字段数组
var items = [
    "certificates_code",
    "certificates_name",
    "certificates_qualification",
    "certificates_type",
    "certificates_start",
    "certificates_end"];

var AjaxURL = tek.common.getRootPath()+"servlet/tobject";
var TempPATH = tek.common.getRootPath() + "servlet/sys";

var certificates_id;  //获取字典记录id
var CERTIFICATES_QUALIFICATION;
var TYPE_INFO = "";
var UPLOAD_TAG = 1;
var UPLOAD_BTN_INIT = {}
var EDIT_FILE = false;
/**
* 初始化
*/
function init(){
	
	certificates_id = request["certificates_id"];
	
	tek.macEdit.initialButton("btn");
	if(certificates_id){
		editNew();
	}
	//日历初始化
	initNoteCalender( {
		type: "note",
		daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
		datestr: "yyyyMMdd",
		begin: "2010,1",
		format: 'yyyyMMdd'
	});
	
	
}
//获得显示的字段
function editNew() {
    var params = {};
    params["objectName"] = "Certificates";
    params["action"] = "getEdit";
    params["certificates_id"] = certificates_id;

    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "set-info");
	
}

/*tek.macEdit.customOperation = function(data, items, parent){
	
	tek.macEdit.defaultOperation(data, items, parent);
	tek.macEdit.initialButton("certificates_btn");

	$("#submitBtn").attr("disabled","disabled");
	$(document).on("click","#submitBtn",function(){
		setNewInfo();
	});

	// addUploadTool();
	
}*/

tek.macEdit.customOperation = function(data, items, parent){
	tek.macEdit.defaultOperation(data, items, parent);
	tek.macEdit.initialButton("certificates_btn");

	
	var qualification_id = data.record.certificates_qualification.value;
	CERTIFICATES_QUALIFICATION = qualification_id;
	
	getQualification(CERTIFICATES_QUALIFICATION,data,parent);
}

// 获取资质
function getQualification(id,cer_data,parent){
	var sendData = {
		objectName : "Qualification",
		action : "readInfo"
	}

	sendData["qualification_id"] = id;

	SendAjax(sendData,function(data){
		// 这里能够查询到资质的列表
		if(data.record){
			var record = data.record;
			var type = record.qualification_type.value;
			if(type == "1010"){
				items = ["certificates_code", "certificates_status"];
				cer_data.record.certificates_code.display = "证件号码";
			}

			TYPE_INFO = type;
			// 设置标题
			//$("#add_a_cer").text(TYPE_INFO["title"]);
			//setPageName(TYPE_INFO["title"]);
			setUploadArea();

			tek.macEdit.defaultOperation(cer_data, items, parent);

			

			$(document).on("click","#submitBtn",function(){
				setNewInfo();
			});
		}
	});
}


tek.macEdit.appendSingleField = function (field) {
	var html = "";
	if (!field || !field.name)
		return html;

	var fieldname = field.name;    //域名
	var value = field.value;    //域值
	var show = field.show;
	var selects = field.selects;
	var shows = field.shows;
	if (!selects || selects.length <= 0 || !shows || shows.length <= 0 || selects.length != shows.length)
		return html;

	for (var i = 0; i < selects.length; i++) {
		if (!selects[i] || selects[i].length <= 0 || !shows[i] || shows[i].length <= 0)
			continue;

		html += "<div class='col-xs-6' style=' overflow:hidden; padding:0px 5px'>"
			+ "<input type='radio' class='col-xs-1' style='width:15%; float:left;' " + " id='" + fieldname + "-" + selects[i]
			+ "' name='" + fieldname + "'" + " value='" + selects[i] + "'"
			+ (shows[i] == show ? " checked='checked'" : "") + "/>"
			+ "<label class='col-xs-11'  style='float:left;width:85%;text-align:left;overflow:hidden' for='" + fieldname + "-" + selects[i] + "'>"
			+ shows[i]
			+ "</label>"
			+ "</div>";
	}

	return html;
};


//提交信息
function setNewInfo() {
    var sendData = tek.common.getSerializeObjectParameters("set-info") || {};	//转为json
    sendData["objectName"] = "Certificates";
    sendData["action"] = "setInfo";
    sendData["certificates_id"] = certificates_id;
	
    // 如果上传了文件，则需要传递这些参数，如果没有传递文件，则不用传递这些参数
	if(EDIT_FILE){
		sendData["upload-temp"] = 1;
		sendData["clear-temp"] = 1;
		sendData["remove-blob"] = 1;
		var file_code = TYPE_INFO;
		sendData["file-code"] = file_code;
        sendData['edit-blob'] = 1;
	}


	var certificatesStart=sendData["certificates_start"];
    if(certificatesStart){
        certificatesStart=decodeURIComponent(certificatesStart);
        sendData["certificates_start"] = getLongDateByStringDate(certificatesStart);
    }

	var certificatesEnd=sendData["certificates_end"];
    if(certificatesEnd){
        certificatesEnd=decodeURIComponent(certificatesEnd);
        sendData["certificates_end"] = getLongDateByStringDate(certificatesEnd);
    }
    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", sendData);
}


//日期类型转换
function getLongDateByStringDate(stringDate){
    var newStringDate = stringDate;
    if(newStringDate){
        newStringDate = replaceMyString(newStringDate,"-","/");
        if(newStringDate){
            if(newStringDate.indexOf(":") <= 0)
                newStringDate += " 00:00:00"
        }else{
            newStringDate = stringDate;
        }
    }

    var dateDate = new Date(newStringDate);
    return dateDate.getTime();
}

//字符串替换
function replaceMyString(str,oldStr,newStr){
    var ns = str;
    if(str){
        do{
            ns = ns.replace(oldStr,newStr);
        }while(ns.indexOf(oldStr) > -1);
    }
    return ns;
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

			console.log("上传成功");

			$("#" + btn_id + "_tips").html("文件添加成功：" + (file.name || ""));

			// 文件上传成功，表示需要修改文件
			EDIT_FILE = true;
		},

		Added : function(uploader,file){
			// $("#" + btn_id).css({
			// 	backgroundImage : 'none'
			// });

			$("#" + btn_id + "_tips").html("文件被添加，等待上传");

			// 文件添加后立即开始上传
			uploader.start();
		},

		BeforeUpload : function(uploader,file){
			// --------------------------
			//这里设置参数
			var send_param = uploader.getOption()["multipart_params"];
			send_param["input-stream"] = "file";
			// send_param["file-name"] = file.name;
			send_param["file-name"] = TYPE_INFO+ file.name.substring(file.name.lastIndexOf("."));

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