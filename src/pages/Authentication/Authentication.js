import React, { useState } from 'react';
import { Button, Grid, Typography } from 'antd';
import { SelectOutlined } from "@ant-design/icons";
import './Authentication.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
const { useBreakpoint } = Grid;
const { Link } = Typography;

const Authentication = () => {
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
  return (
    <div className="auth-page">
          {
            screens.sm ?
            <div className="auth-page-wrapper">              
            <div
              className={`auth-container ${
                isPanelRightActive ? "right-panel-active" : ""
              }`}
            >
              <div className="form-container sign-up-container">
                <SignUp />
              </div>
              <div className="form-container sign-in-container">
                <SignIn />
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