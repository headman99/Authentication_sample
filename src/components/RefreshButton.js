import React from 'react'
import { HiOutlineRefresh } from "react-icons/hi"

const RefreshButton = () => {

    const handleRefresh = () => {
        window.location.reload();
    }

    return (
        <div
            className='button'
            style={{ margin: 20,display:'flex',justifyContent:'center'}}
            onClick={handleRefresh}
        >
            <HiOutlineRefresh size={30}  />
        </div>
    )
}

export default RefreshButton