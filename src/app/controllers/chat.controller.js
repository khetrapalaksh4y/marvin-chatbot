(function() {
	'use strict';

	angular.module('surveyChatbot').controller('ChatController', ChatController);

	/** @ngInject */
	function ChatController($timeout) {

		var vm = this;
		var botMessageSequence = 0;

		var questions = [
			"How often do you eat chocolates?",
			"What kind of chocolates do you like?",
			"Would you be interested in getting a pack of chocolates every week?"
		]

		var introduction = [
			"Hi, I am Marvin.",
			"I am here to ask you a few questions.",
			"Are you ready?"
		]

		var randomResponses = [
			"It was fun talking to you.",
			"Okay then! Bye bye. You may go now.",
			"Don't mock me. You know I'll soon run out of responses.",
			"Why did the chicken cross the road? Don't bother, I don't have an answer.",
			"*knock *knock. Don't answer"
		]

		var positiveResponses = ["yes", "yep", "yo", "yeah", "let's"]
		var negativeResponses = ["no", "nah", "later", "nope"]
		var lastResponseSentiment = 0;

		vm.botAvatar = "http://vignette2.wikia.nocookie.net/edain-mod/images/5/56/The_Necromancer0_Bot_Avatar.png/revision/latest?cb=20160321121352";
		vm.responses = [];
		vm.messageInput = "";

		initializeChat();

		vm.sendMessage = function(message, left) {
			var d = new Date()
			var m = d.getMinutes();

			vm.typing = left ? false : vm.typing;
			vm.messageInput = left ? vm.messageInput : "";

			vm.responses.push({
				'id': vm.responses.length,
				'left': left,
				'message': message
			})

			document.getElementsByClassName('messages')[0].scrollTop = document.getElementsByClassName('messages')[0].scrollHeight;

			if(!left)
			{
				setLastResponseSentiment(message);
				if(botMessageSequence > 3)
				{
					getBotResponse().then();
				}
				else
				{
					getBotResponse().then(getBotResponse).then();
				}
			}

			$timeout(function() {
				vm.responses[vm.responses.length - 1].date = d.getHours() + ':' + m;
			}, 5000);
		}

		function initializeChat() {
			getBotResponse().then(getBotResponse).then(getBotResponse).then();
		}

		function setLastResponseSentiment(message) {
			var messageSentiment = 0;

			if(matchesAgainstKeywords(positiveResponses, message))
			{
				messageSentiment = 1;
			}
			else if(matchesAgainstKeywords(negativeResponses, message))
			{
				messageSentiment = -1;
			}

			lastResponseSentiment = messageSentiment;
		}

		function matchesAgainstKeywords(keywordArray, stringToMatch) {
			var itMatches = false;
			keywordArray.forEach((keyword) => {
				if(getApproximityScore(keyword, stringToMatch) > 0.7)
				{
					itMatches = true;
					return false;
				}
			})
			return itMatches;
		}

		function getApproximityScore(string1, string2) {
			var longer = string1;
			var shorter = string2;

			if (string1.length < string2.length) {
				longer = string2;
				shorter = string1;
			}

			var longerLength = longer.length;

			if (longerLength == 0) {
				return 1;
			}

			return (longerLength - getLevenshteinEditDistance(longer, shorter)) / parseFloat(longerLength);
		}

		function getLevenshteinEditDistance(longerString, shorterString) {
			var longerString = longerString.toLowerCase();
			var shorterString = shorterString.toLowerCase();

			var costs = [];
			for (var i = 0; i <= longerString.length; i++) {
				var lastValue = i;
				for (var j = 0; j <= shorterString.length; j++) {
					if (i == 0){
						costs[j] = j;
					}
					else {
						if (j > 0) {
							var newValue = costs[j - 1];
							if (longerString.charAt(i - 1) != shorterString.charAt(j - 1))
							{
								newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
							}
							costs[j - 1] = lastValue;
							lastValue = newValue;
						}
					}
				}
				if (i > 0)
				{
					costs[shorterString.length] = lastValue;
				}
			}
			return costs[shorterString.length];
		}

		function getBotResponse() {
			return new Promise((resolve, reject) => {
				$timeout(function() {
					vm.typing = true;
				}, 300);
				$timeout(function(){ 
					vm.sendMessage(getBotResponseBasedOnSequence(), true);
					resolve();
				}, 500 + Math.random() * 2500);
			})
		}

		function getBotResponseBasedOnSequence() {
			var botResponse = getRandomResponse();
			if(botMessageSequence < 3)
			{
				botResponse = introduction[botMessageSequence];
			}
			else if(botMessageSequence == 3)
			{
				botResponse = getResponseBasedOnLastResponseSentiment();
			}
			else if(botMessageSequence > 3 && lastResponseSentiment > -1 && botMessageSequence < questions.length + 4)
			{
				botResponse = questions[botMessageSequence - 4];
			}

			botMessageSequence++;

			return botResponse;
		}

		function getResponseBasedOnLastResponseSentiment() {
			if(lastResponseSentiment == -1)
			{
				return "Ah! Alright then. You can come back any time."
			}
			else if(lastResponseSentiment == 0)
			{
				return "I didn't exactly get that. I'll go ahead anyways."
			}
			else if(lastResponseSentiment == 1)
			{
				return "Great! Let's start."
			}
		}

		function getRandomResponse() {
			return randomResponses[Math.floor(Math.random() * randomResponses.length)]
		}
	}
})();