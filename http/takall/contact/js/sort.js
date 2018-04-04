//自由驱动工作室
//作者：林鑫

function initials() {//公众号排序
   <!-- var SortList=$(".sort_list");var SortBox=$(".sort_box");-->]
   var SortBox=$(".container-fluid");
  //数组的大小一定要正确，不然底下报错
  var SortList = new Array(28)
SortList[0] = "张三"
SortList[1] = "李四"
SortList[2] = "王五"
SortList[3] = "王八"
SortList[4] = "阿八"
SortList[5] = "阿七"
SortList[6] = "五哥"
SortList[7] = "七哥"
SortList[8] = "浩哥"
SortList[9] = "逼哥"
SortList[10] = "dj哥"
SortList[11] = "么辉哥"
SortList[12] = "微笑哥"
SortList[13] = "+h"
SortList[14] = "小灰灰"
SortList[15] = "辉总"
SortList[16] = "黎比爱"
SortList[17] = "大头"
SortList[18] = "一只"
SortList[19] = "么牛"
SortList[20] = "打个辉"
SortList[21] = "阿水"
SortList[22] = "浩哥"
SortList[23] = "逼哥"
SortList[24] = "dj哥"
SortList[25] = "么辉哥"
SortList[26] = "微笑哥"
SortList[27] = "+h"

    SortList.sort(asc_sort);//按首字母排序
	
    function asc_sort(a, b) {
		//num_name每条记录的class 名字
	    
        return makePy(b.charAt(0))[0].toUpperCase() < makePy(a.charAt(0))[0].toUpperCase() ? 1 : -1;
    }
  
    var initials = [];
    var num=0;
	//提取出通讯录中所有记录的首字母

  for(var i=0;i<SortList.length;i++) {
	 
        var initial = makePy(SortList[i].charAt(0))[0].toUpperCase();
	  
        if(initial>='A'&&initial<='Z'){
		
            if (initials.indexOf(initial) === -1)
                initials.push(initial);
        }else{
            num++;
        }
		
      
    }
	
	
   //将提出来的首字母插入到标签中
    $.each(initials, function(index, value) {//添加首字母标签
	  
        SortBox.append('<div class="item" id="'+ value +'"> <h3>' + value + '</h3></div>');
    });
    if(num!=0){SortBox.append('<div class="item" id="default"> <h3># </h3></div>');}
   
    for (var i =0;i<SortList.length;i++) {//插入到对应的首字母后面
	  
        var letter=makePy(SortList[i].charAt(0))[0].toUpperCase();
		
        switch(letter){
            case "A":
                $('#A').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "B":
                $('#B').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "C":
                $('#C').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "D":
                $('#D').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "E":
                $('#E').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "F":
                $('#F').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "G":
                $('#G').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "H":
                $('#H').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "I":
                $('#I').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "J":
                $('#J').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "K":
                $('#K').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "L":
                $('#L').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "M":
                $('#M').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "O":
                $('#O').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "P":
                $('#P').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "Q":
                $('#Q').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "R":
                $('#R').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "S":
                $('#S').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "T":
                $('#T').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "U":
                $('#U').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "V":
                $('#V').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "W":
                $('#W').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "X":
                $('#X').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "Y":
                $('#Y').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            case "Z":
                $('#Z').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
            default:
                $('#default').append('<p><a href="#" >'+SortList[i]+'</a></p>');
                break;
        }
    };
}