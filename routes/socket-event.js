var chatHandler = require('./chat-event');
var notifyHandler = require('./notify-event');
/**
 * socket命名空间配置
 */
var namespace = {
	// 'path': function
	'/chat': chatHandler,
	'/notify': notifyHandler.init,
}

var event = function(io){
	for(var prop in namespace){
		var nspSio = io.of(prop);
		namespace[prop](nspSio);
	}
}

module.exports = event;