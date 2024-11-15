import React, { useState } from 'react';
import { Dialog, TextField, Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AddCustomer = ({ open, onClose, onAddCustomer }) => {
    const [customerData, setCustomerData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData({
            ...customerData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        onAddCustomer(customerData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogContent>
                <TextField
                    label="First Name"
                    name="firstname"
                    value={customerData.firstname}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    name="lastname"
                    value={customerData.lastname}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={customerData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={customerData.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCustomer;
