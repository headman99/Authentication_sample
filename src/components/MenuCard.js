import styles from "../css/cardmenu.module.css"
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from "react-router-dom";

const MenuCard = ({ menu, handleChangeMenuQuantity, handleChangeRequest, handleChangeMenuDate }) => {
    const [expanded, setExpanded] = React.useState(false);
    const { nome, descrizione, id } = menu
    const [richiesta, setRichiesta] = React.useState('')
    const [quantity, setQuantity] = React.useState()
    const [date, setDate] = React.useState('')
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 500, width: 500, minWidth: 500, margin: 10 }}>
            <Link to={`/client/menu/${id}`} style={{ textDecoration: 'none', color: 'black' }} >
                {
            /*<CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />*/}
                <CardHeader
                    title={nome}
                    subheader={id}
                >

                </CardHeader>
                <CardMedia
                    component="img"
                    height="180"
                    image="https://write.geeksforgeeks.org/static/media/Group%20210.08204759.svg"
                    alt={nome}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {descrizione}
                    </Typography>
                </CardContent>
            </Link>
            <CardActions disableSpacing>
                {/*
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>  
                */
                }
                <CardContent style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <div>
                        <Typography paragraph>Quantità:</Typography>
                        <input type="number"
                            onChange={(e) => setQuantity(e.target.value)}
                            value={quantity}
                            onBlur={(e) => {
                                let data = {
                                    quantity: parseInt(e.target.value),
                                    date: date ? date : null,
                                    menu_id: id,
                                    richiesta: richiesta ? richiesta : null
                                }

                                handleChangeMenuQuantity(data)

                            }}
                            className={styles.inputNumber} placeholder="N" />
                    </div>
                    <div>
                        <Typography paragraph>Data:</Typography>
                        <input type="date"
                            onChange={(e) => {
                                if (new Date(e.target.value) <= new Date()) {
                                    alert("inserisci una data postuma a quella odierna")
                                    setDate("")
                                    return
                                }

                                setDate(e.target.value)
                            }

                            }
                            value={date}
                            style={{ width: '80%' }}
                            onBlur={(e) => {
                                if (new Date(e.target.value) <= new Date()) {
                                    alert("inserisci una data postuma a quella odierna")
                                    setDate("")
                                    return
                                }

                                let data = {
                                    quantity: quantity ? quantity : null,
                                    date: e.target.value,
                                    menu_id: id,
                                    richiesta: richiesta ? richiesta : null
                                }
                                handleChangeMenuDate(data)

                            }}
                            className={styles.inputNumber} placeholder="Data" />
                    </div>

                </CardContent>

                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Richieste aggiuntive:</Typography>
                    <textarea
                        maxLength={250}
                        className={styles.textArea}
                        rows={7}
                        placeholder='Richieste'
                        value={richiesta}
                        onBlur={(e) => {
                            let data = {
                                quantity: quantity ? quantity : null,
                                date: date ? date : null,
                                richiesta: richiesta,
                                menu_id: id
                            }

                            if (quantity) {
                                data = {
                                    ...data,
                                    quantity: parseInt(quantity)
                                }
                            }

                            handleChangeRequest(data)

                        }}
                        onChange={(e) => { setRichiesta(e.target.value) }}
                    >
                    </textarea>
                </CardContent>
            </Collapse>
        </Card>
    );
}

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default React.memo(MenuCard)