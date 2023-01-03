import React, { useEffect } from 'react'
import { PDFViewer, PDFDownloadLink, Document, View, Page } from "@react-pdf/renderer"
import PDFContent from './PDFContent'
import { FaArrowLeft } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import BackButton from './BackButton'


const MyPdf = () => {

    const location= useLocation();
    const {data,from} = location.state;

    useEffect(()=>{
        console.log(location)
    },[data])

    return (
        <div style={{ width: '100vw', height:'100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%' }}>
                <BackButton path={from} />
            </div>
            <PDFViewer
                style={{ width: '100%', flex: 1 }}
            >
                <Document >
                    {
                        data && 
                        data.map((el, index) => {
                            if (index >= 1)
                                return
                            return (
                                <Page size='A4' key={index} lazy>
                                    <View>
                                        <PDFContent text={el.prodotto} barcode={el.barcode} />
                                    </View>
                                </Page>
                            )
                        }
                        )
                    }
                </Document>
            </PDFViewer>
            <PDFDownloadLink document={<Document />} fileName="somename.pdf">
            </PDFDownloadLink>
        </div>
    )
}

export default MyPdf