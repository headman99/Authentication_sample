import React, { useEffect, useState } from 'react'
import styles from '../../css/addproduct.module.css'
import { registerProduct, getProductGroups, getTeams } from '../../components/api/api';
import BackButton from '../../components/BackButton';
import InputSelect from '../../components/InputSelect';

const AddProduct = () => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [gruppo, setGruppo] = useState('');
    const [availableGroups, setAvailableGroups] = useState([])
    const [resultArray, setResultArray] = useState([])


    useEffect(() => {
        let isApiSubscribed = true;
        if (availableGroups.length == 0) {
            getProductGroups().then((resp) => {
                if (isApiSubscribed && resp.data) {
                    setAvailableGroups(resp.data)
                }
            }).catch((err) => {
                console.log(err)
                alert(err.response.data.message)
            })
        }
        return () => {
            // cancel the subscription
            isApiSubscribed = false;
        };
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

        let allow = true;

        const product = {
            nome: nome,
            categoria: categoria,
            gruppo: gruppo,
        }

        if(!availableGroups.map(el => el.gruppo).includes(gruppo))
            allow = window.confirm("Il gruppo inserito è nuovo, procedere?");

        if (allow)
            registerProduct(product).then(resp => {
                alert('Prodotto inserito');
                setNome('');
                setCategoria('');
                setGruppo('');
                setResultArray(prev => [...prev, { ...product }])
            }).catch((err) => {
                console.log(err)
                if (err.response.data?.message)
                    alert(err.response.data?.message)
            })

    }

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.backButtonContainer}>
                    <BackButton path={"/admin/catalog/productCatalog"} />
                </div>
                <div className={styles.title}>
                    <h1>Aggiungi Prodotto</h1>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.filter}>
                    <div className={styles.inp}>
                        <label className={styles.labell}>Nome</label>
                        <input className={styles.text} type='text'
                            value={nome}
                            maxLength={100}
                            placeholder='Nome'
                            onChange={(text) => setNome(text.target.value)}
                        ></input>
                        <div>
                            <span style={{ float: 'right' }}>{`${nome?.length ? nome.length : 0}/100`}</span>
                        </div>
                    </div>

                    <div className={styles.inp}>
                        <label className={styles.labell}>Categoria</label>
                        <input className={styles.text} type='text'
                            maxLength={20}
                            value={categoria}
                            placeholder='Categoria'
                            onChange={(text) => setCategoria(text.target.value)}
                        ></input>
                        <div>
                            <span style={{ float: 'right' }}>{`${categoria?.length ? categoria.length : 0}/20`}</span>
                        </div>
                    </div>

                    <div className={styles.inp}>
                        <label className={styles.labell}>Gruppo</label>
                        {/*<select value={gruppo} onChange={(e) => setGruppo(e.target.value)} className={styles.select}>
                            <option value={''}> </option>
                            {
                                availableGroups.map(g => <option key={g.gruppo} value={g.gruppo}>{g.gruppo}</option>)
                            }
                        </select>*/}
                        <InputSelect data={availableGroups.map(el => el.gruppo)} value={gruppo} onChangeText={(txt) => setGruppo(txt)} />
                        <span style={{ visibility: (availableGroups.map(e => e.gruppo).includes(gruppo) || gruppo === '') ? 'hidden' : 'visible' }}>*Stai per creare un gruppo nuovo</span>
                    </div>
                </div>
                <div className={styles.results} >
                    <div className={styles.table}>
                        {resultArray.map(el => (
                            <div key={el.name} className={styles.row}>
                                {
                                    Object.values(el).map((v, i) => <div key={i} className={styles.cell}>{v}</div>)
                                }
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button type='button' className='button' onClick={handleAddProduct}>
                    Crea
                </button>
            </div>


        </div>
    )
}

export default AddProduct