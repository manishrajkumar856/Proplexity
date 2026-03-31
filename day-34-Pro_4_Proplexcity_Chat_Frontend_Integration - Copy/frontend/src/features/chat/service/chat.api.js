import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/chats/',
    withCredentials: true,
});

export const sendMessage = async ({message, chatId}) => {
    try {
        const response = await api.post('/message', {message, chatId});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getChats = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const chatMessages = async (chatId) => {
    try {
        const response = await api.get(`/${chatId}/messages`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteChat = async (chatId) => {
    try {
        const response = await api.delete(`/delete/:${chatId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}