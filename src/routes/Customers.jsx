import React, { useState, useEffect } from 'react';
import { fetchCustomers, addCustomer, editCustomer, deleteCustomer } from '../apiService';
import AddCustomer from '../components/crud-operations/AddCustomer';
import EditCustomer from '../components/crud-operations/EditCustomer';
import DeleteCustomer from '../components/crud-operations/DeleteCustomer';
import { 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    IconButton, 
    TextField, 
    Button, 
    TablePagination 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [filter, setFilter] = useState('');
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const getCustomers = async () => {
            try {
                const data = await fetchCustomers();
                setCustomers(data._embedded?.customers || []);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        getCustomers();
    }, []);


    const handleAddCustomer = async (customerData) => {
        try {
            const newCustomer = await addCustomer(customerData);
            setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const handleEditCustomer = async (customerData) => {
        try {
            const updatedCustomer = await editCustomer(customerData);
            setCustomers((prevCustomers) =>
                prevCustomers.map((cust) => (cust._links.self.href === customerData._links.self.href ? updatedCustomer : cust))
            );
        } catch (error) {
            console.error('Error editing customer:', error);
        }
        setIsEditCustomerOpen(false);
    };

    const handleDeleteCustomer = async () => {
        if (selectedCustomer) {
            try {
                await deleteCustomer(selectedCustomer._links.self.href);
                setCustomers((prevCustomers) => prevCustomers.filter((cust) => cust._links.self.href !== selectedCustomer._links.self.href));
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
        setIsDeleteConfirmOpen(false);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const exportToCSV = () => {
        const headers = ["First Name", "Last Name", "Email", "Phone"];
        const csvData = customers.map(({ firstname, lastname, email, phone }) => [firstname, lastname, email, phone]);

        const csvContent = [
            headers.join(","), 
            ...csvData.map(row => row.map(value => `"${value || ''}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "customers.csv";
        link.click();
    };

    const filteredCustomers = customers.filter((customer) =>
        `${customer.firstname} ${customer.lastname}`.toLowerCase().includes(filter.toLowerCase())
    );

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, ));
        setPage(0);
    };
    const paginatedCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
        <Box>
            <TableContainer component={Paper}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                    <Typography variant="h6">Customers</Typography>
                    <Box sx={{ display: 'flex', gap: 30 }}>
                        <TextField label="Search" variant="standard" value={filter} onChange={handleFilterChange} />
                        <Button variant="outlined" onClick={exportToCSV}>
                            Export to CSV
                        </Button>
                        <IconButton color="primary" onClick={() => setIsAddCustomerOpen(true)}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Actions</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCustomers.map((customer) => (
                            <TableRow key={customer._links?.self?.href}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton color="secondary" onClick={() => { setSelectedCustomer(customer); setIsDeleteConfirmOpen(true); }}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => { setSelectedCustomer(customer); setIsEditCustomerOpen(true); }}>
                                            <EditIcon />
                                        </IconButton>
                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            onClick={() => { setIsAddCustomerOpen(true); }}
                                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            ADD CUSTOMER
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{customer.firstname}</TableCell>
                                <TableCell>{customer.lastname}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredCustomers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            
            <AddCustomer open={isAddCustomerOpen} onClose={() => setIsAddCustomerOpen(false)} onAddCustomer={handleAddCustomer} />
            <EditCustomer open={isEditCustomerOpen} onClose={() => setIsEditCustomerOpen(false)} onEditCustomer={handleEditCustomer} customer={selectedCustomer} />
            <DeleteCustomer open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleDeleteCustomer} message="Are you sure you want to delete this customer?" />
        </Box>
    );
};

export default Customers;
