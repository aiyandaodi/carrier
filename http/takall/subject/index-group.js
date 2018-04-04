// JavaScript Document
/**************************************************
 *    取得小组标识
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================

//初始化
function getGroupId() {
	subject_type=(request && request["subject_type"]) ? decodeURIComponent(request["subject_type"]) : "";
	if(!subject_type || subject_type==0)
		subject_type=1;
	var group_id = (request && request["group_id"]) ? decodeURIComponent(request["group_id"]) : "";
	//alert("par group_id="+group_id);
	if(!group_id || groupid==0){
		var group_code=(request && request["group_code"]) ? decodeURIComponent(request["group_code"]) : "";
		if(group_code && group_code.length>2){
			group_id=getGroupIdFromField("group_code",group_code);
		}else{
			var group_name=(request && request["group_name"]) ? decodeURIComponent(request["group_name"]) : "";
			if(group_name && group_name.length>2){
				group_id=getGroupIdFromField("group_name",group_name);
			}else{
				if(subject_type == 1){
				group_id=getGroupIdFromField("group_name","问答");
				}else if(subject_type == 2){
				group_id=getGroupIdFromField("group_name","文章");
					}
			}
		}
	} //end if(!group_id || groupid==0)
	//alert("get group_id="+group_id);
	return group_id;
}
