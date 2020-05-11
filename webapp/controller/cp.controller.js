sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";
	return Controller.extend("com.airbus.unc.main.CP.controller.cp", {
		onOpenDialog: function () {
			this.getOwnerComponent().openHelloDialog();
		},
		onAfterRendering: function () {

			this.getBot(); //get user uuid of your bot account in cai.tools.sap
			if(this.getView().byId("chatBtn"))
			this.getView().byId("chatBtn").attachPress(this.openBot.bind(this));
			//attaching press to open chat window		
			// this.detailContent = this.getView().getContent()[0].getContent()[0].getCurrentMasterPage().getContent()[0].getCurrentDetailPage().getCurrentDetailPage();
		},
		getBot: function () {
			var that = this;
			//check your user-slug in SAP Conversational AI 
			$.ajax({
				type: "GET",
				url: "https://" + "api.cai.tools.sap/auth/v1/owners/abhikr2603",

				headers: {
					"Authorization": "dbfc81971fc0f1365248f734719467d9" //request token
				},
				success: function (data) {
					that.uuid = data.results.owner.id;
				},
				error: function (data) {}
			});

			// },
			// openBot:function(){
			// 	var x = this._openBot();
			// x.open();
		},
		openBot: function (oEvent) {
			if (!this.oChatBot) {
				this.oChatBot = sap.ui.jsfragment("com.airbus.unc.main.CP.view.ChatBot", this);
				this.oChatInput = this.oChatBot.getContent()[0].getContent()[1].getContent()[0];
				this.oChatInput.attachLiveChange(this.addConversation.bind(this));
			}
			var oModel = new sap.ui.model.json.JSONModel({
				data: {}
			});
			this.oChatBot.setModel(oModel);
			// this.oChatBot.openBy(this.detailContent.getFooter().getContentRight()[1]);
			this.oChatBot.openBy(this.getView().byId("chatBtn"));
			// Init listeners
			this.chatInput = document.getElementById("chat");
			this.chatInput.addEventListener("keyup", this.parseText.bind(this), false);
			this.history = document.getElementById("oLabel1");

			this.isTyping = false;
		},
		addConversation: function(oEvent) {
			if(!this.chatInput){
				this.chatInput = document.getElementById("chat");
				this.chatInput.addEventListener("keyup", this.parseText.bind(this), false);
				this.history = document.getElementById("oLabel1");
			}
			this.respondTo(oEvent.getParameters().newValue);
		},
		parseText: function(oEvent) {
			
		},
		onChange: function(oEvent) {
			this.respondTo(oEvent.getParameters().newValue);
		},
		respondTo: function (message) {
			// simulated delayed response
			var msgLength = message.length;
			var responseLength = 2;
            var delay = Math.ceil(Math.random() * (responseLength + 1) * 1000) + 2500;
            if (msgLength > 0) { //if user has inputted message then
                var _data = {
                    "message": {
                        "type": "text",
                        "content": message
                    },
                    "conversation_id": "test-1533969037613",
                    "log_level": "info"
                };
                var that = this;
                $.ajax({
                    type: "POST",
                    data: JSON.stringify(_data),
                    url: "https://api.cai.tools.sap/build/v1/dialog",//bot connector callback url you will find under settings>options
                    contentType: "application/json",
                    path: "/build/v1/dialog",
                    scheme: "https",
                    headers: {
                        "Authorization": "Token 1e5ae1f2a5d1c35eb142381384995966",//developer token
                        "x-uuid": that.uuid
                    },
                    success: function (data) {
                        // do what you need to 
                        that.pqaBotConversation = data;
                        that.createMessage("bot", data.results.messages[0].content, delay);
                    },
                    error: function (data) {
                        that.botError = data;
                    }
                });
			}
		},
		
		createMessage: function (from, message, delay) {
            var p, // paragraph element for message
                img, // image for avatar
                innerDiv, // inner div to hold animation and avatar
                outerDiv, // outer div for clearing floats
                animationSequence, // class list for animation
                position; // left or right

            // paragraph
            p = document.createElement("p");

            // img
            img = document.createElement("img");

            if (from === "bot") {
                img.src = "https:"+"//sdlambert.github.io/loremipsum/img/helmet1.svg";
                position = "left";
            } else if (from === "user") {
                img.src = "https:"+"//sdlambert.github.io/loremipsum/img/user168.svg";
                position = "right";
            }

            img.classList.add("avatar", "middle", position);

            // inner div
            var innerDiv = document.createElement("div");
            innerDiv.appendChild(img);
            innerDiv.classList.add(from);
            var p;
            // add animation, remove animation, add message
            if (delay) {
//                 this.addAnimation(innerDiv);
                var that = this;
                setTimeout(function () {
//                     that.removeAnimation(innerDiv);
                    p.appendChild(document.createTextNode(message));
                    innerDiv.appendChild(p);
                    that.history.scrollTop = that.history.scrollHeight;
                    that.isTyping = false;
                }, delay);
            } else {
                // no delay, just post it
                p.appendChild(document.createTextNode(message));
                innerDiv.appendChild(p);
            }

            //outer div
            outerDiv = document.createElement("div");
            outerDiv.appendChild(innerDiv);
            outerDiv.classList.add("full");

            // history
            this.history.appendChild(outerDiv);
            this.history.scrollTop = this.history.scrollHeight;

        }
        

	});
});