import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';


const VendorProfile = (props) => {
    const curr = JSON.parse(localStorage.getItem('user'));
    const [thisUser, setThisUser] = useState({
        ...curr, OpeningTime: new Date(curr.OpeningTime), ClosingTime: new Date(curr.ClosingTime)
    }) ;
    // setThisUser({...thisUser, ['OpeningTime']: new Date(thisUser.OpeningTime)});
    // setThisUser({...thisUser, ['ClosingTime']: new Date(thisUser.ClosingTime)});
    const [buttonText, setButtonText] = useState('Edit');
    const [currPass, setCurrPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');

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
            for (var i = 0; i < elements.length; i++) {elements[i].readOnly=true; }
            localStorage.setItem('user', JSON.stringify(thisUser));
            setButtonText('Edit');
        }
    };

    const onChangePasswordButton = () => {

    }

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
                                        label='Contact number'
                                        variant='outlined'
                                        value={thisUser.ContactNo}
                                        InputProps={{readOnly: true}}
                                        onChange={handleChange('ContactNo')}
                                    />
                                </Grid>

                                {buttonText === 'Edit' && (
                                    <><Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker 
                                                readOnly
                                                label='Opening time'
                                                defaultValue={thisUser.OpeningTime}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker 
                                                readOnly
                                                label='Closing time'
                                                defaultValue={thisUser.ClosingTime}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid></>)
                                }
                                {buttonText === 'Submit' && (
                                    <><Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker 
                                                label='Opening time'
                                                value={thisUser.OpeningTime}
                                                onChange={(newTime) => setThisUser({...thisUser, ['OpeningTime'] : newTime})}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker 
                                                label='Closing time'
                                                value={thisUser.ClosingTime}
                                                onChange={(newTime) => setThisUser({...thisUser, ['ClosingTime'] : newTime})}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid></>)
                                }
                                <Grid item xs={12} align={'center'}>
                                    <Button variant='contained' onClick={onSubmit}>
                                        {buttonText}
                                    </Button>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container align={'center'} spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Enter your current password'
                                        variant='outlined'
                                        value={currPass}
                                        onChange={(newP) => setCurrPass(newP)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Enter your new password'
                                        variant='outlined'
                                        value={newPass}
                                        onChange={(newP) => setNewPass(newP)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Confirm your new password'
                                        variant='outlined'
                                        value={confirmNewPass}
                                        onChange={(newP) => setConfirmNewPass(newP)}
                                    />
                                </Grid>
                                <Grid item xs={12} align={'center'}>
                                    <Button variant='contained' onClick={onChangePasswordButton}>
                                        Change Password
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

                </Grid>
                </Grid>
            </Container>
            </Box>
        </Box>
    </div>);
};

export default VendorProfile;
