/*
 * @Auth BillWu 201610
 * */

/* 用户操作自定义类, 主要是写业务逻辑的 */

/* cache-cookies 操作类 ========================================================================================================================== Start */
var cache = {};
/*
 * 保存到cache
 * @param name 对象的名字
 * @param data 对象
 * @param days 此cache保存的天数
 * */
cache.set = function(name, data, days) {
	try {
		if (!days) {
			days = "14"; //默认14天
		}
		data = JSON.stringify(data);
		$.cookie(name, data, { expires: days });
   	} catch (err) {
   		alert("浏览器出错");
   	}
};
/*
 * 拿到一个cache 对象/对象属性
 * @param obj 对象的名字, 比如 user
 * @param field 对象的属性, 比如 userid
 * */
cache.get = function(obj, field) {
	try {
		obj = JSON.parse($.cookie(obj));
//		obj = $.parseJSON($.cookie(obj));
//		obj = ($.cookie(obj));
		if (obj) {
			if (field) { //返回对象的属性
				var evStr = "var fieldVal = obj." + field;
				eval(evStr); 
				if (fieldVal) {
					return fieldVal;
				} else {
					return "";
				}
			} else {	//返回对象
				return obj;
			}
		} else {
			return null;
		}
	} catch (err) {
		return null;
	}
};

/*
 * 拿到cache 用户对象/对象的一个参数 
 * @param field 对象的属性, 比如 userid
 * */
cache.getUser = function(field) {
	var obj = "user";
	if (field) {
		return cache.get(obj, field);
	} else {
		return cache.get(obj);
	}
};

/*
 * 清除cache,一般用在退出登录时, 好像这里有bug
 * */
cache.clear = function() {
	$.cookie("user", null);
};
/* cache-cookies 操作类 ==========================================================================================================================   End */


/* user 操作类 ========================================================================================================================== Start */

/* user 操作类 ==========================================================================================================================   End */
