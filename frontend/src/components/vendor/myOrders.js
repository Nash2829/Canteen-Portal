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
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';

const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"]
const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]
const indices = new Array(10).fill().map((_, idx) => idx);


const VendorOrders = (props) => {

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log(userID);
        const post = {VendorID: userID};
        axios
            .get(`http://localhost:4000/order?vendorid=${userID}`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch(err => {
                console.log('Err.Message: ', err.errMsg)
            });
    }, []);

    const getTags = (tagSet) => {
        let tagList = [];
        TAGS.forEach((tag, idx) => {if ((tagSet >> idx) & 1) tagList.push(tag);})
        return tagList;
    }

    const changeStatus = (orderId, status) => {
        if (orders.reduce((prev, order) => prev + ((order.Status === 'ACCEPTED' || order.Status === 'COOKING') ? 1 : 0)) >= 10 && 
            status === 'ACCEPTED') {
            swal('Order overload', 'Please tend to the pending orders first. You can come to this order later.', 'warning');
            return;
        }
        console.log("In changeStatus, params: ", orderId, " ", status);
        axios
            .post(`http://localhost:4000/order/status`, {_id: orderId, Status: status})
            .then((resp) => {
                console.log('Changed Status. ', resp);
                window.location='/vendor/orders'
            })
            .catch((err) => console.log(err));
    }

    const Print = (props) => {
        const status = props.status;
        switch(status) {
            case 'PLACED': return(
                <>
                    <Box sx={{ '& > button': { m: 1 } }}>
                        <Button 
                            variant='contained'
                            startIcon={<CheckIcon />}
                            color='success'
                            onClick={() => changeStatus(props._id, 'ACCEPTED')}
                            >Accept</Button>
                        <Button 
                            variant='contained'
                            startIcon={<ClearIcon />}
                            color='error'
                            onClick={() => changeStatus(props._id, 'REJECTED')}
                            >Reject</Button>
                    </Box>
                </>
            );
            case 'ACCEPTED': return (
                <>
                    <Typography gutterBottom>Order accepted. Start cooking?</Typography>
                    <Button 
                        variant='contained'
                        startIcon={<SoupKitchenIcon />}
                        color='warning'
                        onClick={() => changeStatus(props._id, 'COOKING')}
                        >
                        Cook
                    </Button>
                </>
            );
            case 'REJECTED': return (
                <>
                    <Typography gutterBottom>REJECTED</Typography>
                </>
            );
            case 'COOKING': return (
                <>
                    <Typography gutterBottom>In preparation. Notify buyer?</Typography>
                    <Button 
                        variant='contained'
                        startIcon={<TakeoutDiningIcon />}
                        onClick={() => changeStatus(props._id, 'READY FOR PICKUP')}
                        >
                        Ready for Pickup
                    </Button>
                </>
            );
            case 'READY FOR PICKUP': return (
                <>
                    <Typography gutterBottom>Buyer notified.</Typography>
                </>
            );
            case 'COMPLETED': return (
                <>
                    <Typography gutterBottom>COMPLETED</Typography>
                </>
            );
        }
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
                            <TableCell>Veg/Non-veg</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Add ons</TableCell>
                            <TableCell>Order total</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, ind) => (
                        <TableRow key={ind}>
                            <TableCell>{ind + 1}</TableCell>
                            <TableCell>{order.foodItem}</TableCell>
                            <TableCell>{order.Veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell>{'₹ ' + order.Price}</TableCell>
                            <TableCell>{order.AddOns}</TableCell>
                            <TableCell>{'₹ ' + order.Total}</TableCell>
                            <TableCell>
                                <Print status={order.Status} _id={order._id} />
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

export default VendorOrders;
