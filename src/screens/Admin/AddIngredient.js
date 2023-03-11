import React, { useState,useEffect } from 'react'
import styles from '../../css/addIngredient.module.css'
import { registerIngredient,getTeams } from '../../components/api/api';
import BackButton from '../../components/BackButton';

const AddIngredient = () => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [fornitore, setFornitore] = useState('');
    const [team, setTeam] = useState();
    const [availableTeams, setAvailableTeams] = useState([])
    const [resultArray, setResultArray] = useState([])
    const [checked, setChekced] = useState(false)


    const checkInput = () => {
        if (!nome) {
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

        const ingredient = {
            name: nome,
            quantity: parseFloat(quantity),
            category: categoria,
            provider: fornitore,
            team:availableTeams.find(t => t.name === team)?.id,
            pz:checked
        }

   

        registerIngredient(ingredient).then(() => {
            alert('Ingrediente inserito');
            setNome('');
            setQuantity(0);
            setCategoria('')
            setFornitore('')
            setChekced(false)
            setResultArray(prev => [...prev,{...ingredient,team:team}])
        }).catch((err) => {
            console.log(err)
            alert(err.response?.data?.message)
        })

    }


    useEffect(() => {
        let isApiSubscribed = true;
    
            if (availableTeams.length == 0) {
                getTeams().then((resp) => {
                    if (isApiSubscribed && resp.data) {
                        setAvailableTeams(resp.data)
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

    return (
        < div className = { styles.main } >
            <div className={styles.header}>
                <div className={styles.backButtonContainer}>
                    <BackButton path={"/admin/magazzino"} />
                </div>
                <div className={styles.title}>
                    <h1>Aggiungi Ingrediente</h1>
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
                        <label className={styles.labell}>Quantità</label>
                        <input className={styles.text} type='number'
                            value={quantity}
                            placeholder='Nome'
                            onChange={(text) => {
                                if(isNaN(text.target.value))
                                    setQuantity('')
                                else
                                    setQuantity(parseFloat(text.target.value))
                            }}
                        ></input>
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
                        <label className={styles.labell}>Fornitore</label>
                        <input className={styles.text} type='text'
                            maxLength={20}
                            value={fornitore}
                            placeholder='Fornitore'
                            onChange={(text) => setFornitore(text.target.value)}
                        ></input>
                    </div>

                    <div className={styles.inp}>
                        <label className={styles.labell}>Team</label>
                        <select value={team} onChange={(e) => setTeam(e.target.value)} className={styles.select}>
                            <option value={''}> </option>
                            {
                                availableTeams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)
                            }
                        </select>

                    </div>

                    <div className={styles.inp}>
                        <label className={styles.labell}>Pz</label>
                        <input type = "checkbox" style={{width:35,height:35}} checked={checked} onChange={() => setChekced(prev => !prev)}/>
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
                <button type='button' className='button' onClick={handleAddIngredient}>
                    Crea
                </button>
            </div>
        </div >
    )
}

export default AddIngredient