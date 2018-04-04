var ipowerAudit = "";//连接ipower凭证

//登录ipower管理系统，获取登录凭证
function getIpowerMonitorLogin(){
    var ajaxURL = "http://10.128.0.211:8800/api_jsonrpc.php";
    // var ajaxURL = "http://10.128.0.211:8080/guacamole/api/tokens";
    var params = '';
    params += '{';
    params += '"auth":null,';
    params += '"id":0,';
    params += '"jsonrpc":"2.0",';
    params += '"method":"user.login",';
    params += '"params":{"user":"Admin","password":"tekinfo.net"}';
    // params += '"username":"guacadmin","password":"guacadmin"';
    params += '}';

    $.ajax({
        type:"POST",
        url:ajaxURL,
        headers:{
            "Content-Type":"application/json-rpc",
            "ACCEPT":"application/json-rpc,text/javascript, text/html, application/xml, text/xml, */*"
            // "Content-Type":"application/x-www-form-urlencoded",
            // "ACCEPT":"application/json, text/plain, */*",
            // "Access-Control-Allow-Origin":'*'
        },
        data:params,
        dataType:"json",
        processData:false,
        success: function(data){
            // console.log(data);
            if(data){
                if(data.result != null){
                    ipowerAudit = data.result;
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



var system;
var bit;
function getYourIP(){
              var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
              if (RTCPeerConnection) (function () {
                  var rtc = new RTCPeerConnection({iceServers:[]});
                  if (1 || window.mozRTCPeerConnection) {     
                      rtc.createDataChannel('', {reliable:false});
                 };
                  
                rtc.onicecandidate = function (evt) {
                    if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
                 };
                 rtc.createOffer(function (offerDesc) {
                     grepSDP(offerDesc.sdp);
                     rtc.setLocalDescription(offerDesc);
                 }, function (e) { console.warn("offer failed", e); });
                 
                 
                 var addrs = Object.create(null);
                 addrs["0.0.0.0"] = false;
                 function updateDisplay(newAddr) {
                     if (newAddr in addrs) return;
                     else addrs[newAddr] = true;
                     var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
                     for(var i = 0; i < displayAddrs.length; i++){
                         if(displayAddrs[i].length > 16){
                             displayAddrs.splice(i, 1);
                             i--;
                         }
                     }
                     // document.getElementById('ip_address').value = displayAddrs[0];
                     $("#ip_address").html(displayAddrs[0]);
					 // document.getElementById('ip_address').value = displayAddrs[0];
                 }
                 function grepSDP(sdp) {
                     var hosts = [];
                     sdp.split('\r\n').forEach(function (line, index, arr) { 
                        if (~line.indexOf("a=candidate")) {    
                             var parts = line.split(' '),       
                                 addr = parts[4],
                                 type = parts[7];
                             if (type === 'host') updateDisplay(addr);
                         } else if (~line.indexOf("c=")) {       
                             var parts = line.split(' '),
                                 addr = parts[2];
                             updateDisplay(addr);
                         }
                     });
                 }
             })();
			 
             else{
                 //document.getElementById('list').textContent = "请使用主流浏览器：chrome,firefox,opera,safari";
				 alert("无法获取到本地ip，请使用主流浏览器：360,chrome,firefox,opera,safari,或者进行手动输入！");
				 document.getElementById('ip_address').removeAttribute("disabled");
             }
         }
		 function getBrowserInfo(){
              var agent = navigator.userAgent.toLowerCase();
              console.log(agent);
              var arr = [];
			  if(agent.indexOf("linux")>=0){
			  system = "Linux";
				  }else{
              system = agent.split(' ')[1].split(' ')[0].split('(')[1];
				  }
			  if(agent.indexOf("win64")>=0||agent.indexOf("wow64")>=0 || agent.indexOf("x86_64")>=0) {
				 bit =64; }else{
					 bit=32}; 
              arr.push(system);
			  arr.push(bit);
              var regStr_edge = /edge\/[\d.]+/gi;
              var regStr_ie = /trident\/[\d.]+/gi ;
              var regStr_ff = /firefox\/[\d.]+/gi;
             var regStr_chrome = /chrome\/[\d.]+/gi ;
             var regStr_saf = /safari\/[\d.]+/gi ;
             var regStr_opera = /opr\/[\d.]+/gi;
             //IE
             if(agent.indexOf("trident") > 0){
                 arr.push(agent.match(regStr_ie)[0].split('/')[0]);
                 arr.push(agent.match(regStr_ie)[0].split('/')[1]);
				 console.log(arr);
                 return arr;
             } 
             //Edge
             if(agent.indexOf('edge') > 0){
                 arr.push(agent.match(regStr_edge)[0].split('/')[0]);
                 arr.push(agent.match(regStr_edge)[0].split('/')[1]);
				 console.log(arr);
                 return arr;
             } 
             //firefox
             if(agent.indexOf("firefox") > 0){
                 arr.push(agent.match(regStr_ff)[0].split('/')[0]);
                 arr.push(agent.match(regStr_ff)[0].split('/')[1]);
				 console.log(arr);
                 return arr;
             } 
             //Opera
             if(agent.indexOf("opr")>0){
                 arr.push(agent.match(regStr_opera)[0].split('/')[0]);
                 arr.push(agent.match(regStr_opera)[0].split('/')[1]);
				 console.log(arr);
                 return arr;
             } 
             //Safari
             if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0){
                 arr.push(agent.match(regStr_saf)[0].split('/')[0]);
                 arr.push(agent.match(regStr_saf)[0].split('/')[1]);
				 console.log(arr);
                 return arr;
             } 
             //Chrome
             if(agent.indexOf("chrome") > 0){
                 arr.push(agent.match(regStr_chrome)[0].split('/')[0]);
                 arr.push(agent.match(regStr_chrome)[0].split('/')[1]);
				 console.log(arr);
                 return arr;
             }else{
                 arr.push('请更换主流浏览器，例如chrome,firefox,opera,safari,IE,Edge!');
				 console.log(arr);
                 return arr;
             } 
			 
         }