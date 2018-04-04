
// /*
// *依赖plupload
// *		#wrap_progressing{}						//这是在css中定义进度条父元素的样式的ID值
// *		#progressing_bar{}						//这是进度条的ID值，可以在css中定义样式
// *关于uploader的属性和方法以及file的属性，请查阅plupload文档
// *obj.uploadOk : function(uploader,file){}		//文件上传成功后的回调函数
// *obj.fileAdded : function(uploader,file){}		//文件添加后要做的事情
// *obj.upLoading : function(uploader,file){}		//文件上传过程中调用的方法
// *
// */
// var allUploaded=false;
// //第一个obj直接就是plupload配置文件了，第二个obj就是回调方法

// //初始化参数，
// //操作滚动条
// //错误信息优化
// function loadFile(obj,functionObj){
// 	var uploader = new plupload.Uploader(obj);
// 	uploader.init();
	
// 	var progress_bar = $("<div id='wrap_progressing'><div id='progressing_bar'>进</div></div>");
	
// 	// 如果上传文件的时机就是文件一添加就上传或者是上传按钮没有定义，，则文件一添加就上传
// 	if(obj.upload_when === "file_added" || !obj.upload_file_btn){
// 		progress_bar.children("div").css({
// 			width : 10 + "px",
// 			overflow : "hedden",
// 		});
		
// 	    uploader.bind('FilesAdded',function(uploader,files){
// 	    	if(functionObj.fileAdded && typeof functionObj.fileAdded === "function"){
// 	    		functionObj.fileAdded(uploader,files);
// 	    	}
// 	        uploader.start();
// 	    });
		
// 	}else if(obj.upload_file_btn){
// 		document.getElementById(obj.upload_file_btn).onclick = function(){
// 	        uploader.start();
// 	    }	
// 	}

// 	var container_w = 0;
// 	// 是否显示进度条
// 	if(obj.progressing_bar){
		
// 		$("#"+obj.container).append(progress_bar);
		
// 		var par_w = ($("#"+obj.container).width()  + 0 )/100 * 98;
// 		var par_h = $("#"+obj.container).height() - 12 + 0;
		
// 		container_w = par_w;
		
// 		//默认的进度条的位置
// 		progress_bar.css({
// 			left : 0,
// 			top : 3 + "px",
// 			//marginLeft : -par_w/2 + "px",
// 			height : par_h + "px",
// 			width : par_w + "px",
// 			zIndex : 2,
// 			display : "none",
// 			position : "absolute"
// 		});
		
// 		progress_bar.children('div').css({
// 			height : par_h + "px",
// 			textAlign : "center",
// 			lineHeight : par_h + "px",
// 			position : "absolute",
// 			top : 0,
// 			left : 0,
// 			color : "#FFF",
// 			width : 0
// 	 	});	
// 	}
	
// 	//这里设置参数
// 	uploader.bind('BeforeUpload',function(uploader,file){
// 		var send_param = uploader.getOption()["multipart_params"];
// 		send_param["file-name"] = file.name;
// 		uploader.setOption({
// 			multipart_params: send_param
// 		});
//     });

// 	uploader.bind('UploadProgress',function(uploader,file){
// 		if(obj.progressing_bar){
			
// 			progress_bar.show();

// 			progress_bar.children('div').text(file.percent + "%").stop().animate({
// 				width : container_w * (file.percent/100) + "px"	
// 			},30);
			
			
// 			if((progress_bar.children('div').width() + 0)== container_w){
// 				progress_bar.children('div').text("文件上传结束");	
// 			}
// 		}

// 		if(functionObj.upLoading && typeof functionObj.upLoading === "function"){
// 			functionObj.upLoading(uploader,file);
// 		}
//     });

//     // FileUploaded
//     uploader.bind('FileUploaded',function(uploader,file,res){
//     	//单个文件上传成功后做的事情，
		
// 		allUploaded = true;
		
// 		progress_bar.children('div').text("文件上传成功:" + file.name);
		
// 		if(obj.fileok_progress_hide){
// 			var timer = setTimeout(function(){
// 				progress_bar.hide();
// 				progress_bar.children('div').width(0);
// 				clearTimeout(timer);
// 			},1000);
// 		}
		
//     	if(functionObj.uploadOk && typeof functionObj.uploadOk === "function"){
//     		functionObj.uploadOk(uploader,file,res);
//     	}
//     });
	
// 	 // FileUploaded
//     uploader.bind('Error',function(uploader,errObject){
// 		var err_msg = "";
// 		//具体情况参考plupload文档
// 		switch(errObject.code){
// 			case  -100 : 
// 				err_msg = "通用错误";
// 				break;
// 			case -200 : 
// 				err_msg = "http网络错误";
// 				break;
// 			case -300 :
// 				err_msg = "磁盘读写错误";
// 				break;
// 			case -400 :
// 				err_msg = "因安全问题产生错误代码";
// 				break;
// 			case -500 :
// 				err_msg = "初始化错误";
// 				break;
// 			case -600 :
// 				err_msg = "所选择文件太大";
// 				break;
// 			case -601 :
// 				var filetype = uploader.getOption();
// 				var type = filetype.filters.mime_types;
// 				var num = type.length;
// 				var str = '';
// 				for(var i = 0; i < num; i++){
// 					str += type[i].extensions;
// 				}
// 				err_msg = "文件类型不符合要求,支持" + str + "格式的文件";
// 				break;
// 			case -602 : 
// 				err_msg = "选择了重复的文件";
// 				break;
// 			case -700 :
// 				err_msg = "图片格式错误";
// 				break;
// 			case -702 :
// 				err_msg = "文件大小超过程序所能处理的最大值";
// 				break;
// 			default:
// 				error_msg = "出错了";
// 				break;	
// 		}
		
//     	functionObj.error(uploader,errObject,err_msg);
//     });
	
// }




