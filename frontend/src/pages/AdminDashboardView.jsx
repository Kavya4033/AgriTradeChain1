import { useState } from 'react';
import Container from '../components/layout/Container';
import DashboardLayout from '../components/layout/DashboardLayout';
import Panel from '../components/layout/Panel';
import StatCard from '../components/common/StatCard';
import StatusBadge, { StepTracker } from '../components/StatusBadge';
import { getStatusInfo } from '../utils/statusMap';
import Tabs from '../components/common/Tabs';
import DataTable from '../components/common/DataTable';
import AddressChip from '../components/common/AddressChip';
import EmptyState from '../components/common/EmptyState';
import TxHashBadge from '../components/common/TxHashBadge';

const AdminDashboardView = ({
    stats,
    statsError,
    farmers,
    customers,
    listings,
    orders,
    farmersLoading,
    customersLoading,
    listingsLoading,
    ordersLoading,
    farmersError,
    customersError,
    listingsError,
    ordersError,
    onRefreshAll,
    onRefreshStats,
    onRefreshFarmers,
    onRefreshCustomers,
    onRefreshListings,
    onRefreshOrders,
    onSelectFarmer,
    onSelectCustomer,
    onLogout
}) => {
    const [activeTab, setActiveTab] = useState('orders');
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const searchTerm = searchText.trim().toLowerCase();
    const matchesSearch = (values) => !searchTerm || values.some(
        value => String(value ?? '').toLowerCase().includes(searchTerm)
    );
    const matchesStatus = (status) => statusFilter === 'All' || status === statusFilter;
    const soldCount = listings.filter(item => item.status === 'Sold').length;
    const pendingOrders = orders.filter(order => order.status === 'Pending');
    const pendingCount = pendingOrders.length;
    const deliveredCount = orders.filter(order => order.status === 'Delivered').length;
    const hasPendingAmounts = pendingOrders.every(
        order => order.item?.priceInEth != null && Number.isFinite(Number(order.item.priceInEth))
    );
    const pendingAmount = pendingOrders.reduce((total, order) => total + Number(order.item.priceInEth), 0);
    const filteredOrders = orders.filter(order => matchesStatus(order.status) && matchesSearch([
        order._id,
        order.customer?.name,
        order.customer?.email,
        order.farmer?.name,
        order.farmer?.email,
        order.item?.cropType,
        order.transactionHash,
        order.status
    ]));
    const filteredFarmers = farmers.filter(farmer => matchesSearch([
        farmer.name,
        farmer.email,
        farmer.walletAddress,
        farmer.location
    ]));
    const filteredCustomers = customers.filter(customer => matchesSearch([
        customer.name,
        customer.email,
        customer.walletAddress
    ]));
    const filteredListings = listings.filter(item => matchesStatus(item.status) && matchesSearch([
        item.cropType,
        item.quantity,
        item.priceInEth,
        item.farmer?.name,
        item.status
    ]));

    const tabs = [
        { id: 'orders', icon: '🔒', label: 'Order Settlements & Escrow Engine', count: orders.length },
        { id: 'farmers', label: 'Farmer Management', count: farmers.length },
        { id: 'customers', label: 'Customer Management', count: customers.length },
        { id: 'listings', label: 'Marketplace Listings', count: listings.length }
    ];

    const changeTab = (nextTab) => {
        setActiveTab(nextTab);
        setSearchText('');
        setStatusFilter('All');
    };

    const clearFilters = () => {
        setSearchText('');
        setStatusFilter('All');
    };

    const tableFilter = (statusOptions = []) => (
        <div className="admin-table-filters">
            <label>
                <span>Search</span>
                <input
                    className="input-field"
                    type="search"
                    placeholder={activeTab === 'orders' ? 'Search transaction, customer, farmer, or crop...' : 'Search this table...'}
                    value={searchText}
                    onChange={event => setSearchText(event.target.value)}
                />
            </label>
            {statusOptions.length > 0 && (
                <label>
                    <span>Status</span>
                    <select className="select-field" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
                        {statusOptions.map(status => <option key={status} value={status}>{status === 'All' ? 'All statuses' : status}</option>)}
                    </select>
                </label>
            )}
        </div>
    );

    const renderLoading = (label) => <div className="admin-loading-state" role="status">Loading {label}...</div>;
    const renderError = (message, retry) => (
        <div className="admin-error-state" role="alert">
            <p>{message}</p>
            <button type="button" className="btn-secondary" onClick={retry}>Retry</button>
        </div>
    );

    return (
        <main className="admin-dashboard-page">
            <Container>
                <div className="admin-dashboard">
                    <header className="admin-dashboard-heading">
                        <div>
                            <h1>Platform Oversight &amp; Escrow Engine</h1>
                            <p>Monitor system participants, listings, orders, and settlement status.</p>
                        </div>
                        <div className="admin-dashboard-actions">
                            <button type="button" className="btn-primary" onClick={onRefreshAll}>Refresh Platform Data</button>
                            <button type="button" className="btn-secondary admin-logout" onClick={onLogout}>Logout</button>
                        </div>
                    </header>

                    {statsError && (
                        <div className="admin-error-state" role="alert">
                            <p>Could not load dashboard statistics: {statsError}</p>
                            <button type="button" className="btn-secondary" onClick={onRefreshStats}>Retry</button>
                        </div>
                    )}

                    <section className="admin-stat-grid" aria-label="Platform statistics">
                        <StatCard icon="🧑‍🌾" value={stats.totalFarmers} title="Total Farmers" colorTheme="green" />
                        <StatCard icon="🛒" value={stats.totalCustomers} title="Total Customers" colorTheme="blue" />
                        <StatCard icon="🌾" value={listings.length} title="Total Listings" colorTheme="amber" />
                        <StatCard icon="⏳" value={stats.activeMarketplaceItems} title="Available Crops" colorTheme="blue" />
                        <StatCard icon="📦" value={soldCount} title="Sold Crops" colorTheme="amber" />
                        <StatCard icon="🧾" value={orders.length} title="Total Orders" colorTheme="purple" />
                        <StatCard icon="🔒" value={pendingCount} title="Pending Escrow" subtitle="Funds awaiting settlement" colorTheme="amber" attention={pendingCount > 0} />
                        <StatCard icon="✅" value={stats.blockchainSettlements} title="Delivered & Settled" subtitle={`${deliveredCount} delivered orders in the returned list`} colorTheme="green" />
                        <StatCard icon="💰" value="—" unit="ETH" title="Settled Volume" subtitle="Volume is not included in current responses" colorTheme="purple" />
                    </section>

                    <Tabs items={tabs} value={activeTab} onChange={changeTab} ariaLabel="Admin dashboard sections" />

                    <DashboardLayout
                        main={(
                            <>
                                {activeTab === 'orders' && (
                                    <Panel
                                        title={`Order Settlements & Escrow (${orders.length})`}
                                        action={<button type="button" className="btn-secondary" onClick={onRefreshOrders}>Refresh Orders</button>}
                                    >
                                        {tableFilter(['All', 'Pending', 'Delivered'])}
                                        {ordersLoading ? renderLoading('orders') : ordersError ? renderError(ordersError, onRefreshOrders) : filteredOrders.length === 0 ? (
                                            <EmptyState icon="📦" title="No matching orders" description="No order records match the current search and status filter." actionLabel="Clear filters" onAction={clearFilters} />
                                        ) : (
                                            <DataTable
                                                rows={filteredOrders}
                                                minWidth="78rem"
                                                caption="Customer orders and escrow status"
                                                columns={[
                                                    {
                                                        key: '_id',
                                                        label: 'Order & Date',
                                                        render: (value, order) => <div className="admin-cell-stack"><strong>#{String(value).slice(-6)}</strong><span>{formatDate(order.createdAt) || 'Date unavailable'}</span></div>
                                                    },
                                                    {
                                                        key: 'customer',
                                                        label: 'Customer',
                                                        render: customer => <div className="admin-cell-stack"><strong>{customer?.name || 'Name unavailable'}</strong><span>{customer?.email || 'Email unavailable'}</span></div>
                                                    },
                                                    {
                                                        key: 'farmer',
                                                        label: 'Farmer',
                                                        render: farmer => <div className="admin-cell-stack"><strong>{farmer?.name || 'Name unavailable'}</strong><span>{farmer?.email || 'Email unavailable'}</span></div>
                                                    },
                                                    {
                                                        key: 'item',
                                                        label: 'Crop & Value',
                                                        render: item => <div className="admin-cell-stack"><strong>{item?.cropType || 'Crop unavailable'}</strong><span>{item?.quantity != null ? `${item.quantity} kg` : 'Quantity unavailable'} · {item?.priceInEth != null ? `${item.priceInEth} ETH` : 'Price unavailable'}</span></div>
                                                    },
                                                    {
                                                        key: 'transactionHash',
                                                        label: 'Blockchain Tx Hash',
                                                        render: hash => <TxHashBadge hash={hash} label="Purchase" />
                                                    },
                                                    {
                                                        key: 'status',
                                                        label: 'Escrow Status',
                                                        render: status => <div className="admin-cell-stack"><StatusBadge status={status} /><StepTracker currentStep={getStatusInfo(status).step} /></div>
                                                    }
                                                ]}
                                            />
                                        )}
                                    </Panel>
                                )}

                                {activeTab === 'farmers' && (
                                    <Panel
                                        title={`Farmer Management (${farmers.length})`}
                                        action={<button type="button" className="btn-secondary" onClick={onRefreshFarmers}>Refresh Farmers</button>}
                                    >
                                        {tableFilter()}
                                        {farmersLoading ? renderLoading('farmers') : farmersError ? renderError(farmersError, onRefreshFarmers) : filteredFarmers.length === 0 ? (
                                            <EmptyState icon="🧑‍🌾" title="No matching farmers" description="No farmer records match the current search." actionLabel="Clear search" onAction={clearFilters} />
                                        ) : (
                                            <DataTable
                                                rows={filteredFarmers}
                                                minWidth="58rem"
                                                columns={[
                                                    { key: 'name', label: 'Farmer Name' },
                                                    { key: 'email', label: 'Email' },
                                                    { key: 'walletAddress', label: 'Registered Wallet', render: address => <AddressChip address={address} /> },
                                                    { key: 'location', label: 'Farm Location', render: value => value || 'Location unavailable' },
                                                    { key: 'createdAt', label: 'Registered Date', render: value => formatDate(value) || 'Date unavailable' },
                                                    { key: 'actions', label: 'Details', render: (_, farmer) => <button type="button" className="btn-secondary" onClick={() => onSelectFarmer(farmer)}>View details</button> }
                                                ]}
                                            />
                                        )}
                                    </Panel>
                                )}

                                {activeTab === 'customers' && (
                                    <Panel
                                        title={`Customer Management (${customers.length})`}
                                        action={<button type="button" className="btn-secondary" onClick={onRefreshCustomers}>Refresh Customers</button>}
                                    >
                                        {tableFilter()}
                                        {customersLoading ? renderLoading('customers') : customersError ? renderError(customersError, onRefreshCustomers) : filteredCustomers.length === 0 ? (
                                            <EmptyState icon="🛒" title="No matching customers" description="No customer records match the current search." actionLabel="Clear search" onAction={clearFilters} />
                                        ) : (
                                            <DataTable
                                                rows={filteredCustomers}
                                                minWidth="52rem"
                                                columns={[
                                                    { key: 'name', label: 'Customer Name' },
                                                    { key: 'email', label: 'Email' },
                                                    { key: 'walletAddress', label: 'MetaMask Wallet', render: address => <AddressChip address={address} /> },
                                                    { key: 'createdAt', label: 'Registered Date', render: value => formatDate(value) || 'Date unavailable' },
                                                    { key: 'actions', label: 'Details', render: (_, customer) => <button type="button" className="btn-secondary" onClick={() => onSelectCustomer(customer)}>View details</button> }
                                                ]}
                                            />
                                        )}
                                    </Panel>
                                )}

                                {activeTab === 'listings' && (
                                    <Panel
                                        title={`Marketplace Listings (${listings.length})`}
                                        action={<button type="button" className="btn-secondary" onClick={onRefreshListings}>Refresh Listings</button>}
                                    >
                                        {tableFilter(['All', 'Available', 'Sold'])}
                                        {listingsLoading ? renderLoading('listings') : listingsError ? renderError(listingsError, onRefreshListings) : filteredListings.length === 0 ? (
                                            <EmptyState icon="🌾" title="No matching listings" description="No listing records match the current search and status filter." actionLabel="Clear filters" onAction={clearFilters} />
                                        ) : (
                                            <DataTable
                                                rows={filteredListings}
                                                minWidth="54rem"
                                                columns={[
                                                    { key: 'cropType', label: 'Crop Variety' },
                                                    { key: 'quantity', label: 'Quantity', render: value => `${value} kg` },
                                                    { key: 'priceInEth', label: 'Price in ETH', render: value => `${value} ETH` },
                                                    { key: 'farmer', label: 'Farmer Name', render: farmer => farmer?.name || 'Name unavailable' },
                                                    { key: 'status', label: 'Status', render: status => <StatusBadge status={status} /> }
                                                ]}
                                            />
                                        )}
                                    </Panel>
                                )}
                            </>
                        )}
                        sidebar={(
                            <>
                                <Panel title="Needs your action">
                                    <p className="admin-sidebar-note">
                                        {pendingCount ? `${pendingCount} pending escrow order${pendingCount === 1 ? '' : 's'} in the returned order list.` : 'No pending escrow orders in the returned order list.'}
                                    </p>
                                    <p className="admin-sidebar-note">
                                        Pending amount: {pendingCount === 0 ? '0 ETH' : hasPendingAmounts ? `${pendingAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} ETH` : 'unavailable'}
                                    </p>
                                    <p className="admin-sidebar-note">Release and refund actions are not available in the current admin routes.</p>
                                    <button type="button" className="btn-secondary" onClick={() => changeTab('orders')}>Review Orders</button>
                                </Panel>
                                <Panel title="Recent activity">
                                    {orders.length === 0 ? (
                                        <p className="admin-sidebar-note">No order activity is available.</p>
                                    ) : (
                                        <ul className="admin-recent-list">
                                            {orders.slice(0, 3).map(order => (
                                                <li key={order._id}>
                                                    <strong>{order.item?.cropType || 'Order'}</strong>
                                                    <span>{order.customer?.name || 'Customer unavailable'} · {order.status || 'Status unavailable'}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Panel>
                            </>
                        )}
                    />

                </div>
            </Container>
        </main>
    );
};

function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

export default AdminDashboardView;