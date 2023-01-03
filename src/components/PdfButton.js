import React, { useRef } from 'react'
import Barcode from 'react-barcode/lib/react-barcode'
import * as RTP from "react-to-print"
import Printer, { print } from 'react-pdf-print'


const PdfButton = () => {
    const ids = ['1']

    return (
        <div>
            <button onClick={() => {}}>PdfButton</button>
        </div>

    )
}

export default PdfButton