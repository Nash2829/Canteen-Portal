import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import Chip from '@mui/material/Chip';
import InputAdornment from "@mui/material/InputAdornment";
import swal from 'sweetalert';
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from '@mui/icons-material/Delete';
import Slider from '@mui/material/Slider';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"]
const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]
const indices = new Array(10).fill().map((_, idx) => idx);


const BuyerFoodMenu = (props) => {
    const navigate = useNavigate();

    const Input = styled(MuiInput)`
    width: 60px;
    `;

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;
    const ShopName = user.ShopName;

    const [foodMenu, setFoodMenu] = useState([]);
    const [sortedMenu, setSortedMenu] = useState([]);
    const [sortByPrice, setSortByPrice] = useState(true);
    const [searchText, setSearchText] = useState('');

    const [open, setOpen] = useState(false);

    const [currOrder, setCurrOrder] = useState({food: {
        Name: '', ShopName: '', Price: 0, AddOns: []
    }, quantity: 0, addOn: ''});
  
    const handleClose = () => {
        setCurrOrder({food: {
            Name: '', ShopName: '', Price: 0, AddOns: [], VendorID: null
        }, quantity: 0, addOn: ''})
        setOpen(false);
    };

    const placeOrder = () => {
        setOpen(false);
        let addOnPrice = 0;
        currOrder.food.AddOns.forEach(addOn => {addOnPrice += addOn.Price;});
        const Totall = (currOrder.food.Price + addOnPrice) * currOrder.quantity;
        axios
            .post('http://localhost:4000/order/place', {
                foodItem: currOrder.food.Name,
                VendorID: currOrder.food.VendorID,
                BuyerID: userID,
                Price: currOrder.food.Price,
                Quantity: currOrder.quantity,
                AddOns: currOrder.food.AddOns.map((addOn) => ADD_ONS[addOn.Name]).join(', '),
                Veg: currOrder.food.Veg,
                Total: Totall,
                Rating: 0,
                Status: 'PLACED'
            }).then((response) => {
                console.log(response.data);
                swal(`Order placed`, 'Your order of ₹' + Totall + 'has been placed. Please wait till the chef prepares it.', `success`);
            }).catch((err) => {
                console.log(err.message);
            });
        setCurrOrder({food: {
            Name: '', ShopName: '', Price: 0, AddOns: []
        }, quantity: 0, addOn: ''})
    }

    const changeQuantity = (event) => {
        setCurrOrder({...currOrder, quantity:(event.target.value < 0 ? 0 : event.target.value)});
    };

    useEffect(() => {
        console.log(userID);
        axios
            .get('http://localhost:4000/food')
            .then((response) => {
                setFoodMenu(response.data);
                setSortedMenu(response.data);
                setSearchText('');
            })
            .catch(err => {
                console.log('Err.Message: ', err.errMsg)
            })
    }, []);

    const sortChange = () => {
        let tempFoodMenu = foodMenu;
        const flag = sortByPrice;
        console.log(flag);
        tempFoodMenu.sort((a, b) => {
            return (1 - 2 * flag) * ( a.Price - b.Price);
        });
        console.log(tempFoodMenu);
        setFoodMenu(tempFoodMenu);
        setSortByPrice(!flag);
    };

    const getTags = (tagSet) => {
        let tagList = [];
        TAGS.forEach((tag, idx) => {if ((tagSet >> idx) & 1) tagList.push(tag);})
        return tagList;
    }

  return (
    <div align={'center'} >

        <Grid item xs={12} md={9} lg={9}>
            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell> Sr No.</TableCell>
                            <TableCell>Food item</TableCell>
                            <TableCell>Shop</TableCell>
                            <TableCell>
                                {" "}
                                <Button onClick={sortChange}>
                                {sortByPrice ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                </Button>
                                Price
                            </TableCell>
                            <TableCell>Veg/Non-veg</TableCell>
                            <TableCell>Add ons</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell>
                                {" "}
                                <Button >
                                {sortByPrice ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                </Button>
                                Rating
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {foodMenu.map((user, ind) => (
                        <TableRow key={ind}>
                            <TableCell>{ind + 1}</TableCell>
                            <TableCell>{user.Name}</TableCell>
                            <TableCell>{user.ShopName}</TableCell>
                            <TableCell>{user.Price}</TableCell>
                            <TableCell>{user.Veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell>{ user.AddOns.map((addOn) => (
                                <Chip label={ADD_ONS[addOn.Name] + ': ₹' + addOn.Price} variant='outlined'/>
                                )) }</TableCell>
                            <TableCell>{getTags(user.Tags).map((tag) => (<Chip label={tag} variant='outlined' />))}</TableCell>
                            <TableCell>{user.Rating}</TableCell>
                            <TableCell>
                                <Button variant="outlined" onClick={() => {
                                    setCurrOrder({food: user, quantity: 0});
                                    setOpen(true);
                                }}>
                                    Buy item
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Place order</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Buy Now!!!
                    </DialogContentText>
                    <Grid container align={'center'} spacing={2}
                        >
                        <Grid item xs={12}>
                            <TextField
                                size='small'
                                label='Food item name'
                                InputProps={{readOnly: true}}
                                defaultValue={currOrder.food.Name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                size='small'
                                label='Shop'
                                InputProps={{readOnly: true}}
                                defaultValue={currOrder.food.ShopName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                size='small'
                                label='Price'
                                InputProps={{readOnly: true}}
                                defaultValue={currOrder.food.Price}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography  gutterBottom>
                                Quantity
                            </Typography>
                            <Input
                                value={currOrder.quantity}
                                onChange={changeQuantity}
                                size="small"
                                    inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 10,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={placeOrder}>Place order</Button>
                    </DialogActions>
                </Dialog>
                </div>
          </Paper>
        </Grid>
    </div>
  );
};

export default BuyerFoodMenu;
