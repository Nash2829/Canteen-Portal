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
import Typography from '@mui/material/Typography';

const Statistics = (props) => {
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
    return (
    <div align={'center'} spacing={10}>
        <Typography variant="h4" component='div' gutterBottom>
            Statistics
        </Typography>
        <Grid item xs={12} md={9} lg={9}>
            <Paper>
                <Table >
                    <TableHead>
                        <TableRow>
                                <TableCell> Orders placed </TableCell>
                                <TableCell> Orders pending </TableCell>
                                <TableCell> Completed orders </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >
                            <TableCell>{orders.reduce((prev, order) => prev + (order.Status === 'PLACED' ? 1 : 0), 0)}</TableCell>
                            <TableCell>{orders.reduce((prev, order) => prev + ((['REJECTED', 'COMPLETED']).includes(order.Status) ? 0 : 1 ), 0)}</TableCell>
                            <TableCell>{orders.reduce((prev, order) => prev + (order.Status === 'COMPLETED' ? 1 : 0), 0)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
          </Paper>
        </Grid>
        <br />
        <Typography variant="h5" component='div' gutterBottom>
            Top orders
        </Typography>
        <Grid item xs={12} md={9} lg={9}>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> Food item </TableCell>
                            <TableCell> Orders completed </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                        (Array.from(orders.reduce((prev, order) => prev.set(order.foodItem, (prev.get(order.foodItem) || 0) + 1), new Map())))
                            .sort((x, y) => (y[1] - x[1]))
                            .slice(0, 5)
                            .map((x) => (
                                <TableRow>
                                    <TableCell>{x[0]}</TableCell>
                                    <TableCell>{x[1]}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
          </Paper>
        </Grid>
    </div>
  );
};

export default Statistics;
