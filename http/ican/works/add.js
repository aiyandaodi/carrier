// JavaScript Document
//显示字段数组
var items = new Array("works_type", "works_counts", "works_orgname", "works_tag", "works_color", "works_owner", "works_start", "works_end", "works_url", "works_remark", "works_status", "works_property");

function init(){
    addNew();
    
    //日历初始化
    initNoteCalender( {
        type: "note",
        daydatalist: "6,13,14,15,22,26|4,7,21,24,26|1,11,17,22,24,25,28,31|1,6,8,11,14,16,23|5,10,24|25|5,6,31",
        datestr: "yyyyMMdd",
        begin: "2010,1",
        format: 'yyyyMMdd'
    });

   
}
function addNew(){
    var sendData={
        objectName: "Works",
        action: "getNew"
    };
    tek.macEdit.getEdit(tek.common.getRootPath() + "servlet/tobject", sendData, items, "works_form");
    tek.macEdit.initialDefaultButton("works_btn");
    $("#submitBtn").attr("type","button").click(function(event){
        submitAdd();
        return false;
    });
}
tek.macEdit.customOperation = function(data, items, parent){
    tek.macEdit.defaultOperation(data, items, parent);
    $("#works_btn button[type='reset']").click(function(){
        resetForm();
    });
    
    /*$(document).on("focus", "#works_catalogText", function() {
        getCatalog();
        $(this).blur();
        openCatalogModal();
    });*/
    //获取标签
    getTags();
    //获取颜色
    getColors();
}

tek.macEdit.appendCustomEditField = function(field, record){
    var html = "";
    if (!tek.type.isObject(field) || tek.type.isEmpty(field.name)){
        return html;
    }

    var fieldname = field.name;
    
    if(fieldname === "works_color"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
            + tek.macEdit.appendNameField(field)
            + "<div class='col-xs-9'>";
        html += '<input type="hidden" class="form-control" name="' + fieldname + '" id="' + fieldname+ '" >'
            + '<input type="text" class="form-control dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" id="' + fieldname+ '-input" placeholder="人生色彩">'
            + '<ul class="dropdown-menu" id="works-common-color-ul"  aria-labelledby="' + fieldname + '"></ul>'

        html += '</div></div>';

    }else if(fieldname === "works_tag"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
        + tek.macEdit.appendNameField(field)
        + "<div class='col-xs-9'>";

        html += '<div id="works_tag" class="col-md-12" style="overflow:hidden">'
        + '<ul id="works-common-tags-ul" class="col-md-12 radio-checkbox-ul"></ul>'
        + '</div>';

        html += "</div></div>";

        // html += "<div class='col-xs-2' id='organization_tags_text'>提示信息</div>";

        // 加上提示的text
    }else if(fieldname === "works_type"){
        html += "<div id='" + fieldname + "-form-group' class='form-group'>"
            + tek.macEdit.appendNameField(field)
            + "<div class='col-xs-3'>"
            + "<select class='form-control works-first-select' onchange=changeWorksType(this.value,'" + fieldname + "')>";
        html += tek.macEdit.appendSelectField(field,'<');
      
        html += "</div>"
            + "<div class='col-xs-6'>"
            + "<select id='" + fieldname + "'" + " name='" + fieldname + "' class='form-control works-select'" + ">"
        html += tek.macEdit.appendSelectField(field,'>')
            + "<input class='form-control hide works-input' id='works_name' name='works_name' type='text' placeholder='请输入自定义类型名称...' value='' />"

        
        html += "</div></div>";
    }else{
        html = tek.macEdit.appendDefaultEditField(field, record);
    }

    return html;
}
//选择颜色
function selectedColor(name, value){
   $('#works_color-input').val(name);
   $('#works_color').val(value);
}

//提交新建
function submitAdd(){
    var params = tek.common.getSerializeObjectParameters("works_form");
    params["objectName"] = "Works";
    params["action"] = "addInfo";
    var workType = params["works_type"];
    if(workType < parseInt(0x1000)){
        params["works_name"] = $("#works_type").find("option:selected").text();
    }
    tek.macEdit.editInfo(tek.common.getRootPath() + "servlet/tobject", params);
}

//重置
function resetForm(){
    var input_sum = items.length;
    var temp_type = "";
    var temp_input = "";
    for(i = 0; i < input_sum; i++){
        temp_input = $("#" + items[i]);
        temp_type = temp_input.attr("type");
        // temp_type;
        if(temp_type === "text"){
            temp_input.val("");
        }

    }
}

tek.macEdit.appendSelectField = function (field,operate) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名
            var value = field.value;    //域值
            var selects = field.selects;
            var shows = field.shows;
            if (!selects || selects.length <= 0 || !shows || shows.length <= 0 || selects.length != shows.length)
                return html;

            for (var i = 0; i < selects.length; i++) {
                if (!selects[i] || selects[i].length <= 0 || !shows[i] || shows[i].length <= 0)
                    continue;
                if(operate == '<' && selects[i] < parseInt(0x1000)){
                   continue;
                }else if(operate == '>' && selects[i] >= parseInt(0x1000)){
                   continue;
                }
                html += "<option value='" + selects[i] + "' class='form-control'"
                    + (((i == 0 && tek.type.isEmpty(value)) || selects[i] == value) ? " selected='selected'" : "") + ">"
                    + shows[i]
                    + "</option>";
            }

            html += "</select>";

            return html;
};
//改变works_type类型
function changeWorksType(value, fieldname){
    if(!value){
        return ;
    }
    if(value != parseInt(0x1000)){
        $(".works-input").removeClass('hide');
        $(".works-select").addClass('hide');
        $(".works-select").removeAttr('id');
        $(".works-select").removeAttr('name');
        $(".works-first-select").attr({'id': fieldname,'name': fieldname});
    }else{
        $(".works-select").removeClass('hide');
        $(".works-select").attr({'id': fieldname,'name': fieldname});
        $(".works-input").addClass('hide');
        $(".works-first-select").removeAttr('id','name')
        
    }
}