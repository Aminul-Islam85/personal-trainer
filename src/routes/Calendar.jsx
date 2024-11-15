import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Box, Typography } from '@mui/material';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchTrainings } from '../apiService';

const localizer = momentLocalizer(moment);

const CustomCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getTrainings = async () => {
            try {
                const data = await fetchTrainings();
                const eventsData = await Promise.all(
                    data._embedded?.trainings.map(async (training) => {
                        let customerName = 'Unknown Customer';

                        
                        if (training._links?.customer?.href) {
                            try {
                                const customerResponse = await fetch(training._links.customer.href);
                                const customerData = await customerResponse.json();
                                customerName = `${customerData.firstname} ${customerData.lastname}`;
                            } catch (error) {
                                console.error('Error fetching customer data:', error);
                            }
                        }

                        return {
                            title: `${moment(training.date).format('h:mm A')} - ${moment(training.date).add(training.duration, 'minutes').format('h:mm A')} ${training.activity} / ${customerName}`,
                            start: new Date(training.date),
                            end: new Date(new Date(training.date).getTime() + training.duration * 60000), 
                            allDay: false,
                        };
                    })
                );
                setEvents(eventsData || []);
            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };
        getTrainings();
    }, []);

    return (
        <Box sx={{ padding: '16px' }}>
            <Typography variant="h4" sx={{ marginBottom: '16px' }}>Training Calendar</Typography>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                defaultView="month" 
                views={['month', 'week', 'day', 'agenda']}
            />
        </Box>
    );
};

export default CustomCalendar;
