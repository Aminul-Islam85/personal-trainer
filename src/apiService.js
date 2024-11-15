const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';
const CUSTOMERS_URL = `${BASE_URL}/customers`;
const TRAININGS_URL = `${BASE_URL}/trainings`;

export const fetchCustomers = async () => {
    try {
        const response = await fetch(CUSTOMERS_URL);
        if (!response.ok) throw new Error('Error fetching customers');
        return await response.json();
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

export const addCustomer = async (customerData) => {
    try {
        const response = await fetch(CUSTOMERS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData),
        });
        if (!response.ok) throw new Error('Error adding customer');
        return await response.json();
    } catch (error) {
        console.error('Error adding customer:', error);
        throw error;
    }
};

export const editCustomer = async (customerData) => {
    try {
        const response = await fetch(customerData._links.self.href, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData),
        });
        if (!response.ok) throw new Error('Error editing customer');
        return await response.json();
    } catch (error) {
        console.error('Error editing customer:', error);
        throw error;
    }
};

export const deleteCustomer = async (customerUrl) => {
    try {
        const response = await fetch(customerUrl, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error deleting customer');
        return true;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
};

export const fetchTrainings = async () => {
    try {
        const response = await fetch(TRAININGS_URL);
        if (!response.ok) throw new Error('Error fetching trainings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching trainings:', error);
        throw error;
    }
};

export const addTraining = async (trainingData) => {
    try {
        const response = await fetch(TRAININGS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainingData),
        });
        if (!response.ok) throw new Error('Error adding training');
        return await response.json();
    } catch (error) {
        console.error('Error adding training:', error);
        throw error;
    }
};

export const deleteTraining = async (trainingUrl) => {
    try {
        const response = await fetch(trainingUrl, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error deleting training');
        return true;
    } catch (error) {
        console.error('Error deleting training:', error);
        throw error;
    }
};
