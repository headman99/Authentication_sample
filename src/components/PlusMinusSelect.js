import React, { useEffect, useState } from 'react'
import styles from '../css/plusminusselect.module.css'
import {AiOutlineMinus,AiOutlinePlus} from 'react-icons/ai'
const PlusMinusSelect = ({data,setData,index,width,height}) => {
    const [active, setActive] = useState(2);
    
    const handleClick = (value) =>{
        const d = [...data];
        d[index] = value;
        setData(d);
        console.log(d);
    }

    useEffect(()=>{
        handleClick(2);
    },[]);

    return (
        <div className={styles.container}>
            <div className={styles.addButton}
                style={{backgroundColor:active===1 && 'black',color:active===1 && 'white', width:width,height:height}}
                onClick={()=>{
                    setActive(1)
                    handleClick(1)
                }}
            >
                <AiOutlinePlus size={25} />
            </div>
            <div className={styles.addButton}
                style={{backgroundColor:active===2 && 'black',color:active===2 && 'white',width:width,height:height}}
                onClick={()=>{
                    setActive(2)
                    handleClick(2)
                }}
            >
                <AiOutlineMinus size={25}/>
            </div>
        </div>
    )
}

export default PlusMinusSelect