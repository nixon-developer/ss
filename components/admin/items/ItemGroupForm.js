"use client";

import { useState, useEffect } from 'react';
import { Button, Input, Checkbox, Form, Typography } from 'antd';
import Loading from '@/components/common/Loading';


const { Text } = Typography;

function ItemGroupForm({ itemGroup, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsLoading(false); // Simulating data fetch completion
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true); // Disable form during submission
    const { name, active } = values;

    const data = { name, active };

    try {
      const res = await fetch(itemGroup ? `/api/item-groups/${itemGroup._id}` : '/api/item-groups', {
        method: itemGroup ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onSave();
        form.resetFields(); // Reset the form fields after successful save
      }
    } finally {
      setIsSubmitting(false); // Re-enable form after submission
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="form-group"
      disabled={isSubmitting} // Disable form fields when submitting
    >
      <Form.Item>
        <Text strong>
          {itemGroup ? 'Update Item Group' : 'Create New Item Group'}
        </Text>
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the group name!' }]}
      >
        <Input disabled={isSubmitting} />
      </Form.Item>
      <Form.Item
        name="active"
        valuePropName="checked"
      >
        <Checkbox disabled={isSubmitting}>Active</Checkbox>
      </Form.Item>
      <Form.Item>
        <div className="d-flex">
          <Button
            type="primary"
            htmlType="submit"
            className="w-100 m-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (itemGroup ? 'Updating...' : 'Saving...') : (itemGroup ? 'Update' : 'Save')}
          </Button>
          <Button
            type="default"
            className="w-100 m-2"
            onClick={() => {
              form.resetFields(); // Reset form fields when canceling
              onCancel();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

export default ItemGroupForm;
