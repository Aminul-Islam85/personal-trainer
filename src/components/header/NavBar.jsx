import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 264;

const NavBar = ({ isDrawerOpen, toggleDrawer }) => (
    <AppBar
        position="fixed"
        sx={{
            width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
            ml: isDrawerOpen ? `${drawerWidth}px` : 0,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
    >
        <Toolbar>
            {!isDrawerOpen && (
                <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
            )}
            <Typography variant="h6" noWrap>
                PersonalTrainer
            </Typography>
        </Toolbar>
    </AppBar>
);

export default NavBar;
