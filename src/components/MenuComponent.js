import React from 'react'
import styles from "../css/menucomponent.module.css"
import { addMenuRecipe, addMenuRecipeGroup, getProductsCatalog, removeMenuRecipeGroup, updateMenuRecipeGroup, updateMenuRecipeRatio, updateMenuRecipeSection } from './api/api'
import MenuRow from './MenuRow'
import { removeMenuRecipe, removeMenuRecipeSection } from './api/api'
import { useNavigate } from 'react-router-dom'
import ModalForm from './ModalForm'
import { confirmAlert } from 'react-confirm-alert'
import { FaPlusCircle } from 'react-icons/fa'
import { useEffect } from 'react'



const MenuComponent = ({ recipes, disableIcons, editable, onSelect, setRecipes, availableProducts }) => {

  const menuGroups = [...new Set(recipes.products.map(r => r.gruppo))]
  const navigate = useNavigate();

  const handleRemoveProduct = async (data) => {
    const allow = window.confirm('Procedere con l\'operazione?')
    if (allow) {
      removeMenuRecipe(data).then(resp => {
        if (resp.data.state == 1) {
          alert("Eliminazione avvenuta con successo ")
        }
        window.location.reload();
      }).catch((err) => {
        console.log(err)
        alert(err.response.data.message)
      })
    }
  }


  const openModal = (data, modalOptions, onConfirmRowEditing) => {
    confirmAlert({
      title: "Modifica riga",
      message: 'messaggio',
      closeOnEscape: true,
      closeOnClickOutside: false,
      customUI: ({ onClose }) => {
        return (
          <ModalForm
            data={data}
            options={modalOptions}
            onConfirm={onConfirmRowEditing}
            onCancel={onClose}
            title={modalOptions.title ? modalOptions.title : 'Modifica Elemento'}
          />
        )
      }

    })
  }

  const handleEditRatio = (data) => {
    updateMenuRecipeRatio({
      product_id: data.id,
      menu_id: recipes.menu.id,
      sezione: data.sezione ? data.sezione : '',
      gruppo: data.gruppo,
      ratio: parseFloat(data.ratio)
    }).then(resp => {
      if (resp.data.state === 1) {
        alert("Elemento modificato")
        let copy = [...recipes.products];
        const index = copy.findIndex(el => (el.id === data.id && el.gruppo === data.gruppo && el.sezione === data.sezione));
        copy[index].ratio = parseFloat(data.ratio)
        setRecipes({
          menu: { ...recipes.menu },
          products: [...copy]
        })
      }
    }).catch(err => {
      console.log(err)
      console.log(err.response.data.message)
      if (err.response.data.message) {
        alert(err.response.data.message)
      }
    })
  }


  const handleModifyItem = (data) => {
    openModal({
      ...data
    }, {
      modalLabels: ["Rapporto prodotto/persona"],
      updatableKeys: ['ratio'],
      types: [{ type: 'number' }],
      title: 'Modifica Rapporto prodotto/persona'
    }, handleEditRatio);
  }

  const handleRemoveMenuGroup = async (data) => {
    let allow = window.confirm("Tutti i prodotti,le sezione e il gruppo relativi verranno eliminati dal menu definitivamente, sicuri di voler procedere?")
    if (allow) {
      removeMenuRecipeGroup(data).then(resp => {
        if (resp.data.state == 1) {
          alert("Eliminazione avvenuta con successo ")
        }
        window.location.reload();
      }).catch((err) => {
        console.log(err)
        alert(err.response.data.message)
      })
    }
  }


  const handleRemoveSection = async (data) => {

    let allow = window.confirm("Tutti i prodotti e la sezione relativi verranno eliminati dal menu definitivamente, sicuri di voler procedere?")
    if (allow) {
      removeMenuRecipeSection(data).then(resp => {
        if (resp.data.state == 1) {
          alert("Eliminazione avvenuta con successo ")
        }
        window.location.reload();
      }).catch((err) => {
        console.log(err)
        alert(err.response.data.message)
      })
    }
  }



  const handleEditMenuGroup = (data) => {
    if ((data.old_gruppo === data.new_gruppo) || !data.new_gruppo)
      return
    updateMenuRecipeGroup(data).then((resp) => {
      if (resp.data.state == 1) {
        alert("modifica avvenuta con successo")
        const copy = [...recipes.products];
        copy.forEach((el, index) => {
          if (el.gruppo === data.old_gruppo) {
            copy[index].gruppo = data.new_gruppo
          }
        });

        setRecipes({
          menu: { ...recipes.menu },
          products: [...copy]
        });

      }
    }).catch((err) => {
      console.log(err)
      alert(err.response.data.message)
    })
  }

  const handleEditMenuSection = (data) => {
    console.log(data.old_sezione)
    console.log(data.new_sezione)
    if (data.old_sezione === data.new_sezione)
      return
    updateMenuRecipeSection(data).then((resp) => {
      if (resp.data.state == 1) {
        alert("modifica avvenuta con successo")
        let copy = [...recipes.products];
        copy.forEach((el, index) => {
          if (el.sezione === data.old_sezione)
            copy[index].sezione = data.new_sezione?data.new_sezione:''
        });

        setRecipes({
          menu: { ...recipes.menu },
          products: [...copy]
        });
      }
    }).catch((err) => {
      console.log(err)
      alert(err.response.data.message)
    })
  }

  const handleEditGroup = (item) => {
    addMenuRecipeGroup({
      product_id: availableProducts.find(i => i.nome === item.nome).id,
      gruppo: item.gruppo,
      sezione: item.sezione,
      groupPosition: item.groupPosition,
      menu_id: recipes.menu.id
    }).then(resp => {
      alert("Gruppo aggiunto con successo")
      const object = resp.data.object
      //window.location.reload();
      let copy = [...recipes.products];
      const index = copy.findIndex(el => el.groupPosition === item.groupPosition);
      copy.splice(index, 0, {
        gruppo: item.gruppo,
        id: object.product_id,
        sezione: item.sezione,
        groupPosition: item.groupPosition,
        menu_id: recipes.menu.id,
        alternative: object.alternative ? availableProducts.find(p => p.id === object.alternative).nome : null,
        ratio: 1,
        nome: item.nome
      })
      setRecipes({
        menu: { ...recipes.menu },
        products: [...copy]
      });

    }).catch(err => {
      console.log(err)
      if (err.response?.data?.message)
        alert(err.response.data.message)
    })
  }

  const handleAddGroup = (item) => {
    openModal({
      gruppo: '',
      sezione: '',
      nome: '',
      ...item
    }, {
      modalLabels: ["Gruppo", "Sezione", "Prodotto"],
      updatableKeys: ['gruppo', "sezione", "nome"],
      types: [{ type: 'text' }, { type: 'text' }, { type: 'select', values: [...new Set([...availableProducts.map(el => el.nome)])] }],
      title: 'Aggiungi Gruppo'
    }, handleEditGroup);
  }

  const handleEditSection = (item) => {
    addMenuRecipe({
      product_id: availableProducts.find(i => i.nome === item.nome).id,
      menu_id: recipes.menu.id,
      gruppo: item.gruppo,
      sezione: item.sezione ? item.sezione : '',
    }).then(resp => {
      alert("Sezione aggiunta con successo")
      console.log(resp)
      const object = resp.data.object
      //const {created_at,updated_at,id,...rest} = resp.data.object;
      let copy = [...recipes.products];
      copy.push({
        menu_id: object.menu_id,
        alternative: object.alternative ? availableProducts.find(p => p.id === object.alternative).nome : null,
        id: object.product_id,
        sezione: object.sezione,
        gruppo: object.gruppo,
        groupPosition: object.groupPosition,
        nome: item.nome,
        ratio: 1
      })
      setRecipes({
        menu: { ...recipes.menu },
        products: [...copy]
      });
    })
  }

  const handleAddSection = (item) => {
    openModal({
      gruppo: item.gruppo,
      sezione: '',
      nome: ''
    }, {
      modalLabels: ["Sezione", "Prodotto"],
      updatableKeys: ["sezione", "nome"],
      types: [{ type: 'text' }, { type: 'select', values: [...new Set([...availableProducts.map(el => el.nome)])] }],
      title: 'Aggiungi Sezione'
    }, handleEditSection);
  }

  return (
    <>
      <div>
        <h1 style={{ color: 'red' }}>{ }</h1>
        <div className={styles.content}>
          {
            menuGroups.map((menuGroup, index) => {
              const sections = [...new Set(recipes.products.filter(p => p.gruppo === menuGroup).map(r => r.sezione))]
              return (
                <div style={{ marginBottom: 10 }}
                  key={index}
                >
                  <MenuRow
                    disableArrow={true}
                    disableIcons={true}
                    editable={editable}
                    onEdit={(newGroup) => {
                      if (menuGroup === newGroup)
                        return;
                      handleEditMenuGroup({
                        old_gruppo: menuGroup,
                        new_gruppo: newGroup,
                        menu_id: recipes.menu.id,
                      });

                    }}

                    handleIconClick={() => {
                      handleRemoveMenuGroup({
                        menu_id: recipes.menu.id,
                        gruppo: menuGroup
                      })
                    }}
                    data={menuGroup} style={{
                      fontSize: 40,
                      fontWeight: 'bold',
                      color: 'red'
                    }} />

                  {
                    !disableIcons &&
                    <div className={styles.addGroup} onClick={() => handleAddSection({
                      //il valore index+1 corrisponde alla groupPosition, io voglio passargli il valore successivo quindi sarà index+2
                      gruppo: menuGroup
                    })}>
                      <span>Aggiungi Sezione</span>
                      <FaPlusCircle size={30} color='green' />
                    </div>
                  }

                  {
                    sections.map((section, index) => {
                      return (
                        <div
                          key={index}
                        >
                          <MenuRow
                            disableArrow={true}
                            disableIcons={true}
                            editable={editable}
                            onEdit={(newSection) => {

                              if (newSection === section)
                                return;

                              handleEditMenuSection({
                                new_sezione: newSection,
                                old_sezione: section,
                                gruppo: menuGroup,
                                menu_id: recipes.menu.id
                              });
                            }
                            }

                            handleIconClick={() => handleRemoveSection({
                              menu_id: recipes.menu.id,
                              gruppo: menuGroup,
                              sezione: section
                            })}
                            color="green" data={section} style={{
                              fontSize: 40,
                              fontWeight: 'bold',
                              color: 'green'
                            }} />
                          {
                            recipes.products.filter(r => (r.sezione === section && r.gruppo === menuGroup && !r.alternative)).map((el, index) => {
                              const alternatives = recipes.products.filter(item => (el.nome === item.alternative && el.sezione === item.sezione && el.gruppo === item.gruppo)).map(i => i.nome);

                              return (
                                <MenuRow disableIcons={disableIcons}
                                  goTo={() => navigate('alternatives', {
                                    state: {
                                      menu_id: recipes.menu.id,
                                      product_id: el.id,
                                      gruppo: el.gruppo,
                                      sezione: el.sezione,
                                    }
                                  })}
                                  handleRemoveItem={() => handleRemoveProduct({
                                    menu_id: recipes.menu.id,
                                    product_id: el.id,
                                    gruppo: el.gruppo,
                                    sezione: el.sezione
                                  })}

                                  handleModifyItem={() => handleModifyItem({ ...el })}

                                  key={index}
                                  style={{ fontSize: 30, fontWeight: 'bold' }}
                                  data={el.nome}
                                >
                                  {
                                    alternatives.length === 0 ?
                                      el.nome
                                      :
                                      <select className={styles.select}
                                        onChange={(e) => onSelect({
                                          menu_id: recipes.menu.id,
                                          product_name: e.target.value,
                                          alternative: el.nome,
                                          gruppo: el.gruppo,
                                          sezione: el.sezione
                                        })} >
                                        {
                                          [el.nome, ...alternatives].map(el => <option key={el} value={el}>{el}</option>)
                                        }

                                      </select>
                                  }
                                </MenuRow>
                              )
                            }
                            )
                          }
                        </div>
                      )
                    })

                  }
                  {
                    !disableIcons &&
                    <div className={styles.addGroup} onClick={() => handleAddGroup({
                      //il valore index+1 corrisponde alla groupPosition, io voglio passargli il valore successivo quindi sarà index+2
                      groupPosition: index + 2
                    })}>
                      <span>Aggiungi Gruppo</span>
                      <FaPlusCircle size={30} color='red' />
                    </div>
                  }

                </div>

              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default MenuComponent