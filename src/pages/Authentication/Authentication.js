import React, { useState } from 'react';
import { Button, Grid, message, Typography } from 'antd';
import { SelectOutlined } from "@ant-design/icons";
import './Authentication.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContextProvider } from '../../context/AuthContext';
const { useBreakpoint } = Grid;
const { Link } = Typography;

const Authentication = () => {
  const { logout, user } = useContext(AuthContextProvider);
  const screens = useBreakpoint();
  const [isPanelRightActive, setIsPanelRightActive] = useState(false);
  const switchMode = () => {
    setIsPanelRightActive(!isPanelRightActive);
  };
  const handleClickSignIn = () => {
    setIsPanelRightActive(false);
  };

  const handleClickSignUp = () => {
    setIsPanelRightActive(true);
  };
  const navigate = useNavigate();
  let location = useLocation();

  let from = location.state?.from?.pathname || "/dashboard";
  async function checkAdmin(email, text) {
    const adminEmails = [
      'test@test.com',
      'test@gmail.com'
    ];
    if (adminEmails.includes(email)) {
      message.info(
        {
          content: <div>{text}</div>,
          className: 'notify_saved_customer',
        });
      navigate(from, { replace: true });
    }
    else {
      await logout()
      message.error(
        {
          content: <div>Not Admin</div>,
          className: 'notify_saved_customer',
        });
      navigate('/shop', { replace: true })
    }
  }
  return (
    <div className="auth-page">
      {
        screens.sm ?
          <div className="auth-page-wrapper">
          
            <div
              className={`auth-container ${isPanelRightActive ? "right-panel-active" : ""
                }`}
            >
              <div className="form-container sign-up-container">
                <SignUp checkAdmin={checkAdmin} />
              </div>
              <div className="form-container sign-in-container">
                <SignIn checkAdmin={checkAdmin} />
              </div>

              <div className="overlay-container">
                <div className="overlay">
                  <div className="overlay-panel overlay-left bg-gradient">
                    <h1>Welcome!</h1>
                    <p>
                      If you already have an account with us let's sign in to
                      see something awesome!
                    </p>
                    <Button
                      shape="round"
                      onClick={handleClickSignIn}
                      icon={<SelectOutlined />}
                      size="large"
                    >
                      Use your exist account
                    </Button>
                  </div>
                  <div className="overlay-panel overlay-right bg-gradient">
                    <h1>Hello, Friend!</h1>
                    <p>
                      If you don't have an account, let's enter your personal
                      details and start journey with us
                    </p>
                    <Button
                      shape="round"
                      onClick={handleClickSignUp}
                      icon={<SelectOutlined />}
                      size="large"
                    >
                      Create new account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="mobile-auth-warpper">
            {!isPanelRightActive ? (
              <>
                <SignIn />
                <div className="text-center" onClick={switchMode}>
                  Don't have an account? <Link>Sign up now.</Link>
                </div>
              </>
            ) : (
              <>
                <SignUp />
                <div className="text-center" onClick={switchMode}>
                  Already have an account? <Link>Sign in now.</Link>
                </div>
              </>
            )}
          </div>
      }

    </div>
  );
};

export default Authentication;