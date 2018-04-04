var ajaxURL = tek.common.getRelativePath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
var SKIP = 0;
var COUNT = 5;
var request = tek.common.getRequest();
/*初始化*/
function init() {
    $("#helpLI").addClass("hide");
    showOpenClass("address_book");
    showSubClass("profile");
	
    initParams();
    tek.macList.getList();
}

function initParams(){
    tek.macList.ajaxURL = ajaxURL;
    tek.macList.params = {};
    key = ["contact_profile_","skip","order","desc","contact_profile_id"];
    tek.macList.params = tek.common.getRequestParams(key,request,tek.macList.params,true);
    tek.macList.params["objectName"] = "ContactProfile";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = SKIP;
    tek.macList.params["count"] = COUNT;
    tek.macList.columns = [
        'contact_profile_title',
        'contact_profile_name',
        'contact_profile_sex',
        'contact_profile_birthday',
        'contact_profile_country',
        'contact_profile_unit',
        'contact_profile_department',
        'contact_profile_position',
        'contact_profile_user'
    ];
    tek.macList.searchs = [
        "contact_profile_name",
        "contact_profile_title",
        "contact_profile_unit",
        "contact_profile_department",
        "contact_profile_position"
    ];
    // 自定义操作
    tek.macList.appendListOperation = function(record,data){
          if(!record || !data)
			return "";
		
		  var id=record.id;
		
		  var sb = new StringBuffer();
        sb.append("<span id='operate-");
        sb.append(id);
        sb.append("'>");
        sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readThisInfo(\"");
        sb.append(id);
        sb.append("\");'>");
        sb.append("<ib class='icon-ok'>详情</b> </button>");

        // 编辑按钮【如果有编辑权限】
        if(tek.right.isCanWrite(parseInt(data.right))) {
            sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editThisInfo(\"");
            sb.append(id);
            sb.append("\");'>");
            sb.append("<b class='icon-pencil'>编辑</b> </button>");
        }

        sb.append("</span>");
  
        return sb.toString();
    }
}

// 读取详细信息
function readThisInfo(id){
    window.open("read.html?contact_id="+ id);
}

// 编辑信息
function editThisInfo(id){
    window.open("edit.html?contact_id="+ id + "&isedit=editThisInfo");
}
