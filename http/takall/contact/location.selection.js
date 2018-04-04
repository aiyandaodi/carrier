(function(window){
	var AJAXURL = tek.common.getRootPath() + 'servlet/tobject';

	// var locationInput = document.getElementById('location-input');
	// var locationInput = document.getElementById('location-input');

	// var stateListWraper = document.getElementById('location-city-list');
	// var stateListWraper = document.getElementById('location-city-list');


	var cityListWraper;

	var stateChoose = null;
	var cityChoose = null;
	var DATA_TYPE = 'address';

	window.cityLocation = function(obj){
		var stateListId = obj.stateId,
			cityListId = obj.cityId,
			inputId = obj.inputId;

		if(obj.stateChoose && typeof obj.stateChoose == 'function'){
			stateChoose = obj.stateChoose;
		}

		if(obj.cityChoose && typeof obj.cityChoose == 'function'){
			cityChoose = obj.cityChoose;
		}

		locationInput = document.getElementById(inputId);
		stateListWraper = document.getElementById(stateListId);
		stateListWraper.style.display = 'none';
		cityListWraper = document.getElementById(cityListId);

		locationInput.onfocus = function(e){
			show(stateListWraper);
		}

		addEvent(document, 'click', function(e){
			hide(stateListWraper);
		});

		addEvent(stateListWraper, 'click', function(e){
			cancelBuble(e);
		});

		addEvent(locationInput, 'click', function(e){
			cancelBuble(e);
		});

		showLocationList(stateListWraper);
	}	

	function createUl(arr){
		var ulEle = document.createElement('ul');

		function getLi(obj){
			var liEle = document.createElement('li');
			liEle.className = 'location-city-list-one search-item';
			liEle.innerHTML = obj['name'];
			liEle.setAttribute('data-code', obj['code']);

			liEle.onclick = function(){
				var code = this.getAttribute('data-code');

				locationInput.value = this.innerHTML;

				if(!code){
					return;
				}

				if(stateChoose && typeof stateChoose === "function"){
					stateChoose(this, obj['name'], obj['code']);
				}

				hide(stateListWraper);

				getStateList(code);
			}

			return liEle;
		}

		for(var i = 0, len = arr.length; i < len; i++){
			ulEle.appendChild(getLi(arr[i]));
		}

		return ulEle;
	}

	function createARow(name, arr){
		var rowDiv = document.createElement('div');
		rowDiv.className = 'row';

		var colMd1Div = document.createElement('div');
		colMd1Div.className = 'col-md-1';

		var aEle = document.createElement('a');
		aEle.innerHTML = name;

		colMd1Div.appendChild(aEle);

		rowDiv.appendChild(colMd1Div);

		var colMd11Div = document.createElement('div');
		colMd11Div.className = 'col-md-11';
		var ulEle = createUl(arr);
		colMd11Div.appendChild(ulEle);

		rowDiv.appendChild(colMd11Div);
		return rowDiv;
	}


	function createStateList(){
		var arr1 = [
			{name: '安徽省', code: 'CN0551'},
			{name: '北京市', code: 'CN010'},
			{name: '重庆市', code: 'CN023'},
			{name: '福建省', code: 'CN591'},
			{name: '广东省', code: 'CN020'},
			{name: '甘肃省', code: 'CN0931'},
			{name: '贵州省', code: 'CN085'},
			{name: '广西壮族自治区', code: 'CN450000'},
			{name: '海南省', code: 'CN0898'},
			{name: '黑龙江省', code: 'CN0451'},
			{name: '湖南省', code: 'CN0730'},
			{name: '湖北省', code: 'CN027'},
			{name: '河南省', code: 'CN0370'},
			{name: '河北省', code: 'CN0311'}
		];

		var arr2 = [
			{name: '江西省', code: 'CN360000'},
			{name: '吉林省', code: 'CN0431'},
			{name: '江苏省', code: 'CN025'},
			{name: '辽宁省', code: 'CN024'},
			{name: '内蒙古自治区', code: 'CN150000'},
			{name: '宁夏回族自治区', code: 'CN095'},
			{name: '上海市', code: 'CN021'},
			{name: '陕西省', code: 'CN029'},
			{name: '山西省', code: 'CN0351'},
			{name: '四川省', code: 'CN028'},
			{name: '山东省', code: 'CN0531'}
		];

		var arr3 = [
			{name: '青海省', code: 'CN097'},
			{name: '天津市', code: 'CN022'},
			{name: '新疆维吾尔自治区', code: 'CN'},
			{name: '西藏自治区', code: 'CN0891'},
			{name: '云南省', code: 'CN0871'},
			{name: '浙江省', code: 'CN0571'}
		];

		var listWraper = document.createElement('div');

		

		listWraper.appendChild(createARow('ABCFGH', arr1));
		listWraper.appendChild(createARow('JLNS', arr2));
		listWraper.appendChild(createARow('QTXYZ', arr3));

		return listWraper;
	}

	function createCloseBtn(){
		var closeBtn = document.createElement('span');
		// closeBtn.innerHTML = '+';
		closeBtn.className = 'state_list_close_btn';
		closeBtn.onclick = function(){
			hide(stateListWraper);
		}
		return closeBtn;
	}

	function createCityList(arr){
		var ulEle = document.createElement('ul');

		var createCityLi = function(obj){
			var liEle = document.createElement('li');

			var cityName = obj['city_fullname']['value'];
			var cityCode = obj['city_code']['value'];
			
			liEle.setAttribute('data-value', cityName);
			liEle.setAttribute('data-code', cityCode);
			liEle.setAttribute('data-count', 0);
			liEle.setAttribute('data-type', DATA_TYPE);
			liEle.className = 'address-list';
			
			liEle.onclick = function(e){
				var preCount = parseInt(this.getAttribute('data-count'));
				var curCount = preCount + 1;
				this.setAttribute('data-count', curCount);

				if(cityChoose){
					cityChoose(this, obj['name'], obj['city_code']['value']);
				}
			}

			var spanEle = document.createElement('span');
			spanEle.innerHTML = obj['city_fullname']['value'];
			spanEle.setAttribute('data-type', DATA_TYPE);
			spanEle.setAttribute('data-value', cityCode);

			liEle.appendChild(spanEle);

			return liEle;
		}

		for(var i = 0, len = arr.length; i < len; i++){
			ulEle.appendChild(createCityLi(arr[i]));
		}

		return ulEle;
	}

	function showLocationList(ele){
		var listStr = createStateList();

		var closeBtn = createCloseBtn();
		ele.appendChild(closeBtn);


		ele.appendChild(listStr);
	}

	function getStateList(code){
		if(!code){
			console.log('bianmayouwu');
			return;
		}

	    var sendData = {
	    	set: '获取三级行政单位',
	        objectName: "City",
	        action: "getList",
	        state_code: code || '',
	        city_locale: 'zh_CN'
	    };

	    sendAjax(sendData, function(data){
	    	if(data && data.code == 0){
	    		if(data.record){
	    			var record = data.record;
	    			record = record.length ? record : [record];

	    			cityListWraper.innerHTML = '';
	    			cityListWraper.appendChild(createCityList(record));
	    		}else{
	    			cityListWraper.innerHTML = '<ul><li class="address-list">没有数据</li></ul>';
	    		}
	    	}else{
	    		cityListWraper.innerHTML = '<ul><li class="address-list">没有数据</li></ul>';
	    	}
	    });
	}

	function show(ele){
		ele.style.display = 'block';
	}

	function hide(ele){
		ele.style.display = 'none';	
	}

	function sendAjax(data, dataOk){
		var setting = {
			operateType: data.set,
			nodebug: 1
		};

	    var sendData = data;
	    
	    delete data.set;

	    var callback = {
	        beforeSend: function () {
	            
	        },
	        success: function (data) {
	        	if(data && data.code == 0){
	        		if(dataOk && typeof dataOk === 'function'){
	        			dataOk(data);
	        		}
	        	}
	        },
	        error: function (data, errorMsg) {
	            cityListWraper.innerHTML = '<ul><li class="address-list">没有数据</li></ul>';
	        }
	    };

	    tek.common.ajax(AJAXURL, setting, sendData, callback);
	}

	function isFocus(ele){
		if(document.activeElement == ele){
			return true;
		}else{
			return false;
		}
	}

	function addEvent(ele, type, callback, catchEle){
		if(ele.addEventListener){
			ele.addEventListener(type, callback, catchEle);
		}else if(ele.attachEvent){
			ele.attachEvent('on' + type, callback, catchEle);
		}else{
			ele['on' + type] = callback
		}
	}

	function cancelBuble(ev){
		ev = ev || window.event;
	    if(document.all){
	        ev.cancelBubble = true;
	    }else{
	        ev.stopPropagation();
	    }
	}

})(window);