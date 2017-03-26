var registerWindowCreated = false;
var myId = "";  // 내가 쓴 글은 noti 가 안오게 해야 되므로 필요

function getNotificationId() {
  var id = Math.floor(Math.random() * 9007199254740992) + 1;
  return id.toString();
}

function messageReceived(message) {
  // Set up my sessionId to distinguish the message sender
  if(myId == ""){ // 아이디가 없을경우 셋팅
    myId = message.data['id'];
    return;
  }

  // We do not need to do noti when this message is from this client.
  if(myId == message.data['id'])  // 아이디랑 내 아이디가 같으면 밑에 무시
    return;

  // Pop up a notification to show the GCM message.
  chrome.notifications.create(getNotificationId(), {
    title: 'MSP Chat CodeLab',
    iconUrl: 'gcm_128.png',
    type: 'basic',
    message: message.data['message']
  }, function() {});
}

// chrome app 이 처음 실행 되었을 때
function firstTimeRegistration() {
	chrome.storage.local.get("registered", function(result) {
		registerWindowCreated = true;
		chrome.app.window.create(
			"chat.html",
			{  
				width: 400,
				height: 600,
				frame: 'chrome'
			},
			function(appWin) {}
		);
  	});
}

chrome.gcm.onMessage.addListener(messageReceived);
chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);