'use client';

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { Button, Input, Checkbox, Form, Select } from 'antd';
import Image from "next/image";
import { useState, useEffect } from 'react';
import Link from "next/link";
import styles from './auth.module.css';
import Loading from '../Loading';

const { Option } = Select;

function AuthForm({ type }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Session is still loading

    if (status === 'authenticated') {
      // If the user is authenticated, redirect based on role
      const role = session?.user?.role;
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
    setIsLoading(false); // Set loading to false once session is determined
  }, [status, session, router]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (type === "register") {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          toast.success('Registration successful!');
          // Attempt login immediately after successful registration
          const loginRes = await signIn("credentials", {
            ...data,
            redirect: false,
          });

          if (loginRes.ok) {
            const userRole = loginRes?.user?.role;
            if (userRole === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          } else {
            toast.error("Login failed after registration");
          }
        } else {
          const result = await res.json();
          switch (res.status) {
            case 400:
              toast.error('Invalid input: ' + (result.message || 'Please check your details.'));
              break;
            case 409:
              toast.error('Username already exists.');
              break;
            default:
              toast.error(result.message || 'Registration failed');
          }
        }
      }

      if (type === "login") {
        const res = await signIn("credentials", {
          ...data,
          redirect: false,
        });

        if (res.ok) {
          // Check the role and redirect accordingly
          const userRole = res?.user?.role;
          if (userRole === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        } else {
          toast.error("Invalid username or password");
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className="row">
        <div className="col-6">
          <div className={styles.imageContainer}>
            <Image
              src="/assets/logo/rblogo.png"
              alt="Logo"
              width={350}
              height={60}
              priority
            />
          </div>
        </div>

        <div className="col-6">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="form-group"
            disabled={isSubmitting}
          >
            <Form.Item>
              {type === "register" ? <h2 className="text-center">User Registration</h2> : <h2 className="text-center">User Login</h2>}
            </Form.Item>

            {type === "register" && (
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter the Full Name!" }]}
              >
                <Input disabled={isSubmitting} />
              </Form.Item>
            )}

            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter the Username!" }]}
            >
              <Input disabled={isSubmitting} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter the Password!" }]}
            >
              <Input.Password disabled={isSubmitting} />
            </Form.Item>

            {type === "register" && (
              <Form.Item
                name="userRole"
                label="User Role"
                rules={[{ required: true, message: "Please select the User Role!" }]}
              >
                <Select disabled={isSubmitting}>
                  <Option value="developer">Developer</Option>
                  <Option value="owner">Owner</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="accountant">Accountant</Option>
                  <Option value="cashier">Cashier</Option>
                  <Option value="delivery">Delivery</Option>
                  <Option value="kot">KOT</Option>
                </Select>
              </Form.Item>
            )}

            {type === "register" && (
              <Form.Item name="active" valuePropName="checked">
                <Checkbox disabled={isSubmitting}>Active</Checkbox>
              </Form.Item>
            )}

            <Form.Item>
              <div className="d-flex">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-100 m-2"
                  disabled={isSubmitting}
                >
                  {type === "register" ? "Register" : "Login"}
                </Button>

                {type === "register" && (
                  <Button
                    type="default"
                    className="w-100 m-2"
                    onClick={() => {
                      form.resetFields(); // Reset form fields when canceling
                    }}
                    disabled={isSubmitting}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </Form.Item>
            <Form.Item>
              <div className="d-flex justify-content-center">
                <hr />
                <hr />
                {type === "register" ? (
                  <Link href="/">
                    <p className="text-center">Already have an account? Login Here</p>
                  </Link>
                ) : (
                  <Link href="/register">
                    <p className="text-center">Don&apos;t have an account? Register Here</p>
                  </Link>
                )}
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
