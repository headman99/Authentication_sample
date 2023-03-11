import React from 'react'
import { PDFViewer, PDFDownloadLink, Document, View, Page, Text } from "@react-pdf/renderer"
import PDFContent from './PDFContent'
const ShoppingList = ({ data, headers }) => {
  return (
    <div>
      <PDFViewer style={{ width: '100%', height: '85vh' }}>
        <Document>
          <Page size='A4' style={{ display: 'flex', alignItems: 'center', paddingTop: 20, fontSize: 12, overflow: 'hidden' }}>
            <View style={{ display: 'flex', flexDirection: 'column', width: '96%' }}>
              {
                headers &&
                <View style={{  fontWeight: 'bold',display: 'flex', flexDirection: 'row', padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: 'grey', borderStyle: 'solid' }}>
                  {
                    headers.map((head,i) => {
                      return (
                        <Text key={i} style={{ flex: i==0?1:0.5,textAlign:i==0?'left':'center',textOverflow:'ellipsis' }}>{head}</Text>
                      )

                    })
                  }
                </View>

              }
              {
                data && data.map(i => (
                  <View key={i.ingredient} style={{ display: 'flex', flexDirection: 'row', padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: 'grey', borderStyle: 'solid' }}>
                    <Text style={{ flex: 1 }}>{i.ingredient}</Text>
                    <Text style={{ flex: 0.5, textAlign:'center'}}>{i.quantity} {i?.pz && <Text> pz</Text>}</Text>
                    <Text style={{ flex: 0.5,textAlign:'center' }}>{i.category}</Text>
                    <Text style={{ flex: 0.5,textAlign:'center' }}>{i.provider}</Text>
                  </View>
                ))
              }
            </View>
          </Page>


        </Document>
      </PDFViewer>
    </div>
  )
}

export default ShoppingList