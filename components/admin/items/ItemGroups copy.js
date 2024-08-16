"use client";

import { useState, useEffect } from 'react';
import { Button, Input, Select, Table, Modal, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './ItemGroups.module.css'; // Import CSS module for custom styles
import ItemGroupForm from './ItemGroupForm';
import Loading from '@/components/common/Loading';

const { Search } = Input;
const { Option } = Select;

function ItemGroups() {
  const [isLoading, setIsLoading] = useState(true);
  const [itemGroups, setItemGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const fetchItemGroups = async () => {
    const res = await fetch('/api/item-groups');
    const data = await res.json();
    setItemGroups(data);
  };

  useEffect(() => {
    try {
      fetchItemGroups();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
      toast("Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSave = () => {
    toast.success('Item Group saved successfully!');
    fetchItemGroups();
    setSelectedGroup(null);
    setFilterName('');
  };

  const handleUpdate = () => {
    toast.success('Item Group updated successfully!');
    fetchItemGroups();
    setSelectedGroup(null);
    setFilterName('');
    setShowForm(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/item-groups/${deleteGroupId}`, { method: 'DELETE' });
    if (res.ok) {
      fetchItemGroups();
      setShowConfirm(false);
      setDeleteGroupId(null);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeleteGroupId(id);
    setShowConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowConfirm(false);
    setDeleteGroupId(null);
  };

  const clearFilters = () => {
    setFilterName('');
    setFilterActive('');
  };

  const sortedAndFilteredGroups = itemGroups
    .filter((group) => group.name.toLowerCase().includes(filterName.toLowerCase()))
    .filter((group) =>
      filterActive === '' ? true : group.active.toString() === filterActive
    )
    .sort((a, b) => {
      if (sortConfig.key === 'name') {
        if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      } else if (sortConfig.key === 'active') {
        if (a.active < b.active) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a.active > b.active) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      }
      return 0;
    });

  const paginatedGroups = sortedAndFilteredGroups.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const handleFirstPage = () => setPage(0);

  const handleLastPage = () => {
    const lastPage = Math.ceil(sortedAndFilteredGroups.length / rowsPerPage) - 1;
    setPage(lastPage);
  };

  const columns = [
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
          Item Group Name
          {sortConfig.key === 'name' &&
            (sortConfig.direction === 'ascending' ? (
              <ArrowUpOutlined style={{ marginLeft: 8 }} />
            ) : (
              <ArrowDownOutlined style={{ marginLeft: 8 }} />
            ))}
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('active')}>
          Active Status
          {sortConfig.key === 'active' &&
            (sortConfig.direction === 'ascending' ? (
              <ArrowUpOutlined style={{ marginLeft: 8 }} />
            ) : (
              <ArrowDownOutlined style={{ marginLeft: 8 }} />
            ))}
        </div>
      ),
      dataIndex: 'active',
      key: 'active',
      render: (active) => (active ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedGroup(record);
              setShowForm(true);
            }}
          />
          <Button type="link" icon={<DeleteOutlined />} onClick={() => openDeleteConfirm(record._id)} />
        </>
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      {showForm ? (
        <div className={styles.formContainer}>
          <ItemGroupForm
            itemGroup={selectedGroup}
            onSave={selectedGroup ? handleUpdate : handleSave}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div className={styles.listContainer}>
          
          <div className={styles.filterContainer}>
            <Search
              placeholder="Search by Name"
              allowClear
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Filter by status"
              value={filterActive}
              onChange={(value) => setFilterActive(value)}
              allowClear
              style={{ width: 200 }}
            >
              <Option value="">All</Option>
              <Option value="true">Active</Option>
              <Option value="false">Inactive</Option>
            </Select>

            <Button onClick={clearFilters}>Clear All Filters</Button>

            <Button
            type="primary"
            onClick={() => {
              setShowForm(true);
              setSelectedGroup(null);
            }}
          >
            Add Item Group
          </Button>
          </div>
          <Table
            columns={columns}
            dataSource={paginatedGroups}
            rowKey={(record) => record._id}
            pagination={{
              current: page + 1,
              pageSize: rowsPerPage,
              total: sortedAndFilteredGroups.length,
              onChange: (page) => setPage(page - 1),
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '25', '50', '100'],
              onShowSizeChange: (current, size) => setRowsPerPage(size),
              showQuickJumper: true,
              itemRender: (current, type, originalElement) => {
                if (type === 'prev') {
                  return <Button onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</Button>;
                }
                if (type === 'next') {
                  return <Button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(sortedAndFilteredGroups.length / rowsPerPage) - 1}>Next</Button>;
                }
                return originalElement;
              }
            }}
            scroll={{ x: 800, y: 400 }} // Enable horizontal scrolling for table
          />
        </div>
      )}
      <Modal
        title="Confirm Delete"
        open={showConfirm}
        onCancel={closeDeleteConfirm}
        onOk={handleDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <Typography.Text>Are you sure you want to delete this item group?</Typography.Text>
      </Modal>
    </div>
  );
}

export default ItemGroups;