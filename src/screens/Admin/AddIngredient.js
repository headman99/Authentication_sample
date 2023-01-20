import React, { useState } from 'react'
import styles from '../../css/addIngredient.module.css'
import { registerIngredient } from '../../components/api/api';
import BackButton from '../../components/BackButton';

const AddIngredient = () => {
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [provider, setProvider] = useState('');


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
            category: category,
            provider: provider
        }).then(() => {
            alert('Ingrediente inserito');
            setDescription('');
            setName('');
            setQuantity(0);
            setCategory('')
            setProvider('')
        }).catch((err) => {
            console.log(err)
            alert(err.response?.data?.message)
        })

    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.header}>
                <div className={styles.backButtonContainer}>
                    <BackButton path={"/admin/magazzino"} />
                </div>
                <div className={styles.title}>
                    <h1>Aggiungi Ingrediente</h1>
                </div>
            </div>

            <div className={styles.contentContainer}>
                <div className={styles.filterContainer}>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Nome</label>
                        <input className={styles.textbox} type='text'
                            value={name}
                            placeholder='Nome'
                            maxLength={50}
                            onChange={(text) => setName(text.target.value)}
                        ></input>
                        <div>
                            <span style={{ float: 'right' }}>{`${name.length}/50`}</span>
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Categoria</label>
                        <input className={styles.textbox}
                            type='text'
                            maxLength={20}
                            value={category}
                            placeholder='Categoria'
                            onChange={(text) => setCategory(text.target.value)}
                        ></input>
                        <div>
                            <span style={{ float: 'right' }}>{`${category.length}/20`}</span>
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Fornitore</label>
                        <input className={styles.textbox}
                            type='text'
                            maxLength={50}
                            value={provider}
                            placeholder='fornitore'
                            onChange={(text) => setProvider(text.target.value)}
                        ></input>
                        <div>
                            <span style={{ float: 'right' }}>{`${provider.length}/50`}</span>
                        </div>
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
        </div>
    )
}

export default AddIngredient