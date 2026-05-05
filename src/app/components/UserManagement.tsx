import { useState } from 'react';
import { User, UserRole } from '../types';
import { Users, UserPlus, Edit2, Trash2, Shield, Store, TrendingUp, Mail, Lock, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: User;
  darkMode: boolean;
  stores: string[]; // Available store locations
}

export function UserManagement({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  currentUser,
  darkMode,
  stores
}: UserManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'analyst' as UserRole,
    password: '',
    storeLocation: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'analyst',
      password: '',
      storeLocation: ''
    });
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate manager has store assigned
    if (formData.role === 'manager' && !formData.storeLocation) {
      alert('Please assign a store for the manager');
      return;
    }

    onAddUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
      storeLocation: formData.role === 'manager' ? formData.storeLocation : undefined
    });

    resetForm();
    setShowAddModal(false);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    // Validate manager has store assigned
    if (formData.role === 'manager' && !formData.storeLocation) {
      alert('Please assign a store for the manager');
      return;
    }

    onUpdateUser(editingUser.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      storeLocation: formData.role === 'manager' ? formData.storeLocation : undefined
    });

    resetForm();
    setEditingUser(null);
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      storeLocation: user.storeLocation || ''
    });
  };

  const handleDelete = (userId: string, userName: string) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own account!');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      onDeleteUser(userId);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStore = storeFilter === 'all' || 
                         (user.storeLocation === storeFilter) ||
                         (storeFilter === 'unassigned' && !user.storeLocation);
    
    return matchesSearch && matchesRole && matchesStore;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'manager':
        return <Store className="w-4 h-4 text-blue-600" />;
      case 'analyst':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return darkMode ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return darkMode ? 'bg-blue-900/30 text-blue-300 border-blue-800' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analyst':
        return darkMode ? 'bg-green-900/30 text-green-300 border-green-800' : 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // User statistics
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
    analysts: users.filter(u => u.role === 'analyst').length,
    unassignedManagers: users.filter(u => u.role === 'manager' && !u.storeLocation).length
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className={`mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          User Management
        </h1>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage users, assign stores to managers, and control access
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-3 sm:p-4 border`}>
          <div className="flex items-center gap-2 mb-1">
            <Users className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
          </div>
          <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.total}</p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-3 sm:p-4 border`}>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-red-600" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Admins</p>
          </div>
          <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.admins}</p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-3 sm:p-4 border`}>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-blue-600" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Managers</p>
          </div>
          <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.managers}</p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-3 sm:p-4 border`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Analysts</p>
          </div>
          <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.analysts}</p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-3 sm:p-4 border`}>
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-orange-600" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unassigned</p>
          </div>
          <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.unassignedManagers}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow p-4 border`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Role Filter */}
          <div className="sm:w-40">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className={`w-full px-3 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="analyst">Analyst</option>
            </select>
          </div>

          {/* Store Filter */}
          <div className="sm:w-40">
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Stores</option>
              {stores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          {/* Add User Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>User</th>
                <th className={`px-4 py-3 text-left text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</th>
                <th className={`px-4 py-3 text-left text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Store Assignment</th>
                <th className={`px-4 py-3 text-left text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                <th className={`px-4 py-3 text-right text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs ${getRoleBadgeColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.role === 'manager' ? (
                        user.storeLocation ? (
                          <div className="flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-blue-600" />
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {user.storeLocation}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-xs ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                            ⚠️ Not Assigned
                          </span>
                        )
                      ) : (
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.role === 'manager' && user.storeLocation ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : user.role === 'manager' && !user.storeLocation ? (
                        <XCircle className="w-4 h-4 text-orange-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(user)}
                          className={`p-1.5 rounded ${
                            darkMode 
                              ? 'hover:bg-gray-700 text-gray-400' 
                              : 'hover:bg-gray-100 text-gray-600'
                          }`}
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className={`p-1.5 rounded ${
                              darkMode 
                                ? 'hover:bg-red-900/30 text-red-400' 
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
            <h3 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New User</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="analyst">Analyst</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role === 'manager' && (
                <div>
                  <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Assign Store *
                  </label>
                  <select
                    value={formData.storeLocation}
                    onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select Store...</option>
                    {stores.map(store => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add User
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
            <h3 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit User</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole, storeLocation: '' })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  disabled={editingUser.id === currentUser.id}
                >
                  <option value="analyst">Analyst</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {editingUser.id === currentUser.id && (
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    You cannot change your own role
                  </p>
                )}
              </div>

              {formData.role === 'manager' && (
                <div>
                  <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Assign Store *
                  </label>
                  <select
                    value={formData.storeLocation}
                    onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select Store...</option>
                    {stores.map(store => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Manager must be assigned to a store
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateUser}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update User
              </button>
              <button
                onClick={() => {
                  setEditingUser(null);
                  resetForm();
                }}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}