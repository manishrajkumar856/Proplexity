import React from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';

const Dashbord = () => {
    const { user } = useSelector(state => state.auth);
    const chat = useChat();

    console.log(user);
    
    useEffect(()=>{
      chat.initializeSocketConnection();
    }, [])
  return (
    <div>Dashbord</div>
  )
}

export default Dashbord