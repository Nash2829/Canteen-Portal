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
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';



const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"]
const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]
const indices = new Array(10).fill().map((_, idx) => idx);


const FoodMenu = (props) => {
    const navigate = useNavigate();

    const Input = styled(MuiInput)`
    width: 60px;
    `;
    const [open, setOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;

    const [foodMenu, setFoodMenu] = useState([]);
    const [sortByPrice, setSortByPrice] = useState(true);

    const [editItem, setEditItem] = useState({
        _id: 0, Name: '', Tags: 0, AddOns: [], Price: 0, Veg: true
    });

    const handleChangeEdit = (prop) => (event) => {
        setEditItem({...editItem, [prop]: event.target.value});
    }

    useEffect(() => {
        console.log(userID);
        axios
            .get(`http://localhost:4000/food?vendorid=${userID}`)
            .then((response) => {
                setFoodMenu(response.data);
                setEditItem({
                    _id: 0, Name: '', Tags: 0, AddOns: [], Price: 0, Veg: true
                });
            })
            .catch(err => {
                console.log('Error!!!  ', err); 
                console.log('Err.Message: ', err.message)
                console.log("GET FOOD MENU ERROR MSG: ", err.response.errMsg);
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

    const addFoodItem = (event) => {
        event.preventDefault();
        navigate('/vendor/add-item')
    }

    const getTags = (tagSet) => {
        let tagList = [];
        TAGS.forEach((tag, idx) => {if ((tagSet >> idx) & 1) tagList.push(tag);})
        return tagList;
    }

    const handleClose = () => {
        setEditItem({
            _id: 0, Name: '', Tags: 0, AddOns: [], Price: 0, Veg: true
        }); 
        setOpen(false);
    };

    const onEditItem = () => {
        axios
            .post('http://localhost:4000/food/edit-item', {
                Name: editItem.Name, 
                VendorID: userID, 
                Price: editItem.Price, 
                Veg: editItem.Veg
            }).then((response) => {
                console.log(response.data);
                swal('Edited successfully', `${editItem.Name} has been edited successfully.` ,'success');
            }).catch((err) => console.log(err));
        setEditItem({
            _id: 0, Name: '', Tags: 0, AddOns: [], Price: 0, Veg: true
        }); 
        setOpen(false);
    }

  return (
    <div align={'center'} >
     
        <Grid item xs={12} align={'center'}>
            <Button variant='contained' onClick={addFoodItem}>
                Add Food Item
            </Button>
        </Grid>

        <Grid item xs={12} md={9} lg={9}>
            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell> Sr No.</TableCell>
                            <TableCell>Name</TableCell>
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
                            <TableCell>{user.Price}</TableCell>
                            <TableCell>{user.Veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell>{ user.AddOns.map((addOn) => (
                                <Chip label={ADD_ONS[addOn.Name] + ': ₹' + addOn.Price} variant='outlined'/>
                                )) }</TableCell>
                            <TableCell>{getTags(user.Tags).map((tag) => (<Chip label={tag} variant='outlined' />))}</TableCell>
                            <TableCell>{user.Rating}</TableCell>
                            <TableCell>
                                <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => {
                                    const itemName = user.Name;
                                    swal({
                                        title: "Are you sure?",
                                        text: "Once deleted, you will not be able to recover this food item!",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                    }).then((willDelete) => {
                                        if (willDelete) {
                                            axios.post('http://localhost:4000/food/delete', {_id: user._id})
                                            .then((resp) => {
                                                console.log(resp);
                                                swal({
                                                    title: `Deleted ${itemName}`,
                                                    text: "Poof! Your food item has been deleted!", 
                                                    icon: "success",
                                                }).then(() => window.location='/vendor/shop-menu');
                                            }).catch(error => console.log(error.Message));
                                            
                                            
                                        } else {
                                            swal("Your food item is safe!");
                                        }
                                    });
                                    
                                }} >
                                    Delete Item
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" onClick={() => {
                                    setEditItem({
                                        _id: user._id,
                                        Name: user.Name, 
                                        Price: user.Price,
                                        Veg: user.Veg,
                                        Tags: user.Tags,
                                        AddOns: user.AddOns
                                    });
                                    setOpen(true);
                                }}>
                                    Edit Item
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit {editItem.Name}</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        <br />
                    </DialogContentText>
                    <Grid item xs={12}>
                            <TextField
                                size='small'
                                label='Food item name'
                                InputProps={{readOnly: true}}
                                defaultValue={editItem.Name}
                            />
                        </Grid>
                        <br />
                        <DialogContentText>
                                Edit details of {editItem.Name}:
                        </DialogContentText>
                        <DialogContentText>
                                <br />
                        </DialogContentText>
                    <Grid container align={'center'} spacing={2}
                        >
                        <Grid item xs={12}>
                            <TextField
                                size='small'
                                label='Price'
                                value={editItem.Price}
                                onChange={handleChangeEdit('Price')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Veg or Non-veg?</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={editItem.Veg}
                                    onChange={handleChangeEdit('Veg')}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Veg" />
                                    <FormControlLabel value={false} control={<Radio />} label="Non-veg" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onEditItem}>Save Edited Changes</Button>
                    </DialogActions>
                </Dialog>
                </div>
          </Paper>
        </Grid>
    </div>
  );
};

export default FoodMenu;
