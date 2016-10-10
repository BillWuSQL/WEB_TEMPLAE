/*
 * @Auth BillWu 201610
 * */

var common = {};

/* =========================================================================================================================================================== */
/* common variables ==================================================================================================================================== Start */
common.baseDomain = "http://" + document.domain;	//当前网站的域名
common.login = {}; 
common.login.admin = common.baseDomain + "/admin/index.html";	//登录成功后转到的管理首页
common.login.index = common.baseDomain + "";	//无权限登录退出的url

common.list = [];			//页面列表影子类
common.listUrl = ""; 		//页面列表api url影子类
common.requestPojo = {};	//页面列表request参数影子类
common.pageTableDivId = "";	//content页面的divid
common.lastColumnHtmlList = []; //列表最后一列按钮列表参数
/* =========================================================================================================================================================== */
/* common variables ====================================================================================================================================   End */

/* =========================================================================================================================================================== */
/* 菜单操作类 ============================================================================================================================================ Start */
common.menu = {};	//菜单操作类
/**
 * 菜单重新load页面
 * @param url 要reload的url路径
 * @param ths 当前对象,即this
 * @return 
 */
common.menu.goUrl = function(url) {
	var pageWrapper = $("#page-wrapper"); //页面内容模板
	//reload url
	pageWrapper.load(url);
	//把当前menu 保存住
	$.cookie('amenu', url, { expires: 300 });
	
	common.menu.freshMenu();
};
//重新refresh 左menu, 点击事件, 好少用到
common.menu.freshMenu4click = function() {
	var aurl = $.cookie('amenu');
	$("ul.navbar-nav ul li").each(function() {
		var ths = this;
		$(ths).removeClass("active");
	});
	
	//重新css=active
	var obj = $(this).parent().find("li");
//	console.log(obj);
	obj.addClass("active");
}

//重新refresh 左menu
common.menu.freshMenu = function() {
	var aurl = $.cookie('amenu');
    $("ul.navbar-nav ul li").each(function() {
    	var ths = this;
    	$(ths).removeClass("active");
    	
    	var baseHref = $(ths).find("a").attr("href");
    	if (aurl && baseHref) {
    		//如果 包含有的，就active
        	if (baseHref.indexOf(aurl) >= 0) {
        		//重新css=active
        		var obj = $(ths).parent().find("li");
//        		console.log(obj);
        		obj.addClass("active");
        	}
    	} else {
    		//万一出错了，可以用这个
    		$("ul.navbar-nav ul li").one("click", common.menu.freshMenu4click);
    	}
    });
}
//重新refresh 点击 分页事件, no use 
common.menu.freshPageA = function() {
    $("ul.pagination li").each(function() {
    	var ths = this;
    	$(ths).removeClass("active");
    });
    //重新css=active
    var obj = $(this).parent().find("li");
//    console.log(obj);
    obj.addClass("active");
}
//重新refresh 左menu click事件, no use
//$("ul.navbar-nav ul li").click(common.menu.freshMenu);
/* =========================================================================================================================================================== */
/* 菜单操作类 ============================================================================================================================================   End */

/* ========================================================================================================================================================= */
/* 按钮方法类 ============================================================================================================================================ Start */
common.btn = {};	//按钮方法类
/**
 * 弹出 confirm框
 */
common.btn.confirmDivShow = function(title) {
	if (!title) {
		title = "确定 操作 ?";
	} else {
		title = "确定 " + title + "?";
	}
	$("#myModalContentDiv").text(title);
	params = {
			keyboard: true,
	};
	$('#myModal').modal(params);
}
/**
 * 隐藏 confirm框, no user
 * @despect
 */
common.btn.confirmDivHide = function() {
	$('#myModal').modal("hide");
}

/**
 * 按钮操作 确认框
 * demo: common.btn.confirm("house.topFunRun", "置顶", hid, rid); //传入自定义funciton
 * @param fun 点击确认运行的function
 * @param msg 提示语
 * @param param 第一个参数
 * @param param2 第二个参数
 * @return 
 */
common.btn.confirm = function(fun, msg, param, param2) {
	common.btn.confirmDivShow(msg);
	
	$("#myModalOkBtn").one("click", function() {
		if (fun) {
			var evStr = fun + "(";
			if (param && param2) {
				evStr += param + "," + param2 + ")";
//				fun(param, param2);
			} else if (param) {
				evStr += param + ")";
			} else {
				evStr += ")";
			}
			eval(evStr);
		}
	}
	);
}
/**
 * 按钮操作 确认框2, 直接传入obj, 然后ajax操作后台
 * demo: common.btn.confirm("置顶", "xxxx/top", obj)
 * demo: common.btn.confirm("置顶", "xxxx/top", obj, "xxxSucess")
 * @param resultInfoTitle 提示语
 * @param url 后台接口url
 * @param requestPojo 第一个参数
 * @param successFun 如果成功后,要执行的确方法
 * @param isFillTable 是否重刷列表数据 
 * @return 
 */
common.btn.confirmAjax = function(resultInfoTitle, url, requestPojo, successFun, isFillTable) {
	common.btn.confirmDivShow(resultInfoTitle);
	
	console.log("modiAjax url >" , url);
	console.log("modiAjax requestPojo >" , requestPojo);
	$("#myModalOkBtn").one("click", function() {
		//操作中, 显示加载中...样式 =========
	    common.btn.loadingDivShow();
		$.ajax({
		    type : 'post',
		   	url : url,
		    dataType:'jsonp',
			contentType:'application/json;charset=UTF-8', //jsonp这个好像可不用
//		    data: JSON.stringify(requestPojo), //java端用这个(好像没有测jsonp模式)，php端直接用 data: plData,
		    data: requestPojo,
		    jsonp: "callback",
		    jsonpCallback:"success_jsonpCallback",
		    success : function(data) {
		    	console.log("modiAjax data > ", data);
		    	if (data.result_code >= 0) {
		    		if (successFun) { //如果有指定了成功方法，则不显示提示框
		    			if (data) {
				        	successFun(data, requestPojo);	//最后这个requestPojo参数， 可用可不用
		    			} else {
		    				successFun();
		    			}
		    		} else { //如果并没有指定 成功方法就 提示框
		    			if (resultInfoTitle) {
			    			common.btn.alert(1, resultInfoTitle + "成功");
			    		} else {
			    			common.btn.alert();
			    		}
		    		}
		    		
		    		//是否重刷列表数据
	    			if (isFillTable) {
	    				common.page.currentPageList();
	    			}
		    	} else {
		    		if (data.result_info != null && data.result_info != "") {
	    				common.btn.alert(4,  data.result_info);
	    			} else {
	    				if (resultInfoTitle) {
	    					common.btn.alert(4,  resultInfoTitle + "失败");
	    				} else {
	    					common.btn.alert(4, "操作失败");
	    				}
	    			}
		    	}
		    	//操作完成后, 隐藏加载中...样式 =========
		        common.btn.loadingDivHide();
		    },
		    error : function() {
		    	if (resultInfoTitle) {
					common.btn.alert(4,  resultInfoTitle + "失败");
				} else {
					common.btn.alert(4, "操作失败");
				}
		    	//操作完成后, 隐藏加载中...样式 =========
		        common.btn.loadingDivHide();
		    }
		 });
	}
	);
}

/**
 * 显示 加载中 gif动画
 */
common.btn.loadingDivShow = function() {
    $("#loadingDiv").show();
}
/**
 * 隐藏 加载中 gif动画
 */
common.btn.loadingDivHide = function() {
	$("#loadingDiv").hide();
}

/**
 * 添加tush框 
 * @msg  弹窗内容
 * @type 类型 1:成功,2:提示,3:警告,4:失败
 */
common.btn.alert = function(type, msg, seconds) {
    //<!-- alert-success alert-info alert-warning alert-danger -->
    var classname = "alert-success";
	switch(type)
	{
	    case 1:
	        classname = "alert-success";
	        break;
	    case 2:
	        classname = "alert-info";
	        break;
	    case 3:
	        classname = "alert-warning";
	        break;
	    default:
	        classname = "alert-danger";
	}
	if (!msg) {
		msg = "操作成功";
	}
    
    var tushDivHtml = "";
    tushDivHtml += "<div class=\"alert " + classname + " alert-dismissable\" aria-hidden=\"true\">";
    tushDivHtml += "<a href=\"#\" class=\"close\" data-dismiss=\"alert\">";
    tushDivHtml +=         "&times;";
    tushDivHtml +=     "</a>";
    tushDivHtml +=     "<strong>提示！</strong> " + msg;
    tushDivHtml +=  "</div>";
    
    $("#tushDiv").append(tushDivHtml);
    
    //默认两秒后消失
    if (!seconds) {
    	seconds = 2;
    }
    setTimeout(common.btn.alertclear, 1000 * seconds);
}
//删除alert框
common.btn.alertclear = function() {
	$(".alert").remove();
}


/* page操作类 ========================================================================================================================================= Start */
/* ========================================================================================================================================================= */
common.page = {};	//页面操作类, 如分页, 列表初始化等
/**
 * 登录成功后 进入的管理首页
 **/
common.page.admin = function() {
	window.location = common.login.admin;
}
/**
 * 退出页面，比如登录信息过期等
 **/
common.page.out = function(data) {
	if (data.result_code == -802) {
		window.location = common.login.index;
	}
}
/**
 * 强制退出页面
 **/
common.page.mustout = function() {
	window.location = common.login.index;
}
/**
 * ajax update 后台
 * @param url 后台接口url
 * @param requestPojo 后台接口参数 
 * @param SucceFun 后台接口成功回调方法
 * @param isShowLoading 是否显示用完成后隐藏那个loading窗， 如果是true则不显示，如果 默认没值的则默认就显示 ... 一般 设置为false ,或者不设置, 有些 不需要的特殊情况才设置true(即 不让它动loading图片), 
 * @param isFillTable 是否重刷列表数据
 **/
common.page.updateAjax = function(url, requestPojo, SucceFun, isShowLoading, isFillTable) {
	console.log("updateAjax url  ", url);
	console.log("updateAjax requestPojo  ", requestPojo);
	
	//打开那个loading窗, 一般 设置为false ,或者不设置, 有些 不需要的特殊情况才设置true(即 不让它动loading图片), 
	if (!isShowLoading) {
		common.btn.loadingDivShow();
	}
	
	$.ajax({
	    type : 'post',
	   	url : url,
	    dataType:'jsonp',
//		contentType:'application/json;charset=UTF-8', //jsonp这个好像可不用
//	    data: JSON.stringify(requestPojo), //java端用这个(好像没有测jsonp模式)，php端直接用 data: plData,
	    data: requestPojo,
	    cache : false, 
	    async : false,//同步
	    jsonp: "callback",
	    jsonpCallback:"success_jsonpCallback",
	    success : function(data) {
	    	console.log("updateAjax result data ", data);
	    	if (data.result_code >= 0) {
	    		if (SucceFun) {
	    			SucceFun(data);
	    		}
	    		
	    		//是否重刷列表数据
	    		if (isFillTable) {
	    			common.page.currentPageList();
	    		}
	    		
	    	} else {
	    		if (data.result_info) {
	    			common.btn.alert(4, data.result_info);
	    		} else {
	    			common.btn.alert(4, "操作失败");
	    		}
				//判断是否需要 重新回到首页
				common.page.out(data);
	    	}
	    	if (!isShowLoading) {
    			//操作完成后, 隐藏加载中...样式 =========
    			common.btn.loadingDivHide();
    		}
	    },
	    error : function() {
	    	common.btn.alert(4, "操作失败");
	    	if (!isShowLoading) {
	    		//操作完成后, 隐藏加载中...样式 =========
	    		common.btn.loadingDivHide();
	    	}
	    }
	 });
}
/**
 * ajax 填空table list
 * @param url 后台接口url
 * @param requestPojo 后台接口参数 
 * @param pageTableDivId 列表div的id
 * @param lastColumnHtmlList 最后一列的操作按钮list
 * */
common.page.fillTableListAjax = function(url, requestPojo, pageTableDivId, lastColumnHtmlList) {
	console.log("fillTableListAjax url  ", url);
	console.log("fillTableListAjax requestPojo  ", requestPojo);
	//把 url, requestPojo等几个参数 重刷到 common.listUrl, common.requestPojo等中去， 以备以后分页点击等事件直接用
	common.listUrl = url;
	common.requestPojo = requestPojo;
	common.pageTableDivId = pageTableDivId;
	common.lastColumnHtmlList = lastColumnHtmlList;
	
	//操作之前, 显式显示加载中...样式 =========
	common.btn.loadingDivShow();
	
	$.ajax({
		type : 'post',
		url : url,
		dataType:'jsonp',
//		contentType:'application/json;charset=UTF-8', //jsonp这个好像可不用
//	    data: JSON.stringify(requestPojo), //java端用这个(好像没有测jsonp模式)，php端直接用 data: plData,
		data: requestPojo,
		jsonp: "callback",
		cache : false, 
		async : false,//同步
		jsonpCallback:"success_jsonpCallback",
		success : function(data) {
//	    	console.log("fillTableListAjax data > ", data);
			//把data.里的数组 重刷到 common.list 以备以后操作等事件直接用
			if (data.data) {
				common.list = data.data;
			} else if (data.list) {
				common.list = data.list;
			} else if (data.result) {
				common.list = data.result;
			}
			console.log("fillTableListAjax common.list ", common.list);
			
			if (data.result_code >= 0) {
				//填充table
				common.page.fillTableList(pageTableDivId, data, lastColumnHtmlList);
			} else {
				if (data.result_info) {
	    			common.btn.alert(4, data.result_info);
	    		} else {
	    			common.btn.alert(4, "操作失败");
	    		}
				
				//判断是否需要 重新回到首页
	    		common.page.out(data);
			}
			//操作完成后, 隐藏加载中...样式 =========
			common.btn.loadingDivHide();
		},
		error : function() {
			common.btn.alert(4, "操作失败");
			//操作完成后, 隐藏加载中...样式 =========
			common.btn.loadingDivHide();
		}
	});
}
/**
 * fill table list
 * 
填充分页表格模板方法, 一般在 ajaxlist() 模板里面自动调有了, 也可以独立调用
divId: 分页div的id, 此div 包含一个表格table ,再下面一个div(分页信息)
resultData: 表格
lastColumnHtmlList : 在最后一列追加的json列表 [{class:"icon-zoom-in", title:"商品", method:"js方法"}] //它就会生成 '<a class="blue" href="#"><i class="icon-zoom-in bigger-130">商品</i></a>'

demo:
var lastColumnHtmlList = [{class:"icon-external-link", title:"上架", method:"upStock"}];		//没有key表示只有一种情况 
var lastColumnHtmlList = [{key1:"", class1:"icon-external-link", title1:"上架", method1:"upStock", class2:"icon-external-link", title2:"下架", method1:"downStock"}];	//有key(根据此属性判断是否真假)代表,是根据此key,选择title1还是title2

@see ajaxlist()
@desc
	在表格th列上 class="sorting_asc"/代表向上排序  class="sorting_desc"/代表可以排序  class="sorting"/代表可以排序
	
	以下是JS方法模板
	removeSimplefun()		//单条的删除
	currentPageList()		//指定页面 , 可用在前一页, 后一页
	
	以下是全局参数
	var pageTableDiv = $("#pageTableDiv1");	//pageTableDivId就是 此toble 所有的div 的id
	
//test data 测试一下填充表格的方法
var vendorListResult = {'totalCount':20, 'totalPage':2, 'currentPage':1, 'number':10, 'startIndex':1, 'endIndex':10,  'result': [{aa:12,bb:12},{aa:22,bb:77}]};
var lastColumnJsonList = [{class:"icon-zoom-in", title:"商品", method:""}];
var divId = "pageTableDiv1";
fillPageTables(divId, vendorListResult, 0, true, true, lastColumnJsonList);
**/
common.page.fillTableList = function(divId, resultData, lastColumnHtmlList) {
	console.log("fillTableList resultData ", resultData);
//	console.log("fillTableList lastColumnHtmlList ", lastColumnHtmlList);
	
	var fatherDiv = $("#" + divId);
	fatherDiv.show();	//显示, 默认是隐藏的
	var tbody = fatherDiv.find("tbody");
	
	//把data.里的数组 重刷到 data
	var data = [];
	if (resultData.data) {
		data = resultData.data;
	} else if (resultData.list) {
		data = resultData.list;
	} else if (resultData.result) {
		data = resultData.result;
	}
	//先清除之前的tbody里面的html
	tbody.empty();
	
	//再用newTbodyHtml重新填充表格
	var newTbodyHtml = "";
	//判断为空列表
	if (!data || data.length <= 0) {
		newTbodyHtml = "<td>没有数据...</tds>";
	} else {
		//循环 data列表 ================================================================================================================================== Start
		for (var i = 0; i < data.length; i ++) {
			newTbodyHtml += "<tr>";
			var thead = fatherDiv.find("thead");
			//可以优化，暂时先eq(0)先
			var id = thead.find("input").eq(0).attr("name");
			
			//循环这个data[i]里的 每个列
			thead.find("th").each(function() {
				var columnName = $(this).attr("name");
				if ($.trim(columnName) != "") {
					if ($(this).attr("istrue") == "true") {	//如果有istrue属性, 表示0:否, 1:是
						if (data[i][columnName] == 0) {
							newTbodyHtml += "<td>否</td>";
						} else {
//								newTbodyHtml += "<td>是</td>";					
							newTbodyHtml += "<td><i style='color:red;' class='icon-external-link'>是</i></td>";
						}
					}
					else if ($(this).attr("width")) {	//表示  指定宽度
						if((data[i][columnName] != null)){
								newTbodyHtml += "<td width='" + $(this).attr("width") + "'>"+(data[i][columnName])+"</td>";
						}else{
							newTbodyHtml+="<td></td>";
						}
					}
					/*
					else if ($(this).attr("maxLen")) {	//表示  最大字符, 可以用，但暂时没用到，因为上面已经有了  width 参数 
						if((data[i][columnName] != null)){
							newTbodyHtml += "<td>"+util.maxLen(data[i][columnName], $(this).attr("maxLen"))+"</td>";
						}else{
							newTbodyHtml += "<td>"+(data[i][columnName])+"</td>";
						}
					}
					*/
					else if ($(this).attr("date") == "true") {	//表示日期类型replace
						if((data[i][columnName] != null)){
								var newDate = new Date(parseInt(data[i][columnName]));
								newTbodyHtml += "<td>"+newDate.Format('yyyy-MM-dd')+"</td>";
						}else{
							newTbodyHtml+="<td></td>";
						}
					}
					else if ($(this).attr("time") == "true") {	//表示时间类型
						if((data[i][columnName] != null)){
							var newDate = new Date(parseInt(data[i][columnName]));
							newTbodyHtml += "<td>" + +newDate.Format('HH:mm:ss')+ + "</td>";
						}else{
							newTbodyHtml+="<td></td>";
						}
					}
					else if ($(this).attr("datetime") == "true") {	//表示日期时间类型
						if((data[i][columnName] != null)){
						var newDate = new Date(parseInt(data[i][columnName]));
						newTbodyHtml += "<td>" +newDate.Format('yyyy-MM-dd hh:mm:ss')+ "</td>";
						}else{
							newTbodyHtml+="<td></td>";
						}
					}
					else if($.trim(columnName) == "payType") {	//支付方式, 以前的旧系统 的订单类型
						switch(data[i][columnName])
						{
							case '0':
								newTbodyHtml += "<td>未支付</td>";
							  break;
							case '1':
								newTbodyHtml += "<td>支付宝</td>";
							  break;
							case '2':
								newTbodyHtml += "<td>微信</td>";
							  break;
							case '31':
								newTbodyHtml += "<td>到付</td>";
							  break;
							default:
								newTbodyHtml += "<td>" + data[i][columnName] + "</td>";
						}
					}
					else if($.trim(columnName) == "house_type") {	//租房类型, 1:整租,2:合租
						switch(data[i][columnName])
						{
							case 1:
								newTbodyHtml += "<td>整租</td>";
								break;
							case 2:
								newTbodyHtml += "<td>合租</td>";
								break;
							default:
								newTbodyHtml += "<td>" + data[i][columnName] + "</td>";
						}
					}
					
					else if($(this).attr("linkfun")) {	 //链接方法
						var aDomSart = "<td>";
						var aDomEnd = "</a></td>";
						
						aDomSart += "<a href='javascript:" + $(this).attr("linkfun") + "(" + i + ")'>";
						
						if ($(this).attr("img") == "true") {	//有图片
							newTbodyHtml += aDomSart + "<img src='"+data[i][columnName]+"' width=\"80px\" height=\"60px\" />";
						} else {	//无图片
							newTbodyHtml += aDomSart  + data[i][columnName];
						}
						newTbodyHtml += aDomEnd;
					}
					else if($(this).attr("img") == "true" && !$(this).attr("linkfun")) {	 //图片 并且没有 链接方法
						var imgWidth = "80px";
						var imgHeight = "60px";
						if ($(this).attr("img-width")) {
							imgWidth = $(this).attr("img-width") + "px";
						}
						if ($(this).attr("img-height")) {
							imgHeight = $(this).attr("img-height") + "px";
						}
						newTbodyHtml +="<td><img src='"+data[i][columnName]+"' width=\"" + imgWidth + "\" height=\""+ imgHeight + "\" /></td>";
					}
					
					else {	//普通的属性 
						if (data[i][columnName] == null || data[i][columnName] == "null") {
							newTbodyHtml += "<td>&nbsp;";
						} else {
							newTbodyHtml += "<td>" + data[i][columnName] + "</td>";
						}
					}
				}
			});
			
			newTbodyHtml += '<td>';
			//  循环 最后一列的lastColumnHtmlList==================================================================================== Start
			var lastColumnHtmlListHtml = common.page.fillLastColumnHtmlList(lastColumnHtmlList, data, i);
			newTbodyHtml += lastColumnHtmlListHtml;
			//  循环 最后一列的lastColumnHtmlList==================================================================================== End
			
			newTbodyHtml += '</td>';
			newTbodyHtml += "</tr>";
		}
		//循环 data列表 ================================================================================================================================== End
	}
	tbody.html(newTbodyHtml);
	
	//  分页 ============================================================================================================ Start
	var pageNoDiv = $("#pageCountDiv");
	var pageNoDivHtml = common.page.fillTablePageList(resultData);
	pageNoDiv.html(pageNoDivHtml);
	//  分页 ============================================================================================================  End
	
}

/**
 * 生成最后一列的按钮 
 * @param lastColumnHtmlList 自定义按钮list
 * @param data 列表数组数据 
 * @param i 列表数组的当前key 
 * */
common.page.fillLastColumnHtmlList = function(lastColumnHtmlList, data, i) {
	var newTbodyHtml = "";
	if (lastColumnHtmlList) {
		for (var jj = 0; jj < lastColumnHtmlList.length; jj++) {
			//开放出租，关闭出租按钮组
			if (lastColumnHtmlList[jj].keyOpenStatus) {
				var columnName = $(this).attr("name");
				var room_id = data[i]['room_id'];
				var is_active = data[i]['is_active'];
				
				var columnName = lastColumnHtmlList[jj].keyOpenStatus;
				
				if (room_id) { //表示合租的
					if (data[i][columnName] && data[i][columnName] == '已发布' && is_active == 1) {		//可以关闭出租
						if (lastColumnHtmlList[jj].class2) {
							newTbodyHtml += '&nbsp;<button type="button" class="btn ' 
								+ lastColumnHtmlList[jj].class2 + '"'
								+ 'onclick="' + lastColumnHtmlList[jj].method2 + '(' + i + ',\'' + lastColumnHtmlList[jj].title2 + '\')">'
								+ lastColumnHtmlList[jj].title2 + '</button>';
						}
					} else if (data[i][columnName] && data[i][columnName] == '已发布' && is_active == 0) {	//可以开放出租
						if (lastColumnHtmlList[jj].class) {
							newTbodyHtml += '&nbsp;<button type="button" class="btn ' 
								+ lastColumnHtmlList[jj].class + '"'
								+ 'onclick="' + lastColumnHtmlList[jj].method + '(' + i + ',\'' + lastColumnHtmlList[jj].title + '\')">'
								+ lastColumnHtmlList[jj].title + '</button>';
						}
					} else if (data[i][columnName] && data[i][columnName] == '已出租' && is_active == 1) {		//可以关闭出租
						if (lastColumnHtmlList[jj].class2) {
							newTbodyHtml += '&nbsp;<button type="button" class="btn ' 
								+ lastColumnHtmlList[jj].class2 + '"'
								+ 'onclick="' + lastColumnHtmlList[jj].method2 + '(' + i + ',\'' + lastColumnHtmlList[jj].title2 + '\')">'
								+ lastColumnHtmlList[jj].title2 + '</button>';
						}
					} else if (data[i][columnName] && data[i][columnName] == '已出租' && is_active == 0) {	//可以开放出租
						if (lastColumnHtmlList[jj].class) {
							newTbodyHtml += '&nbsp;<button type="button" class="btn ' 
								+ lastColumnHtmlList[jj].class + '"'
								+ 'onclick="' + lastColumnHtmlList[jj].method + '(' + i + ',\'' + lastColumnHtmlList[jj].title + '\')">'
								+ lastColumnHtmlList[jj].title + '</button>';
						}
					}
				} else { //表示整租的
					if (data[i][columnName] && data[i][columnName] == '已发布') {		//可以关闭出租
						if (lastColumnHtmlList[jj].class2) {
							newTbodyHtml += '&nbsp;<button type="button" class="btn ' 
								+ lastColumnHtmlList[jj].class2 + '"'
								+ 'onclick="' + lastColumnHtmlList[jj].method2 + '(' + i + ',\'' + lastColumnHtmlList[jj].title2 + '\')">'
								+ lastColumnHtmlList[jj].title2 + '</button>';
						}
					} else if (data[i][columnName] && data[i][columnName] == '已出租') {	//可以开放出租
						if (lastColumnHtmlList[jj].class) {
							newTbodyHtml += '&nbsp;<button type="button" class="btn ' 
								+ lastColumnHtmlList[jj].class + '"'
								+ 'onclick="' + lastColumnHtmlList[jj].method + '(' + i + ',\'' + lastColumnHtmlList[jj].title + '\')">'
								+ lastColumnHtmlList[jj].title + '</button>';
						}
					}
				}
			} else {
				//普通 按钮，比如删除按钮
				if (lastColumnHtmlList[jj].class) {
					newTbodyHtml += '&nbsp;<button type="button" class="btn ' 
						+ lastColumnHtmlList[jj].class + '"'
						+ 'onclick="' + lastColumnHtmlList[jj].method + '(' + i + ',\'' + lastColumnHtmlList[jj].title + '\')">'
						+ lastColumnHtmlList[jj].title + '</button>';
				}
			}
		}
	}
	return newTbodyHtml;
}
/**
 * 当前页
 * @param i 当前页的页数
 * */
common.page.currentPageList = function(i) {
	//更改 当前页数, i
	if (i) {
		common.requestPojo.p = i;
	}
	
	var url = common.listUrl;
	var requestPojo = common.requestPojo;
	var pageTableDivId = common.pageTableDivId;
	var lastColumnHtmlList = common.lastColumnHtmlList;
	console.log("currentPageList requestPojo ", requestPojo);
	
	//操作之前, 显式显示加载中...样式 =========
	common.btn.loadingDivShow();
	
	$.ajax({
	    type : 'post',
	   	url : url,
	    dataType:'jsonp',
//		contentType:'application/json;charset=UTF-8', //jsonp这个好像可不用
//	    data: JSON.stringify(requestPojo), //java端用这个(好像没有测jsonp模式)，php端直接用 data: plData,
	    data: requestPojo,
	    jsonp: "callback",
	    jsonpCallback:"success_jsonpCallback",
	    success : function(data) {
//	    	console.log("fillTableListAjax data > ", data);
	    	//把data.里的数组 重刷到 common.list 以备以后操作等事件直接用
	    	if (data.data) {
	    		common.list = data.data;
	    	} else if (data.list) {
	    		common.list = data.list;
	    	} else if (data.result) {
	    		common.list = data.result;
	    	}
	    	console.log("fillTableListAjax common.list ", common.list);
	    	
	    	if (data.result_code >= 0) {
	    		//填充table
	    		common.page.fillTableList(pageTableDivId, data, lastColumnHtmlList);
	    	} else {
	    		if (data.result_info) {
	    			common.btn.alert(4, data.result_info);
	    		} else {
	    			common.btn.alert(4, "操作失败");
	    		}
	    	}
	    	//操作完成后, 隐藏加载中...样式 =========
	        common.btn.loadingDivHide();
	    },
	    error : function() {
	    	common.btn.alert(4, "操作失败");
	    	//操作完成后, 隐藏加载中...样式 =========
	        common.btn.loadingDivHide();
	    }
	 });
}

/**
 * 生成分页dom 
 * */
common.page.fillTablePageList = function(resultData) {
	
	//以下三个参数必须要有, 4 web ajax模板
//	resultData.totalRecord = 100;  //总记录
//	resultData.totalPage = 5;//总有几页
//	resultData.p = 2;	//第几页
	if (!resultData || !resultData.totalRecord || resultData.totalRecord <= 0) {
		return "";
	}
	
	//总共页数
	var showPages =  resultData.totalPage;
	//总共记录数
	var totalRecord =  resultData.totalRecord;
	//当前第几页
	var current = resultData.p;
	
	
	//分页页码 demo: << 1, 2, 3 >>
	var pageNoDivHtml = '<ul class="pagination">';
//	var pageNoDivHtml = '<li><a href="javascript:common.page.currentPageList(1)"> << </a></li>';
	if (current == 1 || totalRecord < 1) {
		//没有页数
	} else {
		//第一页 这里暂时找不到好的样式，先隐藏
//		pageNoDivHtml += '<li><a href="javascript:common.page.currentPageList(1)">«</a></li>';
		//上一页
		if (current - 1 > 0) {
			pageNoDivHtml += '<li><a href="javascript:common.page.currentPageList(' + (current - 1) +  ')">«</a></li>';
		}
	}
	
	//内层 迭代 =================================================================================================================== Start
	//页面太多时 的 优化
	var start = 1;
	var end = (showPages > 10 ? 10 : showPages);
	if(current > 5){
		start = current - 4;
		end = current + 4;
		while(end > showPages){
			//往后退
			end--;
			//不允许有 0 以下的页码
			if(start > 1){
				start--;
			}
		}
	}
	for (var i = start; i <= end; i ++) {
		if (current == i) {
			pageNoDivHtml += '<li class="active"><a href="#">' + i + '</a></li>';
		} else {
			pageNoDivHtml += '<li><a href="javascript:common.page.currentPageList(' + i + ')">' + i + '</a></li>';
		}
	}
	//内层 迭代 =================================================================================================================== End
	
	if (current == showPages || totalRecord < 1) {
//		pageNoDivHtml += '<li class="disabled"><a href="#"> > </a></li>';
	} else {
		//下一页
		pageNoDivHtml += '<li><a href="javascript:common.page.currentPageList(' + (current + 1) + ')">»</a></li>';
		//最后一页 这里暂时找不到好的样式，先隐藏
//		pageNoDivHtml += '<li><a href="javascript:common.page.currentPageList('+showPages+')"> >> </a></li>';
	}
	
	pageNoDivHtml += '</ul>';
	
	return pageNoDivHtml;
}
/* ========================================================================================================================================================= */
/* page操作类 ============================================================================================================================================ End */

