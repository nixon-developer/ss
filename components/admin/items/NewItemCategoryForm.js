"use client";

import { useState, useEffect } from 'react';
import { Button, Input, Checkbox, Form, Select } from 'antd';
import Loading from '@/components/common/Loading';

const { Option } = Select;

function NewItemCategoryForm({ onSave, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [itemGroups, setItemGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItemGroups = async () => {
      const res = await fetch('/api/item-groups');
      const data = await res.json();
      setItemGroups(data.filter(group => group.active)); // Filter only active groups
      setIsLoading(false);
    };
    fetchItemGroups();
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const { name, active, groupId } = values;
    const data = { name, active, groupId };

    try {
      const res = await fetch('/api/item-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        onSave();
      }
      form.resetFields(); // Reset form after save
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Clear form fields when cancel is clicked
    onCancel();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      disabled={isSubmitting}
      initialValues={{ active: true }}
    >
      <hr />
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the category name' }]}
      >
        <Input disabled={isSubmitting} />
      </Form.Item>
      <Form.Item
        name="groupId"
        label="Group"
        rules={[{ required: true, message: 'Please select the group' }]}
      >
        <Select disabled={isSubmitting}>
          {itemGroups.map(group => (
            <Option key={group._id} value={group._id}>{group.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="active"
        valuePropName="checked"
      >
        <Checkbox disabled={isSubmitting}>Active</Checkbox>
      </Form.Item>
      <Form.Item>
        <div className="d-flex">
          <Button type="primary" htmlType="submit" className="w-100 m-2" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button
            type="default"
            className="w-100 m-2"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

export default NewItemCategoryForm;
