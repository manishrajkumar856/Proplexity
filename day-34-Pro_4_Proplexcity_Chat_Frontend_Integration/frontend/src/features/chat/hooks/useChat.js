import { useDispatch } from "react-redux";
import { chatMessages, deleteChat, getChats, sendMessage } from "../service/chat.api";
import { initializeSocketConnection } from "../service/chat.socket";
import { setChats, setCurrentChatId, setLoading, createNewChat, addNewMessage } from "../chat.slice";


export const useChat = ()=>{

    const dispatch = useDispatch();
    

    async function handleSendMessage({message, chatId}){
        dispatch(setLoading(true));
        try {
            const data = await sendMessage({message, chatId});
            const {aiMessage, chat} = data;
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }));
            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))            
            dispatch(setCurrentChatId(chat._id));

        } catch (error) {
            console.log(error);
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
    }
}

