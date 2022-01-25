import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';


const BuyerProfile = (props) => {
    const [thisUser, setThisUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [buttonText, setButtonText] = useState('Edit');
    const handleChange = (prop) => (event) => {
        setThisUser({ ...thisUser, [prop]: event.target.value });
    };
    
    const onSubmit = (props) => {
        console.log(thisUser);
        var elements = document.getElementsByClassName("MuiOutlinedInput-input MuiInputBase-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input");
        if (buttonText === 'Edit') {
            for (var i = 0; i < elements.length; i++) {elements[i].readOnly=false;}
            setButtonText('Submit');
        } else {
            console.log(thisUser);
            axios
                .post('http://localhost:4000/user/edit', thisUser)
                .then(()=>{
                    swal('Edited successfully', 'Your details have been updated.', 'success');
                })
                .catch((err)=>console.log(err));
            for (var i = 0; i < elements.length; i++) {elements[i].readOnly=true;}
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
                <Grid container spacing={2} align={'center'}>
                    <Grid item xs={12}>
                        <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 420,
                        }}
                        >
                    <Grid container align={'center'}>
                        <Grid item xs={6}>
                            <Grid container align={'center'} spacing={2}>

                                <Grid item xs={12}>
                                    <TextField
                                        label='Name'
                                        variant='outlined'
                                        value={thisUser.Name}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('Name')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Email'
                                        variant='outlined'
                                        value={thisUser.Email}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('Email')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Password'
                                        variant='outlined'
                                        value={thisUser.Password}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('Password')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Contact number'
                                        variant='outlined'
                                        value={thisUser.ContactNo}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('ContactNo')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Age'
                                        variant='outlined'
                                        value={thisUser.Age}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('Age')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label='Batch'
                                        variant='outlined' 
                                        value={thisUser.BatchName}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('BatchName')}
                                    />
                                </Grid>
                            </Grid>
                            </Grid>
                            <Grid item xs={12}></Grid>
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
