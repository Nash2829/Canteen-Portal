import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Navbar = () => {
    const navigate = useNavigate();
    const curr = JSON.parse(localStorage.getItem('user'));
    return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    Canteen Portal
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                {curr === undefined || curr === null ?
                    <>
                        <Button color="inherit" href='/login'>
                        Login
                        </Button>
                        <Button color="inherit" href='/register'>
                            Register
                        </Button>
                    </>
                : 
                    <>
                        <Button color="inherit" href='/vendor/statistics'>
                            Statistics
                        </Button>
                            <Button color="inherit" href={curr.userStatus === 'Vendor' ? '/vendor/shop-menu' : '/buyer/menu'}>
                            Menu
                        </Button>
                        <Button color="inherit"  href={curr.userStatus === 'Vendor' ? '/vendor' : '/buyer'} >
                            My Profile
                        </Button>
                        <Button color="inherit"  href={curr.userStatus === 'Vendor' ? '/vendor/orders' : '/buyer/orders'} >
                            My orders
                        </Button>
                        <Button variant='outlined' color="inherit" onClick={() => {localStorage.clear(); navigate('/');}} >
                            Logout
                        </Button> 
                    </>
                }   
            </Toolbar>
        </AppBar>
    </Box>
  );
};

export default Navbar;
