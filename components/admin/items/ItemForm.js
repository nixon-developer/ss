"use client";

import { useState, useEffect } from 'react';
import { Button, Input, Form, Typography, Select as AntSelect } from 'antd';
import Loading from '@/components/common/Loading';

const { Text } = Typography;
const { Option } = AntSelect;

function ItemForm({ item, categories, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [unit, setUnit] = useState('pcs');

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        description: item.description,
        unit: item.unit,
        category: item.category,
        basePrice: item.basePrice.price,
        quarterPrice: item.quarterPrice.price,
        halfPrice: item.halfPrice.price,
        fullPrice: item.fullPrice.price,
      });
      setUnit(item.unit);
      setSelectedCategory(item.category);
      setIsLoading(false);
    } else {
      form.resetFields();
      setUnit('pcs');
      setSelectedCategory(null);
      setIsLoading(false);
    }
  }, [item, form]);

  const fetchLastPLU = async (priceCategory) => {
    const res = await fetch(`/api/items/last-${priceCategory}-plu`);
    if (res.ok) {
      const { lastPLU } = await res.json();
      return lastPLU + 1;
    }
    return 1;
  };
  
  const handleSubmit = async (values) => {
    const { basePrice, quarterPrice, halfPrice, fullPrice } = values;

    const isBasePriceSet = basePrice !== 0;
    const isQuarterPriceSet = quarterPrice !== 0;
    const isHalfPriceSet = halfPrice !== 0;
    const isFullPriceSet = fullPrice !== 0;

    const basePLU = isBasePriceSet ? await fetchLastPLU('base') : "";
    const quarterPLU = isQuarterPriceSet ? `${basePLU}-1` : "";
    const halfPLU = isHalfPriceSet ? `${basePLU}-2` : "";
    const fullPLU = isFullPriceSet ? `${basePLU}-3` : "";

    const data = {
      ...values,
      category: selectedCategory,
      basePrice: {
        price: isBasePriceSet ? basePrice : 0,
        plu: basePLU,
      },
      quarterPrice: {
        price: isQuarterPriceSet ? quarterPrice : 0,
        plu: quarterPLU,
      },
      halfPrice: {
        price: isHalfPriceSet ? halfPrice : 0,
        plu: halfPLU,
      },
      fullPrice: {
        price: isFullPriceSet ? fullPrice : 0,
        plu: fullPLU,
      },
    };

    const res = await fetch(item ? `/api/items/${item._id}` : '/api/items', {
      method: item ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      onSave();
      form.resetFields();
      setSelectedCategory(null);
    }
  };

  const handleSelectChange = (value) => {
    setSelectedCategory(value);
  };

  const handleUnitChange = (value) => {
    setUnit(value);
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
    >
      <Form.Item>
        <Text strong>
          {item ? 'Update Item' : 'Create New Item'}
        </Text>
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
      >
        <AntSelect
          value={selectedCategory}
          onChange={handleSelectChange}
          placeholder="Select Category"
        >
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </AntSelect>
      </Form.Item>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the item name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input />
      </Form.Item>
      <Form.Item
        name="unit"
        label="Unit"
        rules={[{ required: true, message: 'Please select a unit!' }]}
      >
        <AntSelect placeholder="Select Unit" onChange={handleUnitChange}>
          <Option value="pcs">pcs</Option>
          <Option value="kgs">kgs</Option>
          <Option value="size">size</Option>
          <Option value="nos">nos</Option>
        </AntSelect>
      </Form.Item>
      {unit !== 'size' && (
        <Form.Item
          name="basePrice"
          label="Base Price"
        >
          <Input type="number" />
        </Form.Item>
      )}
      {/* {(unit === 'pcs' || unit === 'kgs' || unit === 'nos') && (
        <>
          <Form.Item name="quarterPrice" label="Quarter Price">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="halfPrice" label="Half Price">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="fullPrice" label="Full Price">
            <Input type="number" />
          </Form.Item>
        </>
      )} */}
      {unit === 'size' && (
        <>
          <Form.Item
            name="quarterPrice"
            label="Quarter Price"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="halfPrice"
            label="Half Price"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="fullPrice"
            label="Full Price"
          >
            <Input type="number" />
          </Form.Item>
        </>
      )}
      <Form.Item>
        <div className="d-flex">
          <Button type="primary" htmlType="submit" className="w-100 m-2">
            {item ? 'Update' : 'Save'}
          </Button>
          <Button
            type="default"
            className="w-100 m-2"
            onClick={() => {
              form.resetFields();
              setSelectedCategory(null);
              onCancel();
            }}
          >
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

export default ItemForm;
