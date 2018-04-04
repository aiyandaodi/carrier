var ajaxURL = tek.common.getRelativePath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
var SKIP = 0;
var COUNT = 5;
var request = tek.common.getRequest();
function init() {
    
	showOpenClass("address_book");
    showSubClass("address");
	
    initParams();
    tek.macList.getList();
}

function initParams(){
    tek.macList.ajaxURL = ajaxURL;
    tek.macList.params = {};
    key = ["address_","skip","order","desc","address_id"];
    tek.macList.params = tek.common.getRequestParams(key,request,tek.macList.params,true);
    tek.macList.params["objectName"] = "ContactAddress";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = SKIP;
    tek.macList.params["count"] = COUNT;
    tek.macList.columns = [
        'address_code',
        'address_name',
        'address_zip',
        'address_country',
        'address_state',
        'address_city',
        'address_street',
        'address_landmark'
    ];
    // 快速检索域
	
    tek.macList.searchs = [
        'address_name'
    ];
    
    // 自定义操作
    tek.macList.appendListOperation = function(record,data){
		if(!record || !data){
			return "";
		}
		
		var id=record.id;

		var sb = new StringBuffer();
		sb.append("<span id='operate-");
		sb.append(id);
		sb.append("'>");
		// 编辑按钮【如果有编辑权限】
		if(tek.right.isCanDelete(parseInt(data.right))) {
			sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:removeThisInfo(\"");
			sb.append(id);
			sb.append("\",\"");
			sb.append(record.name);
			sb.append("\");'>");
			sb.append("<b class='icon-remove'>删除</b> </button>");
		}

        sb.append("</span>");
  
        return sb.toString();
    }
}



// 删除信息
function removeThisInfo(address_id, address_name){
    var params = {};
    params["objectName"] = "ContactAddress";
    params["action"] = "removeInfo";
    params["address_id"] = address_id;

    tek.macList.removeInfo(address_id, address_name, params);
}
