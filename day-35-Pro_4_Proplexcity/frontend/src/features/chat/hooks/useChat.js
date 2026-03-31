import { useDispatch } from "react-redux";
import { chatMessages, deleteChat, getChats, sendMessage } from "../service/chat.api";
import { initializeSocketConnection } from "../service/chat.socket";
import { setChats, setCurrentChatId, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useEffect } from "react";


export const useChat = ()=>{

    const dispatch = useDispatch();
    

    async function handleSendMessage({message, chatId}){
        dispatch(setLoading(true));
        try {
            const data = await sendMessage({message, chatId});
            const {aiMessage, chat} = data;
            if(!chatId){
                dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }));
            }
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))            
            dispatch(setCurrentChatId(chat._id));

        } catch (error) {
            console.log(error);
        }
    }

    async function  handleGetChats() {
        dispatch(setLoading(true));
        try {
            const data = await getChats();
            const {chats} = data;

            dispatch(setChats(chats.reduce((acc, chat)=>{
                acc[chat._id] =  {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }

                return acc;
            }, {})));

            dispatch(setLoading(false));
        } catch (error) {
            console.log(error);
        }
    }

    async function  handleOpenChat(chatId, chats) {
        console.log("Chature:"+chats);
        if(chats[chatId]?.messages.length === 0){
            const data = await chatMessages(chatId);
        console.log(data);
        const { messages }  = data;
        console.log("HEllo")
        console.log("Messages: ",messages)

        const formattedMessage = Object.values(messages).map(msg => ({
            content: msg.content,
            role: msg.role,
        }))

        console.log("Formatted Message: ", formattedMessage);

        dispatch(addMessages({
            chatId: chatId,
            messages: formattedMessage,
        }));

        }
        
        dispatch(setCurrentChatId(chatId));
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }
}

