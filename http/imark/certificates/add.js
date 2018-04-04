// JavaScript Document
//显示字段数组
var items = new Array("certificates_code", "certificates_name", "certificates_qualification", "certificates_type", "certificates_start", "certificates_end");
var user_id;
var UPLOAD_TAG = 1;
var UPLOAD_BTN_INIT = {};
var TempPATH = tek.common.getRootPath() + "servlet/sys";
var CER_SUM,A_IMG_OK=0;
// 文件上传
var filesize = "1536M";
function init(){
	user_id = request["user_id"];
	if(user_id){
		addNew();
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
function addNew(){
	var params={};
	params["objectName"]="Certificates";
	params["action"]="getNew";
	params["certificates_user"] = user_id;
	if(request["certificates_qualification"]){
		params['certificates_qualification'] = request["certificates_qualification"];
	}

	tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", params, items, "certificates_form");
}


tek.macEdit.customOperation = function(data, items, parent){
	
	tek.macEdit.defaultOperation(data, items, parent);
	tek.macEdit.initialButton("certificates_btn");

	$("#submitBtn").attr("disabled","disabled");
	$(document).on("click","#submitBtn",function(){
		submitAdd();
	});

	addUploadTool();
	
	var qualification_name = request["qualification_name"];
	if(qualification_name){
		tek.macEdit.searchObjectOption('certificates_qualification',qualification_name);
	}
}

//提交新建证书信息
function submitAdd(){
	var mydata = tek.common.getSerializeObjectParameters("certificates_form") || {};	//转为json

    mydata["objectName"] = "Certificates";
    mydata["action"] = "addInfo";
    mydata["certificates_user"] = user_id;
    mydata["image-file"] = 1;
    // var file_code = TYPE_INFO["file_code"].join("|");
	mydata["upload-temp"] = 1;
	mydata["clear-temp"] = 1;
	mydata["file-code"] = 'zhegnshu1';


	
	if($("#certificates_qualification").val()){
        
		mydata["certificates_qualification"] = $("#certificates_qualification").val();
	}
	var certificatesStart=mydata["certificates_start"];
    if(certificatesStart){
        certificatesStart=decodeURIComponent(certificatesStart);
        mydata["certificates_start"] = getLongDateByStringDate(certificatesStart);
    }
	var certificatesEnd=mydata["certificates_end"];
    if(certificatesEnd){
        certificatesEnd=decodeURIComponent(certificatesEnd);
        mydata["certificates_end"] = getLongDateByStringDate(certificatesEnd);
    }
    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", mydata);
}


//取得fieldname字段的对象列表信息的ajax调用参数
tek.macEdit.getObjectOptionParam = function (fieldname) {
    var params = {};
    params["objectName"] = "Qualification";
    params["action"] = "getList";
    params["condition"] = "qualification_status=1";

    return params;
}
 /**
 * 检索输入对象信息
 * @param {String} fieldname 域名
 * @param {String} val 检索值
 */
tek.macEdit.searchObjectOption = function (fieldname, val) {
	if (val && val.length > 0) {
		$("#" + fieldname + "-option").show();

		var loadingImg = "<li class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...</li>";
		$("#" + fieldname + "-option").html(loadingImg);

		var sendData;
		if (typeof tek.macEdit.getObjectOptionParam == "function")
			sendData = tek.macEdit.getObjectOptionParam(fieldname);

		var ajaxURL;
		if (typeof tek.macEdit.getObjectOptionUrl == "function")
			ajaxURL = tek.macEdit.getObjectOptionUrl(fieldname);
		if (!ajaxURL)
			ajaxURL = tek.common.getRootPath() + "servlet/tobject";

		if (!sendData || !ajaxURL) {
			$("#" + fieldname + "-option").html("<li class='center'><font color='red'>无法得到检索参数!</font></li>");
			return;
		}

		var maxcount = 5;
		sendData["count"] = maxcount;
		if (val.lastIndexOf(")")>=val.length-1) {
			var loc=val.lastIndexOf("(");
			if(loc>=0)
			  val=val.substring(0, loc);
		}
		sendData["quick-search"] = encodeURIComponent(val);

		var setting = {};//operateType: "检索输入信息"};

		var callback = {
			success: function (data) {
				// 操作成功
				var records = data["record"];
				if (records) {
					// 对象数组化
					records = tek.type.isArray(records) ? records : [records];

					var html = "";
					for (var i in records)
						html += tek.macEdit.appendObjectOptionRecord(records[i], fieldname);

					// 检索结果多余maxcount，显示“...”
					if (records.length > maxcount)
						html += "<li>...</li>";

					$("#" + fieldname + "-option").html(html);
				} else {
					$("#" + fieldname + "-option").html("<li class='center'>没有数据!</li>");
					
					$("#tip-modal-dialog").modal('show');
						
				}
			},
			error: function (data, message) {
				$("#" + fieldname + "-option").html(message);
			}
		};

		tek.common.ajax(ajaxURL, setting, sendData, callback);
	} else {
		$("#" + fieldname).val("0");
		$("#" + fieldname + "-option").hide();
	}
};

//创建资质，跳转页面
function createQualification(){
	
	$("#tip-modal-dialog").modal('hide'); 	//隐藏模态框
	
	var url = tek.common.getRootPath() + "http/imark/qualification/add.html";
	window.open(url);
	
	
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



function uploadHTMLStr(title,tips){
	var btn_id = "addAndUpload"+ UPLOAD_TAG;
	var str = '';
	str += "<div id='upload" + 	UPLOAD_TAG + "-form-group' class='form-group upload-img-wrap'>"
	str += "<label class='col-xs-3'>"+ title +"</label>"
	str += "<div class='col-xs-9'>";
	str += "<div class='upload-img-tips' style='font-size: 0.9em;'>"+ tips +"</div>";
	str += "<div id='"+ btn_id +"' class='upload-a-image'></div>";
	str += "<div id='"+ btn_id +"_tips'>请添加图片文件</div>";
	// str += "<div onclick='removeStr(this);'>点击移除</div>";
	str += "</div>";
	str += "</div>";
	UPLOAD_TAG++;

	return {
		html : str,
		btn : btn_id
	}
}

function addUploadTool(){
	$("#upload_certificates_area").html("");

	// $("#page_title").text(TYPE_INFO["title"]);

	/*if(TYPE_INFO["file_count"] === 2){
		// 在表单中添加文件上传控件
		var html_str = uploadHTMLStr("上传身份证正面","图片大小保证在1M以内，格式为*.jpg,*.png,*.gif,图片宽高不得小于200px");
		var btn_id1 = html_str.btn;
		$("#upload_certificates_area").append(html_str.html);
		loadAImg(btn_id1,0);

		var html_str1 = uploadHTMLStr("上传身份证反面","图片大小保证在1M以内，格式为*.jpg,*.png,*.gif,图片宽高不得小于200px");
		var btn_id2 = html_str1.btn;
		$("#upload_certificates_area").append(html_str1.html);
		loadAImg(btn_id2,1);
	}else{
		// 在表单中添加文件上传控件*/
		var html_str = uploadHTMLStr("上传证件扫描件","图片大小保证在1M以内，格式为*.jpg,*.png,*.gif，图片宽高不得小于200px");
		var btn_id1 = html_str.btn;
		$("#upload_certificates_area").append(html_str.html);
		loadAImg(btn_id1,0);
	// }
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

			$("#" + btn_id + "_tips").html("文件添加成功：" + (file.name || ""));

			A_IMG_OK++;

			// if(A_IMG_OK >= CER_SUM){
				// alert("请上传必要的图片信息");
				// return;
				$("#submitBtn").removeAttr("disabled");
			// }
		},

		Added : function(uploader,file){
			// 文件添加后立即开始上传
			/*if(!TYPE_INFO){
				alert("没有选择所属资质");
				return;
			}*/

			// $("#" + btn_id).css({
			// 	backgroundImage : 'none'
			// });

			$("#" + btn_id + "_tips").html("文件被添加，等待上传");

			uploader.start();
		},

		BeforeUpload : function(uploader,file){
			// --------------------------
			//这里设置参数
			var send_param = uploader.getOption()["multipart_params"];
			send_param["input-stream"] = "file";
			// send_param["file-name"] = file.name;
			send_param["file-name"] = 'zhegnshu1' + file.name.substring(file.name.lastIndexOf("."));

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
