import React from 'react';
import './CustomInformation.css';

const CustomInformation = ({ customInformation,setSelectedInfo, setShowInfoModal }) => {
    return (
        <>
            <div className="infoTable">
                {
                    customInformation.map((info, index) => {
                        const { fieldLabel, information } = info;
                        return <div className="infoTableRow" key={index}>
                            <div className="infoTableCell">
                                <p onClick={() => { setShowInfoModal(true); setSelectedInfo(info) }}>
                                    <span>{fieldLabel}</span>
                                </p>
                            </div>
                            <div className="infoTableCell">
                                <p>
                                    {information}
                                    <br />
                                </p>
                            </div>
                        </div>
                    })
                }
            </div>
        </>
    );
};

export default CustomInformation;