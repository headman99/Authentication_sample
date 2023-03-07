import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
const BackButton = ({path,replace,state}) => {
    const navigate = useNavigate();
    return (
        <button
            className='button'
            onClick={() => {
                navigate(path,{
                    replace:replace,
                    state:state
                })
            }}>
            <FaArrowLeft size={30} />
        </button>
    )
}

export default BackButton