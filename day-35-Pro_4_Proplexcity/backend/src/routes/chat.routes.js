import { Router } from 'express';
import { identifyUser } from '../middleware/auth.middleware.js';
import { deleteChat, getChats, getMessages, sendMessage } from '../controller/chat.controller.js';

const chatRouter = Router();

chatRouter.post('/message', identifyUser, sendMessage);

chatRouter.get('/', identifyUser, getChats);

chatRouter.get('/:chatId/messages', identifyUser, getMessages);

chatRouter.delete('/delete/:chatId', identifyUser, deleteChat);


export default chatRouter;