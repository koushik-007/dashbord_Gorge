import React, { useContext, useState } from 'react';
import { Button, Form, Input, message, Typography } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import SocialNetwork from './SocialNetwork';
import { AuthContextProvider } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title } = Typography;
const SignIn = () => {
    const { login } = useContext(AuthContextProvider);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    let location = useLocation();

    let from = location.state?.from?.pathname || "/dashboard";
    const [loading, setLoading] = useState(false);
    function onFinish(values) {
        setLoading(true);
        login(values).then((res) => {
            if (res?.email) {
                setLoading(false);
                message.info(
                    {
                        content: <div>
                            Successfully Signin
                        </div>,
                        className: 'notify_saved_customer',           
                    }); 
                navigate(from, { replace: true });
            }
        }).catch((error) => {
            setLoading(false)
            message.error("please try with valid credentials");
        });
    }
    return (
        <>
        <Form
          name="signin"
          form={form}
          initialValues={{
            remember: false,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Title level={2} className="text-center">
            Sign in
          </Title>
          <SocialNetwork />
  
          <div className="option-text">or use your account</div>
  
          <Form.Item
            name="email"
            hasFeedback
            label="Email address"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please input your email.",
              },
              {
                type: "email",
                message: "Your email is invalid.",
              },
            ]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>
  
          <Form.Item
            name="password"
            hasFeedback
            label="Password"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please input your password.",
              },
              { min: 6, message: "Password must be minimum 6 characters." },
            ]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>
  
  
          <Button
             loading={loading}
            type="primary"
            htmlType="submit"
            shape="round"
            icon={<LoginOutlined />}
            size="large"
          >
            Sign In
          </Button>
        </Form>
      </>
    );
};

export default SignIn;