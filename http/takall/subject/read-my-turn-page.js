// JavaScript Document
/**
 *  说明：翻页代码
 *      为 read-reply.js 文件服务
 *
 *  注意：调用此页面 需要实现    方法 list();
 */
var MY_TURN_PAGE = {
    skip: 0,										//技术起始值
    total: 0,									//记录总条数
    DefaultCountPerPage: 20,						//默认每页显示的条数
    maxPage: 5,									//每屏幕显示页码数
    currentCount: 20,			//当前每页显示的条数
    currentFromPage: 1,								//当前显示的页码起始值
    currentPage: 1,								//当前页
    totalPage: 1,								//总页数
    pageShowId: "subject-page",					//显示页码的id
    //翻页
    turnPage: function (eTotal, eCcount) {
        var page = Math.ceil(eTotal / eCcount);
        if (page == 0)
            page = 1;	//只有一页

        MY_TURN_PAGE.totalPage = page;		//保存总页数
        MY_TURN_PAGE.total = eTotal;		//保存总数

        MY_TURN_PAGE.currentCount = eCcount;	//保存每页显示的条数

        MY_TURN_PAGE.showpagebutton();	//显示翻页
    },
    //显示页码按钮
    showpagebutton: function () {
        var pagestr = "";

        //获取截止页
        var currentEndPage = (MY_TURN_PAGE.currentFromPage + MY_TURN_PAGE.maxPage - 1);
        if (currentEndPage > MY_TURN_PAGE.totalPage)
            currentEndPage = MY_TURN_PAGE.totalPage;

        //显示 xx/xxxx
        pagestr += "<li style='float:left'>"
            + "<div style='padding: 6px 12px;line-height: 1.5;'>" + MY_TURN_PAGE.currentPage + "/" + "页 共" + MY_TURN_PAGE.total + "条</div>"
            + "</li>";

        //上一组
        if (MY_TURN_PAGE.currentFromPage == 1) {	//没有上一组
            pagestr += "";
        } else {
            //上一组
            pagestr += "<li title='上一组' style='cursor:pointer' onClick=\"MY_TURN_PAGE.quickChange('Pre',event);\"><a>«</a></li>";
        }//end if(currentFromPage - maxPage > 1)

        //上一页
        if (MY_TURN_PAGE.currentPage == 1) {	//首页
            //上一页
            pagestr += "";
        } else {
            //上一页
            pagestr += "<li title='上一页' style='cursor:pointer' onClick=\"MY_TURN_PAGE.change('Pre',event);\"><a>‹</a></li>";
        }//end if(currentPage == 1)

        //页码
        for (var j = MY_TURN_PAGE.currentFromPage; j <= currentEndPage; j++) {
            if (j == MY_TURN_PAGE.currentPage) {
                pagestr += "<li style='cursor:pointer' class='active'><a>" + j + "</a></li>";
            } else {
                pagestr += "<li style='cursor:pointer' onClick=\"MY_TURN_PAGE.change(" + j + ",event)\"><a>" + j + "</a></li>";
            }
        }

        //下一页
        if (MY_TURN_PAGE.currentPage == MY_TURN_PAGE.totalPage) {	//尾页
            //下一页
            pagestr += "";
        } else {
            //下一页
            pagestr += "<li title='下一页' style='cursor:pointer' onClick=\"MY_TURN_PAGE.change('Next',event);\"><a>›</a></li>";
        }//end if(currentPage == 1)

        //下一组
        if (currentEndPage == MY_TURN_PAGE.totalPage) {	//没有下一组
            pagestr += "";
        } else {
            //下一组
            pagestr += "<li title='下一组' style='cursor:pointer' onClick=\"MY_TURN_PAGE.quickChange('Next',event);\"><a>»</a></li>";
        }//end if(currentFromPage - maxPage > 1)

        $("#" + MY_TURN_PAGE.pageShowId).html(pagestr);
    },

    /**
     *    页面翻组
     *    @param mark
     *            翻组标记（向前或者向后）
     *    @param elem
     *            鼠标事件
     */
    quickChange: function (mark, elem) {
        if (mark == "Pre") {
            MY_TURN_PAGE.currentPage = MY_TURN_PAGE.currentFromPage - 1;				//翻组向前（当前页）
            MY_TURN_PAGE.currentFromPage = MY_TURN_PAGE.currentFromPage - MY_TURN_PAGE.maxPage;		//翻组向前（起始页向前）
        } else if (mark == "Next") {
            MY_TURN_PAGE.currentPage = MY_TURN_PAGE.currentFromPage + MY_TURN_PAGE.maxPage;	//翻组向后（当前页
            MY_TURN_PAGE.currentFromPage = MY_TURN_PAGE.currentFromPage + MY_TURN_PAGE.maxPage;		//翻组向后（起始页向前）
        }//end if(mark=="Pre") else

        //改变列表起始位置
        MY_TURN_PAGE.skip = (MY_TURN_PAGE.currentPage - 1) * MY_TURN_PAGE.currentCount;

        MY_TURN_PAGE.showpagebutton();

        if (typeof getMyList == "function")
            getMyList();	//重新查询
        else
            alert("缺少getMyList方法！");
    },
    /**
     *    页面翻页
     *    @param mark
     *            翻页标记（向前或者向后）
     *    @param elem
     *            鼠标事件
     */
    change: function (mark, elem) {
        if (mark == "Pre") {	//上一页
            if (MY_TURN_PAGE.currentPage == MY_TURN_PAGE.currentFromPage) {	//新的一组
                MY_TURN_PAGE.currentFromPage = MY_TURN_PAGE.currentFromPage - MY_TURN_PAGE.maxPage;		//翻组向前（起始页向前）
            }
            MY_TURN_PAGE.currentPage--;
        } else if (mark == "Next") {	//下一页
            if (MY_TURN_PAGE.currentPage == (MY_TURN_PAGE.currentFromPage + MY_TURN_PAGE.maxPage - 1)) {
                MY_TURN_PAGE.currentFromPage = MY_TURN_PAGE.currentFromPage + MY_TURN_PAGE.maxPage;		//翻组向前（起始页向前）
            }
            MY_TURN_PAGE.currentPage++;
        } else
            MY_TURN_PAGE.currentPage = parseInt(mark);

        //改变列表起始位置
        MY_TURN_PAGE.skip = (MY_TURN_PAGE.currentPage - 1) * MY_TURN_PAGE.currentCount;

        if (typeof getMyList == "function")
            getMyList();	//重新查询
        else
            alert("缺少getMyList方法！");
    },
    //初始化参数
    config: function (configData) {
        var configData = configData || {};
        if (typeof configData["skip"] == "number" && configData["skip"] >= 0)
            MY_TURN_PAGE.skip = configData["skip"];						//起始值
        if (typeof configData["DefaultCountPerPage"] == "number" && configData["DefaultCountPerPage"] > 0) {
            MY_TURN_PAGE.DefaultCountPerPage = configData["DefaultCountPerPage"];	//默认每页显示的条数
            MY_TURN_PAGE.currentCount = MY_TURN_PAGE.DefaultCountPerPage; //当前每页显示的条数
        }
        if (typeof configData["maxPage"] == "number" && configData["maxPage"] > 0)
            MY_TURN_PAGE.maxPage = configData["maxPage"];				//每屏幕显示页码数

        if (typeof configData["pageShowId"] == "string" && configData["pageShowId"] != "")
            MY_TURN_PAGE.pageShowId = configData["pageShowId"];
    }
};
