"use client";

import { useState, useEffect } from 'react';
import { Button, Input, Select, Table, Modal, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './Items.module.css';
import ItemForm from './ItemForm';
import Loading from '@/components/common/Loading';

const { Search } = Input;
const { Option } = Select;

function Items() {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [filterName, setFilterName] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  
    const fetchItems = async () => {
      const res = await fetch('/api/items');
    //   const data = await res.json();
    //   setItems(data);
    };
  
    const fetchCategories = async () => {
      const res = await fetch('/api/item-categories');
    //   const data = await res.json();
    //   setCategories(data);
    };
  
    useEffect(() => {
      fetchCategories().then(() => {
        fetchItems().finally(() => setIsLoading(false));
      });
    }, []);
  
    const handleSave = () => {
      toast.success('Item saved successfully!');
      fetchItems();
      setSelectedItem(null);
      setFilterName('');
    };
  
    const handleUpdate = () => {
      toast.success('Item updated successfully!');
      fetchItems();
      setSelectedItem(null);
      setFilterName('');
      setShowForm(false);
    };
  
    const handleDelete = async () => {
      const res = await fetch(`/api/items/${deleteItemId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems();
        setShowConfirm(false);
        setDeleteItemId(null);
      }
    };
  
    const openDeleteConfirm = (id) => {
      setDeleteItemId(id);
      setShowConfirm(true);
    };
  
    const closeDeleteConfirm = () => {
      setShowConfirm(false);
      setDeleteItemId(null);
    };
  
    const clearFilters = () => {
      setFilterName('');
      setFilterCategory('');
    };
  
    const sortedAndFilteredItems = items
      .filter((item) => item.name.toLowerCase().includes(filterName.toLowerCase()))
      .filter((item) => filterCategory === '' ? true : item.category === filterCategory)
      .sort((a, b) => {
        if (sortConfig.key === 'name') {
          if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortConfig.key === 'category') {
          if (a.category < b.category) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a.category > b.category) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
        return 0;
      });
  
    const paginatedItems = sortedAndFilteredItems.slice(
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
      const lastPage = Math.ceil(sortedAndFilteredItems.length / rowsPerPage) - 1;
      setPage(lastPage);
    };
  
    const columns = [
      {
        title: (
          <div style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
            Item Name
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
          <div style={{ cursor: 'pointer' }} onClick={() => requestSort('category')}>
            Category
            {sortConfig.key === 'category' &&
              (sortConfig.direction === 'ascending' ? (
                <ArrowUpOutlined style={{ marginLeft: 8 }} />
              ) : (
                <ArrowDownOutlined style={{ marginLeft: 8 }} />
              ))}
          </div>
        ),
        dataIndex: 'category',
        key: 'category',
        render: (categoryId) => {
          const category = categories.find(cat => cat._id === categoryId);
          return category ? category.name : 'Unknown';
        },
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
                setSelectedItem(record);
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
            <ItemForm
              item={selectedItem}
              categories={categories}
              onSave={selectedItem ? handleUpdate : handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <div className={styles.listContainer}>
            <div className={styles.filterContainer}>
              <Search
                placeholder="Search by name"
                allowClear
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                placeholder="Filter by category"
                value={filterCategory}
                onChange={(value) => setFilterCategory(value)}
                allowClear
                style={{ width: 200 }}
              >
                <Option value="">All</Option>
                {categories.map(cat => (
                  <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                ))}
              </Select>
              <Button onClick={clearFilters}>Clear Filters</Button>
              <Button
                type="primary"
                onClick={() => {
                  setShowForm(true);
                  setSelectedItem(null);
                }}
              >
                Add New Item
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={paginatedItems}
              rowKey={(record) => record._id}
              pagination={{
                current: page + 1,
                pageSize: rowsPerPage,
                total: sortedAndFilteredItems.length,
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
                    return <Button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(sortedAndFilteredItems.length / rowsPerPage) - 1}>Next</Button>;
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
          <Typography.Text>Are you sure you want to delete this item?</Typography.Text>
        </Modal>
      </div>
    );
  }

export default Items