import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';



const BuyerProfile = (props) => {
    const navigate = useNavigate();

    const [thisUser, setThisUser] = useState(JSON.parse(localStorage.getItem('user'))) ;
    const [buttonText, setButtonText] = useState('Edit');
    const handleChange = (prop) => (event) => {
        setThisUser({ ...thisUser, [prop]: event.target.value });
    };
    
    const onSubmit = (props) => {
        console.log(thisUser);
        var elements = document.getElementsByClassName("MuiOutlinedInput-input MuiInputBase-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input");
        console.log(typeof elements);
        
        if (buttonText === 'Edit') {
            for (var i = 0; i < elements.length; i++) {elements[i].readOnly=false;}
            setButtonText('Submit');
        } else {
            axios
                .post('http://localhost:4000', thisUser)
                .then(()=>{
                    swal('Edited successfully', 'Your details have been updated.', 'success');
                })
                .catch((err)=>console.log(err));
            for (var i = 0; i < elements.length; i++) {elements[i].readOnly=true; elements[i].defaultValue={thisUser}}
            localStorage.setItem('user', JSON.stringify(thisUser));
            setButtonText('Edit');
        }
    };

    return (<div>
        <Box sx={{ display: 'flex' }}>
            <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
            >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3} align={'center'}>
                <Grid item xs={12}>
                    <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 300,
                    }}
                    >
                    <Grid item xs={12}>
                        <TextField
                            label='Name'
                            variant='outlined'
                            defaultValue={thisUser.Name}
                            value={thisUser.Name}
                            InputProps={{readOnly: true}}
                            onChange={handleChange('Name')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Email'
                            variant='outlined'
                            defaultValue={thisUser.Email}
                            value={thisUser.Email}
                            InputProps={{readOnly: true}}
                            onChange={handleChange('Email')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Password'
                            variant='outlined'
                            defaultValue={thisUser.Password}
                            value={thisUser.Password}
                            InputProps={{readOnly: true}}
                            onChange={handleChange('Password')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Contact number'
                            variant='outlined'
                            defaultValue={thisUser.ContactNo}
                            value={thisUser.ContactNo}
                            InputProps={{readOnly: true}}
                            onChange={handleChange('ContactNo')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Age'
                            variant='outlined'
                            defaultValue={thisUser.Age}
                            value={thisUser.Age}
                            InputProps={{readOnly: true}}
                            onChange={handleChange('Age')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Batch name'
                            variant='outlined'
                            defaultValue={thisUser.BatchName}
                            value={thisUser.BatchName}
                            InputProps={{readOnly: true}}
                            onChange={handleChange('BatchName')}
                        />
                    </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} align={'center'}>
                    <Button variant='contained' onClick={onSubmit}>
                        {buttonText}
                    </Button>
                </Grid>
                </Grid>
            </Container>
            </Box>
        </Box>
    </div>);
};

export default BuyerProfile;
