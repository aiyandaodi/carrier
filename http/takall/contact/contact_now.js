// 在页面中引入以下dom节点，用以显示联系信息
// <div id="contact-modal-dialog" class="modal fade">
//   <div class="modal-dialog">
//     <div class="modal-content">
//       <div class="modal-header">
//         <button id="contact" type="button" class="close" data-dismiss="modal" aria-hidden="true"  onclick="javascript:;">×</button>
//         <h3 id="message-modal-dialog-title">立即咨询</h3>
//       </div>
//       <div class="modal-body" id="contact_content"></div>
//     </div>
//   </div>
// </div>

// 咨询按钮DOM
// 机构咨询
// <a href='javascript:;' data-id='"+ organization_id +"' data-type='organization' class='btn btn-success contact_now'>咨询</a>
// 专家咨询
// <a href='javascript:;' data-id='"+ expert_id +"' data-type='expert' class='btn btn-success contact_now'>咨询</a>

// 在HTML底部引入该JS文件。http/takall/contact/contact_now.js
(function(window){
    var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";

    var OBJ_NAME = "";
    var ID_TAG = "";
    var ID_VALUE = "";
    var SUM_LIST = 4;
    var CONTACT_TYPE = "";
    var count = 0;
    var html_text;

    $(document).on("click",".contact_now",function(){
        // 每次点击都要初始化值变量，否则闭包会引起数据错误。累加或者重复值
        count = 0;

        html_text = {
            phone : "",
            mail : "",
            instance : "",
            address : ""
        }
        
        var id_val = $(this).attr("data-id");
        var id_type = $(this).attr("data-type");

        if(id_type === "expert"){
            OBJ_NAME = "Expert"
            // ID_TAG = "expert_id";
            ID_TAG = "contact_id";
            SUM_LIST = 3;
            CONTACT_TYPE = "expert";
        }else if(id_type === "organization"){
            OBJ_NAME = "Organization"
            // ID_TAG = "organization_id";
            ID_TAG = "contact_id";
            SUM_LIST = 4;
            CONTACT_TYPE = "organization";
        }

        ID_VALUE = id_val;

        var HTML_STR = '';

        // -------------------------------------
        // 电话信息
        getHtmlStr("ContactTelephone",function(data_list){
            if(data_list){
                data_list.forEach(function(item,index,arr){
                    html_text.phone += '<div>'+ item["telephone_name"]["show"] + item["telephone_type"]["show"] +'：'+ item["telephone_phone"]["show"] +'</div>';
                });
            }
            alertContact(count);
        });

        // --------------------------------------------------------
        // 邮件信息
        getHtmlStr("ContactEmail",function(data_list){
            if(data_list){
                data_list.forEach(function(item,index,arr){
                    html_text.mail += '<div>'+ item["email_name"]["show"] +' 邮箱：'+ item["email_address"]["show"] +'</div>';
                });
                
            }
            alertContact(count);
        });

        // --------------------------------------------------------
        // 即时通讯信息
        getHtmlStr("ContactInstance",function(data_list){
            if(data_list){
                data_list.forEach(function(item,index,arr){
                    html_text.instance += '<div>' + item["instance_name"]["show"] + " " + item["instance_type"]["show"] + "：" + item["instance_address"]["show"] + '</div>';
                });
            }
            alertContact(count);
        });

        // --------------------------------------------------------
        // 地址信息
        if(OBJ_NAME !== "Expert"){
            getHtmlStr("ContactAddress",function(data_list){
                if(data_list){
                    data_list.forEach(function(item,index,arr){
                        html_text.address += '<div>'+ item["address_name"]["show"] +' 地址：'+ item["address_country"]["show"] + "/" + item["address_state"]["show"] + "/" + item["address_city"]["show"] + "/" + tek.dataUtility.stringToHTML(item["address_street"]["show"]) +'</div>';
                    });
                }
                alertContact(count);
            });
        }
    });
    
    function getHtmlStr(obj_name,fn){
        var SendData = returnParams(obj_name);
        SendAjax(SendData,function(data){
            if(data.code === "0" && data.record){
                var record = data.record;

                var data_list = record.length ? record : [record],
                    record = data.record || null;

                count++;

                fn(data_list);
            }else{
                FAIL();
            }

        });
    }

    function FAIL(){
        SUM_LIST--;

        if(SUM_LIST === 0){
            OBJ_NAME === "Expert" ? TIPS("专家") : TIPS("机构");
        }
    }

    function TIPS(str){
        showMsg("该"+ str +"暂无详细的联系信息");
    }

    function alertContact(i){
        if(i === SUM_LIST){
            var html_str = "";

            html_str += html_text.phone;
            html_str += html_text.mail;
            html_str += html_text.instance;
            html_str += html_text.address;

            showMsg(html_str);
        }
    }

    function showMsg(str){
        $("#contact_content").html(str);
        $("#contact-modal-dialog").modal("show");
    }

    function SendAjax(obj, fn) {
        var callback = {
            success: function(data) {
                if (fn && typeof fn === "function") {
                    fn(data);
                }
            },
            error: function(data,msg){
                FAIL();
            }
        }
        tek.common.ajax(AjaxURL, null, obj, callback);
    }

    function returnParams(obj_name){
        var params_data = {
            objectName : obj_name,
            action : "getList",
            // count : 1,
            random : 1
        }
        params_data[ID_TAG] = ID_VALUE;
        return params_data;
    }
})(window);
