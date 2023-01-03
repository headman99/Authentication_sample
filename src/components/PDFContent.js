import React from 'react'
import { Text, Image, View } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode'

const PDFContent = ({ text, barcode }) => {

    let canvas = document.createElement("canvas")
    JsBarcode(canvas, barcode, {
        width: 3,
        height: 100,
        displayValue: false,
    });
    const barcodeURI = canvas.toDataURL('image/jpg');

    return (
        <View style={{ display: 'flex', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image alt="" src={barcodeURI}
                style={{
                    transform:'scale(0.3)'
                }}
            />
            <Text>{text}</Text>
        </View>
    )
}

export default PDFContent