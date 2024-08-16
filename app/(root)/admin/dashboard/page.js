"use client";

import React, { useState } from "react";
import { Layout, List, Typography, Button, Col, Row, Card } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

const categoriesData = [
  { id: 1, name: "Starters" },
  { id: 2, name: "Main Course" },
  { id: 3, name: "Desserts" },
];

const itemsData = {
  1: [
    {
      id: 1,
      name: "AL-FAHAM NORMAL",
      image: "/images/spring_rolls.jpg",
      portions: {
        quarter: { price: 150, plu: "SR-Q1" },
        half: { price: 270, plu: "SR-H1" },
        full: { price: 530, plu: "SR-F1" },
      },
    },
    {
      id: 2,
      name: "AL-FAHAM ARABIAN",
      image: "/images/garlic_bread.jpg",
      portions: {
        quarter: { price: 4, plu: "GB-Q2" },
        half: { price: 6, plu: "GB-H2" },
        full: { price: 10, plu: "GB-F2" },
      },
    },
    {
      id: 3,
      name: "AL-FAHAM ARABIAN",
      image: "/images/garlic_bread.jpg",
      portions: {
        quarter: { price: 4, plu: "GB-Q2" },
        half: { price: 6, plu: "GB-H2" },
        full: { price: 10, plu: "GB-F2" },
      },
    },
  ],
  2: [
    {
      id: 4,
      name: "Grilled Chicken",
      image: "/images/grilled_chicken.jpg",
      portions: {
        quarter: { price: 7, plu: "GC-Q3" },
        half: { price: 12, plu: "GC-H3" },
        full: { price: 18, plu: "GC-F3" },
      },
    },
    {
      id: 5,
      name: "Veggie Pizza",
      image: "/images/veggie_pizza.jpg",
      portions: {
        quarter: { price: 6, plu: "VP-Q4" },
        half: { price: 10, plu: "VP-H4" },
        full: { price: 15, plu: "VP-F4" },
      },
    },
  ],
  3: [
    {
      id: 6,
      name: "Chocolate Cake",
      image: "/images/chocolate_cake.jpg",
      portions: {
        quarter: { price: 3, plu: "CC-Q5" },
        half: { price: 5, plu: "CC-H5" },
        full: { price: 7, plu: "CC-F5" },
      },
    },
    {
      id: 7,
      name: "Ice Cream",
      image: "/images/ice_cream.jpg",
      portions: {
        quarter: { price: 2, plu: "IC-Q6" },
        half: { price: 4, plu: "IC-H6" },
        full: { price: 6, plu: "IC-F6" },
      },
    },
  ],
};

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToInvoice = (item, portion) => {
    const existingItemIndex = invoiceItems.findIndex(
      (invoiceItem) =>
        invoiceItem.id === item.id && invoiceItem.portion === portion
    );

    if (existingItemIndex !== -1) {
      const newInvoiceItems = [...invoiceItems];
      newInvoiceItems[existingItemIndex].quantity += 1;
      setInvoiceItems(newInvoiceItems);
    } else {
      setInvoiceItems([
        ...invoiceItems,
        {
          ...item,
          portion,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveFromInvoice = (index) => {
    const newInvoiceItems = [...invoiceItems];
    newInvoiceItems.splice(index, 1);
    setInvoiceItems(newInvoiceItems);
  };

  const calculateTotalPrice = () => {
    return invoiceItems.reduce(
      (total, item) =>
        total + item.portions[item.portion].price * item.quantity,
      0
    );
  };

  return (
    <Layout style={{ minHeight: "90vh" }}>
      <Layout>
        <Content style={{ padding: "0px", display: "flex" }}>
          <Row gutter={16} style={{ width: "100%" }}>
            <Col xs={24} sm={6} md={4} lg={3}>
              <Title level={4}>Categories</Title>
              <List
                bordered
                dataSource={categoriesData}
                renderItem={(category) => (
                  <List.Item
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {category.name}
                  </List.Item>
                )}
              />
            </Col>

            <Col
              xs={24}
              sm={12}
              md={14}
              lg={15}
              style={{ height: "80vh", overflowY: "scroll" }}
            >
              <Title level={4}>Items</Title>
              <Row gutter={[8, 8]}>
                {selectedCategory &&
                  itemsData[selectedCategory]?.map((item) => (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        className="m-1"
                        style={{
                          height: "200px",
                          width: "240px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <Title level={5}>{item.name}</Title>
                        </div>
                        <Button.Group
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              gap: "4px",
                              width: "100%",
                            }}
                          >
                            <Button
                              key={`quarter-${item.id}`}
                              className="p-3"
                              size="large"
                              onClick={() =>
                                handleAddToInvoice(item, "quarter")
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Text>Q</Text>
                                <Text>{item.portions.quarter.price}</Text>
                              </div>
                            </Button>
                            <Button
                              key={`half-${item.id}`}
                              className="p-3"
                              size="large"
                              onClick={() => handleAddToInvoice(item, "half")}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Text>H</Text>
                                <Text>{item.portions.half.price}</Text>
                              </div>
                            </Button>
                            <Button
                              key={`full-${item.id}`}
                              className="p-3"
                              size="large"
                              onClick={() => handleAddToInvoice(item, "full")}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Text>F</Text>
                                <Text>{item.portions.full.price}</Text>
                              </div>
                            </Button>
                          </div>
                        </Button.Group>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Col>

            {/* Invoice List */}
            <Col xs={24} sm={6} md={6} lg={6}>
              <Title level={4}>Invoice</Title>
              <List
                bordered
                dataSource={invoiceItems}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id + '-' + item.portion} // Unique key based on item ID and portion
                    actions={[
                      <Button
                        key={`remove-${index}`} // Unique key for the remove button
                        onClick={() => handleRemoveFromInvoice(index)}
                        type="danger"
                      >
                        Remove
                      </Button>,
                    ]}
                  >
                    <Text>
                      {item.name} ({item.portion}) x {item.quantity} -{" "}
                      {item.portions[item.portion].price * item.quantity} (PLU:{" "}
                      {item.portions[item.portion].plu})
                    </Text>
                  </List.Item>
                )}
              />
              <div style={{ marginTop: "16px" }}>
                <Title level={5}>Total: Rs.{calculateTotalPrice()}</Title>
                <Button type="primary" block>
                  BILL
                </Button>
                <Button type="primary" block>
                  KOT
                </Button>
                <Button type="primary" block>
                  KOT - BILL
                </Button>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
