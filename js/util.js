/*
 * @Auth BillWu 201610
 * */
/* 原生对象重写类 ============================================================================================================================================ Start */
/**
 * 时间日期格式化, 这里继承重写了Date类的protoytpe 
 **/
Date.prototype.Format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
/* 原生对象重写类 ============================================================================================================================================   End */


/* 辅助操作类 ============================================================================================================================================ Start */
var util = {};
/**
 * 重新格式 requestPojo, 比如追加 $appCode, $poloCode, $app等参数
 **/
util.initRequestObj = function(requestPojo) {
	if (!requestPojo) {
		var requestPojo = {};
	}
	requestPojo.appCode = "WEB";
	requestPojo.poloCode = "polo1224";
	requestPojo.app = 3;
	if (requestPojo.source_id) {
		requestPojo.hid = requestPojo.source_id;
	}
	if (requestPojo.room_id) {
		requestPojo.rid = requestPojo.room_id;
	}
	
	//初始化 uid, token
	var uid = cache.getUser("uid");
	var token = cache.getUser("token");
	if (uid) {
		requestPojo.uid = uid;
	}
	if (token) {
		requestPojo.token = token;
	}
	
	if (!requestPojo.uid) {
		requestPojo.uid = 0;
	}
	return requestPojo;
}

/**
 * 把form 转成 obj, 便于form json ajax add update 操作, no use
 * @depected
 **/
util.dom2Obj = function(myFormId) {
	var serializeObj={};  
	var domId = "#" + myFormId;
	var myForm1Obj = $(domId).serializeArray();
    $(myForm1Obj).each(function(){  
        serializeObj[this.name] = this.value;  
    }); 
    console.log(serializeObj);
    return serializeObj;
}

/* 辅助操作类 ============================================================================================================================================ End */
/* ========================================================================================================================================================= */

/* ========================================================================================================================================================= */
/* 字符串操作类 ======================================================================================================================================== Start */
/**
 * 去除所有空格(兼顾 中文模式)
 **/
util.trim = function(str) {
	if (str) {
		str = str.replace(/(^\s*)|(\s*$)/g, "");
		str = str.replace(/(\s|\&nbsp\;|　|\xc2\xa0)/g, "");
	} else {
		str = '';
	}
	return str;
}
/**
 * js if (str) 判断是否为空(js 0, 0.0, null 都是空，与php有类似,但php的empty()-php的'0'是空的,php的'0,0'也不为空 ) 
 **/
util.isEmpty = function(str) {
	if (str) {
		return true;
	} else {
		return false;
	}
}
/**
 * 判断是否数字(包括正负数)
 **/
util.isNum = function(str) {
	if (!isNaN(str)) {
		return true;
	} else {
		return false;
	}
}
/**
 * 判断是否正整数(正整数)
 **/
util.isNumB = function(str) {
	var re = /^[0-9]*[1-9][0-9]*$/ ;  
    return re.test(str); 
}
/**
 * 判断字符位数是否相符(一个中文也算一个字符)
 **/
util.isCounts = function(str, counts) {
	var len = str.length;
	if (counts == len) {
		return true;
	} else {
		return false;
	}
}
/**
 * 判断字符位数是否超过某数
 **/
util.isMaxCounts = function(str, counts) {
	var len = str.length;
	if (counts >= len) {
		return true;
	} else {
		return false;
	}
}
/**
 * 返回最大长度maxLen的字符 ,后面以 ...追加
 **/
util.maxLen = function(str, maxLen) {
	var len = str.length;
	if (len > maxLen) {
//		return str + "<br>" + str;
		return str.substr(0, maxLen) + "..";
	} else {
		return str;
	}
}
/**
 * 判断是否电话号码 
 **/
util.isMobile = function(str) {
	if (util.isCounts(str, 11) && util.isNumB(str)) {
		return true;
	} else {
		return false;
	}
}
/**
 * 判断是否邮箱 
 **/
util.isEmail = function(str) {
	var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return reg.test(str);
}
/* 字符串操作类 ========================================================================================================================================   End */
/* ========================================================================================================================================================= */

/* dom操作类 ========================================================================================================================================= Start */
/* ========================================================================================================================================================= */
//dom操作类, 如input转成object,验证等
/**
 *	一个div里同步 一个json, 
 *	多用到添加 元素时,  需要完善, 要当于模拟AngularJS的绑定功能
 *	在这里顺便做简单的表单验证  dom的 validate属性 <其中 number:数字; mobil:电话号码; email:邮箱 等, >
 *	//介贷已经 被var formData = new FormData($("#productUpateForm")[0]); 彻底取代了, 886
 *	@divId div的id
 *	@isValidate 是否需要在这一步验证字段
 *	@return Obj
 **/
util.angu = function (divId, isValidate) {
	//指定div ,  此div里的所有input ,一改变都是同步到指定的json属性中, 
	var obj = {};
	var returnFlag = true;
	$("#" + divId).find("input").each(function() {
		var val = $(this).val();
		//验证字段
		if (isValidate) {
			//验证类型
			var validateType = $(this).attr("validate");	
			var mustneed = $(this).attr("mustneed");
			var limit = $(this).attr("limit");
//			console.log($(this).parent().prev());
			var labelName = $(this).parent().prev().text();
			labelName = '';	//先默认不用传入这个了
			if (!util.valiSimple(labelName, val, validateType, mustneed, limit, $(this))) {
				$(this).focus();	//此方法在bootbox里行不通
				returnFlag = false;
				return false;
			};
		}
		var name = $(this).attr("name");
		var type = $(this).attr("type");
		if (type !="checkbox") {	//此方法里面可能有bug, 还没更新
//			alert(util.trim(val));
			
			if (name) {
				var evStr = "obj." + name + "='" + util.trim(val) + "'";
				eval(evStr); 
			} else {	//如果是空的
				var evStr = "obj." + name + "=''";
				eval(evStr); 
			}
		}
	});
	
	
	if (!returnFlag) return false; 
	
	//select 字段 ,,这个字段暂时 没有验证类型什么的
	$("#" + divId).find("select").each(function() {
		var name = $(this).attr("name");
		var val = $(this).val();
		if (name) {
			var evStr = "obj." + name + "='" + util.trim(val) + "'";
			eval(evStr); 
		} else {	//如果是空的
			var evStr = "obj." + name + "=''";
			eval(evStr); 
		}
	});
	
	//重新 追加 模板参数 如: app, polocode等
	obj = util.initRequestObj(obj);
	return obj;
}
/**
一个json里的key-value 同步一个div里的属性值 , 
多用到添加 元素时,  需要完善, 要当于模拟AngularJS的绑定功能
@angJson 传过来的div id
@divId div的id
**/
util.angu4html = function (angJson, divId) {
	//指定div ,  json属性 同步到 此div里的所有input 
	//	console.log("divId>>> ", divId);
	//	console.log("bill>>> ", $("#" + divId).find("input"));
	$("#" + divId).find("input").each(function() {
		var val = $(this).val();
	//		console.log("val > ", val);
		//每次都 循环一下 此json, 罪过 
		for (k in angJson) {
			if (k == $(this).attr("name")) {
				if (angJson[k] != null) {
					$(this).val(angJson[k]);
				}
				break;
			}
		}
	});
	
	//select 字段 ,,这个字段暂时 没有验证类型什么的
	$("#" + divId).find("select").each(function() {
		var name = $(this).attr("name");
		var val = $(this).val();
		//每次都 循环一下 此json, 罪过 
		for (k in angJson) {
			if (k == $(this).attr("name")) {
				if (angJson[k] != null) {
					$(this).val(angJson[k]);
				}
				break;
			}
		}
	});
}
/**
清空这个form的所有字段 ，一般是用在新添什么时 
@divId div的id
 **/
util.angu4empty = function (divId) {
	//指定div ,  json属性 同步到 此div里的所有input 
	//	console.log("divId>>> ", divId);
	//	console.log("bill>>> ", $("#" + divId).find("input"));
	$("#" + divId).find("input").each(function() {
		$(this).val('');
	});
	
	//select 字段 ,,这个字段暂时 没有验证类型什么的
	/*
	$("#" + divId).find("select").each(function() {
		$(this).val('');
	});
	*/
}
/**
单个 类型 验证 
@param labelName
@param val
@param validateType 验证类型, number:数字, numberB:正整数, mobile:手机, email:邮箱
@param mustneed 是否必输
@param limit 限制几个字符 
@param parentDom 上层dom jq元素，用于在这里append显示 错误信息
*/
util.valiSimple = function (labelName, val, validateType, mustneed, limit, parentDom) {
	var info = "验证不通过";
	//mustneed
	//非空验证
	if (mustneed && !util.isEmpty(val)) {
		if (labelName) {
			info = labelName + ' 不能为空';
		} else {
			info = '不能为空';
		}
		util.valiSimple.err(info, parentDom);
		return false;
	}
	//长度限制
	if (limit && !util.isMaxCounts(val)) {
		if (labelName) {
			info = labelName + " 不能超过 " + limit + "个字符";
		} else {
			info = "不能超过 " + limit + "个字符";
		}
		util.valiSimple.err(info, parentDom);
		return false;
	}
	//	validate
	//类型验证
	switch(validateType){
	    case "number": 
	      if (!util.isNum(val)) {
	    	  	if (labelName) {
		  			info = labelName + " 请输入数字";
		  		} else {
		  			info = "请输入数字";
		  		}
	    	  	util.valiSimple.err(info, parentDom);
	    	  	return false;
	      }
	      break;
	    case "numberB": 
	    	if (!util.isNumB(val)) {
	    		if (labelName) {
	    			info = labelName + " 请输入正整数";
	    		} else {
	    			info = "请输入正整数";
	    		}
	    		util.valiSimple.err(info, parentDom);
	    		return false;
	    	}
	    	break; 
	    case "mobile": 
	    	if (!util.isMobile(val)) {
	    		if (labelName) {
	    			info = labelName + " 请输入正确格式";
	    		} else {
	    			info = "请输入手机号码";
	    		}
	    		util.valiSimple.err(info, parentDom);
	    		return false;
	    	}
	      break; 
	    case "email": 
	    	if (!util.isEmail(val)) {
	    		if (labelName) {
	    			info = labelName + " 请输入正确格式";
	    		} else {
	    			info = "请输入邮箱";
	    		}
	    		util.valiSimple.err(info, parentDom);
	    		return false;
	    	}
	    	break; 
	}
	return true;
}
/**
 * 显示 错误的input信息到 输入框下面
 */
util.valiSimple.err = function(info, parentDom) {
	if (info) {
		if (parentDom && parentDom.parent()) {
			info = "<span class='input-error-span'>" + info + "</span>";
			//先删除了先前的 error信息
			parentDom.parent().parent().find(".input-error-span").remove();
			//把错误信息追加到 对应的input下面
			parentDom.parent().append(info);
		} else {
			alert(info);
		}
	}
}
/* dom操作类 =========================================================================================================================================    End */
/* ========================================================================================================================================================= */

/* MD5类 ============================================================================================================================================ Start */
util.md5 = function(str) {
	var hex_chr = "0123456789abcdef";
	function rhex(num)
	{
		var str = ""; 
		for(j = 0; j <= 3; j++)
			str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + 
			hex_chr.charAt((num >> (j * 8)) & 0x0F); 
		return str;
	}
	function str2blks_MD5(str)
	{
		nblk = ((str.length + 8) >> 6) + 1; 
		blks = new Array(nblk * 16); 
		for(i = 0; i < nblk * 16; i++) blks[i] = 0; 
		for(i = 0; i < str.length; i++) 
		blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8); 
		blks[i >> 2] |= 0x80 << ((i % 4) * 8); 
		blks[nblk * 16 - 2] = str.length * 8; 
		return blks; 
	}
	function add(x, y)
	{
		var lsw = (x & 0xFFFF) + (y & 0xFFFF); 
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16); 
		return (msw << 16) | (lsw & 0xFFFF); 
	} 
	function rol(num, cnt) 
	{ 
		return (num << cnt) | (num >>> (32 - cnt)); 
	} 
	function cmn(q, a, b, x, s, t) 
	{ 
		return add(rol(add(add(a, q), add(x, t)), s), b); 
	} 
	function ff(a, b, c, d, x, s, t) 
	{ 
		return cmn((b & c) | ((~b) & d), a, b, x, s, t); 
	} 
	function gg(a, b, c, d, x, s, t) 
	{ 
		return cmn((b & d) | (c & (~d)), a, b, x, s, t); 
	} 
	function hh(a, b, c, d, x, s, t) 
	{ 
		return cmn(b ^ c ^ d, a, b, x, s, t); 
	} 
	function ii(a, b, c, d, x, s, t) 
	{ 
		return cmn(c ^ (b | (~d)), a, b, x, s, t); 
	} 
	function MD5(str)
	{
		x = str2blks_MD5(str); 
		var a = 1732584193; 
		var b = -271733879; 
		var c = -1732584194; 
		var d = 271733878; 
		for(i = 0; i < x.length; i += 16) 
		{
			var olda = a; 
			var oldb = b; 
			var oldc = c; 
			var oldd = d; 
			a = ff(a, b, c, d, x[i+ 0], 7 , -680876936); 
			d = ff(d, a, b, c, x[i+ 1], 12, -389564586); 
			c = ff(c, d, a, b, x[i+ 2], 17, 606105819); 
			b = ff(b, c, d, a, x[i+ 3], 22, -1044525330); 
			a = ff(a, b, c, d, x[i+ 4], 7 , -176418897); 
			d = ff(d, a, b, c, x[i+ 5], 12, 1200080426); 
			c = ff(c, d, a, b, x[i+ 6], 17, -1473231341); 
			b = ff(b, c, d, a, x[i+ 7], 22, -45705983); 
			a = ff(a, b, c, d, x[i+ 8], 7 , 1770035416); 
			d = ff(d, a, b, c, x[i+ 9], 12, -1958414417); 
			c = ff(c, d, a, b, x[i+10], 17, -42063); 
			b = ff(b, c, d, a, x[i+11], 22, -1990404162); 
			a = ff(a, b, c, d, x[i+12], 7 , 1804603682); 
			d = ff(d, a, b, c, x[i+13], 12, -40341101); 
			c = ff(c, d, a, b, x[i+14], 17, -1502002290); 
			b = ff(b, c, d, a, x[i+15], 22, 1236535329); 
			a = gg(a, b, c, d, x[i+ 1], 5 , -165796510); 
			d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632); 
			c = gg(c, d, a, b, x[i+11], 14, 643717713); 
			b = gg(b, c, d, a, x[i+ 0], 20, -373897302); 
			a = gg(a, b, c, d, x[i+ 5], 5 , -701558691); 
			d = gg(d, a, b, c, x[i+10], 9 , 38016083); 
			c = gg(c, d, a, b, x[i+15], 14, -660478335); 
			b = gg(b, c, d, a, x[i+ 4], 20, -405537848); 
			a = gg(a, b, c, d, x[i+ 9], 5 , 568446438); 
			d = gg(d, a, b, c, x[i+14], 9 , -1019803690); 
			c = gg(c, d, a, b, x[i+ 3], 14, -187363961); 
			b = gg(b, c, d, a, x[i+ 8], 20, 1163531501); 
			a = gg(a, b, c, d, x[i+13], 5 , -1444681467); 
			d = gg(d, a, b, c, x[i+ 2], 9 , -51403784); 
			c = gg(c, d, a, b, x[i+ 7], 14, 1735328473); 
			b = gg(b, c, d, a, x[i+12], 20, -1926607734); 
			a = hh(a, b, c, d, x[i+ 5], 4 , -378558); 
			d = hh(d, a, b, c, x[i+ 8], 11, -2022574463); 
			c = hh(c, d, a, b, x[i+11], 16, 1839030562); 
			b = hh(b, c, d, a, x[i+14], 23, -35309556); 
			a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060); 
			d = hh(d, a, b, c, x[i+ 4], 11, 1272893353); 
			c = hh(c, d, a, b, x[i+ 7], 16, -155497632); 
			b = hh(b, c, d, a, x[i+10], 23, -1094730640); 
			a = hh(a, b, c, d, x[i+13], 4 , 681279174); 
			d = hh(d, a, b, c, x[i+ 0], 11, -358537222); 
			c = hh(c, d, a, b, x[i+ 3], 16, -722521979); 
			b = hh(b, c, d, a, x[i+ 6], 23, 76029189); 
			a = hh(a, b, c, d, x[i+ 9], 4 , -640364487); 
			d = hh(d, a, b, c, x[i+12], 11, -421815835); 
			c = hh(c, d, a, b, x[i+15], 16, 530742520); 
			b = hh(b, c, d, a, x[i+ 2], 23, -995338651); 
			a = ii(a, b, c, d, x[i+ 0], 6 , -198630844); 
			d = ii(d, a, b, c, x[i+ 7], 10, 1126891415); 
			c = ii(c, d, a, b, x[i+14], 15, -1416354905); 
			b = ii(b, c, d, a, x[i+ 5], 21, -57434055); 
			a = ii(a, b, c, d, x[i+12], 6 , 1700485571); 
			d = ii(d, a, b, c, x[i+ 3], 10, -1894986606); 
			c = ii(c, d, a, b, x[i+10], 15, -1051523); 
			b = ii(b, c, d, a, x[i+ 1], 21, -2054922799); 
			a = ii(a, b, c, d, x[i+ 8], 6 , 1873313359); 
			d = ii(d, a, b, c, x[i+15], 10, -30611744); 
			c = ii(c, d, a, b, x[i+ 6], 15, -1560198380); 
			b = ii(b, c, d, a, x[i+13], 21, 1309151649); 
			a = ii(a, b, c, d, x[i+ 4], 6 , -145523070); 
			d = ii(d, a, b, c, x[i+11], 10, -1120210379); 
			c = ii(c, d, a, b, x[i+ 2], 15, 718787259); 
			b = ii(b, c, d, a, x[i+ 9], 21, -343485551); 
			a = add(a, olda); 
			b = add(b, oldb); 
			c = add(c, oldc); 
			d = add(d, oldd); 
		}
		return rhex(a) + rhex(b) + rhex(c) + rhex(d); 
	}
	//final return, add Bill
	return MD5(str);
}
/* MD5类 ============================================================================================================================================  End  */

