import React, { memo, useContext } from 'react';
import { Button, message, Tooltip } from 'antd';
import { FcGoogle } from "react-icons/fc";
import { AuthContextProvider } from '../../context/AuthContext';
const SocialNetwork = ({checkAdmin}) => {
    const { handleSigninWithGmail, handleSignInWithApple } = useContext(AuthContextProvider);
    
    async function signinWithGmail() {
        handleSigninWithGmail().then((res) => {
            if (res?.email) {
                checkAdmin(res?.email, "Successfully Signin")                               
            }
        }).catch((error) => {
            message.error("please try with another mail");
        });
    }
    // async function signinWithApple() {
    //     handleSignInWithApple().then((res) => {
    //         if (res?.email) {
    //             message.info(
    //                 {
    //                     content: <div>
    //                         Successfully Signin
    //                     </div>,
    //                     className: 'notify_saved_customer',           
    //                 }); 
    //             navigate(from, { replace: true });
    //         }
    //     }).catch((error) => {
    //         message.error("please try with another mail");
    //     });
    // }
    return (
        <div className="social-container">
            <Tooltip
                title="Signin with Google"
                placement="bottom"
                color="#ab951b"
                key="#db4a39"
            >
                <Button onClick={signinWithGmail} className="social google">
                    <FcGoogle />
                </Button>
            </Tooltip>

            {/* <Tooltip
                title="Signin with Apple"
                placement="bottom"
                color="#7c8081"
                key="#7c8081"
            >
                <div className="social Apple">
                    <AppleFilled />
                </div>
            </Tooltip> */}
        </div>
    );
};

export default memo(SocialNetwork);