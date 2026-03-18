import React from 'react'
import { useSelector } from 'react-redux'

const Dashbord = () => {
    const { user } = useSelector(state => state.auth);

    console.log(user);
  return (
    <div>Dashbord</div>
  )
}

export default Dashbord