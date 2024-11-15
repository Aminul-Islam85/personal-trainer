import React, { useState, useEffect } from 'react';
import { fetchTrainings, addTraining, deleteTraining, fetchCustomers } from '../apiService';
import {
    Box,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTraining from '../components/crud-operations/AddTraining';
import DeleteTraining from '../components/crud-operations/DeleteTraining';
import CloseIcon from '@mui/icons-material/Close'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Trainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [filter, setFilter] = useState('');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const getTrainings = async () => {
            try {
                const data = await fetchTrainings();
                const updatedTrainings = await Promise.all(
                    data._embedded?.trainings.map(async (training) => {
                        if (training._links?.customer?.href) {
                            try {
                                const customerResponse = await fetch(training._links.customer.href);
                                const customerData = await customerResponse.json();
                                return {
                                    ...training,
                                    customerName: `${customerData.firstname} ${customerData.lastname}`
                                };
                            } catch {
                                return { ...training, customerName: 'Unknown Customer' };
                            }
                        }
                        return { ...training, customerName: 'No Customer Info' };
                    })
                );
                setTrainings(updatedTrainings || []);
            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };

        const getCustomers = async () => {
            try {
                const customerData = await fetchCustomers();
                setCustomers(customerData._embedded?.customers || []);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        getTrainings();
        getCustomers();
    }, []);

    const handleAddTraining = async (trainingData) => {
        try {
            const newTraining = await addTraining(trainingData);
            newTraining.customerName = 'No Customer Info';

            if (trainingData.customer) {
                try {
                    const customerResponse = await fetch(trainingData.customer);
                    const customerData = await customerResponse.json();
                    newTraining.customerName = `${customerData.firstname} ${customerData.lastname}`;
                } catch {
                    console.error('Error fetching customer data');
                }
            }
            setTrainings((prevTrainings) => [...prevTrainings, newTraining]);
        } catch (error) {
            console.error('Error adding training:', error);
        }
    };

    const handleDeleteTraining = async () => {
        if (selectedTraining) {
            try {
                await deleteTraining(selectedTraining._links.self.href);
                setTrainings((prevTrainings) => prevTrainings.filter((training) => training._links.self.href !== selectedTraining._links.self.href));
            } catch (error) {
                console.error('Error deleting training:', error);
            }
        }
        setIsDeleteConfirmOpen(false);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setPage(0);
    };

    
    const filteredTrainings = trainings.filter((training) =>
        training.activity.toLowerCase().includes(filter.toLowerCase())
    );

    const paginatedTrainings = filteredTrainings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    
    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const chartData = {
        labels: [...new Set(trainings.map(training => training.activity))],
        datasets: [{
            label: 'Duration (min)',
            data: [...new Set(trainings.map(training => training.activity))].map(activity =>
                trainings.filter(training => training.activity === activity).reduce((total, current) => total + current.duration, 0)
            ),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    };

    const handleOpenStatistics = () => setIsStatisticsOpen(true);
    const handleCloseStatistics = () => setIsStatisticsOpen(false);

    return (
        <Box>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                    <Typography variant="h6">Trainings</Typography>
                    <TextField label="Search" variant="standard" value={filter} onChange={handleFilterChange} />
                    <Button variant="outlined" onClick={handleOpenStatistics} style={{ margin: '0 10px' }}>
                        Statistics
                    </Button>
                    <IconButton color="primary" onClick={() => setIsAddTrainingOpen(true)}>
                        Add Training
                    </IconButton>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Actions</TableCell>
                            <TableCell>Activity</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Duration (min)</TableCell>
                            <TableCell>Customer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedTrainings.map((training) => (
                            <TableRow key={training._links?.self?.href}>
                                <TableCell>
                                    <IconButton color="secondary" onClick={() => { setSelectedTraining(training); setIsDeleteConfirmOpen(true); }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>{training.activity}</TableCell>
                                <TableCell>{new Date(training.date).toLocaleString()}</TableCell>
                                <TableCell>{training.duration}</TableCell>
                                <TableCell>{training.customerName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredTrainings.length} 
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            <AddTraining open={isAddTrainingOpen} onClose={() => setIsAddTrainingOpen(false)} onAddTraining={handleAddTraining} customers={customers} />
            <DeleteTraining open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleDeleteTraining} message="Are you sure you want to delete this training?" />

            
            <Dialog open={isStatisticsOpen}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick') {
                        handleCloseStatistics();
                    }
            }}
            fullWidth
            maxWidth="md"
            disableEscapeKeyDown
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Training Statistics</Typography>
                    <IconButton onClick={handleCloseStatistics} edge="end">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <Typography variant="h6">Duration by Activity</Typography>
                        <Bar data={chartData} />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Trainings;
