"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button, Input, Select, Table, Modal, Typography, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './ItemCategories.module.css'; // Import CSS module for custom styles

import Loading from '@/components/common/Loading';

const UpdateItemCategoryForm = dynamic(() => import('./UpdateItemCategoryForm'), {
  loading: () => <Loading />, 
});

const NewItemCategoryForm = dynamic(() => import('./NewItemCategoryForm'), {
  loading: () => <Loading />, 
});

const { Search } = Input;
const { Option } = Select;

function ItemCategories() {
  const [isLoading, setIsLoading] = useState(true);
  const [itemCategories, setItemCategories] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        await Promise.all([fetchItemCategories(), fetchItemGroups()]); // Wait for both fetches to complete
      } catch (error) {
        console.error("Error fetching data:", error);
        toast("Failed to fetch data");
      } finally {
        setIsLoading(false); // Set loading to false after both fetches complete
      }
    };
  
    fetchData();
  }, []);

  const fetchItemCategories = async () => {
    try {
      const res = await fetch('/api/item-categories');
      const data = await res.json();
      setItemCategories(data);
    } catch (error) {
      console.error("Error fetching:", error);
      toast("Failed to fetch item categories");
    }
  };

  const fetchItemGroups = async () => {
    try {
      const res = await fetch('/api/item-groups');
      const data = await res.json();
      setItemGroups(data.filter(group => group.active)); // Fetch only active groups
    } catch (error) {
      console.error("Error fetching:", error);
      toast("Failed to fetch item groups");
    }
  };

  const handleSave = () => {
    toast.success('Category saved successfully!');
    fetchItemCategories();
    setIsNewModalVisible(false);
  };

  const handleUpdate = () => {
    toast.success('Category updated successfully!');
    fetchItemCategories();
    setSelectedCategory(null);
    setIsUpdateModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/item-categories/${deleteCategoryId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItemCategories();
        setShowConfirm(false);
        setDeleteCategoryId(null);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast("Failed to delete item category");
    }
  };

  const openDeleteConfirm = (category) => {
    setDeleteCategoryId(category._id);
    setCategoryToDelete(category.name);
    setShowConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowConfirm(false);
    setDeleteCategoryId(null);
  };

  const clearFilters = () => {
    setFilterName('');
    setFilterGroup('all');
    setFilterStatus('all');
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredCategories = itemCategories
    .filter(category => category.name.toLowerCase().includes(filterName.toLowerCase()))
    .filter(category => filterGroup === 'all' ? true : category.groupId._id === filterGroup)
    .filter(category => filterStatus === 'all' ? true : category.active === (filterStatus === 'active'))
    .sort((a, b) => {
      if (sortConfig.key === 'name') {
        if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      } else if (sortConfig.key === 'groupId') {
        if (a.groupId.name < b.groupId.name) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a.groupId.name > b.groupId.name) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      } else if (sortConfig.key === 'active') {
        return sortConfig.direction === 'ascending' ? a.active - b.active : b.active - a.active;
      }
      return 0;
    });

  const paginatedCategories = sortedAndFilteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
          Category
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
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('groupId')}>
          Group
          {sortConfig.key === 'groupId' &&
            (sortConfig.direction === 'ascending' ? (
              <ArrowUpOutlined style={{ marginLeft: 8 }} />
            ) : (
              <ArrowDownOutlined style={{ marginLeft: 8 }} />
            ))}
        </div>
      ),
      dataIndex: 'groupId',
      key: 'groupId',
      render: (groupId) => groupId.name,
    },
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('active')}>
          Status
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
              setSelectedCategory(record);
              setIsUpdateModalVisible(true);
            }}
          />
          <Button type="link" icon={<DeleteOutlined />} onClick={() => openDeleteConfirm(record)} />
        </>
      ),
    },
  ];

  const groupOptions = itemGroups.map(group => ({ value: group._id, label: group.name }));
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.listContainer}>
          <h6 className="text-end pt-3 pe-3" strong>CATEGORIES</h6>
        <div className={styles.filterContainer}>
          <Search
          className="pe-2"
            placeholder="Search by Category"
            allowClear
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
          className="pe-2"
            placeholder="Filter by Group"
            value={filterGroup}
            onChange={(value) => setFilterGroup(value)}
            allowClear
            style={{ width: 200 }}
          >
            <Option value="all">All Groups</Option>
            {itemGroups.map((group) => (
              <Option key={group._id} value={group._id}>
                {group.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Status"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            allowClear
            style={{ width: 200 }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <Button className="m-2" type="link" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button className="m-2" type="primary" onClick={() => setIsNewModalVisible(true)}>
            Add Category
          </Button>
        </div>

        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={paginatedCategories}
            pagination={false}
            rowKey="_id"
            bordered
            scroll={{ y: 'calc(85vh - 200px)' }} // Adjust height to fit view
          />
          <Pagination
          className={styles.paginationContainer}
            current={currentPage}
            pageSize={rowsPerPage}
            total={sortedAndFilteredCategories.length}
            showSizeChanger
            pageSizeOptions={['5', '10', '25', '50', '100']}
            onShowSizeChange={(current, size) => {
                          setRowsPerPage(size);
                          setCurrentPage(1); // Reset to first page
                        }}
                        onChange={(page) => setCurrentPage(page)}
                                  showQuickJumper
                                  showTotal={(total) => `Total ${total} items`}
                                  itemRender={(current, type, originalElement) => {
                                    if (type === 'prev') {
                                      return <a>Previous</a>;
                                    }
                                    if (type === 'next') {
                                      return <a>Next</a>;
                                    }
                                    if (type === 'first') {
                                      return <a>First</a>;
                                    }
                                    if (type === 'last') {
                                      return <a>Last</a>;
                                    }
                                    return originalElement;
                                  }}
          />
        </div>
      </div>

      <Modal
        title="Create New Category"
        open={isNewModalVisible}
        footer={null}
        onCancel={() => setIsNewModalVisible(false)}
        destroyOnClose
      >
        <NewItemCategoryForm
          onSave={handleSave}
          onCancel={() => setIsNewModalVisible(false)}
        />
      </Modal>

      <Modal
        title="Edit Category"
        open={isUpdateModalVisible}
        footer={null}
        onCancel={() => setIsUpdateModalVisible(false)}
        destroyOnClose
      >
        <UpdateItemCategoryForm
          itemCategory={selectedCategory}
          onUpdate={handleUpdate}
          onCancel={() => setIsUpdateModalVisible(false)}
        />
      </Modal>

      <Modal
        title="Delete Confirmation"
        open={showConfirm}
        onOk={handleDelete}
        onCancel={closeDeleteConfirm}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        {/* <Typography.Text>Are you sure you want to delete this category name {name}?</Typography.Text> */}
        <Typography.Text>Are you sure you want to delete the category &quot;{categoryToDelete}&quot;?</Typography.Text>
      </Modal>
    </>
  );
}

export default ItemCategories;
