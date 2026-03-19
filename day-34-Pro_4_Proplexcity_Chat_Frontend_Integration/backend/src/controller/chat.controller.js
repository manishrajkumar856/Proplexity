import { Result } from "express-validator";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";

export const sendMessage = async (req, res, next) => {
  const { message, chatId } = req.body;

  let title = null;
  let chat = null;

  try {
    if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title: title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chatId || chat._id });

  const result = await generateResponse(messages);
  console.log(messages);

    const aiMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: result,
      role: "ai",
    });

    return res.status(201).json({
        title,
      aiMessage: aiMessage,
      chat: chat,
    });
  } catch (error) {
    const err = new Error("Internal Server Error!: "+error);
    err.status = 500;
    next(err);
  }
};

export async function getChats(req, res, next) {
    const user = req.user;
    
    const chats = await chatModel.find({
        user: user.id,
    });

    res.status(200).json({
        message: 'Chat retrived successfully!',
        chats
    });
}

export async function getMessages(req, res, next) {
    const {chatId} = req.params;
    
    const chat = await chatModel.findOne({
        chat: chatId,
        user: req.user.id,
    });

    if(!chat){
        const err = new Error('Chat not exist!');
        err.status = 404;
        return next(err);
    }

    const messages = await messageModel.find({
        chat: chat._id,
    });

    return res.status(200).json({
        message: "Message retrieved successfully!",
        messages,
    });

}


export async function deleteChat(req, res, next) {
    const {chatId} = req.params;
    
    const chat = await chatModel.findOneAndDelete({
        chat: chatId,
        user: req.user.id,
    });

    await messageModel.deleteMany({
        chat: chatId
    })

    if(!chat){
        const err = new Error('Chat not found!');
        err.status = 404;
        return next(err);
    }

    res.status(200).json({
        message: "Chat deleted successfully!"
    });
}