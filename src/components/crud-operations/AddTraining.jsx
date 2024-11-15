import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddTraining = ({ open, onClose, onAddTraining, customers }) => {
    const [trainingData, setTrainingData] = useState({
        activity: '',
        duration: '',
        date: null,
        customer: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTrainingData({
            ...trainingData,
            [name]: value,
        });
    };

    const handleDateChange = (newDate) => {
        setTrainingData({
            ...trainingData,
            date: newDate,
        });
    };

    const handleSubmit = () => {
        onAddTraining(trainingData);
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Add Training</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Activity"
                        name="activity"
                        value={trainingData.activity}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Duration (minutes)"
                        name="duration"
                        type="number"
                        value={trainingData.duration}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <DatePicker
                        label="Exercise Date"
                        value={trainingData.date}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <TextField
                        select
                        label="Customer"
                        name="customer"
                        value={trainingData.customer}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        {customers.map((customer) => (
                            <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                                {`${customer.firstname} ${customer.lastname}`}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default AddTraining;
