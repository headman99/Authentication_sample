import React, { useState } from 'react'
import styles from '../../css/updatequantity.module.css'
import { useLocation } from 'react-router-dom'
import InputSelect from '../../components/InputSelect'
import { addIngredientQuantity } from '../../components/api/api'
import { FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import PlusMinusSelect from '../../components/PlusMinusSelect'
import BackButton from '../../components/BackButton'
const UpdateQuantity = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [plusMinus, setPlusMinus] = useState([]);
    const [count, setCount] = useState(1);
    const [values, setValues] = useState([])


    const handleChangeText = (data) => {
        let copy = [...values];
        copy[data.index] = data.newValue;
        setValues([...copy]) 
    }


    const handleConfirm = async () => {
        let data = [];
        let allow = true;
        const inputs = document.querySelectorAll('[type=text]');
        const quantities = document.querySelectorAll('[type=number]');
        inputs?.forEach((elem, index) => {
            if (!allow) {
                return;
            }
            if (!location.state.map(item => item.name).includes(elem.value) && elem.value !== '') {
                alert(`Correggi il nome dell'ingrediente inserito "${elem.value}" `);
                allow = false;
            }

            if (isNaN(quantities[index].value) || (!quantities[index].value && elem.value !== '')) {
                alert(`Correggi la quantità inserita presso l'ingrediente "${elem.value}" `)
                allow = false
            }

            if (elem.value !== '') {
                data.push({
                    ingredient: elem.value,
                    quantity: quantities[index].value,
                    mode: parseFloat(plusMinus[index])
                });
            }

        });

        if (!allow) {
            return;
        }
        if (data.length === 0) {
            alert('Inserisci almeno un ingrediente')
            return
        }

        addIngredientQuantity({
            data: data
        }).then((resp) => {
            if (resp.data.state) {
                alert('Ingredienti modificati correttamente')
                navigate('/admin/magazzino')
            }
        }).catch((e) => {
            console.log(e);
            alert(e.response.data.message);
        });

    }

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.backButtonContainer}>
                    <BackButton path={"/admin/magazzino"} />
                </div>
                <div className={styles.title}>
                    <h1>Modifica scorte</h1>
                </div>
            </div>
            <div className={styles.contentContainer}>
                {
                    Array.from({ length: count }, (_, index) => {
                        return (
                            <div className={styles.row} key={index}>
                                <InputSelect value={values[index]} onChangeText={(newValue) => handleChangeText({
                                    index: index,
                                    newValue: newValue
                                })}
                                    data={location.state.map(item => item.name)} placeholder='Ingrediente' />
                                <input type='number' className={styles.inputNumber} placeholder='Quantità' />
                                <PlusMinusSelect data={plusMinus} setData={setPlusMinus} index={index} width={100} />
                            </div>

                        )
                    })
                }
                <div >
                    <button className={styles.button}
                        onClick={() => {
                            setCount(p => p + 1);
                        }}
                    >
                        <FaPlus size={22} color='grey' />
                    </button>
                </div>
                <div style={{ marginTop: 50, marginBottom: 20 }}>
                    <button type='button' className='button'
                        style={{ width: 120, fontSize: 23 }}
                        onClick={handleConfirm}
                    >
                        Conferma
                    </button>
                </div>
            </div>

        </div >
    )
}

export default UpdateQuantity