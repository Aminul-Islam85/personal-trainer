import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import SideBar from './SideBar';
import NavBar from './NavBar';
import { useLocation } from 'react-router-dom';

const drawerWidth = 5;

const MainLayout = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    
    const location = useLocation();
    const isDefaultPage = location.pathname === '/customers' || location.pathname === '/';

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <NavBar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
            {isDrawerOpen && <SideBar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: isDrawerOpen ? `${drawerWidth}px` : 0, 
                    padding: isDefaultPage && !isDrawerOpen ? '24px 24px 24px 0px' : '24px', 
                    transition: (theme) =>
                        theme.transitions.create(['margin', 'padding'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Toolbar />
                <Box sx={{ flex: 1 }}>{children}</Box>
            </Box>
        </Box>
    );
};

export default MainLayout;
