const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//Sample room data
const rooms = [
    {
        "id": 1,
        "roomName": "Conference Room A",
        "seatsAvailable": 20,
        "amenities": ["Projector", "Whiteboard", "WiFi"],
        "pricePerHour": 50
    },
    {
        "id": 2,
        "roomName": "Conference Room B",
        "seatsAvailable": 15,
        "amenities": ["Projector", "Whiteboard"],
        "pricePerHour": 40
    },
    {
        "id": 3,
        "roomName": "Meeting Room 1",
        "seatsAvailable": 10,
        "amenities": ["TV", "Whiteboard"],
        "pricePerHour": 30
    },
    {
        "id": 4,
        "roomName": "Meeting Room 2",
        "seatsAvailable": 8,
        "amenities": ["Projector", "WiFi"],
        "pricePerHour": 25
    },
    {
        "id": 5,
        "roomName": "Training Room",
        "seatsAvailable": 30,
        "amenities": ["Projector", "Whiteboard", "Audio System"],
        "pricePerHour": 60
    }
];

// Sample booking data
let bookings = [
    {
        id: 1,
        customerName: "John Doe",
        date: "2024-04-15",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        roomId: 1,
        roomName: "Conference Room A",
        bookedStatus: true
    },
    {
        id: 2,
        customerName: "Alice Smith",
        date: "2024-04-16",
        startTime: "02:00 PM",
        endTime: "04:00 PM",
        roomId: 2,
        roomName: "Conference Room B",
        bookedStatus: true
    },
    {
        id: 3,
        customerName: "Bob Johnson",
        date: "2024-04-17",
        startTime: "09:00 AM",
        endTime: "11:00 AM",
        roomId: 3,
        roomName: "Meeting Room 1",
        bookedStatus: true
    },
    {
        id: 4,
        customerName: "Emma Brown",
        date: "2024-04-18",
        startTime: "01:00 PM",
        endTime: "03:00 PM",
        roomId: 4,
        roomName: "Meeting Room 2",
        bookedStatus: true
    },
    {
        id: 5,
        customerName: "James Wilson",
        date: "2024-04-19",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        roomId: 5,
        roomName: "Training Room",
        bookedStatus: true
    }
];

// Route to create a room
app.post('/rooms', (req, res) => {
    const { roomName, seatsAvailable, amenities, pricePerHour } = req.body;
    const room = {
        id: rooms.length + 1,
        roomName,
        seatsAvailable,
        amenities,
        pricePerHour
    };
    rooms.push(room);
    res.json(room);
});

// Route to book a room
app.post('/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const room = rooms.find(room => room.id === roomId);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    const booking = {
        id: bookings.length + 1,
        customerName,
        date,
        startTime,
        endTime,
        roomId,
        roomName: room.roomName,
        bookedStatus: true
    };
    bookings.push(booking);
    res.json(booking);
});

// Route to list all rooms with booked data
app.get('/rooms/bookings', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const bookingsForRoom = bookings.filter(booking => booking.roomId === room.id);
        const uniqueBookingsForRoom = [...new Set(bookingsForRoom.map(booking => JSON.stringify(booking)))].map(strBooking => JSON.parse(strBooking)); // Remove duplicate entries

        return {
            roomName: room.roomName,
            bookedData: uniqueBookingsForRoom.map(booking => ({
                customerName: booking.customerName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime
            }))
        };
    });

    // Remove rooms without bookings
    const cleanedRooms = roomsWithBookings.filter(room => room.bookedData.length > 0);

    res.json(cleanedRooms);
});




// Route to list all customers with booked data
app.get('/customers/bookings', (req, res) => {
    const customersWithBookings = bookings.map(booking => ({
        customerName: booking.customerName,
        roomName: booking.roomName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime
    }));
    res.json(customersWithBookings);
});

// Route to list how many times a customer has booked the room
app.get('/customers/:customerName/bookings', (req, res) => {
    const { customerName } = req.params;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    res.json(customerBookings);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
