// app/components/HomeContent.js
import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, IconButton } from '@mui/material';
import { db } from '../../firebase';  // Adjusted import path
import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export default function HomeContent() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!name || isNaN(quantity) || quantity <= 0) {
      alert('Please provide a valid item name and quantity.');
      return;
    }

    const newItem = { name, quantity: parseInt(quantity) };
    try {
      const docRef = await addDoc(collection(db, 'items'), newItem);
      setItems([...items, { id: docRef.id, ...newItem }]);
      setName('');
      setQuantity('');
      setOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = async () => {
    if (!name || isNaN(quantity) || quantity <= 0) {
      alert('Please provide a valid item name and quantity.');
      return;
    }

    const updatedItem = { name, quantity: parseInt(quantity) };
    try {
      await updateDoc(doc(db, 'items', selectedItem.id), updatedItem);
      setItems(items.map(item => item.id === selectedItem.id ? { ...item, ...updatedItem } : item));
      setName('');
      setQuantity('');
      setEditOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <Box>
      {/* Fixed Header */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          bgcolor: 'background.paper',
          borderBottom: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'auto',
          mb: '80px', // Margin-bottom to ensure space for the button
        }}
      >
        <Typography
          variant="h2"
          align="center"
          gutterBottom
        >
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }} // Margin-bottom to create space between button and items list
        >
          Add Item
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ pt: '180px', pb: 4 }}> {/* Padding top to ensure content starts below the fixed header */}
        <Stack spacing={2} alignItems="center">
          {items.map((item) => (
            <Box
              key={item.id}
              p={3}
              border="1px solid #ddd"
              borderRadius="4px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: '100%', minWidth: '300px', maxWidth: '600px', boxShadow: 2 }}
            >
              <Box>
                <Typography variant="h6">{item.name}</Typography>
                <Typography>Quantity: {item.quantity}</Typography>
              </Box>
              <Box>
                <IconButton color="primary" onClick={() => { setSelectedItem(item); setName(item.name); setQuantity(item.quantity); setEditOpen(true); }}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Modals */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2} align="center">Add New Item</Typography>
          <TextField
            label="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddItem} fullWidth>
            Add Item
          </Button>
        </Box>
      </Modal>
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2} align="center">Edit Item</Typography>
          <TextField
            label="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleEditItem} fullWidth>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
