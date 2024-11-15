import { Drawer, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ isDrawerOpen, toggleDrawer }) => (
    <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
    >
        <Toolbar>
            <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
            </IconButton>
        </Toolbar>
        <List>
            
            <ListItem button component={Link} to="/customers">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Customers" />
            </ListItem>
            <ListItem button component={Link} to="/trainings">
                <ListItemIcon><FitnessCenterIcon /></ListItemIcon>
                <ListItemText primary="Trainings" />
            </ListItem>
            <ListItem button component={Link} to="/calendar">
                <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                <ListItemText primary="Calendar" />
            </ListItem>
        </List>
    </Drawer>
);

export default Sidebar;
