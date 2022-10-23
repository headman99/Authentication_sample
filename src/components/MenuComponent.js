import React from 'react'
import styles from "../css/menucomponent.module.css"
import { removeMenuRecipeGroup, updateMenuRecipeGroup, updateMenuRecipeSection } from './api/api'
import MenuRow from './MenuRow'
import { removeMenuRecipe, removeMenuRecipeSection } from './api/api'
const MenuComponent = ({ recipes, disableIcons, editable }) => {

  const menuGroups = [...new Set(recipes.products.map(r => r.gruppo))]

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
    updateMenuRecipeGroup(data).then((resp) => {
      if (resp.data.state == 1) {
        alert("modifica avvenuta con successo")
        window.location.reload();
      }
    }).catch((err) => {
      console.log(err)
      alert(err.response.data.message)
    })
  }

  const handleEditMenuSection = (data) => {
    console.log(data)
    updateMenuRecipeSection(data).then((resp) => {
      if (resp.data.state == 1) {
        alert("modifica avvenuta con successo")
        window.location.reload();
      }
    }).catch((err) => {
      console.log(err)
      alert(err.response.data.message)
    })
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
                    disableIcons={disableIcons}
                    editable={editable}
                    onEdit={(newGroup) => {
                      handleEditMenuGroup({
                        old_gruppo: menuGroup,
                        new_gruppo: newGroup,
                        menu_id: recipes.menu.id
                      })
                    }
                    }

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
                    sections.map((section, index) => {
                      return (
                        <div
                          key={index}
                        >
                          <MenuRow
                            disableIcons={disableIcons}
                            editable={editable}
                            onEdit={(newSection) => {
                              handleEditMenuSection({
                                old_sezione: section,
                                new_sezione: newSection,
                                menu_id: recipes.menu.id,
                                gruppo: menuGroup
                              })

                            }}
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
                            recipes.products.filter(r => (r.sezione === section && r.gruppo === menuGroup && r.extra !== 1)).map((el) => <MenuRow disableIcons={disableIcons} handleIconClick={() => handleRemoveProduct({
                              menu_id: recipes.menu.id,
                              product_id: el.id,
                              gruppo: el.gruppo,
                              sezione: el.sezione
                            })}
                              key={el.id}
                              style={{ fontSize: 30, fontWeight: 'bold' }}
                              data={el.nome} />)
                          }
                        </div>
                      )
                    })

                  }
                  <div style={{ border: "1px solid lightgrey" }}></div>
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