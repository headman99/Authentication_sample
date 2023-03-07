import React, { useEffect, useRef, useState, useContext } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import styles from "../../css/ordersproductlist.module.css"
import { getOpenProductsInstance, getProductsInstanceByFilter, scanAll } from '../../components/api/api'
import { Audio } from 'react-loader-spinner'
import CardTable from '../../components/CardTable'
import RefreshButton from '../../components/RefreshButton'
import { AiFillCaretRight, AiFillCaretLeft, AiOutlineSearch } from "react-icons/ai"
import { BarcodeContext } from '../../Routes/AdminRoutes'
import ReactDOM from 'react-dom/client';
import { AiFillPrinter } from "react-icons/ai"
import MyPdf from '../../components/MyPdf'
import BackButton from '../../components/BackButton'

const OrdersProductList = () => {
  const { contextBarcode, setContextBarcode } = useContext(BarcodeContext)
  const { pathname } = useLocation();
  const { code } = useParams()
  const filterValue = useRef('')
  const [filteredArray, setFilteredArray] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimitState, setPageLImitState] = useState(null)
  const pageLimit = useRef(1)
  const checkbox = useRef(false)
  const products = useRef([])
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    if (contextBarcode) {
      refreshAction(contextBarcode)
      setContextBarcode('')
    }
  }, [contextBarcode])

  const handleShowPdf = () => {
    const newWindow = window.open();
    newWindow.document.body.innerHTML = '<div id="root"></div>';
    const root = ReactDOM.createRoot(newWindow.document.getElementById("root"))
    root.render(
      <MyPdf data={filteredArray} />
    );
  }

  const filterContent = (filter) => {
    if (!filter) {
      if (checkbox.current)
        return products.current.filter(prod => prod.scanned_at != null)
      return products.current
    }

    if (isNaN(filter)) {
      const filtered = products.current.filter(prod => (
        prod.prodotto.toUpperCase().startsWith(filter.toUpperCase())
        || prod.barcode.split('_')[1].toUpperCase().startsWith(filter.toUpperCase()))
      )
      if (checkbox.current)
        return filtered.filter(prod => prod.scanned_at !== null)

      return filtered
    }
    else
      return products.current.filter(prod => prod.id === parseInt(filter))

  }



  const handleIncrementElements = () => {
    getOpenProductsInstance({
      order: code,
      start_from: products.current.length,
      page: currentPage
    }).then(resp => {
      if (resp?.data.length > 0) {
        products.current = products.current.concat(resp.data)
        filter();
      }
    }).catch(e => {
      console.log(e)
      alert(e.response.data.message)
    })
  }

  const filter = () => {
    if (pageLimitState !== pageLimit.current)
      setPageLImitState(pageLimit.current)
    setFilteredArray([...filterContent(filterValue.current)])
  }

  const refreshAction = (barcode) => {
    let prodsCopy = products.current
    const index = products.current.findIndex(el => el.barcode === barcode)
    const old_obj = prodsCopy[index]
    if (old_obj?.scanned_at)
      return
    prodsCopy.splice(index, 1, {
      ...prodsCopy[index],
      scanned_at: new Date().toLocaleDateString()
    })

    products.current = prodsCopy
    filter()
  }

  const handleCheckbox = () => {
    checkbox.current = !checkbox.current
    if (checkbox.current)
      setFilteredArray(filteredArray.filter(el => el.scanned_at != null))
    else
      filter()
  }

  const handlePage = (mode) => {
    const page = mode === 1 ? currentPage + 1 : currentPage - 1
    if (page < 1 || page > pageLimit || currentPage === pageLimitState)
      return

    getOpenProductsInstance({
      order: code,
      page: page
    }).then((resp) => {
      if (resp.data.length > 0) {
        products.current = [...resp.data]
        filter()
        setCurrentPage(page)
      }
    }).catch(e => {
      console.log(e)
      alert(e.response.data.message)
    })

  }

  const handleSearch = () => {
    getProductsInstanceByFilter({
      order: code,
      filter: filterValue.current
    }).then(resp => {
      if (resp.data.length > 0) {
        setFilteredArray(resp.data)
        setCurrentPage(1)
        setPageLImitState(1)
      }
    }).catch(e => {
      console.log(e)
      alert(e.response.data.message)
    })
  }

  useEffect(() => {
    let isApiSubscribed = true;
    getOpenProductsInstance({
      order: code
    }).then(resp => {
      if (isApiSubscribed && resp.data) {
        products.current = resp.data.products
        pageLimit.current = resp.data.limitPage
        setPageLImitState(pageLimit.current)
        setFilteredArray(resp.data.products)
      }
    }).catch(e => {
      console.log(e)
      alert(e.response.data.message)
    })
    return () => {
      // cancel the subscription
      isApiSubscribed = false;
    };
  }, [])

  const handleScanAll = () => {
    if (scanned)
      return
    scanAll({
      order: code
    }).then(resp => {
      if (resp.data.state === 1) {
        alert("Tutti i prodotti sono stati scannerizzati");
        setScanned(true);
      }

    }).catch(err => {
      console.log(err)
      console.log(err.response.data.message)
    })
  }

  return (
    <div className={styles.mainContainer}>
      <div className='_header'>
        <BackButton path="/admin/orders" replace={true} />
        <div className="_filtersContainer">
          <div style={{ height: '100%', display: 'flex', gap: 20 }}>
            <button style={{ fontSize: 20, padding: 10, backgroundColor: 'black', color: 'white', fontWeight: 'bold' }} onClick={handleScanAll}>Scannerizza tutti</button>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <div>Mostra solo Scannerizzati</div>
              <input type='checkbox'
                value={checkbox.current}
                className="_checkbox"
                onChange={handleCheckbox}
              />
            </div>
          </div>

          <div className={styles.inputTextContainer}>
            <input type='text'
              className="_filterInput"
              placeholder='Filtra'
              onChange={(text) => {
                filterValue.current = text.target.value
                filter()
              }}
            ></input>
            <div onClick={handleSearch}>
              <AiOutlineSearch size={45} />
            </div>
          </div>
        </div>
        <Link className='button'
          to='/admin/pdfViewer'
          state={{
            data: [...filteredArray],
            from: pathname
          }}
        >
          <AiFillPrinter size={25} />
        </Link>
        <RefreshButton />
      </div>
      <div className={styles.page}>
        <div style={{ position: 'absolute', left: 0, marginLeft: 20 }}>Risultati: {filteredArray.length}</div>
        <AiFillCaretLeft onClick={() => handlePage(-1)} size={45} />
        {currentPage} / {pageLimitState ? pageLimitState : ''}
        <AiFillCaretRight onClick={() => handlePage(1)} size={45} />
      </div>
      <div className={styles.contentContainer}>
        {
          !filteredArray
            ?
            <div style={{ width: '100%', height: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Audio color='black' />
            </div>
            :
            <CardTable data={filteredArray} handleIncrements={handleIncrementElements} refreshAction={refreshAction} scanned={scanned} />
        }
      </div>
    </div>
  )
}

export default OrdersProductList
