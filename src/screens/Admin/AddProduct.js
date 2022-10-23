import React, { useEffect, useState } from 'react'
import styles from '../../css/addproduct.module.css'
import { registerProduct, getProductGroups } from '../../components/api/api';
import BackButton from '../../components/BackButton';
const AddProduct = () => {
    const [descrizione, setDescrizione] = useState('');
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [peso, setPeso] = useState(0);
    const [gruppo, setGruppo] = useState('');
    const [availableGroups, setAvailableGroups] = useState([])

    useEffect(() => {
        if (availableGroups.length == 0) {
            getProductGroups().then((resp) => {
                if (resp.data) {
                    setAvailableGroups(resp.data)
                }
            }).catch((err) => {
                console.log(err)
                alert(err.response.data.message)
            })
        }
    }, [])

    const checkInput = () => {
        if (!nome) {
            alert('Inserire un nome valido')
            return false;
        }
        if (!categoria) {
            setCategoria(null)
        }
        return true;
    }

    const handleAddProduct = () => {
        if (!checkInput()) {
            return;
        }
        registerProduct({
            descrizione: descrizione,
            nome: nome,
            peso: parseInt(peso),
            categoria: categoria,
            gruppo: gruppo
        }).then(resp => {
            console.log(resp);
            alert('Prodotto inserito');
            setDescrizione('');
            setNome('');
            setPeso(0);
        }).catch((err) => {
            console.log(err)
            alert(err.response.data.message)
        })

    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.header}>
                <div className={styles.backButtonContainer}>
                    <BackButton path={"/admin/catalog/productCatalog"} />
                </div>
                <div className={styles.title}>
                    <h1>Aggiungi Prodotto</h1>
                </div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.filterContainer}>
                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Nome</label>
                        <input className={styles.textbox} type='text'
                            value={nome}
                            placeholder='Nome'
                            onChange={(text) => setNome(text.target.value)}
                        ></input>
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Categoria</label>
                        <input className={styles.textbox} type='text'
                            maxLength={20}
                            value={categoria}
                            placeholder='Categoria'
                            onChange={(text) => setCategoria(text.target.value)}
                        ></input>
                        <div>
                            <span style={{ float: 'right' }}>{`${categoria?.length ? categoria.length : 0}/20`}</span>
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <label className={styles.label}>Gruppo</label>
                        <select value={gruppo} onChange={(e) => setGruppo(e.target.value)} className={styles.select}>
                            <option value={''}> </option>
                            {
                                availableGroups.map(g => <option key={g.gruppo} value={g.gruppo}>{g.gruppo}</option>)
                            }
                        </select>
                    </div>
                </div>

                <div className={styles.descriptionContainer}>
                    <label className={styles.label}>Descrizione</label>
                    <textarea
                        maxLength={250}
                        className={styles.textArea}
                        rows={7}
                        placeholder='Descrizione'
                        value={descrizione}
                        onChange={(text) => setDescrizione(text.target.value)}
                    >
                    </textarea>
                    <div>
                        <span style={{ float: 'right' }}>{`${descrizione?.length ? descrizione.length : 0}/250`}</span>
                    </div>

                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label className={styles.label}>Peso (g)</label>
                    <input className={styles.numberArea} type='number'
                        value={peso}
                        placeholder='g'
                        onChange={(number) => setPeso(number.target.value)}
                    ></input>
                </div>

                <button type='button' className='button' onClick={handleAddProduct}>
                    Crea
                </button>

            </div>
        </div>
    )
}

export default AddProduct