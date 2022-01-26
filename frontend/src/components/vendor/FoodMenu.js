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


const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"]
const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]
const indices = new Array(10).fill().map((_, idx) => idx);


const FoodMenu = (props) => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;
    const ShopName = user.ShopName;

    const [foodMenu, setFoodMenu] = useState([]);
    const [sortedMenu, setSortedMenu] = useState([]);
    const [sortByPrice, setSortByPrice] = useState(true);
    const [searchText, setSearchText] = useState('');


    useEffect(() => {
        console.log(userID);
        axios
            .get('http://localhost:4000/food')
            .then((response) => {
                // console.log('response');
                // console.log(response.data);
                setFoodMenu(response.data);
                setSortedMenu(response.data);
                setSearchText('');
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

    const customFunction = (event) => {
        console.log(event.target.value);
        setSearchText(event.target.value);
    };

    const getTags = (tagSet) => {
        let tagList = [];
        TAGS.forEach((tag, idx) => {if ((tagSet >> idx) & 1) tagList.push(tag);})
        return tagList;
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
                                    axios.post('http://localhost:4000/food/delete', {_id: user._id})
                                    .then(() => {
                                        swal(`Deleted {user.Name}`,  `{user.Name} has been deleted successfully.`, 'success');
                                        navigate('/vendor/shop-menu');
                                    }).catch(error => console.log(error.Message));
                                }} >
                                    Delete Item
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
          </Paper>
        </Grid>
    </div>
  );
};

export default FoodMenu;
