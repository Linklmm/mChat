window.app = {

	//后端服务发布的URL
	// serverUrl:'http://192.168.1.15:8081',
	serverUrl: 'http://192.168.0.106:8081',

	/**
	 * netty服务后端发布的URL
	 */
	nettyServerUrl: 'ws://192.168.0.106:8088/ws',

	//图片服务器的URL
	imgServerUrl: 'http://47.107.46.101:88/mchat/',

	/**
	 * 判断字符串是否为空
	 * true不为空
	 * false：为空
	 */
	isNotNull: function(str) {
		if (str != null && str != "" && str != undefined) {
			return true;
		}
		return false;
	},

	/**
	 * 封装消息提示框，默认mui的不支持居中和自定义icon，所以使用h5
	 */
	showToast: function(msg, type) {
		plus.nativeUI.toast(msg, {
			icon: "image/" + type + ".png",
			verticalAlign: "center"
		});
	},

	/**
	 * 保存用户的全局对象
	 */
	setUserGlobalInfo: function(user) {
		var userInfoStr = JSON.stringify(user);
		plus.storage.setItem("userInfo", userInfoStr);
	},

	/**
	 * 获取用户的全局对象
	 */
	getUserGlobalInfo: function() {
		var userInfoStr = plus.storage.getItem("userInfo");
		return JSON.parse(userInfoStr);
	},

	/**
	 * 登出后，移除用户全局对象
	 */
	userLogout: function() {
		plus.storage.removeItem("userInfo");
	},

	/**
	 * 保存用户的联系人列表
	 */
	setContactList: function(contactList) {
		var contactListStr = JSON.stringify(contactList);
		plus.storage.setItem("contactList", contactListStr);
	},

	/**
	 * 获取本地缓存中的好友列表
	 */
	getContactList: function() {
		var contactListStr = plus.storage.getItem("contactList");

		if (!this.isNotNull(contactListStr)) {
			return [];
		}
		return JSON.parse(contactListStr);
	},

	/**
	 * 根据用户id，从本地缓存（联系人列表）中获取朋友的信息
	 */
	getFriendFromContactList: function(friendId) {
		var contactListStr = plus.storage.getItem("contactList");
		console.log("用户联系人列表：" + JSON.stringify(contactListStr));
		//判断是否为空
		if (this.isNotNull(contactListStr)) {
			//不为空，则把用户信息返回
			var contactList = JSON.parse(contactListStr);
			for (var i = 0; i < contactList.length; i++) {
				var friend = contactList[i];
				if (friend.friendId == friendId) {
					return friend;
					break;
				}
			}
		} else {
			//为空，则返回空
			return null;
		}
	},

	/**
	 * 用于保存用户的聊天记录
	 * flag判断本条消息是用户发送的还是用户好友发送的
	 * 1：用户自己，2：用户好友
	 */
	saveUserChatHistory: function(myId, friendId, msg, flag) {
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId;

		//从本地缓存获取聊天记录是否存在
		var chatHistoryListStr = plus.storage.getItem(chatKey);
		var chatHistoryList;
		if (me.isNotNull(chatHistoryListStr)) {
			//如果不为空
			chatHistoryList = JSON.parse(chatHistoryListStr);
		} else {
			//如果为空，赋一个空的List
			chatHistoryList = [];
		}

		//构建聊天记录对象
		var singleMsg = new me.ChatHistory(myId, friendId, msg, flag);

		//向List中追加msg对象
		chatHistoryList.push(singleMsg);

		plus.storage.setItem(chatKey, JSON.stringify(chatHistoryList));
	},

	/**
	 * 聊天记录快照，仅仅保存和朋友聊天的最后消息
	 */
	saveUserChatSnapshot: function(myId, friendId, msg, isRead) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;

		//从本地缓存获取聊天快照的List
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			//如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);

			//循环快照List，并且判断每个元素是否包含(匹配)friendId,如果匹配，则删除
			for (var i = 0; i < chatSnapshotList.length; i++) {
				if (chatSnapshotList[i].friendId == friendId) {
					console.log("快照存在");
					//从第i个元素后，删除1个
					//删除已经存在的friendId所对应的快照对象
					chatSnapshotList.splice(i, 1);
					break;
				}
			}

		} else {
			//如果为空，赋一个空的List
			chatSnapshotList = [];
		}

		//构建聊天快照对象
		var singleMsg = new me.ChatSnapshot(myId, friendId, msg, isRead);

		//向List中追加快照对象
		chatSnapshotList.unshift(singleMsg);
		console.log("向List中追加快照对象");
		console.log(JSON.stringify(chatSnapshotList));

		plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
	},

	/**
	 * 获取客户聊天记录
	 */
	getUserChatHistory: function(myId, friendId) {
		var me = this;
		var chatKey = "chat-" + myId + "-" + friendId;

		var chatHistoryListStr = plus.storage.getItem(chatKey);
		if (me.isNotNull(chatHistoryListStr)) {
			//如果不为空
			chatHistoryList = JSON.parse(chatHistoryListStr);
		} else {
			//如果为空，赋一个空的List
			chatHistoryList = [];
		}
		console.log("获取客户聊天记录:"+JSON.stringify(chatHistoryList));
		return chatHistoryList;
	},
	
	/**
	 * 删除本地的聊天快照
	 */
	deleteUserChatSnapshot: function(myId, friendId) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;
	
		//从本地缓存获取聊天快照的List
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			//如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
	
			//循环快照List，并且判断每个元素是否包含(匹配)friendId,如果匹配，则删除
			for (var i = 0; i < chatSnapshotList.length; i++) {
				if (chatSnapshotList[i].friendId == friendId) {
					console.log("快照存在");
					//从第i个元素后，删除1个
					//删除已经存在的friendId所对应的快照对象
					chatSnapshotList.splice(i, 1);
					break;
				}
			}
	
		} else {
			//如果为空，不做处理
			return;
		}
	
		plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));
	},
	
	/**
	 * 删除用户和朋友的聊天记录
	 */
	deleteUserChatHistory:function(myId,friendId){
		console.log("删除用户聊天记录");
		var chatKey = "chat-" + myId + "-" + friendId;
		plus.storage.removeItem(chatKey);
	},

	/**
	 * 获取用户快照记录列表
	 */
	getUserChatSnapshot: function(myId) {
		console.log("保存用户聊天快照");
		var me = this;
		var chatKey = "chat-snapshot" + myId;
		//从本地缓存获取聊天快照的List
		console.log("从本地缓存获取聊天快照的List");
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		if (me.isNotNull(chatSnapshotListStr)) {
			//如果不为空
			console.log("不为空，保存用户快照")
			chatSnapshotList = JSON.parse(chatSnapshotListStr);

		} else {
			//如果为空，赋一个空的List
			chatSnapshotList = [];
		}

		return chatSnapshotList;
	},

	/**
	 * 标记未读消息为已读状态
	 */
	readUserChatSnapshot: function(myId, friendId) {
		var me = this;
		var chatKey = "chat-snapshot" + myId;
		var chatSnapshotListStr = plus.storage.getItem(chatKey);
		var chatSnapshotList;
		console.log("标记未读消息为已读状态");
		if (me.isNotNull(chatSnapshotListStr)) {
			//如果不为空
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			console.log(chatSnapshotListStr);
			//循坏List，判断是否存在好友，比对friendId，如果有，在List原有位置
			//删除该快照对象，然后重新放入一个已读的快照对象
			for (var i = 0; i < chatSnapshotList.length; i++) {
				var item = chatSnapshotList[i];
				if (item.friendId == friendId && item.isRead == false) {
					//标记为已读
					item.isRead = true;
					//从第i个元素，删除1个
					//删除已经存在的friendId所对应的快照对象
					chatSnapshotList.splice(i, 1, item); //替换原有的快照
					//向List中追加快照对象
					console.log(JSON.stringify(chatSnapshotList));
					break;
				}
			}
			//替换原有的快照列表
			plus.storage.setItem(chatKey, JSON.stringify(chatSnapshotList));

		} else {
			//如果为空，不做任何处理
			return;
		}
	},

	/**
	 * 和后端的枚举对应
	 */
	CONNECT: 1, // "第一次(或重连)初始化连接"),
	CHAT: 2, //"聊天消息"),	
	SIGNED: 3, // "消息签收"),
	KEEPALIVE: 4, // "客户端保持心跳"),
	PULL_FRIEND: 5, // "拉取好友");

	/**
	 * 和后端的ChatMsg聊天模型对象保持一致
	 */
	ChatMsg: function(senderId, receiverId, msg, msgId) {
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.msg = msg;
		this.msgId = msgId;

	},

	/**
	 * 构建消息模型对象
	 */
	DataContent: function(action, chatMsg, extand) {
		this.action = action;
		this.chatMsg = chatMsg;
		this.extand = extand;

	},

	/**
	 * 单个聊天的记录对象
	 */
	ChatHistory: function(myId, friendId, msg, flag) {
		this.myId = myId;
		this.friendId = friendId;
		this.msg = msg;
		this.flag = flag;
	},

	/**
	 * 快照对象
	 * 用于判断消息是否已读或未读
	 */
	ChatSnapshot: function(myId, friendId, msg, isRead) {
		this.myId = myId;
		this.friendId = friendId;
		this.msg = msg;
		this.isRead = isRead;
	}
}
