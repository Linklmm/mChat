window.app ={
	
	//后端服务发布的URL
	serverUrl:'http://192.168.0.106:8081',
	
	//后端服务发布的URL
	imgServerUrl:'',
	
	/**
	 * 判断字符串是否为空
	 * true不为空
	 * false：为空
	 */
	isNotNull:function(str){
		if(str!=null&&str!=""&&str!=undefined){
			return true;
		}
		return false;
	},
	
	/**
	 * 封装消息提示框，默认mui的不支持居中和自定义icon，所以使用h5
	 */
	showToast:function(msg,type){
		plus.nativeUI.toast(msg,
		{icon:"image/"+type+".png",verticalAlign:"center"});
	},
	
	/**
	 * 保存用户的全局对象
	 */
	setUserGlobalInfo:function(user){
		var userInfoStr = JSON.stringify(user);
		plus.storage.setItem("userInfo",userInfoStr);
	},
	
	/**
	 * 获取用户的全局对象
	 */
	getUserGlobalInfo:function(){
		var userInfoStr = plus.storage.getItem("userInfo");
		return JSON.parse(userInfoStr);
	}
}