import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
const BackButton = ({path,replace}) => {
    const navigate = useNavigate();
    return (
        <button
            className='button'
            onClick={() => {
                navigate(path,{
                    replace:replace
                })
            }}>
            <FaArrowLeft size={30} />
        </button>
    )
}

export default BackButton