import React from 'react'
import styles from "../css/prodbarcodecard.module.css"
import Barcode from 'react-barcode/lib/react-barcode'
import { scanProduct } from './api/api'


const ProdBarcodeCard = ({ product, labels, refreshAction }) => {

    const handleScan = (barcode) => {
        scanProduct({
            barcode: barcode
        }).then(resp => {
            if (resp.data.state) {
                alert("barcode scansionato con successo")
            }
        }).catch(exc => {
            alert(exc.response.data.message)
        })
        refreshAction(product.barcode)
    }

    //const product_obj = Object.values(product)

    return (
        <div className={styles.container}>
            <div className={styles.product}
                style={{ backgroundColor: product?.scanned_at ? '#fa98a1' : null }}
                key={product.id}
            >
                <div className={styles.header}>
                    {
                        `${product?.prodotto}`.length >= 90 ?
                            <span>{`${product.prodotto}`.slice(0, 50)} ...</span>
                            :
                            <span>{`${product.prodotto}`}</span>
                    }
                </div>
                <div
                    className={styles.details}
                >
                    <div className={styles.textDetails}>
                        {/*
                            labels.map((label, index) => {
                                if (product_obj[index] === null)
                                    return
                                return (
                                    <div key={index}>
                                        {

                                            `${product_obj[index]}`.length >= 50 ?
                                                <><b>{label} :</b> <span>{`${product_obj[index]}`.slice(0, 50)} ...</span></>
                                                :
                                                <><b>{label} :</b> <span>{`${product_obj[index]}`}</span></>

                                        }
                                    </div>
                                )
                            })
                        */}

                        <div><b>ID :</b> <span>{product.id}</span></div>
                        <div><b>Ordine :</b> <span>{product.ordine}</span></div>
                        <div><b>Creato il :</b> <span>{product.creato_il}</span></div>
                    </div>

                    <div
                        className={styles.barcode}
                    >
                        {
                            product?.barcode && <Barcode value={product.barcode} width={1.5} />
                        }

                    </div>
                </div>
            </div>
            <button
                className={styles.scanButton}
                onClick={() => handleScan(product.barcode)} >
                scan
            </button>
        </div>
    )
}

export default ProdBarcodeCard