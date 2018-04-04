// JavaScript Document

/**
 * 列表形式显示数据
 *
 * @param records
 *           检索所有数据
 * @param data
 *           检索结果
 */
tek.macList.showCustomListRecords=function(records,data) {
	if(records){
		$("#table-infos").html("");
	}else{
		$("#table-infos").html("没有数据!");
		return;
	}
	var tr=document.getElementById("table-columns");
	
	if(tr){
		// 1、设置列名行
		if(tr.innerHTML.length<=0){
			if (records.length) {
				// 多条数据
				showColumns(records[0],tr);
			}else{
			// 一条数据
				showColumns(records,tr);
			}
		}
		
		// 2、设置排序
		for(var i in tek.macList.columns){
			var elem=document.getElementById("img_"+tek.macList.columns[i]);
			if(!elem)
				continue;
			if(params["order"]==tek.macList.columns[i]){
				elem.style.display="";
				var desc=params["desc"];
				if(desc==1 || desc=="1" || desc=="true" || desc==true)
					elem.src=dascendingPath;
				else
					elem.src=ascendingPath;
			}else{
				elem.style.display="none";
			}
		}
	
		// 3、设置数据
		var elem=document.getElementById("table-infos");
		if(!elem)
			return;
		if(records.length){
			// 多条数据
			for(var i in records){
				showInfo(records[i],data,elem);
			}
		}else{
			// 一条数据
			showInfo(records,data,elem);		
		}
	}
}

//显示列名
function showColumns(record,tr){
	if(!tr)
		return;
	var sb=new StringBuffer(); 
	if((typeof tek.macList.columns) != "object" || !tek.macList.columns || tek.macList.columns.length<=0) {
		// 未定义显示列，显示所有列
		for (var name in record) {
			if(record[name] && record[name].display)
				tek.macList.columns.push(record[name].name);
		}
	}
		  
	for(var i in tek.macList.columns) {
		if(!tek.macList.columns[i])
			continue;
		var field=record[tek.macList.columns[i]];
		if(!field)
			continue;
		sb.append("<th id='column-");
		sb.append(tek.macList.columns[i]);
		sb.append("-title' class='column-");
		sb.append(tek.macList.columns[i]);
		sb.append("' style='cursor:pointer' onClick=\"tek.macList.changeOrder('");
		sb.append(tek.macList.columns[i]);
		sb.append("');\" onMouseOver=\"tek.macList.columnMouseOver(this);\" onMouseOut=\"tek.macList.columnMouseOut(this);\">");
		sb.append(field.display);
		sb.append("</th>");
	}
		
	tr.insertAdjacentHTML('BeforeEnd', sb.toString());
}

//显示信息
function showInfo(record,data,elem){
  var sb=new StringBuffer();
  
  sb.append("<tr>");
  // 列信息
  for(var j in tek.macList.columns)
    tek.macList.appendListField(record[tek.macList.columns[j]],record,data,sb);
  sb.append("</tr>");
  elem.insertAdjacentHTML('BeforeEnd', sb.toString());
}

//响应刷新事件   
function myRefresh(){	
	tek.macList.getList();
}

//返回上一级页面
function goback() {
	window.history.back();
}
