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
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';

const VendorOrders = (props) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log(userID);
        const post = {VendorID: userID};
        axios
            .get(`http://localhost:4000/order?buyerid=${userID}`)
            .then((response) => {
                setOrders(response.data);
                console.log(orders);
            })
            .catch(err => {
                console.log('Err.Message: ', err.errMsg)
            });
    }, []);

    const changeStatus = (orderId, status) => {
        console.log("In changeStatus, params: ", orderId, " ", status);
        axios
            .post(`http://localhost:4000/order/status`, {_id: orderId, Status: status})
            .then((resp) => {
                console.log('Changed Status. ', resp);
                window.location='/buyer/orders'
            })
            .catch((err) => console.log(err));
    }

    const Print = (props) => {
        const status = props.status;
        switch(status) {
            case 'PLACED': return(
                <>
                    <Typography gutterBottom>PLACED</Typography>
                </>
            );
            case 'ACCEPTED': return (
                <>
                    <Typography gutterBottom>ACCEPTED</Typography>
                </>
            );
            case 'REJECTED': return (
                <>
                    <Typography gutterBottom>REJECTED</Typography>
                </>
            );
            case 'COOKING': return (
                <>
                    <Typography gutterBottom>COOKING</Typography>
                </>
            );
            case 'READY FOR PICKUP': return (
                <>
                    <Typography gutterBottom>Your order is ready for pick up.</Typography>
                    <Button 
                        variant='contained'
                        onClick={() => changeStatus(props._id, 'COMPLETED')}
                        >
                        Picked Up
                    </Button>
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
