import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import {
  AppBar, Toolbar, Typography, Container, Grid, Paper, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Box, Badge, Snackbar, Alert, Tabs, Tab,
  CircularProgress, Tooltip
} from '@mui/material';
import {
  Notifications, CheckCircle, Cancel, Pending, Person, Flight,
  Hotel, DirectionsCar, TrendingUp, AccessTime, Email, Refresh, Add
} from '@mui/icons-material';
import { fetchRequests, updateRequestStatus } from '../redux/requestsSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { items: requests = [], loading } = useSelector((state) => state.requests || { items: [], loading: false });
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(fetchRequests(filterStatus));
  }, [dispatch, filterStatus]);

  // Statistics
  const stats = {
    total: requests.length || 0,
    pending: requests.filter(r => r?.status === 'pending').length || 0,
    approved: requests.filter(r => r?.status === 'approved').length || 0,
    rejected: requests.filter(r => r?.status === 'rejected').length || 0,
    avgResponseTime: '4.5 hours'
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await dispatch(updateRequestStatus({ 
        id: requestId, 
        status: newStatus,
        notes 
      })).unwrap();

      const request = requests.find(r => r._id === requestId);
      
      if (request) {
        const notification = {
          id: Date.now(),
          message: `Email sent to ${request.clientName}: Request ${newStatus}`,
          time: new Date().toLocaleTimeString()
        };
        
        setNotifications(prev => [notification, ...prev].slice(0, 10));
      }

      setSnackbar({
        open: true,
        message: `Request ${newStatus} and email notification sent!`,
        severity: 'success'
      });

      setOpenDialog(false);
      setNotes('');
    } catch (error) {
      console.error('Error updating request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update request',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flight': return <Flight />;
      case 'hotel': return <Hotel />;
      case 'car': return <DirectionsCar />;
      default: return <Flight />;
    }
  };

  const handleRefresh = () => {
    dispatch(fetchRequests(filterStatus));
    setSnackbar({
      open: true,
      message: 'Data refreshed!',
      severity: 'info'
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Flight sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Travel Request Admin Dashboard
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/request-form"
            sx={{ textTransform: 'none', fontSize: '16px' }}
          >
            Add New Request
          </Button>
          <Tooltip title="Refresh">
            <IconButton color="inherit" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <IconButton color="inherit">
            <Badge badgeContent={notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography variant="body2" gutterBottom>Total Requests</Typography>
                <Typography variant="h4" fontWeight="bold">{stats.total}</Typography>
                <TrendingUp />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography variant="body2" gutterBottom>Pending</Typography>
                <Typography variant="h4" fontWeight="bold">{stats.pending}</Typography>
                <Pending />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography variant="body2" gutterBottom>Approved</Typography>
                <Typography variant="h4" fontWeight="bold">{stats.approved}</Typography>
                <CheckCircle />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography variant="body2" gutterBottom>Rejected</Typography>
                <Typography variant="h4" fontWeight="bold">{stats.rejected}</Typography>
                <Cancel />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography variant="body2" gutterBottom>Avg Response</Typography>
                <Typography variant="h5" fontWeight="bold">{stats.avgResponseTime}</Typography>
                <AccessTime />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="All Requests" />
            <Tab label={`Notifications (${notifications.length})`} />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <>
            {/* Filter */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                select
                label="Filter by Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ minWidth: 200 }}
                size="small"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
              {loading && <CircularProgress size={24} />}
            </Box>

            {/* Requests Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Client</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Destination</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Budget</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">No requests found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request._id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                        <TableCell>{request._id?.slice(-6) || 'N/A'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person fontSize="small" color="action" />
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {request.clientName || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {request.email || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getTypeIcon(request.type)}
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {request.type || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{request.destination || 'N/A'}</TableCell>
                        <TableCell>
                          {request.date ? new Date(request.date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            ${request.budget || '0'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={request.status || 'pending'} 
                            color={getStatusColor(request.status)}
                            size="small"
                            sx={{ textTransform: 'capitalize', fontWeight: 'medium' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              setSelectedRequest(request);
                              setOpenDialog(true);
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Email color="primary" />
              <Typography variant="h6">Recent Email Notifications</Typography>
            </Box>
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Email sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography color="textSecondary">No notifications yet</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {notifications.map(notif => (
                  <Paper 
                    key={notif.id} 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#f0f7ff',
                      border: '1px solid #d0e7ff',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body2">{notif.message}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notif.time}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        )}
      </Container>

      {/* Review Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setNotes('');
        }} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' }}>
          Review Travel Request
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">Client Name</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedRequest.clientName || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Email</Typography>
                <Typography variant="body1">{selectedRequest.email || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Type</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {selectedRequest.type || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Destination</Typography>
                <Typography variant="body1">{selectedRequest.destination || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Date</Typography>
                <Typography variant="body1">
                  {selectedRequest.date ? new Date(selectedRequest.date).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Budget</Typography>
                <Typography variant="body1" fontWeight="medium">
                  ${selectedRequest.budget || '0'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Current Status</Typography>
                <Chip 
                  label={selectedRequest.status || 'pending'} 
                  color={getStatusColor(selectedRequest.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize', mt: 0.5 }}
                />
              </Box>
              <TextField
                label="Add Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                placeholder="Add any notes for the client..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setNotes('');
            }}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleStatusChange(selectedRequest._id, 'rejected')}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Reject & Notify
          </Button>
          <Button 
            onClick={() => handleStatusChange(selectedRequest._id, 'approved')}
            color="success"
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Approve & Notify
          </Button>
        </DialogActions>
      </Dialog>

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

export default Dashboard;