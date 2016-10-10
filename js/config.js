/*
 * @Auth BillWu 201610
 * */

var config = {};

config.gongyuDomain = "http://" + document.domain;	//当前项目域名
config.payDomain = "http://pay.boluoroom.com";	//api支付相关域名(no use)
config.baseDomain = "http://web.pl.com";	//api主域名 test
config.baseDomain = "http://api.boluoroom.com";	//api主域名 product
config.pcDomain = "http://web.pl.com";	//pc端网站域名 test
config.pcDomain = "http://www.boluoroom.com";	//pc端网站域名 product




//api
//登陆模块
config.login = {};
config.login.admin = config.gongyuDomain + "/admin/index.php";	//登录成功后转到的管理首页
config.login.index = config.gongyuDomain + "";	//无权限登录退出的url
config.login.urlLogin = config.baseDomain + "/index.php?s=/Home/Loginj/phone_login";	//登录api
config.login.urlLogout = config.baseDomain + "/index.php?s=/Home/Loginj/logout";	//退出登录api


//房源模块 ==============================================================================================
config.house = {};
//非异步 静态路径 
config.house.newhouse = config.pcDomain + "/index.php?s=/Home/Newhouse/type/gongyu/1/";	//发布房源 /uid/156/
config.house.urldetail = config.pcDomain + "/index.php?s=/Home/Search/detail/gongyu/1/";	//房源详情 /uid/156/id/6166/rid/434
config.house.urlpreviewdetail = config.pcDomain + "/index.php?s=/Home/Search/preview_detail/gongyu/1/";	//房源预览详情 id/6166/rid/434
config.house.urlmodify = config.pcDomain + "/index.php?s=/Home/Newhouse/type_edit/house_type/1/gongyu/1/";	//整租的修改房源 /uid/156/hid/6166
config.house.urlmodify2 = config.pcDomain + "/index.php?s=/Home/Newhouse/upload_edit/house_type/2/gongyu/1/";	//合租的修改房源 /uid/156/hid/6166/rid/434

//异步api
config.house.top = config.baseDomain + "/index.php?s=/Home/Userj/roomCollect";	//置顶api
config.house.fresh = config.baseDomain + "/index.php?s=/Home/Userj/roomCollect";	//刷新api

config.house.counts = config.baseDomain + "/index.php?s=/Home/Gongyuj/houseCounts";	//房源统计api
config.house.manage2b = config.baseDomain + "/index.php?s=/Home/Gongyuj/index2b";	//房源列表api
config.house.del = config.baseDomain + "/index.php?s=/Home/Gongyuj/delHouse";	//删除房源api
config.house.openHouse = config.baseDomain + "/index.php?s=/Home/Gongyuj/openHouse";	//开放出租api
config.house.closeHouse = config.baseDomain + "/index.php?s=/Home/Gongyuj/closeHouse";	//关闭出租api

//公寓用户模块 ===========================================================================================
config.user = {};
config.user.empty = config.baseDomain + "/index.php?s=/Home/Gongyuj/userEmpty";	//是否已有房管中api
config.user.userList = config.baseDomain + "/index.php?s=/Home/Gongyuj/userList";	//公寓用户列表api
config.user.userDel = config.baseDomain + "/index.php?s=/Home/Gongyuj/userDel";	//公寓用户删除api
config.user.userAdd = config.baseDomain + "/index.php?s=/Home/Gongyuj/userAdd";	//公寓用户添加api
config.user.userModi = config.baseDomain + "/index.php?s=/Home/Gongyuj/userModi";	//公寓用户修改api



