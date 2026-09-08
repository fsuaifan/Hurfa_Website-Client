import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import '../css/admin.css';

function Admin() {
  const { t, getLocalizedName, getLocalizedCategory } = useLanguage();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('catalog'); // 'catalog' | 'bedrooms' | 'orders' | 'clients'
  const [loading, setLoading] = useState(true);

  // Catalog State (Products)
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem('hurfa_catalog_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Bedrooms State
  const [bedroomRecords, setBedroomRecords] = useState([]);
  const [bedroomSearchQuery, setBedroomSearchQuery] = useState('');
  const [orderSaveToast, setOrderSaveToast] = useState('');
  const [isBedroomModalOpen, setIsBedroomModalOpen] = useState(false);
  const [isSavingBedroom, setIsSavingBedroom] = useState(false);
  const [editingBedroom, setEditingBedroom] = useState({
    id: null,
    name: '',
    desc: '',
    price: '',
    price2: '',
    image: '',
    isVisible: true,
    stockStatus: 'Active',
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('In Production');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Clients State
  const [clients, setClients] = useState([]);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Amman',
    status: 'Prospect',
    totalOrders: 0,
    totalSpent: 'JOD 0',
  });

  // Fetch live records from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.catalog.getAll();
        if (isMounted && Array.isArray(data)) {
          setRecords(data);
        }
      } catch (e) {
        console.warn('Catalog API warning:', e.message);
      }

      try {
        const bedroomsData = await api.bedrooms.getAll({ all: true });
        if (isMounted && Array.isArray(bedroomsData)) {
          setBedroomRecords(bedroomsData);
        }
      } catch (e) {
        console.warn('Bedrooms API warning:', e.message);
      }

      try {
        const ordersData = await api.orders.getAll();
        if (isMounted && Array.isArray(ordersData)) {
          setOrders(ordersData);
        }
      } catch (e) {
        console.warn('Orders API warning:', e.message);
      }

      try {
        const clientsData = await api.clients.getAll();
        if (isMounted && Array.isArray(clientsData)) {
          setClients(clientsData);
        }
      } catch (e) {
        console.warn('Clients API warning:', e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('hurfa_admin_authenticated');
    sessionStorage.removeItem('hurfa_user');
    navigate('/login?redirect=/admin', { replace: true });
  };

  const handleDeleteRecord = async (id, name) => {
    if (window.confirm(`${t('confirmDeleteRecord', 'Are you sure you want to remove')} "${name}" ${t('fromTheCatalog', 'from the catalog?')}`)) {
      try {
        await api.catalog.delete(id);
      } catch (e) {
        console.warn('Delete API fallback:', e.message);
      }
      setRecords((prev) => {
        const updated = prev.filter((r) => r.id !== id);
        try {
          localStorage.setItem('hurfa_catalog_records', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
  };

  const handleDeleteOrder = async (orderId, clientName) => {
    const confirmMsg = `${t('confirmDeleteOrder', 'Are you sure you want to delete order')} ${orderId}${clientName ? ` (${clientName})` : ''}?`;
    if (window.confirm(confirmMsg)) {
      try {
        await api.orders.delete(orderId);
      } catch (e) {
        console.warn('Delete order API fallback:', e.message);
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId && o.orderId !== orderId));
    }
  };

  const handleDeleteClient = async (clientId, clientName) => {
    const confirmMsg = `${t('confirmDeleteClient', 'Are you sure you want to delete client')} "${clientName}" ${t('fromClientDirectory', 'from the client directory?')}`;
    if (window.confirm(confirmMsg)) {
      try {
        await api.clients.delete(clientId);
      } catch (e) {
        console.warn('Delete client API fallback:', e.message);
      }
      setClients((prev) => prev.filter((c) => c.id !== clientId));
    }
  };

  const openUpdateOrderModal = (order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.status || 'In Production');
    setIsOrderModalOpen(true);
  };

  const handleSaveOrderStatus = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedOrder || !newOrderStatus) return;

    setIsSavingOrder(true);
    try {
      await api.orders.updateStatus(selectedOrder.id, newOrderStatus);
    } catch (e) {
      console.warn('Order status API fallback:', e.message);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newOrderStatus } : o))
    );
    setIsSavingOrder(false);
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const openRegisterClientModal = () => {
    setClientForm({
      name: '',
      email: '',
      phone: '',
      city: 'Amman',
      status: 'Prospect',
      totalOrders: 0,
      totalSpent: 'JOD 0',
    });
    setIsClientModalOpen(true);
  };

  const handleSaveClient = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!clientForm.name || !clientForm.name.trim()) return;

    setIsSavingClient(true);
    const spentVal = clientForm.totalSpent.trim() || '0';
    const formattedSpent = spentVal.startsWith('JOD') ? spentVal : `JOD ${spentVal}`;
    const ordersCount = Number(clientForm.totalOrders) || 0;

    const newClient = {
      id: Date.now(),
      name: clientForm.name.trim(),
      email: clientForm.email.trim() || 'client@hurfa.com',
      phone: clientForm.phone.trim() || '+962 7 9000 0000',
      city: clientForm.city.trim() || 'Amman',
      totalOrders: ordersCount,
      orders: ordersCount,
      totalSpent: formattedSpent,
      spent: formattedSpent,
      status: clientForm.status || 'Prospect',
      lastActive: 'Just now',
    };

    try {
      await api.clients.create({
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        city: newClient.city,
        status: newClient.status,
        totalOrders: newClient.totalOrders,
        totalSpent: newClient.totalSpent,
      });
    } catch (e) {
      console.warn('Client create API fallback:', e.message);
    }

    setClients((prev) => [newClient, ...prev]);
    setIsSavingClient(false);
    setIsClientModalOpen(false);
  };

  // Reorder Products
  const handleMoveProductUp = async (itemId) => {
    const idx = records.findIndex((r) => r.id === itemId);
    if (idx <= 0) return;
    const next = [...records];
    const temp = next[idx];
    next[idx] = next[idx - 1];
    next[idx - 1] = temp;
    setRecords(next);

    try {
      localStorage.setItem('hurfa_catalog_records', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }

    const sortPayload = next.map((item, i) => ({
      id: item.id,
      sortOrder: i + 1,
    }));
    try {
      await api.catalog.updateSort(sortPayload);
      setOrderSaveToast(t('orderSaved', '✓ Display order updated'));
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Sort update warning:', err.message);
    }
  };

  const handleMoveProductDown = async (itemId) => {
    const idx = records.findIndex((r) => r.id === itemId);
    if (idx < 0 || idx >= records.length - 1) return;
    const next = [...records];
    const temp = next[idx];
    next[idx] = next[idx + 1];
    next[idx + 1] = temp;
    setRecords(next);

    try {
      localStorage.setItem('hurfa_catalog_records', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }

    const sortPayload = next.map((item, i) => ({
      id: item.id,
      sortOrder: i + 1,
    }));
    try {
      await api.catalog.updateSort(sortPayload);
      setOrderSaveToast(t('orderSaved', '✓ Display order updated'));
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Sort update warning:', err.message);
    }
  };

  // Reorder Bedrooms
  const handleMoveBedroomUp = async (bedroomId) => {
    const idx = bedroomRecords.findIndex((b) => b.id === bedroomId);
    if (idx <= 0) return;
    const next = [...bedroomRecords];
    const temp = next[idx];
    next[idx] = next[idx - 1];
    next[idx - 1] = temp;
    setBedroomRecords(next);

    const sortPayload = next.map((item, i) => ({
      id: item.id,
      sortOrder: i + 1,
    }));
    try {
      await api.bedrooms.updateSort(sortPayload);
      setOrderSaveToast(t('orderSaved', '✓ Display order updated'));
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Bedroom sort update warning:', err.message);
    }
  };

  const handleMoveBedroomDown = async (bedroomId) => {
    const idx = bedroomRecords.findIndex((b) => b.id === bedroomId);
    if (idx < 0 || idx >= bedroomRecords.length - 1) return;
    const next = [...bedroomRecords];
    const temp = next[idx];
    next[idx] = next[idx + 1];
    next[idx + 1] = temp;
    setBedroomRecords(next);

    const sortPayload = next.map((item, i) => ({
      id: item.id,
      sortOrder: i + 1,
    }));
    try {
      await api.bedrooms.updateSort(sortPayload);
      setOrderSaveToast(t('orderSaved', '✓ Display order updated'));
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Bedroom sort update warning:', err.message);
    }
  };

  const handleDeleteBedroom = async (id, name) => {
    const confirmMsg = `${t('confirmDeleteBedroom', 'Are you sure you want to remove bedroom piece')} "${name}"?`;
    if (window.confirm(confirmMsg)) {
      try {
        await api.bedrooms.delete(id);
      } catch (e) {
        console.warn('Bedroom delete fallback:', e.message);
      }
      setBedroomRecords((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const openEditBedroomModal = (bedroom) => {
    setEditingBedroom({
      id: bedroom.id,
      name: bedroom.name || '',
      desc: bedroom.desc || '',
      price: bedroom.price || '',
      price2: bedroom.price2 || bedroom.price2Formatted || '',
      image: bedroom.image || bedroom.images?.[0] || '',
      isVisible: bedroom.isVisible !== false,
      stockStatus: bedroom.stockStatus || 'In Stock',
    });
    setIsBedroomModalOpen(true);
  };

  const handleSaveBedroom = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingBedroom.id || !editingBedroom.name.trim()) return;

    setIsSavingBedroom(true);
    const cleanPrice = String(editingBedroom.price).replace(/[^0-9.]/g, '');
    const cleanPrice2 = String(editingBedroom.price2).replace(/[^0-9.]/g, '');
    const finalIsVisible = editingBedroom.isVisible !== false;
    const finalStockStatus = editingBedroom.stockStatus || 'In Stock';

    const payload = {
      name: editingBedroom.name.trim(),
      desc: editingBedroom.desc.trim(),
      img: editingBedroom.image.trim(),
      price: cleanPrice ? parseFloat(cleanPrice) : null,
      price2: cleanPrice2 ? parseFloat(cleanPrice2) : null,
      isvisible: finalIsVisible,
      isVisible: finalIsVisible,
      stock_status: finalStockStatus,
      stockStatus: finalStockStatus,
    };

    try {
      await api.bedrooms.update(editingBedroom.id, payload);
      setOrderSaveToast(t('bedroomUpdatedSuccess', 'Bedroom piece updated successfully!'));
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Bedroom update warning:', err.message);
    }

    setBedroomRecords((prev) =>
      prev.map((b) =>
        b.id === editingBedroom.id
          ? {
              ...b,
              name: payload.name,
              desc: payload.desc,
              image: payload.img,
              images: [payload.img],
              price: cleanPrice ? `JOD ${parseFloat(cleanPrice).toLocaleString()}` : b.price,
              price2: cleanPrice2 ? parseFloat(cleanPrice2) : null,
              price2Formatted: cleanPrice2 ? `JOD ${parseFloat(cleanPrice2).toLocaleString()}` : null,
              isVisible: finalIsVisible,
              stockStatus: finalStockStatus,
            }
          : b
      )
    );

    setIsSavingBedroom(false);
    setIsBedroomModalOpen(false);
  };

  const cycleStockStatus = (current) => {
    const s = (current || '').toLowerCase().replace(/[-_]/g, ' ').trim();
    if (s === 'in stock' || s === 'active' || s === 'in-stock') return 'Low Stock';
    if (s === 'low stock' || s === 'low' || s === 'low-stock') return 'Out of Stock';
    return 'In Stock';
  };

  const getStockBadgeClass = (status) => {
    const s = (status || '').toLowerCase().replace(/[-_]/g, ' ').trim();
    if (s === 'low stock' || s === 'low' || s === 'low-stock') return 'low-stock low';
    if (s === 'out of stock' || s === 'out' || s === 'out-of-stock') return 'out-of-stock out';
    return 'in-stock active';
  };

  const getStockStatusLabel = (status) => {
    const s = (status || '').toLowerCase().replace(/[-_]/g, ' ').trim();
    if (s === 'low stock' || s === 'low' || s === 'low-stock') return t('lowStock', 'Low-stock');
    if (s === 'out of stock' || s === 'out' || s === 'out-of-stock') return t('outOfStock', 'Out-of-stock');
    return t('inStock', 'In-stock');
  };

  const handleCycleProductStock = async (item) => {
    const nextStatus = cycleStockStatus(item.stockStatus);

    // Optimistic update - stock status changes do NOT affect isVisible
    setRecords((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, stockStatus: nextStatus } : r))
    );

    try {
      await api.catalog.update(item.id, {
        stockStatus: nextStatus,
        stock_status: nextStatus,
      });
      const toastMsg =
        nextStatus === 'Low Stock'
          ? t('statusLowStockSuccess', 'Status updated to Low-stock.')
          : nextStatus === 'Out of Stock'
          ? t('statusOutOfStockSuccess', 'Status updated to Out-of-stock.')
          : t('statusInStockSuccess', 'Status updated to In-stock.');
      setOrderSaveToast(toastMsg);
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Cycle product stock warning:', err.message);
    }
  };

  const handleCycleBedroomStock = async (bedroom) => {
    const nextStatus = cycleStockStatus(bedroom.stockStatus);

    // Optimistic update - stock status changes do NOT affect isVisible
    setBedroomRecords((prev) =>
      prev.map((b) => (b.id === bedroom.id ? { ...b, stockStatus: nextStatus } : b))
    );

    try {
      await api.bedrooms.update(bedroom.id, {
        stock_status: nextStatus,
        stockStatus: nextStatus,
      });
      const toastMsg =
        nextStatus === 'Low Stock'
          ? t('statusLowStockSuccess', 'Status updated to Low-stock.')
          : nextStatus === 'Out of Stock'
          ? t('statusOutOfStockSuccess', 'Status updated to Out-of-stock.')
          : t('statusInStockSuccess', 'Status updated to In-stock.');
      setOrderSaveToast(toastMsg);
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Cycle bedroom stock warning:', err.message);
    }
  };

  const handleToggleProductVisibility = async (item) => {
    const isCurrentlyHidden = item.isVisible === false;
    const nextIsVisible = isCurrentlyHidden;

    setRecords((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, isVisible: nextIsVisible } : r))
    );

    try {
      await api.catalog.update(item.id, {
        isVisible: nextIsVisible,
        isvisible: nextIsVisible,
      });
      setOrderSaveToast(
        nextIsVisible
          ? t('pieceVisibleSuccess', 'Piece is now visible on the website.')
          : t('pieceHiddenSuccess', 'Piece is now hidden from the website.')
      );
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Toggle product visibility warning:', err.message);
    }
  };

  const handleToggleBedroomVisibility = async (bedroom) => {
    const isCurrentlyHidden = bedroom.isVisible === false;
    const nextIsVisible = isCurrentlyHidden;

    setBedroomRecords((prev) =>
      prev.map((b) => (b.id === bedroom.id ? { ...b, isVisible: nextIsVisible } : b))
    );

    try {
      await api.bedrooms.update(bedroom.id, {
        isvisible: nextIsVisible,
        isVisible: nextIsVisible,
      });
      setOrderSaveToast(
        nextIsVisible
          ? t('pieceVisibleSuccess', 'Piece is now visible on the website.')
          : t('pieceHiddenSuccess', 'Piece is now hidden from the website.')
      );
      setTimeout(() => setOrderSaveToast(''), 2500);
    } catch (err) {
      console.warn('Toggle bedroom visibility warning:', err.message);
    }
  };

  // Filtered Catalog (Products)
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesCategory =
        selectedCategory === 'All' || r.category === selectedCategory || (r.category && r.category.includes(selectedCategory));
      const matchesSearch =
        (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [records, searchQuery, selectedCategory]);

  // Filtered Bedrooms
  const filteredBedrooms = useMemo(() => {
    return bedroomRecords.filter((b) => {
      const query = bedroomSearchQuery.toLowerCase();
      return (
        (b.name || '').toLowerCase().includes(query) ||
        (b.desc || '').toLowerCase().includes(query) ||
        (b.arabicName || '').toLowerCase().includes(query)
      );
    });
  }, [bedroomRecords, bedroomSearchQuery]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === 'All' || o.status === orderStatusFilter;
      const matchesSearch =
        (o.id || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (o.clientName || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (o.items || '').toLowerCase().includes(orderSearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const query = clientSearchQuery.toLowerCase();
      return (
        (c.name || '').toLowerCase().includes(query) ||
        (c.email || '').toLowerCase().includes(query) ||
        (c.city || '').toLowerCase().includes(query) ||
        (c.phone || '').toLowerCase().includes(query)
      );
    });
  }, [clients, clientSearchQuery]);

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header Bar */}
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">{t('studioPortal', 'Studio Portal')}</span>
            <h1>{t('managementConsole', 'Management Console')}</h1>
            <p>{t('hurfaStudioPortalDesc', 'Hurfa Architectural Studio • Catalog, Orders & Client Directory')}</p>
          </div>

          <div className="admin-header-actions">
            <Link to="/editor" className="admin-btn admin-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {t('addNewPiece', 'Add New Piece')}
            </Link>
            <Link to="/products" className="admin-btn admin-btn-outline" target="_blank" rel="noreferrer">
              {t('liveWebsite', 'Live Website ↗')}
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn-logout"
              onClick={handleLogout}
            >
              {t('logOut', 'Log Out')}
            </button>
          </div>
        </header>

        {/* Top-Level Section Switcher Tabs */}
        <div className="admin-nav-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'catalog'}
            className={`admin-nav-tab ${activeSection === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveSection('catalog')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            {t('furnitureProducts', 'Furniture Products')} ({records.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'bedrooms'}
            className={`admin-nav-tab ${activeSection === 'bedrooms' ? 'active' : ''}`}
            onClick={() => setActiveSection('bedrooms')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 4v16" />
              <path d="M2 8h18a2 2 0 0 1 2 2v10" />
              <path d="M2 17h20" />
              <path d="M6 8v9" />
            </svg>
            {t('bedroomsCollection', 'Bedrooms Collection')} ({bedroomRecords.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'orders'}
            className={`admin-nav-tab ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {t('ordersAndRequests', 'Orders & Inquiries')} ({orders.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'clients'}
            className={`admin-nav-tab ${activeSection === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveSection('clients')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {t('clientDirectory', 'Client Directory')} ({clients.length})
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: FURNITURE PRODUCTS */}
        {/* ========================================================================= */}
        {activeSection === 'catalog' && (
          <>
            {/* Sub-nav Pills */}
            <div className="admin-subnav-pills">
              <button
                type="button"
                className="admin-subnav-pill active"
                onClick={() => setActiveSection('catalog')}
              >
                {t('furnitureProducts', 'Furniture Products')}
                <span className="pill-count">{records.length}</span>
              </button>
              <button
                type="button"
                className="admin-subnav-pill"
                onClick={() => setActiveSection('bedrooms')}
              >
                {t('bedroomsCollection', 'Bedrooms Collection')}
                <span className="pill-count">{bedroomRecords.length}</span>
              </button>
            </div>

            {/* Hurfa KPI Overview Cards */}
            <section className="admin-stats-grid" aria-label={t('furnitureCatalog', 'Catalog KPIs')}>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('totalCatalogItems', 'Total Catalog Items')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m7.5 4.27 9 5.15" />
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{records.length}</h2>
                <span className="admin-stat-trend">{t('liveAcrossWeb', 'Live across web & boutique')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('orderRank', 'Display Ordering')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m3 16 4 4 4-4" />
                      <path d="M7 20V4" />
                      <path d="m21 8-4-4-4 4" />
                      <path d="M17 4v16" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{t('activeInStock', 'Active')}</h2>
                <span className="admin-stat-trend">{t('reorderCatalogDesc', 'Reorder sequence on live website')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('kitchenSystems', 'Kitchen Systems')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {records.filter((r) => r.category === 'Kitchens' || (r.category && r.category.includes('Kitchen'))).length}
                </h2>
                <span className="admin-stat-trend">{t('chicOrganicContemporary', 'Chic, Organic & Contemporary')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('signatureCollections', 'Signature Collections')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">2</h2>
                <span className="admin-stat-trend">{t('theOudAndTheWesalSuite', 'The Oud & The Wesal Suite')}</span>
              </div>
            </section>

            {/* Filter and Search Controls */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder={t('searchPieceNameOrCat', 'Search piece name or category...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className="admin-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">{t('allCategories', 'All Categories')}</option>
                <option value="Living Room">{t('Living Room', 'Living Room')}</option>
                <option value="Living Room Tables">{t('Living Room Tables', 'Living Room Tables')}</option>
                <option value="Kitchens">{t('Kitchens', 'Kitchens')}</option>
                <option value="Bedrooms">{t('Bedrooms', 'Bedrooms')}</option>
              </select>

              {orderSaveToast && (
                <div className="admin-toast-banner" role="status">
                  {orderSaveToast}
                </div>
              )}
            </div>

            {/* Records Table Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>{t('catalogRecords', 'Catalog Records')} ({filteredRecords.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '90px' }}>{t('orderRank', 'Order')}</th>
                      <th>{t('productCol', 'Product')}</th>
                      <th>{t('category', 'Category')}</th>
                      <th>{t('price', 'Price')}</th>
                      <th>{t('status', 'Status')}</th>
                      <th>{t('actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                          {t('noMatchingRecordsFound', 'No matching records found.')}
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((item) => {
                        const originalIdx = records.findIndex((r) => r.id === item.id);
                        const isFirst = originalIdx === 0;
                        const isLast = originalIdx === records.length - 1;

                        const isHidden = item.isVisible === false;

                        return (
                          <tr key={item.id} className={isHidden ? 'admin-row-hidden' : ''}>
                            <td>
                              <div className="admin-reorder-cell">
                                <span className="admin-rank-badge">#{originalIdx + 1}</span>
                                <div className="admin-reorder-btn-group">
                                  <button
                                    type="button"
                                    className="admin-reorder-btn"
                                    onClick={() => handleMoveProductUp(item.id)}
                                    disabled={isFirst}
                                    title={t('moveUp', 'Move Up')}
                                    aria-label={t('moveUp', 'Move Up')}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="18 15 12 9 6 15" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-reorder-btn"
                                    onClick={() => handleMoveProductDown(item.id)}
                                    disabled={isLast}
                                    title={t('moveDown', 'Move Down')}
                                    aria-label={t('moveDown', 'Move Down')}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="admin-prod-cell">
                                <img
                                  src={item.image || item.images?.[0]}
                                  alt={getLocalizedName(item)}
                                  className="admin-prod-thumb"
                                  loading="lazy"
                                />
                                <div>
                                  <p className="admin-prod-title">{getLocalizedName(item)}</p>
                                </div>
                              </div>
                            </td>
                            <td>{getLocalizedCategory(item.category || item)}</td>
                            <td>
                              <span className="admin-price">{item.price}</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`admin-badge-stock clickable ${getStockBadgeClass(item.stockStatus)}`}
                                onClick={() => handleCycleProductStock(item)}
                                title={t('clickToCycleStockStatus', 'Click to cycle status: In-stock → Low-stock → Out-of-stock')}
                              >
                                {getStockStatusLabel(item.stockStatus)}
                              </button>
                            </td>
                            <td>
                              <div className="admin-actions-cell">
                                <Link
                                  to={`/editor?id=${item.id}`}
                                  className="admin-action-btn edit"
                                  title={t('editPiece', 'Edit piece specifications')}
                                >
                                  {t('edit', 'Edit')}
                                </Link>
                                <button
                                  type="button"
                                  className={`admin-action-btn visibility ${isHidden ? 'show' : 'hide'}`}
                                  onClick={() => handleToggleProductVisibility(item)}
                                  title={isHidden ? t('showPiece', 'Show piece on website') : t('hidePiece', 'Hide piece from website')}
                                >
                                  {isHidden ? t('show', 'Show') : t('hide', 'Hide')}
                                </button>
                                <button
                                  type="button"
                                  className="admin-action-btn delete"
                                  onClick={() => handleDeleteRecord(item.id, item.name)}
                                  title={t('deletePiece', 'Remove piece from catalog')}
                                >
                                  {t('delete', 'Delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: BEDROOMS COLLECTION */}
        {/* ========================================================================= */}
        {activeSection === 'bedrooms' && (
          <>
            {/* Sub-nav Pills */}
            <div className="admin-subnav-pills">
              <button
                type="button"
                className="admin-subnav-pill"
                onClick={() => setActiveSection('catalog')}
              >
                {t('furnitureProducts', 'Furniture Products')}
                <span className="pill-count">{records.length}</span>
              </button>
              <button
                type="button"
                className="admin-subnav-pill active"
                onClick={() => setActiveSection('bedrooms')}
              >
                {t('bedroomsCollection', 'Bedrooms Collection')}
                <span className="pill-count">{bedroomRecords.length}</span>
              </button>
            </div>

            {/* Bedrooms KPIs */}
            <section className="admin-stats-grid" aria-label={t('bedroomsCollection', 'Bedrooms KPIs')}>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('totalBedroomPieces', 'Total Bedroom Pieces')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 4v16" />
                      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                      <path d="M2 17h20" />
                      <path d="M6 8v9" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{bedroomRecords.length}</h2>
                <span className="admin-stat-trend">{t('liveAcrossWeb', 'Live across web & boutique')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('orderRank', 'Display Ordering')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m3 16 4 4 4-4" />
                      <path d="M7 20V4" />
                      <path d="m21 8-4-4-4 4" />
                      <path d="M17 4v16" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{t('activeInStock', 'Active')}</h2>
                <span className="admin-stat-trend">{t('reorderCatalogDesc', 'Reorder sequence on live website')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('theTayfSuite', 'Featured Bedroom Suite')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">Tayf</h2>
                <span className="admin-stat-trend">{t('chicOrganicContemporary', 'Solid Walnut & Organic Minimalist')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('warranty', 'Structural Warranty')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">5 Yrs</h2>
                <span className="admin-stat-trend">{t('warranty5Year', 'Craftsmanship Warranty')}</span>
              </div>
            </section>

            {/* Filter and Search Controls */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder={t('searchBedroomsPlaceholder', 'Search bedrooms by model or wood type...')}
                value={bedroomSearchQuery}
                onChange={(e) => setBedroomSearchQuery(e.target.value)}
              />

              {orderSaveToast && (
                <div className="admin-toast-banner" role="status">
                  {orderSaveToast}
                </div>
              )}
            </div>

            {/* Bedrooms Table Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>{t('bedroomsCollection', 'Bedrooms Collection')} ({filteredBedrooms.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '90px' }}>{t('orderRank', 'Order')}</th>
                      <th>{t('bedroomPiece', 'Bedroom Piece')}</th>
                      <th>{t('standardPrice', 'Standard Price')}</th>
                      <th>{t('wardrobeOptionPrice', 'With Wardrobe / Option B')}</th>
                      <th>{t('status', 'Status')}</th>
                      <th>{t('actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBedrooms.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                          {t('noMatchingBedroomsFound', 'No matching bedroom pieces found.')}
                        </td>
                      </tr>
                    ) : (
                      filteredBedrooms.map((item) => {
                        const originalIdx = bedroomRecords.findIndex((b) => b.id === item.id);
                        const isFirst = originalIdx === 0;
                        const isLast = originalIdx === bedroomRecords.length - 1;

                        const isHidden = item.isVisible === false;

                        return (
                          <tr key={item.id} className={isHidden ? 'admin-row-hidden' : ''}>
                            <td>
                              <div className="admin-reorder-cell">
                                <span className="admin-rank-badge">#{originalIdx + 1}</span>
                                <div className="admin-reorder-btn-group">
                                  <button
                                    type="button"
                                    className="admin-reorder-btn"
                                    onClick={() => handleMoveBedroomUp(item.id)}
                                    disabled={isFirst}
                                    title={t('moveUp', 'Move Up')}
                                    aria-label={t('moveUp', 'Move Up')}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="18 15 12 9 6 15" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-reorder-btn"
                                    onClick={() => handleMoveBedroomDown(item.id)}
                                    disabled={isLast}
                                    title={t('moveDown', 'Move Down')}
                                    aria-label={t('moveDown', 'Move Down')}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="admin-prod-cell">
                                <img
                                  src={item.image || item.images?.[0]}
                                  alt={getLocalizedName(item)}
                                  className="admin-prod-thumb"
                                  loading="lazy"
                                />
                                <div>
                                  <p className="admin-prod-title">{getLocalizedName(item)}</p>
                                  {item.desc && (
                                    <small style={{ color: '#7d7365' }}>{item.desc.slice(0, 50)}...</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="admin-price">{item.price}</span>
                            </td>
                            <td>
                              <span className="admin-price">{item.price2Formatted || item.price2 || '—'}</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`admin-badge-stock clickable ${getStockBadgeClass(item.stockStatus)}`}
                                onClick={() => handleCycleBedroomStock(item)}
                                title={t('clickToCycleStockStatus', 'Click to cycle status: In-stock → Low-stock → Out-of-stock')}
                              >
                                {getStockStatusLabel(item.stockStatus)}
                              </button>
                            </td>
                            <td>
                              <div className="admin-actions-cell">
                                <Link
                                  to={`/editor?id=${item.id}&type=bedroom`}
                                  className="admin-action-btn edit"
                                  title={t('editPiece', 'Edit piece specifications')}
                                >
                                  {t('edit', 'Edit')}
                                </Link>
                                <button
                                  type="button"
                                  className={`admin-action-btn visibility ${isHidden ? 'show' : 'hide'}`}
                                  onClick={() => handleToggleBedroomVisibility(item)}
                                  title={isHidden ? t('showPiece', 'Show piece on website') : t('hidePiece', 'Hide piece from website')}
                                >
                                  {isHidden ? t('show', 'Show') : t('hide', 'Hide')}
                                </button>
                                <button
                                  type="button"
                                  className="admin-action-btn delete"
                                  onClick={() => handleDeleteBedroom(item.id, item.name)}
                                  title={t('deletePiece', 'Remove bedroom piece')}
                                >
                                  {t('delete', 'Delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: ORDERS & INQUIRIES */}
        {/* ========================================================================= */}
        {activeSection === 'orders' && (
          <>
            {/* Orders KPIs */}
            <section className="admin-stats-grid" aria-label={t('ordersAndRequests', 'Order KPIs')}>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('totalInquiriesOrders', 'Total Inquiries / Orders')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{orders.length}</h2>
                <span className="admin-stat-trend">{t('lifetimeStudioRequests', 'Lifetime Studio Requests')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('inProduction', 'In Production')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {orders.filter((o) => o.status === 'In Production').length}
                </h2>
                <span className="admin-stat-trend">{t('workshopJordanActive', 'Workshop Jordan Active')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('readyForDelivery', 'Ready for Delivery')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {orders.filter((o) => o.status === 'Ready for Delivery').length}
                </h2>
                <span className="admin-stat-trend">{t('qualityInspectedPacked', 'Quality Inspected & Packed')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('consultationsScheduled', 'Consultations Scheduled')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {orders.filter((o) => o.status === 'Consultation Scheduled').length}
                </h2>
                <span className="admin-stat-trend">{t('architecturalOnSiteVisits', 'Architectural On-Site Visits')}</span>
              </div>
            </section>

            {/* Controls */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder={t('searchOrderIdClient', 'Search order ID, client name, or piece...')}
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
              />

              <select
                className="admin-category-filter"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="All">{t('allStatuses', 'All Statuses')}</option>
                <option value="In Production">{t('inProduction', 'In Production')}</option>
                <option value="Ready for Delivery">{t('readyForDelivery', 'Ready for Delivery')}</option>
                <option value="Delivered">{t('delivered', 'Delivered')}</option>
                <option value="Consultation Scheduled">{t('consultationScheduled', 'Consultation Scheduled')}</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>{t('bespokeOrdersInquiries', 'Bespoke Orders & Inquiries')} ({filteredOrders.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t('orderCode', 'Order Code')}</th>
                      <th>{t('clientName', 'Client Name')}</th>
                      <th>{t('itemsAndDetails', 'Items & Details')}</th>
                      <th>{t('totalValue', 'Total Value')}</th>
                      <th>{t('date', 'Date')}</th>
                      <th>{t('status', 'Status')}</th>
                      <th>{t('action', 'Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                          {t('noMatchingOrdersFound', 'No matching orders found.')}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong className="admin-order-id">{order.id}</strong>
                          </td>
                          <td>
                            <strong>{order.clientName}</strong>
                            <br />
                            <small style={{ color: '#6b7280' }}>
                              {order.clientEmail || order.clientPhone}
                            </small>
                          </td>
                          <td>{order.items}</td>
                          <td>
                            <span className="admin-price">{order.total}</span>
                          </td>
                          <td>{order.date || t('recent', 'Recent')}</td>
                          <td>
                            <span
                              className={`admin-status-badge ${order.status
                                .toLowerCase()
                                .replace(/\s+/g, '-')}`}
                            >
                              {t(order.status, order.status)}
                            </span>
                          </td>
                          <td>
                            <div className="admin-actions-cell">
                              <button
                                type="button"
                                className="admin-action-btn edit"
                                onClick={() => openUpdateOrderModal(order)}
                                title={t('updateOrder', 'Update order status')}
                              >
                                {t('update', 'Update')}
                              </button>
                              <button
                                type="button"
                                className="admin-action-btn delete"
                                onClick={() => handleDeleteOrder(order.id, order.clientName)}
                                title={t('deleteOrder', 'Delete order')}
                              >
                                {t('delete', 'Delete')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: CLIENTS & PATRONS */}
        {/* ========================================================================= */}
        {activeSection === 'clients' && (
          <>
            {/* Clients KPIs */}
            <section className="admin-stats-grid" aria-label={t('clientDirectory', 'Client KPIs')}>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('vipStudioPatrons', 'VIP Studio Patrons')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {clients.filter((c) => c.status === 'VIP').length}
                </h2>
                <span className="admin-stat-trend">{t('highValueArchitects', 'High-value residential architects')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('activeClients', 'Active Clients')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {clients.filter((c) => c.status === 'Active').length}
                </h2>
                <span className="admin-stat-trend">{t('recentInquiriesProjects', 'Recent inquiries & projects')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('totalPatrons', 'Total Patrons')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{clients.length}</h2>
                <span className="admin-stat-trend">{t('jordanGccDirectory', 'Jordan & GCC Directory')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('averageProjectValue', 'Average Project Value')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">JOD 2,450</h2>
                <span className="admin-stat-trend">{t('acrossBespokeSuites', 'Across bespoke suites')}</span>
              </div>
            </section>

            {/* Search & Actions Bar */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder={t('searchPatronsPlaceholder', 'Search patrons by name, email, city, or phone...')}
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
              />

              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={openRegisterClientModal}
              >
                {t('registerClient', '+ Register Client')}
              </button>
            </div>

            {/* Clients Table */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>{t('registeredClientsPatrons', 'Registered Clients & Patrons')} ({filteredClients.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t('clientName', 'Client Name')}</th>
                      <th>{t('contactInfo', 'Contact Info')}</th>
                      <th>{t('location', 'Location')}</th>
                      <th>{t('ordersCompleted', 'Orders Completed')}</th>
                      <th>{t('totalValue', 'Total Value')}</th>
                      <th>{t('status', 'Status')}</th>
                      <th>{t('lastActive', 'Last Active')}</th>
                      <th>{t('actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                          {t('noMatchingClientsFound', 'No matching clients found.')}
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td>
                            <strong>{client.name}</strong>
                          </td>
                          <td>
                            <div>{client.email}</div>
                            <small style={{ color: '#6b7280' }}>{client.phone}</small>
                          </td>
                          <td>{client.city}</td>
                          <td>{client.orders || client.totalOrders || 0} {t('projects', 'Projects')}</td>
                          <td>
                            <span className="admin-price">{client.spent || client.totalSpent || 'JOD 0'}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-status-badge ${
                                client.status === 'VIP'
                                  ? 'delivered'
                                  : client.status === 'Active'
                                  ? 'in-production'
                                  : 'ready-for-delivery'
                              }`}
                            >
                              {t(client.status, client.status)}
                            </span>
                          </td>
                          <td>
                            <small style={{ color: '#6b7280' }}>
                              {t(client.lastActive || 'Just now', client.lastActive || 'Just now')}
                            </small>
                          </td>
                          <td>
                            <div className="admin-actions-cell">
                              <button
                                type="button"
                                className="admin-action-btn delete"
                                onClick={() => handleDeleteClient(client.id, client.name)}
                                title={t('deleteClient', 'Delete client from directory')}
                              >
                                {t('delete', 'Delete')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: UPDATE ORDER STATUS */}
        {/* ========================================================================= */}
        {isOrderModalOpen && selectedOrder && (
          <div
            className="admin-modal-overlay"
            onClick={() => setIsOrderModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
          >
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h2 id="order-modal-title">{t('updateOrder', 'Update Order Status')}</h2>
                  <p>{t('updateOrderDesc', 'Modify production and delivery milestones for this bespoke order.')}</p>
                </div>
                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setIsOrderModalOpen(false)}
                  aria-label={t('cancel', 'Close')}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveOrderStatus}>
                <div className="admin-modal-body">
                  <div className="admin-modal-summary">
                    <div className="admin-modal-summary-row">
                      <span className="admin-modal-summary-label">{t('orderCode', 'Order Code')}</span>
                      <span className="admin-modal-summary-val">{selectedOrder.id}</span>
                    </div>
                    <div className="admin-modal-summary-row">
                      <span className="admin-modal-summary-label">{t('clientName', 'Client')}</span>
                      <span className="admin-modal-summary-val">{selectedOrder.clientName}</span>
                    </div>
                    <div className="admin-modal-summary-row">
                      <span className="admin-modal-summary-label">{t('itemsAndDetails', 'Items')}</span>
                      <span className="admin-modal-summary-val">{selectedOrder.items}</span>
                    </div>
                    <div className="admin-modal-summary-row">
                      <span className="admin-modal-summary-label">{t('totalValue', 'Total Value')}</span>
                      <span className="admin-modal-summary-val">{selectedOrder.total}</span>
                    </div>
                    <div className="admin-modal-summary-row">
                      <span className="admin-modal-summary-label">{t('currentStatus', 'Current Status')}</span>
                      <span
                        className={`admin-status-badge ${selectedOrder.status
                          ?.toLowerCase()
                          ?.replace(/\s+/g, '-')}`}
                      >
                        {t(selectedOrder.status, selectedOrder.status)}
                      </span>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label" htmlFor="order-status-select">
                      {t('newStatus', 'New Status')} <span className="required">*</span>
                    </label>
                    <select
                      id="order-status-select"
                      className="admin-form-select"
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value)}
                      required
                    >
                      <option value="In Production">{t('inProduction', 'In Production')}</option>
                      <option value="Ready for Delivery">{t('readyForDelivery', 'Ready for Delivery')}</option>
                      <option value="Delivered">{t('delivered', 'Delivered')}</option>
                      <option value="Consultation Scheduled">{t('consultationsScheduled', 'Consultation Scheduled')}</option>
                    </select>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline"
                    onClick={() => setIsOrderModalOpen(false)}
                    disabled={isSavingOrder}
                  >
                    {t('cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={isSavingOrder}
                  >
                    {isSavingOrder ? t('savingStatus', 'Saving...') : t('saveStatus', 'Save Status')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: REGISTER NEW CLIENT */}
        {/* ========================================================================= */}
        {isClientModalOpen && (
          <div
            className="admin-modal-overlay"
            onClick={() => setIsClientModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="client-modal-title"
          >
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h2 id="client-modal-title">{t('registerNewClient', 'Register New Client')}</h2>
                  <p>{t('registerClientDesc', 'Add a new patron or architectural client to the studio directory.')}</p>
                </div>
                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setIsClientModalOpen(false)}
                  aria-label={t('cancel', 'Close')}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveClient}>
                <div className="admin-modal-body">
                  <div className="admin-form-group">
                    <label className="admin-form-label" htmlFor="client-name">
                      {t('clientName', 'Client Full Name')} <span className="required">*</span>
                    </label>
                    <input
                      id="client-name"
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Architect Sarah Al-Qudah"
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="client-email">
                        {t('email', 'Email Address')} <span className="required">*</span>
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        className="admin-form-input"
                        placeholder="client@hurfa.com"
                        value={clientForm.email}
                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="client-phone">
                        {t('phone', 'Phone Number')} <span className="required">*</span>
                      </label>
                      <input
                        id="client-phone"
                        type="tel"
                        className="admin-form-input"
                        placeholder="+962 7 9000 0000"
                        value={clientForm.phone}
                        onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="client-city">
                        {t('city', 'District / City')} <span className="required">*</span>
                      </label>
                      <input
                        id="client-city"
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. Amman (Abdoun)"
                        value={clientForm.city}
                        onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="client-tier">
                        {t('clientTier', 'Patron Tier / Status')}
                      </label>
                      <select
                        id="client-tier"
                        className="admin-form-select"
                        value={clientForm.status}
                        onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                      >
                        <option value="Prospect">{t('prospect', 'Prospect')}</option>
                        <option value="Active">{t('Active', 'Active Client')}</option>
                        <option value="VIP">{t('VIP', 'VIP Client')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="client-projects">
                        {t('initialProjects', 'Completed Projects')}
                      </label>
                      <input
                        id="client-projects"
                        type="number"
                        min="0"
                        className="admin-form-input"
                        placeholder="0"
                        value={clientForm.totalOrders}
                        onChange={(e) => setClientForm({ ...clientForm, totalOrders: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="client-spent">
                        {t('initialSpent', 'Total Spent / Value')}
                      </label>
                      <input
                        id="client-spent"
                        type="text"
                        className="admin-form-input"
                        placeholder="JOD 0"
                        value={clientForm.totalSpent}
                        onChange={(e) => setClientForm({ ...clientForm, totalSpent: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline"
                    onClick={() => setIsClientModalOpen(false)}
                    disabled={isSavingClient}
                  >
                    {t('cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={isSavingClient}
                  >
                    {isSavingClient ? t('registeringClient', 'Registering...') : t('saveClient', 'Save Client')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: EDIT BEDROOM PIECE */}
        {/* ========================================================================= */}
        {isBedroomModalOpen && editingBedroom && (
          <div
            className="admin-modal-overlay"
            onClick={() => setIsBedroomModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bedroom-modal-title"
          >
            <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <h2 id="bedroom-modal-title">{t('editBedroom', 'Edit Bedroom Piece')}</h2>
                  <p>{t('editBedroomDesc', 'Modify dimensions, pricing, and visual media for this bedroom suite.')}</p>
                </div>
                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setIsBedroomModalOpen(false)}
                  aria-label={t('cancel', 'Close')}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveBedroom}>
                <div className="admin-modal-body">
                  <div className="admin-form-group">
                    <label className="admin-form-label" htmlFor="bedroom-name">
                      {t('pieceName', 'Piece Name')} <span className="required">*</span>
                    </label>
                    <input
                      id="bedroom-name"
                      type="text"
                      className="admin-form-input"
                      value={editingBedroom.name}
                      onChange={(e) => setEditingBedroom({ ...editingBedroom, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="bedroom-price">
                        {t('standardPrice', 'Standard Price (JOD)')} <span className="required">*</span>
                      </label>
                      <input
                        id="bedroom-price"
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. 1450"
                        value={editingBedroom.price}
                        onChange={(e) => setEditingBedroom({ ...editingBedroom, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="bedroom-price2">
                        {t('wardrobeOptionPrice', 'With Wardrobe / Option B (JOD)')}
                      </label>
                      <input
                        id="bedroom-price2"
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. 2100"
                        value={editingBedroom.price2}
                        onChange={(e) => setEditingBedroom({ ...editingBedroom, price2: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label" htmlFor="bedroom-image">
                      {t('imageMedia', 'Image / Media URL')}
                    </label>
                    <input
                      id="bedroom-image"
                      type="text"
                      className="admin-form-input"
                      placeholder="https://ik.imagekit.io/..."
                      value={editingBedroom.image}
                      onChange={(e) => setEditingBedroom({ ...editingBedroom, image: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label" htmlFor="bedroom-desc">
                      {t('description', 'Description')}
                    </label>
                    <textarea
                      id="bedroom-desc"
                      className="admin-form-textarea"
                      rows="3"
                      value={editingBedroom.desc}
                      onChange={(e) => setEditingBedroom({ ...editingBedroom, desc: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="bedroom-status">
                        {t('stockStatus', 'Stock Status')}
                      </label>
                      <select
                        id="bedroom-status"
                        className="admin-form-select"
                        value={editingBedroom.stockStatus || 'In Stock'}
                        onChange={(e) =>
                          setEditingBedroom({
                            ...editingBedroom,
                            stockStatus: e.target.value,
                          })
                        }
                      >
                        <option value="In Stock">{t('inStock', 'In-stock')}</option>
                        <option value="Low Stock">{t('lowStock', 'Low-stock')}</option>
                        <option value="Out of Stock">{t('outOfStock', 'Out-of-stock')}</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label" htmlFor="bedroom-visibility">
                        {t('visibility', 'Catalog Visibility')}
                      </label>
                      <select
                        id="bedroom-visibility"
                        className="admin-form-select"
                        value={editingBedroom.isVisible !== false ? 'visible' : 'hidden'}
                        onChange={(e) =>
                          setEditingBedroom({
                            ...editingBedroom,
                            isVisible: e.target.value === 'visible',
                          })
                        }
                      >
                        <option value="visible">{t('visibleActive', 'Visible (Published on Website)')}</option>
                        <option value="hidden">{t('hiddenPiece', 'Hidden (Draft / Unpublished)')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline"
                    onClick={() => setIsBedroomModalOpen(false)}
                    disabled={isSavingBedroom}
                  >
                    {t('cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={isSavingBedroom}
                  >
                    {isSavingBedroom ? t('savingBedroom', 'Saving...') : t('saveBedroom', 'Save Bedroom Piece')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
