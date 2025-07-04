<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotspot Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 0;
            margin-bottom: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .stats-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }

        .stats-card:hover {
            transform: translateY(-5px);
        }

        .stats-card h3 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .stats-card p {
            color: #666;
            font-size: 1.1em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .stats-card.green h3 { color: #28a745; }
        .stats-card.red h3 { color: #dc3545; }
        .stats-card.blue h3 { color: #007bff; }
        .stats-card.purple h3 { color: #6f42c1; }

        .main-content {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .content-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }

        .content-header h2 {
            font-size: 1.8em;
            margin-bottom: 10px;
        }

        .filters {
            background: #f8f9fa;
            padding: 20px 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .filter-row {
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .filter-group label {
            font-weight: 600;
            color: #555;
            font-size: 0.9em;
        }

        .filter-group input,
        .filter-group select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.9em;
        }

        .filter-group input:focus,
        .filter-group select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            text-align: center;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5a6fd8;
        }

        .btn-success {
            background: #28a745;
            color: white;
        }

        .btn-success:hover {
            background: #218838;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .btn-sm {
            padding: 5px 10px;
            font-size: 0.8em;
        }

        .table-container {
            padding: 30px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .table th,
        .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }

        .table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #555;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .table tr:hover {
            background: #f8f9fa;
        }

        .table tr:nth-child(even) {
            background: #fafafa;
        }

        .table tr:nth-child(even):hover {
            background: #f0f0f0;
        }

        .badge {
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
        }

        .badge-success {
            background: #d4edda;
            color: #155724;
        }

        .badge-danger {
            background: #f8d7da;
            color: #721c24;
        }

        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        }

        .pagination button {
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            border-radius: 5px;
        }

        .pagination button.active {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .pagination button:hover:not(.active) {
            background: #f8f9fa;
        }

        .pagination button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .loading {
            text-align: center;
            padding: 50px;
            color: #666;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .export-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .content-header {
                flex-direction: column;
                gap: 15px;
            }

            .filter-row {
                flex-direction: column;
                align-items: stretch;
            }

            .table-container {
                padding: 15px;
                overflow-x: auto;
            }

            .table {
                min-width: 600px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌐 Hotspot Admin Dashboard</h1>
            <p>Manage user registrations and WiFi access data</p>
        </div>

        <!-- Statistics Cards -->
        <div class="dashboard-grid">
            <div class="stats-card blue">
                <h3 id="totalUsers">-</h3>
                <p>Total Users</p>
            </div>
            <div class="stats-card green">
                <h3 id="verifiedUsers">-</h3>
                <p>Verified Users</p>
            </div>
            <div class="stats-card red">
                <h3 id="unverifiedUsers">-</h3>
                <p>Unverified Users</p>
            </div>
            <div class="stats-card purple">
                <h3 id="activeSessions">-</h3>
                <p>Active Sessions</p>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <div class="content-header">
                <div>
                    <h2>User Management</h2>
                    <p>View and manage registered users</p>
                </div>
                <div class="export-buttons">
                    <button class="btn btn-success btn-sm" onclick="exportData('csv')">📊 Export CSV</button>
                    <button class="btn btn-success btn-sm" onclick="exportData('excel')">📈 Export Excel</button>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters">
                <div class="filter-row">
                    <div class="filter-group">
                        <label for="emailFilter">Email</label>
                        <input type="text" id="emailFilter" placeholder="Search by email...">
                    </div>
                    <div class="filter-group">
                        <label for="nameFilter">Name</label>
                        <input type="text" id="nameFilter" placeholder="Search by name...">
                    </div>
                    <div class="filter-group">
                        <label for="verifiedFilter">Status</label>
                        <select id="verifiedFilter">
                            <option value="">All Users</option>
                            <option value="1">Verified Only</option>
                            <option value="0">Unverified Only</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="dateFromFilter">Date From</label>
                        <input type="date" id="dateFromFilter">
                    </div>
                    <div class="filter-group">
                        <label for="dateToFilter">Date To</label>
                        <input type="date" id="dateToFilter">
                    </div>
                </div>
                <div class="filter-row">
                    <button class="btn btn-primary" onclick="loadUsers()">🔍 Search</button>
                    <button class="btn btn-secondary" onclick="clearFilters()">🔄 Clear</button>
                </div>
            </div>

            <!-- Data Table -->
            <div class="table-container">
                <div id="loadingIndicator" class="loading">Loading data...</div>
                <div id="errorMessage" class="error" style="display: none;"></div>
                <div id="successMessage" class="success" style="display: none;"></div>

                <table class="table" id="usersTable" style="display: none;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Terms</th>
                            <th>IP Address</th>
                            <th>Created</th>
                            <th>Verified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                    </tbody>
                </table>

                <div class="pagination" id="pagination" style="display: none;"></div>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        let currentPage = 1;
        let currentFilters = {};
        let currentSort = { field: 'created_at', order: 'DESC' };

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadStatistics();
            loadUsers();
            setupEventListeners();
        });

        // Setup event listeners
        function setupEventListeners() {
            // Auto-search on filter changes
            ['emailFilter', 'nameFilter', 'verifiedFilter', 'dateFromFilter', 'dateToFilter'].forEach(id => {
                document.getElementById(id).addEventListener('change', function() {
                    currentPage = 1;
                    loadUsers();
                });
            });

            // Enter key search
            ['emailFilter', 'nameFilter'].forEach(id => {
                document.getElementById(id).addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        currentPage = 1;
                        loadUsers();
                    }
                });
            });
        }

        // Load user statistics
        async function loadStatistics() {
            try {
                const response = await fetch('../api/endpoints/statistics.php');
                const data = await response.json();
                
                if (data.success) {
                    const stats = data.statistics;
                    document.getElementById('totalUsers').textContent = stats.total_users || 0;
                    document.getElementById('verifiedUsers').textContent = stats.verified_users || 0;
                    document.getElementById('unverifiedUsers').textContent = stats.unverified_users || 0;
                    document.getElementById('activeSessions').textContent = stats.active_sessions || 0;
                } else {
                    console.error('Failed to load statistics:', data.error);
                }
            } catch (error) {
                console.error('Error loading statistics:', error);
            }
        }

        // Load users with current filters
        async function loadUsers() {
            showLoading();
            hideMessages();

            try {
                // Build filters
                const filters = {};
                const email = document.getElementById('emailFilter').value.trim();
                const name = document.getElementById('nameFilter').value.trim();
                const verified = document.getElementById('verifiedFilter').value;
                const dateFrom = document.getElementById('dateFromFilter').value;
                const dateTo = document.getElementById('dateToFilter').value;

                if (email) filters.email = email;
                if (name) filters.name = name;
                if (verified !== '') filters.verified = verified;
                if (dateFrom) filters.date_from = dateFrom;
                if (dateTo) filters.date_to = dateTo;

                currentFilters = filters;

                // Build query string
                const params = new URLSearchParams();
                Object.keys(filters).forEach(key => params.append(key, filters[key]));
                params.append('page', currentPage);
                params.append('limit', 25);
                params.append('sort', currentSort.field);
                params.append('order', currentSort.order);

                const response = await fetch(`../api/endpoints/users.php?${params.toString()}`);
                const data = await response.json();

                if (data.success) {
                    displayUsers(data.users);
                    displayPagination(data.pagination);
                } else {
                    showError(data.error || 'Failed to load users');
                }
            } catch (error) {
                console.error('Error loading users:', error);
                showError('Network error occurred');
            }
        }

        // Display users in table
        function displayUsers(users) {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';

            if (users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 30px; color: #666;">No users found</td></tr>';
            } else {
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</td>
                        <td>${escapeHtml(user.email)}</td>
                        <td>
                            <span class="badge ${user.email_verified ? 'badge-success' : 'badge-danger'}">
                                ${user.email_verified ? 'Verified' : 'Unverified'}
                            </span>
                        </td>
                        <td>
                            <span class="badge ${user.terms_agreement ? 'badge-success' : 'badge-danger'}">
                                ${user.terms_agreement ? 'Agreed' : 'Not Agreed'}
                            </span>
                        </td>
                        <td>${user.client_ip || 'Unknown'}</td>
                        <td>${formatDate(user.created_at)}</td>
                        <td>${user.verified_at ? formatDate(user.verified_at) : 'Not verified'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="viewUser(${user.id})">View</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            showTable();
        }

        // Display pagination
        function displayPagination(pagination) {
            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = '';

            if (pagination.pages <= 1) {
                paginationDiv.style.display = 'none';
                return;
            }

            // Previous button
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '« Previous';
            prevBtn.disabled = !pagination.has_prev;
            prevBtn.onclick = () => {
                if (pagination.has_prev) {
                    currentPage--;
                    loadUsers();
                }
            };
            paginationDiv.appendChild(prevBtn);

            // Page numbers
            const startPage = Math.max(1, pagination.page - 2);
            const endPage = Math.min(pagination.pages, pagination.page + 2);

            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.className = i === pagination.page ? 'active' : '';
                pageBtn.onclick = () => {
                    currentPage = i;
                    loadUsers();
                };
                paginationDiv.appendChild(pageBtn);
            }

            // Next button
            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Next »';
            nextBtn.disabled = !pagination.has_next;
            nextBtn.onclick = () => {
                if (pagination.has_next) {
                    currentPage++;
                    loadUsers();
                }
            };
            paginationDiv.appendChild(nextBtn);

            paginationDiv.style.display = 'flex';
        }

        // Export data
        function exportData(format) {
            const params = new URLSearchParams();
            Object.keys(currentFilters).forEach(key => params.append(key, currentFilters[key]));
            params.append('format', format);

            const url = `../api/endpoints/export.php?${params.toString()}`;
            
            // Create temporary link and click it
            const link = document.createElement('a');
            link.href = url;
            link.download = `hotspot_users_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xls' : 'csv'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showSuccess(`${format.toUpperCase()} export started`);
        }

        // View user details
        function viewUser(userId) {
            // TODO: Implement user detail modal
            alert(`View user details for ID: ${userId}`);
        }

        // Delete user
        function deleteUser(userId) {
            if (confirm('Are you sure you want to delete this user?')) {
                // TODO: Implement user deletion
                alert(`Delete user ID: ${userId}`);
            }
        }

        // Clear filters
        function clearFilters() {
            ['emailFilter', 'nameFilter', 'verifiedFilter', 'dateFromFilter', 'dateToFilter'].forEach(id => {
                document.getElementById(id).value = '';
            });
            currentPage = 1;
            currentFilters = {};
            loadUsers();
        }

        // Utility functions
        function showLoading() {
            document.getElementById('loadingIndicator').style.display = 'block';
            document.getElementById('usersTable').style.display = 'none';
            document.getElementById('pagination').style.display = 'none';
        }

        function showTable() {
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('usersTable').style.display = 'table';
        }

        function showError(message) {
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('errorMessage').textContent = message;
            document.getElementById('errorMessage').style.display = 'block';
        }

        function showSuccess(message) {
            document.getElementById('successMessage').textContent = message;
            document.getElementById('successMessage').style.display = 'block';
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 3000);
        }

        function hideMessages() {
            document.getElementById('errorMessage').style.display = 'none';
            document.getElementById('successMessage').style.display = 'none';
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html> 