var subjectId;
var subjectType; //主题类型
var groupId;  //小组表示id

function init(){
	userId=request["user_id"];

	if(tek.dataUtility.isNull(orgId)){
		//没有权限
		$("photo-content").html("<font color='red'>参数错误，没有权限！</font>");
		return;
	}

	getPhotoRight();
}

//获取权限新建、编辑域  --新建域不传入任何参数
function getPhotoRight(){
	
	var url = tek.common.getRootPath() + "servlet/tobject";
	var setting = {"async": "false"};

	var sendData = {
		objectName: "Subject",
		"action": "getNew",
		"group_id": groupId
	};
	
	var callback = {
		beforeSend: function(){
			$("#photo-content").html("<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />&nbsp;正在获取数据...");

		},
		success: function(data){
			var right = data.value;
			if(tek.right.isCanWriteBlob(data.value)){
				UPLOAD_PARAMS = {
					objectName: "Subject",
					action: 'upload',
					group_id: groupId,
					"upload-temp": 1
				};

				var fileCode1 = decodeURIComponent(request["file-code"]);
				if(!tek.dataUtility.isNull(fileCode1)){
					// UPLOAD_PARAMS["file-code"]=fileCode;
		            if(fileCode){
		    			fileCode = decodeURIComponent(fileCode);
		    			$('#org_photo_title').val(fileCode);
		            }
				    UPLOAD_PARAMS["file-code"]=$('#org_photo_title').val(); 
		            UPLOAD_PARAMS["edit-blob"]=1;
				}

				$("#photo-content").html("");
				$("#edit-content").removeClass("hide");
			}else{
				$("#photo-content").html("<font color='red'>没有权限！</font>");
			}
		},
		error: function(data, errorMsg){
			$("#photo-content").html(errorMsg);
		}

	};

	tek.common.ajax(url, setting, sendData, callback);
}