const chatHandler = require('./chat-event');
const notifyHandler = require('./notify-event');
/**
 * socket命名空间配置
 */
const namespace = {
	// 'path': function
	'/chat': chatHandler,
	'/notify': notifyHandler.init,
}

const event = function (io) {
	for (let prop in namespace) {
		let nspSio = io.of(prop);
		namespace[prop](nspSio);
	}
}

module.exports = event;