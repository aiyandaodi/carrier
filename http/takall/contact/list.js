var ajaxURL = tek.common.getRelativePath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
var SKIP = 0;
var COUNT = 10;
var request = tek.common.getRequest();
function init() {
	showOpenClass("address_book");
	showSubClass("contacts");
	
    $("#helpLI").addClass("hide");
    showOpenClass("contact");
    if(request['contact_objectName']=='Organization'){
        showSubClass("contact_organization_list");
    }else if(request['contact_objectName']=='Expert'){
        showSubClass("contact_expert_list");
    }

    initParams();
    tek.macList.getList();
}

function initParams(){
    tek.macList.ajaxURL = ajaxURL;
    tek.macList.params = {};
    key = ["contact_","skip","order","desc","contact_id"];
    tek.macList.params = tek.common.getRequestParams(key,request,tek.macList.params,true);
    tek.macList.params["objectName"] = "Contact";
    tek.macList.params["action"] = "getList";
    if(request['contact_objectName'])
    {
        tek.macList.params['contact_objectName']=request['contact_objectName'];
    }
    tek.macList.params["skip"] = SKIP;
    tek.macList.params["count"] = COUNT;
    tek.macList.columns = [
        'contact_name',
        // 'contact_owner',
        'contact_objectId',
        'contact_catalog',
        'contact_tags',
        'contact_color',
        'contact_property',
        // 'contact_remark'
    ];
    tek.macList.searchs = [
        "contact_name",
        "contact_property",
        "contact_catalog",
        "contact_tags",
        "contact_color"
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
        sb.append("<ib class='icon-ok'>查看</b> </button>");

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
	var url = tek.common.getRootPath() + "http/takall/contact/read.html?contact_id=" + id;
	url += "&show-close=1&refresh-opener=1";
    window.open(url);
}

// 编辑信息
function editThisInfo(id){
	var url = tek.common.getRootPath() + "http/takall/contact/edit.html?contact_id=" + id;
	url += "&show-close=1&refresh-opener=1&isedit=editThisInfo";
    window.open(url);
}
