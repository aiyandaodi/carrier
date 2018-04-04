var groupId;	//小组标识
function init(){

	groupId = request["group_id"];
	
	if(groupId){
		$(".question").attr('href',"add-qa.html?subject_type=1&group_id="+groupId);
		$(".photos").attr('href',"add.html?subject_type=2&group_id="+groupId);
		$(".baike").attr('href',"add.html?subject_type=3&group_id="+groupId);
		$(".notice").attr('href',"add.html?subject_type=4&group_id="+groupId);
	}else{

	}
}