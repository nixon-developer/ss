// "use client";

// import { useState, useEffect } from 'react';
// import { Button, Input, Select, Table, Modal, Typography } from 'antd';
// import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
// import { toast } from 'react-toastify';
// import styles from './ItemCategories.module.css';
// import ItemCategoryForm from './ItemCategoryForm';
// import Loading from '@/components/common/Loading';

// const { Search } = Input;
// const { Option } = Select;

// function ItemCategories() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [itemCategories, setItemCategories] = useState([]);
//   const [itemGroups, setItemGroups] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deleteCategoryId, setDeleteCategoryId] = useState(null);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [page, setPage] = useState(0);
//   const [filterName, setFilterName] = useState('');
//   const [filterActive, setFilterActive] = useState('');
//   const [filterGroup, setFilterGroup] = useState(''); // State for filtering by item group
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

//   useEffect(() => {
//     fetchItemGroups().then(() => {
//       fetchItemCategories().finally(() => setIsLoading(false));
//     });
//   }, []);
  
//   const fetchItemCategories = async () => {
//     const res = await fetch('/api/item-categories');
//     const data = await res.json();
//     console.log('Fetched Item Categories:', data); // Log categories
//     setItemCategories(data);
//   };
  
//   const fetchItemGroups = async () => {
//     const res = await fetch('/api/item-groups');
//     const data = await res.json();
//     console.log('Fetched Item Groups:', data); // Log groups
//     setItemGroups(data);
//   };

//   const handleSave = () => {
//     toast.success('Item Category saved successfully!');
//     fetchItemCategories();
//     setSelectedCategory(null);
//     setFilterName('');
//   };

//   const handleUpdate = () => {
//     toast.success('Item Category updated successfully!');
//     fetchItemCategories();
//     setSelectedCategory(null);
//     setFilterName('');
//     setShowForm(false);
//   };

//   const handleDelete = async () => {
//     const res = await fetch(`/api/item-categories/${deleteCategoryId}`, { method: 'DELETE' });
//     if (res.ok) {
//       fetchItemCategories();
//       setShowConfirm(false);
//       setDeleteCategoryId(null);
//     }
//   };

//   const openDeleteConfirm = (id) => {
//     setDeleteCategoryId(id);
//     setShowConfirm(true);
//   };

//   const closeDeleteConfirm = () => {
//     setShowConfirm(false);
//     setDeleteCategoryId(null);
//   };

//   const clearFilters = () => {
//     setFilterName('');
//     setFilterActive('');
//     setFilterGroup('');
//   };

//   const sortedAndFilteredCategories = itemCategories
//     .filter((category) => category.name.toLowerCase().includes(filterName.toLowerCase()))
//     .filter((category) => 
//       filterActive === '' ? true : category.active.toString() === filterActive
//     )
//     .filter((category) =>
//       filterGroup === '' ? true : category.groupId === filterGroup
//     )
//     .sort((a, b) => {
//       if (sortConfig.key === 'name') {
//         if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
//         if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
//         return 0;
//       } else if (sortConfig.key === 'active') {
//         if (a.active < b.active) return sortConfig.direction === 'ascending' ? -1 : 1;
//         if (a.active > b.active) return sortConfig.direction === 'ascending' ? 1 : -1;
//         return 0;
//       } else if (sortConfig.key === 'groupId') {
//         // if (a.groupId.name < b.groupId.name) return sortConfig.direction === 'ascending' ? -1 : 1;
//         // if (a.groupId.name > b.groupId.name) return sortConfig.direction === 'ascending' ? 1 : -1;
//         // return 0;

//         const groupA = itemGroups.find((group) => group._id === a.groupId);
//         const groupB = itemGroups.find((group) => group._id === b.groupId);
//         const nameA = groupA ? groupA.name : '';
//         const nameB = groupB ? groupB.name : '';
//         if (nameA < nameB) return sortConfig.direction === 'ascending' ? -1 : 1;
//         if (nameA > nameB) return sortConfig.direction === 'ascending' ? 1 : -1;
//         return 0;
//       }
//       return 0;
//     });

//   const paginatedCategories = sortedAndFilteredCategories.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
//       direction = 'ascending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleFirstPage = () => setPage(0);

//   const handleLastPage = () => {
//     const lastPage = Math.ceil(sortedAndFilteredCategories.length / rowsPerPage) - 1;
//     setPage(lastPage);
//   };

//   const columns = [
//     {
//       title: (
//         <div style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
//           Item Category Name
//           {sortConfig.key === 'name' &&
//             (sortConfig.direction === 'ascending' ? (
//               <ArrowUpOutlined style={{ marginLeft: 8 }} />
//             ) : (
//               <ArrowDownOutlined style={{ marginLeft: 8 }} />
//             ))}
//         </div>
//       ),
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: (
//         <div style={{ cursor: 'pointer' }} onClick={() => requestSort('groupId')}>
//           Item Group
//           {sortConfig.key === 'groupId' &&
//             (sortConfig.direction === 'ascending' ? (
//               <ArrowUpOutlined style={{ marginLeft: 8 }} />
//             ) : (
//               <ArrowDownOutlined style={{ marginLeft: 8 }} />
//             ))}
//         </div>
//       ),
//       dataIndex: 'groupId',
//       key: 'groupId',
//       render: (groupId) => {
//         const group = itemGroups.find((g) => g._id === groupId);
//         return groupId ? groupId.name : 'Unknown';
//       },
//     },
//     {
//       title: (
//         <div style={{ cursor: 'pointer' }} onClick={() => requestSort('active')}>
//           Active Status
//           {sortConfig.key === 'active' &&
//             (sortConfig.direction === 'ascending' ? (
//               <ArrowUpOutlined style={{ marginLeft: 8 }} />
//             ) : (
//               <ArrowDownOutlined style={{ marginLeft: 8 }} />
//             ))}
//         </div>
//       ),
//       dataIndex: 'active',
//       key: 'active',
//       render: (active) => (active ? 'Active' : 'Inactive'),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       align: 'right',
//       render: (text, record) => (
//         <>
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             onClick={() => {
//               setSelectedCategory(record);
//               setShowForm(true);
//             }}
//           />
//           <Button type="link" icon={<DeleteOutlined />} onClick={() => openDeleteConfirm(record._id)} />
//         </>
//       ),
//     },
//   ];
  

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <div className={styles.container}>
//       {showForm ? (
//         <div className={styles.formContainer}>
//           <ItemCategoryForm
//             itemCategory={selectedCategory}
//             itemGroups={itemGroups}
//             onSave={selectedCategory ? handleUpdate : handleSave}
//             onCancel={() => setShowForm(false)}
//           />
//         </div>
//       ) : (
//         <div className={styles.listContainer}>
//           <div className={styles.filterContainer}>
//             <Search
//               placeholder="Search by category"
//               allowClear
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//               style={{ width: 200 }}
//             />
//             <Select
//               placeholder="Filter by status"
//               value={filterActive}
//               onChange={(value) => setFilterActive(value)}
//               allowClear
//               style={{ width: 200 }}
//             >
//               <Option value="">All</Option>
//               <Option value="true">Active</Option>
//               <Option value="false">Inactive</Option>
//             </Select>
//             <Select
//               placeholder="Filter by item group"
//               value={filterGroup}
//               onChange={(value) => setFilterGroup(value)}
//               allowClear
//               style={{ width: 200 }}
//             >
//               <Option value="">All</Option>
//               {itemGroups.map((group) => (
//                 <Option key={group._id} value={group._id}>
//                   {group.name}
//                 </Option>
//               ))}
//             </Select>
//             <Button onClick={clearFilters}>Clear Filters</Button>
//             <Button
//               type="primary"
//               onClick={() => {
//                 setSelectedCategory(null);
//                 setShowForm(true);
//               }}
//             >
//               Add Item Category
//             </Button>
//           </div>
//           <Table
//             dataSource={paginatedCategories}
//             columns={columns}
//             pagination={false}
//             rowKey={(record) => record._id}
//           />
//           <div className={styles.paginationContainer}>
//             <Button disabled={page === 0} onClick={handleFirstPage}>
//               First
//             </Button>
//             <Button disabled={page === 0} onClick={() => setPage((prev) => prev - 1)}>
//               Previous
//             </Button>
//             <span>
//               Page {page + 1} of {Math.ceil(sortedAndFilteredCategories.length / rowsPerPage)}
//             </span>
//             <Button
//               disabled={page >= Math.ceil(sortedAndFilteredCategories.length / rowsPerPage) - 1}
//               onClick={() => setPage((prev) => prev + 1)}
//             >
//               Next
//             </Button>
//             <Button
//               disabled={page >= Math.ceil(sortedAndFilteredCategories.length / rowsPerPage) - 1}
//               onClick={handleLastPage}
//             >
//               Last
//             </Button>
//           </div>
//         </div>
//       )}
//       <Modal
//         title="Confirm Delete"
//         open={showConfirm}
//         onOk={handleDelete}
//         onCancel={closeDeleteConfirm}
//       >
//         <Typography>Are you sure you want to delete this item category?</Typography>
//       </Modal>
//     </div>
//   );
// }

// export default ItemCategories;




// "use client";

// import { useState, useEffect } from 'react';
// import { Button, Input, Select, Table, Modal, Typography } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { toast } from 'react-toastify';
// import ItemCategoryForm from './ItemCategoryForm';
// import Loading from '@/components/common/Loading';

// const { Search } = Input;
// const { Option } = Select;

// function ItemCategories() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [itemCategories, setItemCategories] = useState([]);
//   const [itemGroups, setItemGroups] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deleteCategoryId, setDeleteCategoryId] = useState(null);
//   const [filterName, setFilterName] = useState('');
//   const [filterGroup, setFilterGroup] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [sorter, setSorter] = useState({
//     columnKey: 'name',
//     order: 'ascend',
//   });

//   const fetchItemCategories = async () => {
//     try {
//       const res = await fetch('/api/item-categories');
//       const data = await res.json();
//       setItemCategories(data);
//     } catch (error) {
//       console.error("Error fetching:", error);
//       toast("Failed to fetch item categories");
//     }
//   };

//   const fetchItemGroups = async () => {
//     try {
//       const res = await fetch('/api/item-groups');
//       const data = await res.json();
//       setItemGroups(data.filter(group => group.active)); // Fetch only active groups
//     } catch (error) {
//       console.error("Error fetching:", error);
//       toast("Failed to fetch item groups");
//     }
//   };

//   useEffect(() => {
//     fetchItemCategories();
//     fetchItemGroups();
//     setIsLoading(false);
//   }, []);

//   const handleSave = () => {
//     toast.success('Item Category saved successfully!');
//     fetchItemCategories();
//     setSelectedCategory(null);
//     setFilterName('');
//     setShowForm(false);
//   };

//   const handleUpdate = () => {
//     toast.success('Item Category updated successfully!');
//     fetchItemCategories();
//     setSelectedCategory(null);
//     setFilterName('');
//     setShowForm(false);
//   };

//   const handleDelete = async () => {
//     try {
//       const res = await fetch(`/api/item-categories/${deleteCategoryId}`, { method: 'DELETE' });
//       if (res.ok) {
//         fetchItemCategories();
//         setShowConfirm(false);
//         setDeleteCategoryId(null);
//       }
//     } catch (error) {
//       console.error("Error deleting:", error);
//       toast("Failed to delete item category");
//     }
//   };

//   const openDeleteConfirm = (id) => {
//     setDeleteCategoryId(id);
//     setShowConfirm(true);
//   };

//   const closeDeleteConfirm = () => {
//     setShowConfirm(false);
//     setDeleteCategoryId(null);
//   };

//   const handleSearch = (value) => {
//     setFilterName(value);
//   };

//   const handleClearFilters = () => {
//     setFilterName('');
//     setFilterGroup('all');
//     setFilterStatus('all');
//   };

//   const handleSort = (columnKey) => {
//     setSorter(prev => {
//       const newOrder = prev.columnKey === columnKey
//         ? (prev.order === 'ascend' ? 'descend' : 'ascend')
//         : 'ascend';
//       return { columnKey: columnKey, order: newOrder };
//     });
//   };

//   const filteredCategories = itemCategories
//     .filter(category => category.name.toLowerCase().includes(filterName.toLowerCase()))
//     .filter(category => filterGroup === 'all' ? true : category.groupId._id === filterGroup)
//     .filter(category => filterStatus === 'all' ? true : category.active === (filterStatus === 'active'))
//     .sort((a, b) => {
//       const { columnKey, order } = sorter;
//       if (columnKey === 'name') {
//         const nameA = a.name.toLowerCase();
//         const nameB = b.name.toLowerCase();
//         return order === 'ascend' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
//       } else if (columnKey === 'groupId') {
//         const groupA = a.groupId.name.toLowerCase();
//         const groupB = b.groupId.name.toLowerCase();
//         return order === 'ascend' ? groupA.localeCompare(groupB) : groupB.localeCompare(groupA);
//       } else if (columnKey === 'active') {
//         return order === 'ascend' ? a.active - b.active : b.active - a.active;
//       }
//       return 0;
//     });

//   const columns = [
//     {
//       title: 'Item Category Name',
//       dataIndex: 'name',
//       key: 'name',
//       sorter: true,
//       sortOrder: sorter.columnKey === 'name' ? sorter.order : undefined,
//       onHeaderCell: () => ({
//         onClick: () => handleSort('name'),
//       }),
//     },
//     {
//       title: 'Item Group Name',
//       dataIndex: 'groupId',
//       key: 'groupId',
//       render: (groupId) => groupId.name,
//       sorter: true,
//       sortOrder: sorter.columnKey === 'groupId' ? sorter.order : undefined,
//       onHeaderCell: () => ({
//         onClick: () => handleSort('groupId'),
//       }),
//     },
//     {
//       title: 'Active Status',
//       dataIndex: 'active',
//       key: 'active',
//       render: (active) => (active ? 'Active' : 'Inactive'),
//       sorter: true,
//       sortOrder: sorter.columnKey === 'active' ? sorter.order : undefined,
//       onHeaderCell: () => ({
//         onClick: () => handleSort('active'),
//       }),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (text, record) => (
//         <div>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setSelectedCategory(record);
//               setShowForm(true);
//             }}
//             className="m-1"
//           />
//           <Button
//             icon={<DeleteOutlined />}
//             onClick={() => openDeleteConfirm(record._id)}
//             danger
//             className="m-1"
//           />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       {isLoading ? (
//         <Loading />
//       ) : (
//         <>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <Search
//               placeholder="Search by Category Name"
//               onSearch={handleSearch}
//               onChange={(e) => handleSearch(e.target.value)}
//               value={filterName}
//               enterButton
//               className="w-50 m-2"
//             />
//             <Select
//               placeholder="Filter by Item Group"
//               value={filterGroup}
//               onChange={(value) => setFilterGroup(value)}
//               className="w-25 m-2"
//             >
//               <Option value="all">All</Option>
//               {itemGroups.map((group) => (
//                 <Option key={group._id} value={group._id}>
//                   {group.name}
//                 </Option>
//               ))}
//             </Select>
//             <Select
//               placeholder="Filter by Active Status"
//               value={filterStatus}
//               onChange={(value) => setFilterStatus(value)}
//               className="w-25 m-2"
//             >
//               <Option value="all">All</Option>
//               <Option value="active">Active</Option>
//               <Option value="inactive">Inactive</Option>
//             </Select>
//             <div className="d-flex">
//               <Button
//                 type="primary"
//                 onClick={() => {
//                   setSelectedCategory(null);
//                   setShowForm(true);
//                 }}
//                 className="m-2"
//               >
//                 Add New Item Category
//               </Button>
//               <Button
//                 type="default"
//                 onClick={handleClearFilters}
//                 className="m-2"
//               >
//                 Clear All Filters
//               </Button>
//             </div>
//           </div>
//           <Table
//             dataSource={filteredCategories}
//             columns={columns}
//             rowKey={(record) => record._id}
//             pagination={{ pageSize: 10 }}
//           />
//         </>
//       )}

//       <Modal
//         title={selectedCategory ? 'Edit Item Category' : 'Create New Item Category'}
//         visible={showForm}
//         footer={null}
//         onCancel={() => setShowForm(false)}
//         destroyOnClose
//       >
//         <ItemCategoryForm
//           itemCategory={selectedCategory}
//           onSave={selectedCategory ? handleUpdate : handleSave}
//           onCancel={() => setShowForm(false)}
//         />
//       </Modal>

//       <Modal
//         title="Confirm Deletion"
//         visible={showConfirm}
//         onOk={handleDelete}
//         onCancel={closeDeleteConfirm}
//         okText="Delete"
//         okButtonProps={{ danger: true }}
//       >
//         Are you sure you want to delete this item category?
//       </Modal>
//     </>
//   );
// }

// export default ItemCategories;









// "use client";

// import { useState, useEffect } from 'react';
// import { Button, Input, Select, Table, Modal, Typography, Pagination } from 'antd';
// import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
// import { toast } from 'react-toastify';
// import styles from './ItemCategories.module.css'; // Import CSS module for custom styles
// import ItemCategoryForm from './ItemCategoryForm';
// import Loading from '@/components/common/Loading';

// const { Search } = Input;
// const { Option } = Select;

// function ItemCategories() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [itemCategories, setItemCategories] = useState([]);
//   const [itemGroups, setItemGroups] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deleteCategoryId, setDeleteCategoryId] = useState(null);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterName, setFilterName] = useState('');
//   const [filterGroup, setFilterGroup] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

//   const fetchItemCategories = async () => {
//     try {
//       const res = await fetch('/api/item-categories');
//       const data = await res.json();
//       setItemCategories(data);
//     } catch (error) {
//       console.error("Error fetching:", error);
//       toast("Failed to fetch item categories");
//     }
//   };

//   const fetchItemGroups = async () => {
//     try {
//       const res = await fetch('/api/item-groups');
//       const data = await res.json();
//       setItemGroups(data.filter(group => group.active)); // Fetch only active groups
//     } catch (error) {
//       console.error("Error fetching:", error);
//       toast("Failed to fetch item groups");
//     }
//   };

//   useEffect(() => {
//     fetchItemCategories();
//     fetchItemGroups();
//     setIsLoading(false);
//   }, []);

//   const handleSave = () => {
//     toast.success('Item Category saved successfully!');
//     fetchItemCategories();
//     setSelectedCategory(null);
//     setFilterName('');
//     setShowForm(false);
//   };

//   const handleUpdate = () => {
//     toast.success('Item Category updated successfully!');
//     fetchItemCategories();
//     setSelectedCategory(null);
//     setFilterName('');
//     setShowForm(false);
//   };

//   const handleDelete = async () => {
//     try {
//       const res = await fetch(`/api/item-categories/${deleteCategoryId}`, { method: 'DELETE' });
//       if (res.ok) {
//         fetchItemCategories();
//         setShowConfirm(false);
//         setDeleteCategoryId(null);
//       }
//     } catch (error) {
//       console.error("Error deleting:", error);
//       toast("Failed to delete item category");
//     }
//   };

//   const openDeleteConfirm = (id) => {
//     setDeleteCategoryId(id);
//     setShowConfirm(true);
//   };

//   const closeDeleteConfirm = () => {
//     setShowConfirm(false);
//     setDeleteCategoryId(null);
//   };

//   const clearFilters = () => {
//     setFilterName('');
//     setFilterGroup('all');
//     setFilterStatus('all');
//   };

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
//       direction = 'ascending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedAndFilteredCategories = itemCategories
//     .filter(category => category.name.toLowerCase().includes(filterName.toLowerCase()))
//     .filter(category => filterGroup === 'all' ? true : category.groupId._id === filterGroup)
//     .filter(category => filterStatus === 'all' ? true : category.active === (filterStatus === 'active'))
//     .sort((a, b) => {
//       if (sortConfig.key === 'name') {
//         if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
//         if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
//         return 0;
//       } else if (sortConfig.key === 'groupId') {
//         if (a.groupId.name < b.groupId.name) return sortConfig.direction === 'ascending' ? -1 : 1;
//         if (a.groupId.name > b.groupId.name) return sortConfig.direction === 'ascending' ? 1 : -1;
//         return 0;
//       } else if (sortConfig.key === 'active') {
//         return sortConfig.direction === 'ascending' ? a.active - b.active : b.active - a.active;
//       }
//       return 0;
//     });

//   const paginatedCategories = sortedAndFilteredCategories.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   if (isLoading) {
//     return <Loading />;
//   }

//   const columns = [
//     {
//       title: (
//         <div style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
//           Item Category Name
//           {sortConfig.key === 'name' &&
//             (sortConfig.direction === 'ascending' ? (
//               <ArrowUpOutlined style={{ marginLeft: 8 }} />
//             ) : (
//               <ArrowDownOutlined style={{ marginLeft: 8 }} />
//             ))}
//         </div>
//       ),
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: (
//         <div style={{ cursor: 'pointer' }} onClick={() => requestSort('groupId')}>
//           Item Group Name
//           {sortConfig.key === 'groupId' &&
//             (sortConfig.direction === 'ascending' ? (
//               <ArrowUpOutlined style={{ marginLeft: 8 }} />
//             ) : (
//               <ArrowDownOutlined style={{ marginLeft: 8 }} />
//             ))}
//         </div>
//       ),
//       dataIndex: 'groupId',
//       key: 'groupId',
//       render: (groupId) => groupId.name,
//     },
//     {
//       title: (
//         <div style={{ cursor: 'pointer' }} onClick={() => requestSort('active')}>
//           Active Status
//           {sortConfig.key === 'active' &&
//             (sortConfig.direction === 'ascending' ? (
//               <ArrowUpOutlined style={{ marginLeft: 8 }} />
//             ) : (
//               <ArrowDownOutlined style={{ marginLeft: 8 }} />
//             ))}
//         </div>
//       ),
//       dataIndex: 'active',
//       key: 'active',
//       render: (active) => (active ? 'Active' : 'Inactive'),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       align: 'right',
//       render: (text, record) => (
//         <>
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             onClick={() => {
//               setSelectedCategory(record);
//               setShowForm(true);
//             }}
//           />
//           <Button type="link" icon={<DeleteOutlined />} onClick={() => openDeleteConfirm(record._id)} />
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className={styles.container}>
//       {showForm ? (
//         <div className={styles.formContainer}>
//           <ItemCategoryForm
//             itemCategory={selectedCategory}
//             onSave={selectedCategory ? handleUpdate : handleSave}
//             onCancel={() => setShowForm(false)}
//           />
//         </div>
//       ) : (
//         <div className={styles.listContainer}>
//           <div className={styles.filterContainer}>
//             <Search
//               placeholder="Search by Category Name"
//               allowClear
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//               style={{ width: 200 }}
//             />
//             <Select
//               placeholder="Filter by Item Group"
//               value={filterGroup}
//               onChange={(value) => setFilterGroup(value)}
//               allowClear
//               style={{ width: 200 }}
//             >
//               <Option value="all">All</Option>
//               {itemGroups.map((group) => (
//                 <Option key={group._id} value={group._id}>
//                   {group.name}
//                 </Option>
//               ))}
//             </Select>
//             <Select
//               placeholder="Filter by Active Status"
//               value={filterStatus}
//               onChange={(value) => setFilterStatus(value)}
//               allowClear
//               style={{ width: 200 }}
//             >
//               <Option value="all">All</Option>
//               <Option value="active">Active</Option>
//               <Option value="inactive">Inactive</Option>
//             </Select>
//             <Button type="link" onClick={clearFilters}>
//               Clear Filters
//             </Button>
//             <Button type="primary" onClick={() => setShowForm(true)}>
//               Add Item Category
//             </Button>
//           </div>
//           <Table
//             columns={columns}
//             dataSource={paginatedCategories}
//             pagination={false}
//             rowKey="_id"
//             bordered
//           />
//           <Pagination
//             current={currentPage}
//             pageSize={rowsPerPage}
//             total={sortedAndFilteredCategories.length}
//             showSizeChanger
//             pageSizeOptions={['5', '10', '25', '50', '100']}
//             onShowSizeChange={(current, size) => {
//               setRowsPerPage(size);
//               setCurrentPage(1); // Reset to first page
//             }}
//             onChange={(page) => setCurrentPage(page)}
//             showQuickJumper
//             showTotal={(total) => `Total ${total} items`}
//             itemRender={(current, type, originalElement) => {
//               if (type === 'prev') {
//                 return <a>Previous</a>;
//               }
//               if (type === 'next') {
//                 return <a>Next</a>;
//               }
//               if (type === 'first') {
//                 return <a>First</a>;
//               }
//               if (type === 'last') {
//                 return <a>Last</a>;
//               }
//               return originalElement;
//             }}
//           />
//           <Modal
//             title="Confirm Deletion"
//             visible={showConfirm}
//             onOk={handleDelete}
//             onCancel={closeDeleteConfirm}
//           >
//             <Typography.Paragraph>
//               Are you sure you want to delete this item category?
//             </Typography.Paragraph>
//           </Modal>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ItemCategories;









"use client";

import { useState, useEffect } from 'react';
import { Button, Input, Select, Table, Modal, Typography, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from './ItemCategories.module.css'; // Import CSS module for custom styles
import ItemCategoryForm from './ItemCategoryForm';
import Loading from '@/components/common/Loading';

const { Search } = Input;
const { Option } = Select;

function ItemCategories() {
  const [isLoading, setIsLoading] = useState(true);
  const [itemCategories, setItemCategories] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

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

  useEffect(() => {
    fetchItemCategories();
    fetchItemGroups();
    setIsLoading(false);
  }, []);

  const handleSave = () => {
    toast.success('Item Category saved successfully!');
    fetchItemCategories();
    setSelectedCategory(null);
    setFilterName('');
    setShowForm(false);
  };

  const handleUpdate = () => {
    toast.success('Item Category updated successfully!');
    fetchItemCategories();
    setSelectedCategory(null);
    setFilterName('');
    setShowForm(false);
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

  const openDeleteConfirm = (id) => {
    setDeleteCategoryId(id);
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

  if (isLoading) {
    return <Loading />;
  }

  const columns = [
    {
      title: (
        <div style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
          Item Category Name
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
          Item Group Name
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
              setSelectedCategory(record);
              setShowForm(true);
            }}
          />
          <Button type="link" icon={<DeleteOutlined />} onClick={() => openDeleteConfirm(record._id)} />
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {showForm ? (
        <div className={styles.formContainer}>
          <ItemCategoryForm
            itemCategory={selectedCategory}
            onSave={selectedCategory ? handleUpdate : handleSave}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div className={styles.listContainer}>
          <div className={styles.filterContainer}>
            <Search
              placeholder="Search by Category Name"
              allowClear
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Filter by Item Group"
              value={filterGroup}
              onChange={(value) => setFilterGroup(value)}
              allowClear
              style={{ width: 200 }}
            >
              <Option value="all">All</Option>
              {itemGroups.map((group) => (
                <Option key={group._id} value={group._id}>
                  {group.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Filter by Active Status"
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              allowClear
              style={{ width: 200 }}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
            <Button type="link" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button type="primary" onClick={() => setShowForm(true)}>
              Add Item Category
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

          <Modal
            title="Confirm Deletion"
            visible={showConfirm}
            onOk={handleDelete}
            onCancel={closeDeleteConfirm}
          >
            <Typography.Paragraph>
              Are you sure you want to delete this item category?
            </Typography.Paragraph>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default ItemCategories;
