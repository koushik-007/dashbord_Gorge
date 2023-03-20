import React, { useContext, useState } from 'react';
import { Button, Col, Form, Input, message, Row, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons'
import SocialNetwork from './SocialNetwork';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContextProvider } from '../../context/AuthContext';

const { Title } = Typography;
const SignUp = () => {
    const { signup } = useContext(AuthContextProvider);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    let location = useLocation();

    let from = location.state?.from?.pathname || "/";
    const [loading, setLoading] = useState(false);
    function onFinish(values) {
        setLoading(true);
        signup(values).then((res) => {
            if (res?.email) {
                setLoading(false);
                message.info(
                    {
                        content: <div>
                            Successfully Sign up
                        </div>,
                        className: 'notify_saved_customer',           
                    }); 
                navigate(from, { replace: true });
            }
        }).catch((error) => {
            setLoading(false)
            message.error("please try with another mail");
        });
    }
    return (
        <Form
            name="signup"
            initialValues={{}}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
        >
            <Title level={2} className="text-center">
                Create Account
            </Title>
            <SocialNetwork />
            <div className="option-text">or use your email for registration</div>
            <Form.Item
                name="email"
                label="Email address"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                hasFeedback
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

            <Row gutter={{ xs: 8, sm: 16 }}>
                <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item
                        name="password"
                        label="Password"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        hasFeedback
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
                </Col>

                <Col className="gutter-row" xs={{ span: 24 }} md={{ span: 12 }}>
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Confirm your password.",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "The two passwords that you entered do not match!"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm password" size="large" />
                    </Form.Item>
                </Col>
            </Row>
            <Button
                type="primary"
                loading={loading}
                className="form-submit-btn"
                htmlType="submit"
                shape="round"
                icon={<UserAddOutlined />}
                size="large"
            >
                Sign Up
            </Button>
        </Form>
    );
};

export default SignUp;