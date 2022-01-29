import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from '@mui/material/Chip';
import swal from 'sweetalert';
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Fuse from 'fuse.js'

const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"]
const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]
const indices = new Array(10).fill().map((_, idx) => idx);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const BuyerFoodMenu = (props) => {
    const navigate = useNavigate();
    const Input = styled(MuiInput)`
    width: 60px;
    `;

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;
    const ShopName = user.ShopName;

    const [foodMenu, setFoodMenu] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [sortedMenu, setSortedMenu] = useState([]);
    const [sortByPrice, setSortByPrice] = useState(true);
    const [searchText, setSearchText] = useState('');

    // Canteen opening time
    const [COT, setCOT] = useState(null);
    // Canteen closing time
    const [CCT, setCCT] = useState(null);

    const [chips, setChips] = useState([]);
    const [addON, setAddON] = useState([]);

    const [open, setOpen] = useState(false);

    const [currOrder, setCurrOrder] = useState({food: {
        Name: '', ShopName: '', Price: 0, AddOns: []
    }, quantity: 0, addOn: ''});
  
    const handleClose = () => {
        setAddON([]); setChips([]);
        setCurrOrder({food: {
            Name: '', ShopName: '', Price: 0, AddOns: [], VendorID: null
        }, quantity: 0, addOn: ''});
        setOpen(false);
    };

    function MutliSelectChip(props) {
        const theme = useTheme();
    
        const handleChange = (event) => {
            const {
            target: { value },
            } = event;
            setAddON(
            typeof value === 'string' ? value.split(',') : value,
            );
        };
    
        return (
            <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Add ons</InputLabel>
                <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={addON}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                        <Chip key={value} label={value} />
                    ))}
                    </Box>
                )}
                MenuProps={MenuProps}
                >
                {props.addONList.map((name) => (
                    <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, addON, theme)}
                    >
                    {name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </div>
        );
    }
    

    const isCanteenOpen = (date, O_hrs, O_mins, C_hrs, C_mins) => {
        const Now_hrs = date.getHours(); const Now_mins = date.getMinutes();
        console.log(O_hrs, O_mins, '\n', Now_hrs, Now_mins, '\n', C_hrs, C_mins);
        return Boolean(((O_hrs < Now_hrs || (O_hrs === Now_hrs && O_mins <= Now_mins)) && 
                ((Now_hrs < C_hrs || (Now_hrs === C_hrs && Now_mins <= C_mins)))));
    }

    const placeOrder = () => {
        if (currOrder.quantity === 0) {
            swal("Error", "Please enter a valid quantity", "error"); return;
        }
        setCOT(new Date(currOrder.food.CanteenOpeningTime)); setCCT(new Date(currOrder.food.CanteenClosingTime));
        const date = new Date();
        console.log(date);
        if (!isCanteenOpen(date, COT.getHours(), COT.getMinutes(), CCT.getHours(), CCT.getMinutes())) {
            swal("Error", `Sorry for the inconvenience. ${currOrder.food.ShopName} is not open right now.`, "error"); 
            setCurrOrder({food: {
                Name: '', ShopName: '', Price: 0, AddOns: []
            }, quantity: 0, addOn: ''});
            setOpen(false); return;
        }
        const Totall = (currOrder.food.Price + (addON.map((a) => Number((a.split('₹'))[1])).reduce((prev, curr) => (prev + curr), 0))) * currOrder.quantity;
        console.log("Price: ", currOrder.food.Price, "  Total: ", Totall);
        if (Totall > user.Wallet) {
            swal('Oops! Something went wrong!', 'You do not have enough money in your wallet!', 'error');
            setCurrOrder({food: {
                Name: '', ShopName: '', Price: 0, AddOns: []
            }, quantity: 0, addOn: ''}); return;
        }

        axios
            .post('http://localhost:4000/order/place', {
                foodItem: currOrder.food.Name,
                VendorID: currOrder.food.VendorID,
                BuyerID: userID,
                VendorName: currOrder.food.VendorName,
                buyerAge: user.Age,
                buyerBatch: user.BatchName,
                Price: currOrder.food.Price,
                Quantity: currOrder.quantity,
                AddOns: (addON.map((a) => (a.split(':'))[0]).join(', ')),
                Veg: currOrder.food.Veg,
                Total: Totall,
                Rating: -1,
                date: date,
                Status: 'PLACED'
            }).then((response) => {
                console.log(response.data);
                axios
                    .post('http://localhost:4000/user/edit', {
                        _id: userID, 
                        updateWallet: true, 
                        increment: (-Totall)
                    }).then((response) => {
                        console.log(response.data); setCurrOrder({food: {
                            Name: '', ShopName: '', Price: 0, AddOns: []
                        }, quantity: 0, addOn: ''});
                        setChips([]); setAddON([]);
                        swal({
                            title: `Order placed!`, 
                            text: `Your order of ₹${Totall} has been placed. Please wait till the chef prepares it.`, 
                            icon: `success`}).then(() => {
                                setOpen(false);
                                window.location='/buyer/orders';
                            });
                    })
                    .catch((error) => console.log(error));
            }).catch((err) => {
                console.log(err.message);
                setCurrOrder({food: {
                    Name: '', ShopName: '', Price: 0, AddOns: []
                }, quantity: 0, addOn: ''});
            });
    }

    const changeQuantity = (event) => {
        setCurrOrder({...currOrder, quantity:(event.target.value < 0 ? 0 : event.target.value)});
    };

    useEffect(() => {
        // console.log(userID);
        axios
            .get('http://localhost:4000/food')
            .then((response) => {
                setFoodMenu(response.data);
                setFilteredMenu(response.data);
                setSortedMenu(response.data);
                setSearchText('');
            })
            .catch(err => {
                console.log('Err.Message: ', err)
            })
    }, []);

    const searchBar = (event) => {
        setSearchText(event.target.value);
        console.log("Text: ", searchText, "    filtered: ", filteredMenu, "  food: ",  foodMenu);
    }

    useEffect(() => {
        const [intermediate, setIntermediate] = useState(filteredMenu);
        if (searchText !== null && !(searchText === '')) {
            const fuse = new Fuse(foodMenu, {
                keys: ['Name']
            });
            const results = fuse.search(searchText);
            if (results.length) {
                setIntermediate(results.map(result => result.item));
            } else {
                setIntermediate([]);
            }
        }
        
        if (sortByPrice) {
            let tempFoodMenu = intermediate;
            const flag = sortByPrice;
            tempFoodMenu.sort((a, b) => {
                return (1 - 2 * flag) * ( a.Price - b.Price);
            });
            setIntermediate(tempFoodMenu);
        }
    });

    const sortChange = () => {
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
            <Grid container>
            <Grid item xs={12} md={3} lg={3}>
            <List component="nav" aria-label="mailbox folders">
                <ListItem text>
                <h1>Filters</h1>
                </ListItem>
            </List>
            </Grid>
            <Grid item xs={12} md={9} lg={9}>
            <List component="nav" aria-label="mailbox folders">
                <TextField
                id="standard-basic"
                label="Search"
                fullWidth={true}
                InputProps={{
                    endAdornment: (
                    <InputAdornment>
                        <IconButton>
                        <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                onChange={searchBar}
                />
            </List>
            </Grid>
        </Grid>
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
                                Rating
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(filteredMenu).map((user, ind) => (
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
                                    console.log(user.Rating);
                                    setChips((user.AddOns).map((addOn) => `${ADD_ONS[addOn.Name]}: ₹${addOn.Price}`));
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
                        <Grid item xs={12}><MutliSelectChip addONList={chips}/></Grid>
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
                        <Grid item xs={12}>
                            <Typography variant='h6'  gutterBottom>
                                Order Total: ₹{(currOrder.food.Price + (addON.map((a) => Number((a.split('₹'))[1])).reduce((prev, curr) => (prev + curr), 0))) * currOrder.quantity}
                            </Typography>
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
