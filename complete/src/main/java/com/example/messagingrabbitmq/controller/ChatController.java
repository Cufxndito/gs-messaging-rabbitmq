package com.example.messagingrabbitmq.controller;

import com.example.messagingrabbitmq.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

	@MessageMapping("/chat")
	@SendTo("/topic/public")
	public ChatMessage sendMessage(ChatMessage message) {
		return message;
	}

}
