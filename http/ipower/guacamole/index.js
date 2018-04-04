var gua;
//登录ipower管理系统，获取登录凭证
function getGuacamole(){
    var ajaxURL = "http://10.128.0.211:8080/guacamole/api/tokens?username=guacadmin&password=guacadmin";
    var params = '';
    params += '{';
    params += '"username":"guacadmin",';
    params += '"password":"guacadmin"';
    params += '}';

    $.ajax({
        type:"POST",
        url:ajaxURL,
        headers:{
            "Content-Type":"application/json",
            "ACCEPT":"application/json, text/plain, */*",
            "Access-Control-Allow-Origin":"*"
        },
        // data:params,
        dataType:"json",
        processData:false,
        success: function(data){
            // console.log(data);
            if(data){
                if(data.result != null){
                    gua = data.result;
                }else{

                }
            }else{

            }
        },
        error: function(data){
            console.log(data);
        }
    })

}
