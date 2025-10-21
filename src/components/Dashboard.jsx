import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import {
  AppBar, Toolbar, Typography, Container, Grid, Paper, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Box, Badge, Snackbar, Alert, Tabs, Tab,
  CircularProgress, Tooltip, Avatar, Divider, Stack, LinearProgress
} from '@mui/material';
import {
  Notifications, CheckCircle, Cancel, Pending, Person, Flight,
  Hotel, DirectionsCar, TrendingUp, AccessTime, Email, Refresh, Add,
  FilterList, Search, MoreVert, Download, CalendarMonth, AttachMoney,
  ShowChart, Public
} from '@mui/icons-material';
import { fetchRequests, updateRequestStatus } from '../redux/requestsSlice';

// Default mock data
const defaultRequests = [
  {
    _id: '67a8b9c1d2e3f4g5h6i7j8k9',
    clientName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    type: 'flight',
    destination: 'Paris, France',
    date: new Date('2025-11-15'),
    budget: 1500,
    status: 'pending',
    priority: 'high',
    requestDate: new Date('2025-10-18')
  },
  {
    _id: '67a8b9c1d2e3f4g5h6i7j8k8',
    clientName: 'Michael Chen',
    email: 'michael.chen@email.com',
    type: 'hotel',
    destination: 'Tokyo, Japan',
    date: new Date('2025-12-01'),
    budget: 2200,
    status: 'approved',
    priority: 'medium',
    requestDate: new Date('2025-10-15')
  },
  {
    _id: '67a8b9c1d2e3f4g5h6i7j8k7',
    clientName: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    type: 'car',
    destination: 'Los Angeles, CA',
    date: new Date('2025-10-28'),
    budget: 450,
    status: 'pending',
    priority: 'low',
    requestDate: new Date('2025-10-19')
  },
  {
    _id: '67a8b9c1d2e3f4g5h6i7j8k6',
    clientName: 'James Wilson',
    email: 'james.wilson@email.com',
    type: 'flight',
    destination: 'London, UK',
    date: new Date('2025-11-20'),
    budget: 1800,
    status: 'approved',
    priority: 'high',
    requestDate: new Date('2025-10-14')
  },
  {
    _id: '67a8b9c1d2e3f4g5h6i7j8k5',
    clientName: 'Amanda Thompson',
    email: 'amanda.t@email.com',
    type: 'hotel',
    destination: 'Dubai, UAE',
    date: new Date('2025-12-15'),
    budget: 3000,
    status: 'rejected',
    priority: 'medium',
    requestDate: new Date('2025-10-16')
  },
  {
    _id: '67a8b9c1d2e3f4g5h6i7j8k4',
    clientName: 'David Martinez',
    email: 'david.martinez@email.com',
    type: 'flight',
    destination: 'Sydney, Australia',
    date: new Date('2025-11-08'),
    budget: 2500,
    status: 'pending',
    priority: 'high',
    requestDate: new Date('2025-10-17')
  },
  {
    _id: '67a8b9c1d2e3f4g5h6i7j8k3',
    clientName: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    type: 'car',
    destination: 'Miami, FL',
    date: new Date('2025-10-25'),
    budget: 380,
    status: 'approved',
    priority: 'low',
    requestDate: new Date('2025-10-13')
  }
];

const defaultNotifications = [
  {
    id: 1,
    message: 'Email sent to Michael Chen: Request approved',
    time: '10:30 AM',
    type: 'success'
  },
  {
    id: 2,
    message: 'Email sent to James Wilson: Request approved',
    time: '09:45 AM',
    type: 'success'
  },
  {
    id: 3,
    message: 'Email sent to Amanda Thompson: Request rejected',
    time: '09:15 AM',
    type: 'error'
  },
  {
    id: 4,
    message: 'Email sent to Lisa Anderson: Request approved',
    time: 'Yesterday 4:20 PM',
    type: 'success'
  }
];

function Dashboard() {
  const dispatch = useDispatch();
  const { items: requests = [], loading } = useSelector((state) => state.requests || { items: [], loading: false });
  
  const displayRequests = requests.length > 0 ? requests : defaultRequests;
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(fetchRequests(filterStatus));
  }, []);

  // Enhanced Statistics
  const stats = {
    total: displayRequests.length || 0,
    pending: displayRequests.filter(r => r?.status === 'pending').length || 0,
    approved: displayRequests.filter(r => r?.status === 'approved').length || 0,
    rejected: displayRequests.filter(r => r?.status === 'rejected').length || 0,
    avgResponseTime: '4.5 hours',
    totalBudget: displayRequests.reduce((sum, r) => sum + (r?.budget || 0), 0),
    approvalRate: Math.round((displayRequests.filter(r => r?.status === 'approved').length / displayRequests.length) * 100) || 0
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await dispatch(updateRequestStatus({ 
        id: requestId, 
        status: newStatus,
        notes 
      })).unwrap();

      const request = displayRequests.find(r => r._id === requestId);
      
      if (request) {
        const notification = {
          id: Date.now(),
          message: `Email sent to ${request.clientName}: Request ${newStatus}`,
          time: new Date().toLocaleTimeString(),
          type: newStatus === 'approved' ? 'success' : 'error'
        };
        
        setNotifications(prev => [notification, ...prev].slice(0, 10));
      }

      setSnackbar({
        open: true,
        message: `Request ${newStatus} successfully! Email notification sent to client.`,
        severity: 'success'
      });

      setOpenDialog(false);
      setNotes('');
    } catch (error) {
      console.error('Error updating request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update request. Please try again.',
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#388e3c';
      default: return '#757575';
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

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const handleRefresh = () => {
    dispatch(fetchRequests(filterStatus));
    setSnackbar({
      open: true,
      message: 'Dashboard data refreshed successfully!',
      severity: 'info'
    });
  };

  const handleExportData = () => {
    try {
      // Prepare data for export
      const exportData = filteredRequests.map(request => ({
        'Request ID': request._id?.slice(-8) || 'N/A',
        'Client Name': request.clientName || '',
        'Email': request.email || '',
        'Type': request.type || '',
        'Destination': request.destination || '',
        'Travel Date': request.date ? new Date(request.date).toLocaleDateString() : '',
        'Budget': `${request.budget || 0}`,
        'Priority': request.priority || 'medium',
        'Status': request.status || 'pending',
        'Request Date': request.requestDate ? new Date(request.requestDate).toLocaleDateString() : ''
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in values
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `travel-requests-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbar({
        open: true,
        message: `Successfully exported ${exportData.length} requests to CSV!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Export error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to export data. Please try again.',
        severity: 'error'
      });
    }
  };

  const filteredRequests = displayRequests.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = !searchQuery || 
      r.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Modern Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box sx={{ 
              bgcolor: 'rgba(255,255,255,0.15)', 
              p: 1, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <Flight sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                Travel Request Dashboard
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Manage and track all travel requests
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              component={Link}
              to="/request-form"
              startIcon={<Add />}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              New Request
            </Button>
            
            <Tooltip title="Export Data">
              <IconButton 
                onClick={handleExportData}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <Download />
              </IconButton>
            </Tooltip>

            <Tooltip title="Refresh Dashboard">
              <IconButton 
                onClick={handleRefresh}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton 
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Enhanced Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                      Total Requests
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      +12% from last month
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    p: 1.5, 
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <TrendingUp sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
              </CardContent>
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: 'rgba(255,255,255,0.3)' 
              }}>
                <Box sx={{ height: '100%', width: '75%', bgcolor: 'white' }} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(240, 147, 251, 0.4)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                      Pending Review
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Requires attention
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    p: 1.5, 
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Pending sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
              </CardContent>
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: 'rgba(255,255,255,0.3)' 
              }}>
                <Box sx={{ height: '100%', width: `${(stats.pending/stats.total)*100}%`, bgcolor: 'white' }} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(79, 172, 254, 0.4)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                      Approved
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {stats.approved}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {stats.approvalRate}% approval rate
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    p: 1.5, 
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <CheckCircle sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
              </CardContent>
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: 'rgba(255,255,255,0.3)' 
              }}>
                <Box sx={{ height: '100%', width: `${stats.approvalRate}%`, bgcolor: 'white' }} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(250, 112, 154, 0.4)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                      Total Budget
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      ${(stats.totalBudget/1000).toFixed(1)}K
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Across all requests
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    p: 1.5, 
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <AttachMoney sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
              </CardContent>
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: 'rgba(255,255,255,0.3)' 
              }}>
                <Box sx={{ height: '100%', width: '65%', bgcolor: 'white' }} />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Stats Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: '#eff6ff', p: 1.5, borderRadius: 2 }}>
                  <AccessTime sx={{ color: '#3b82f6', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Avg Response Time
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {stats.avgResponseTime}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: '#f0fdf4', p: 1.5, borderRadius: 2 }}>
                  <ShowChart sx={{ color: '#22c55e', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Approval Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#22c55e' }}>
                    {stats.approvalRate}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: '#fef3c7', p: 1.5, borderRadius: 2 }}>
                  <Cancel sx={{ color: '#f59e0b', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Rejected Requests
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#f59e0b' }}>
                    {stats.rejected}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Modern Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            sx={{
              bgcolor: '#fafbfc',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '15px',
                minHeight: 64
              }
            }}
          >
            <Tab 
              icon={<FilterList sx={{ mr: 1 }} />} 
              iconPosition="start"
              label="All Requests" 
            />
            <Tab 
              icon={<Email sx={{ mr: 1 }} />}
              iconPosition="start"
              label={`Notifications (${notifications.length})`} 
            />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <>
            {/* Advanced Filter Bar */}
            <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by client, email, or destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Status Filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Chip 
                      label={`${filteredRequests.length} Results`} 
                      color="primary" 
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    {loading && <CircularProgress size={24} />}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Modern Requests Table */}
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b', py: 2 }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Destination</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Travel Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Budget</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <Search sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No requests found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your search or filter criteria
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow 
                        key={request._id} 
                        hover 
                        sx={{ 
                          '&:hover': { bgcolor: '#f8fafc' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: '#3b82f6', 
                                width: 40, 
                                height: 40,
                                fontWeight: 600,
                                fontSize: '14px'
                              }}
                            >
                              {getInitials(request.clientName)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600} color="text.primary">
                                {request.clientName || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {request.email || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getTypeIcon(request.type)}
                            label={request.type || 'N/A'}
                            size="small"
                            sx={{ 
                              textTransform: 'capitalize',
                              fontWeight: 600,
                              bgcolor: '#f1f5f9',
                              border: '1px solid #e2e8f0'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Public sx={{ fontSize: 18, color: '#64748b' }} />
                            <Typography variant="body2" fontWeight={500}>
                              {request.destination || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarMonth sx={{ fontSize: 18, color: '#64748b' }} />
                            <Typography variant="body2">
                              {request.date ? new Date(request.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              }) : 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color="primary">
                            ${request.budget?.toLocaleString() || '0'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: getPriorityColor(request.priority),
                              display: 'inline-block',
                              mr: 1
                            }} 
                          />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              textTransform: 'capitalize',
                              fontWeight: 600,
                              color: getPriorityColor(request.priority)
                            }}
                          >
                            {request.priority || 'medium'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={request.status || 'pending'} 
                            color={getStatusColor(request.status)}
                            size="small"
                            sx={{ 
                              textTransform: 'capitalize', 
                              fontWeight: 700,
                              borderRadius: 2
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              setSelectedRequest(request);
                              setOpenDialog(true);
                            }}
                            sx={{ 
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: 2,
                              px: 2.5,
                              boxShadow: 'none',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                              }
                            }}
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
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ bgcolor: '#eff6ff', p: 1.5, borderRadius: 2 }}>
                <Email sx={{ color: '#3b82f6', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Recent Email Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track all email communications with clients
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Email sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No notifications yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email notifications will appear here when you approve or reject requests
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {notifications.map((notif, index) => (
                  <Paper 
                    key={notif.id} 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      bgcolor: notif.type === 'success' ? '#f0fdf4' : '#fef2f2',
                      border: notif.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: notif.type === 'success' ? '#22c55e' : '#ef4444'
                    }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pl: 1 }}>
                      <Box sx={{ 
                        bgcolor: notif.type === 'success' ? '#dcfce7' : '#fee2e2',
                        p: 1,
                        borderRadius: 1.5,
                        mt: 0.5
                      }}>
                        {notif.type === 'success' ? (
                          <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                        ) : (
                          <Cancel sx={{ color: '#ef4444', fontSize: 20 }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 14 }} />
                          {notif.time}
                        </Typography>
                      </Box>
                      <IconButton size="small" sx={{ mt: -0.5 }}>
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        )}
      </Container>

      {/* Enhanced Review Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setNotes('');
        }} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          } 
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 3,
          borderBottom: '1px solid #e2e8f0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48 }}>
              {selectedRequest && getInitials(selectedRequest.clientName)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Review Travel Request
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedRequest?._id?.slice(-8) || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 3, px: 4 }}>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                    CLIENT INFORMATION
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedRequest.clientName || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email Address</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {selectedRequest.email || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                    TRAVEL DETAILS
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Request Type</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        {getTypeIcon(selectedRequest.type)}
                        <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                          {selectedRequest.type || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Destination</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedRequest.destination || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Travel Date</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary" sx={{ mt: 1 }}>
                    {selectedRequest.date ? new Date(selectedRequest.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Budget Allocation</Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main" sx={{ mt: 1 }}>
                    ${selectedRequest.budget?.toLocaleString() || '0'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Priority Level
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: getPriorityColor(selectedRequest.priority)
                      }} 
                    />
                    <Typography variant="body1" fontWeight={700} sx={{ textTransform: 'capitalize', color: getPriorityColor(selectedRequest.priority) }}>
                      {selectedRequest.priority || 'medium'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Current Status
                  </Typography>
                  <Chip 
                    label={selectedRequest.status || 'pending'} 
                    color={getStatusColor(selectedRequest.status)}
                    sx={{ 
                      textTransform: 'capitalize',
                      fontWeight: 700,
                      mt: 1,
                      height: 32,
                      fontSize: '14px'
                    }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Add Notes for Client (Optional)"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  placeholder="Enter any additional information or instructions for the client..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1.5, borderTop: '1px solid #e2e8f0', bgcolor: '#fafbfc' }}>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setNotes('');
            }}
            variant="outlined"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleStatusChange(selectedRequest._id, 'rejected')}
            variant="contained"
            startIcon={<Cancel />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              bgcolor: '#ef4444',
              '&:hover': {
                bgcolor: '#dc2626',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
              }
            }}
          >
            Reject & Notify
          </Button>
          <Button 
            onClick={() => handleStatusChange(selectedRequest._id, 'approved')}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              bgcolor: '#22c55e',
              '&:hover': {
                bgcolor: '#16a34a',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
              }
            }}
          >
            Approve & Notify
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              fontSize: 24
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;