// 事物类型颜色
var TRANSACTION_TYPE_COLOR = {
    0x10: "lblue",
    0x20: "orange",
    0x80: "green",
    0x40: "red",
	0x41: "rose",
	0x81: "blue"
	
};

//事物类型
var TRANSACTION_TYPE={
    "question": 0x10,  
    "worksheet": 0x20, 
    "consult": 0x80, 
    "complaint": 0x40 ,
	"report": 0x41,
	"suggestion": 0x81
}


//事物状态颜色
var TRANSACTION_STATUS_COLOR = {
    "-1": "danger",
    "0": "warning",
    "1": "info"

}

//事物状态
var TRANSACTION_STATUS = {
    "stop": "-1",   //禁止
    "apply": "0",   //申请中
    "release": "1", //发布
}