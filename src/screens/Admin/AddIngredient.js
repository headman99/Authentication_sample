import React, { useState } from 'react'
import styles from '../../css/addIngredient.module.css'
import { api, registerIngredient } from '../../components/api/api';

const AddIngredient = () => {
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(0);

    const checkInput = () => {
        if (!name) {
            alert('Inserire un nome valido')
            return false;
        }

        if (!quantity) {
            setQuantity(0)
        }
        return true;
    }

    const handleAddIngredient = () => {
        if (!checkInput()) {
            return;
        }

        registerIngredient({
            description: description,
            name: name,
            quantity: parseInt(quantity),
            category:category
        }).then(resp => {
            console.log(resp);
            alert('Ingrediente inserito');
            setDescription('');
            setName('');
            setQuantity(0);
        }).catch((err) => {
            console.log(err)
            alert(err.response.data.errore)
        })

    }

    return (
        <div className={styles.mainContainer}>
            <h1>Aggiungi Ingrediente</h1>
        <div className={styles.contentContainer}>

            <div className={styles.inputContainer}>
                <label className={styles.label}>Nome</label>
                <input className={styles.textbox} type='text'
                    value={name}
                    placeholder='Nome'
                    onChange={(text) => setName(text.target.value)}
                ></input>
            </div>

            <div className={styles.inputContainer}>
                <label className={styles.label}>Categoria</label>
                <input className={styles.textbox} type='text'
                    value={category}
                    placeholder='Categoria'
                    onChange={(text) => setCategory(text.target.value)}
                ></input>
            </div>
        </div>
            
            <div className={styles.descriptionContainer}>
                <label className={styles.label}>Descrizione</label>
                <textarea
                    maxLength={250}
                    className={styles.textArea}
                    rows={7}
                    placeholder='Descrizione'
                    value={description}
                    onChange={(text) => setDescription(text.target.value)}
                >
                </textarea>
                <div>
                    <span style={{ float: 'right' }}>{`${description.length}/250`}</span>
                </div>

            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label className={styles.label}>Quantità (g)</label>
                <input className={styles.numberArea} type='number'
                    value={quantity}
                    placeholder='g'
                    onChange={(number) => setQuantity(number.target.value)}
                ></input>
            </div>
            <button type='button' className='button' onClick={handleAddIngredient}>
                Crea
            </button>
        </div>
    )
}

export default AddIngredient