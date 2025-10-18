import { useState } from 'react';
import { Link } from 'react-router';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Card,
  Typography,
  Grid,
  MenuItem,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Flight, CheckCircle, Dashboard as DashboardIcon } from '@mui/icons-material';

function TravelRequestForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    type: 'flight',
    destination: '',
    date: '',
    budget: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.clientName ||
      !formData.email ||
      !formData.destination ||
      !formData.date ||
      !formData.budget
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSnackbar({
        open: true,
        message: 'Travel request submitted successfully!',
        severity: 'success',
      });

      setSubmitted(true);
      setFormData({
        clientName: '',
        email: '',
        type: 'flight',
        destination: '',
        date: '',
        budget: '',
      });

      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error submitting request. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Button
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <Flight sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Travel Request
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<DashboardIcon />}
            sx={{ textTransform: 'none', fontSize: '16px' }}
          >
            Admin Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        {!submitted ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'white',
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              Request Your Travel
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
              Fill out the form below to submit your travel request. Our team will review and get back to you soon.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Personal Information */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#667eea' }}>
                  Personal Information
                </Typography>

                <TextField
                  fullWidth
                  label="Full Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  size="small"
                />
              </Box>

              {/* Travel Details */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#667eea' }}>
                  Travel Details
                </Typography>

                <TextField
                  id="travel-type"
                  select
                  fullWidth
                  label="Travel Type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="flight">Flight</MenuItem>
                  <MenuItem value="hotel">Hotel</MenuItem>
                  <MenuItem value="car">Car Rental</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label="Destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Where are you traveling to?"
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Travel Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Budget ($)"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  inputProps={{ step: '0.01', min: '0' }}
                  size="small"
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '16px',
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </Box>
          </Paper>
        ) : (
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <CheckCircle sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              Request Submitted Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your travel request has been received. We'll review it and send you an update to {formData.email}.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  clientName: '',
                  email: '',
                  type: 'flight',
                  destination: '',
                  date: '',
                  budget: '',
                });
              }}
            >
              Submit Another Request
            </Button>
          </Card>
        )}

        {/* Info Cards */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#667eea' }}>
                Fast Processing
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your request will be reviewed within 24 hours
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#667eea' }}>
                Email Confirmation
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You'll receive updates on your request via email
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TravelRequestForm;