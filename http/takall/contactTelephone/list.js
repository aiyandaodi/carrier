var ajaxURL = tek.common.getRelativePath()+"servlet/tobject";    //Ajax取得列表信息的访问地址
var SKIP = 0;
var COUNT = 5;
var request = tek.common.getRequest();
/*初始化*/
function init() {
    showOpenClass("address_book");
    showSubClass("telphone");
	
    initParams();
    tek.macList.getList();
}

function initParams(){
    tek.macList.ajaxURL = ajaxURL;
    tek.macList.params = {};
    key = ["telephone_","skip","order","desc","telephone_id"];
    tek.macList.params = tek.common.getRequestParams(key,request,tek.macList.params,true);
    tek.macList.params["objectName"] = "ContactTelephone";
    tek.macList.params["action"] = "getList";
    tek.macList.params["skip"] = SKIP;
    tek.macList.params["count"] = COUNT;
    tek.macList.columns = [
        "telephone_name",
        "telephone_type",
        "telephone_phone"
    ];
    // 快速检索域
    tek.macList.searchs = [
        "telephone_name"
    ];
   
}
/*添加数据*/
tek.macList.appendCustomListField = function(field, record, data){
    var html = "";
    if(!field || !record || !data){
        return html;
    }
    var fieldName = field.name;
    if(!fieldName){
        return html;
    }

    var show = field.show || "";

    // 普通列数据
    html += tek.macList.appendDefaultListField(field, record, data);

    return html;

}
 // 自定义操作
    tek.macList.appendListOperation = function(record,data){
          if(!record || !data)
            return "";
        
          var id=record.id;
        
          var sb = new StringBuffer();
        sb.append("<span id='operate-");
        sb.append(id);
        sb.append("'>");
        /*sb.append("<button class='btn btn-xs btn-success' onClick='javascript:readThisInfo(\"");
        sb.append(id);
        sb.append("\");'>");
        sb.append("<ib class='icon-ok'>详情</b> </button>");

        // 编辑按钮【如果有编辑权限】
        if(tek.right.isCanWrite(parseInt(data.right))) {
            sb.append(" <button class='btn btn-xs btn-warning' onClick='javascript:editThisInfo(\"");
            sb.append(id);
            sb.append("\");'>");
            sb.append("<b class='icon-pencil'>编辑</b> </button>");
        }*/
		
		// 删除按钮【如果有删除权限】
        if(tek.right.isCanDelete(parseInt(data.right))) {
            sb.append(" <button class='btn btn-xs btn-danger' onClick='javascript:removeThisInfo(\"");
            sb.append(id);
            sb.append("\",\"");
			sb.append(record.name);
			sb.append("\");'>");
			sb.append("<b class='icon-remove'>删除</b> </button>");
        }
        sb.append("</span>");
  
        return sb.toString();
    }
// 读取详细信息
function readThisInfo(id){
    window.open("read.html?contact_id="+ id);
}

// 编辑信息
function editThisInfo(id){
    window.open("edit.html?contact_id="+ id + "&isedit=editThisInfo");
}

// 删除信息
function removeThisInfo(telephone_id, telephone_name){
    var params = {};
    params["objectName"] = "ContactTelephone";
    params["action"] = "removeInfo";
    params["telephone_id"] = telephone_id;

    tek.macList.removeInfo(telephone_id, telephone_name, params);
}
