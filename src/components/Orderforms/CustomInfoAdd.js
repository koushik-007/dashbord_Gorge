import { Button, Col } from 'antd';
import "./CustomInformation.css";


const CustomInfoAdd = ({customInformation, setSelectedInfo, setShowInfoModal }) => {
    
    return (
        <>
            <Col lg={12} xs={24}>
                <div className='container-box'>
                    <div className="box">
                        <div className='info-box'>
                            <div>
                                <h2>Information</h2>
                            </div>
                            <div>
                                <Button onClick={() => { setShowInfoModal(true); setSelectedInfo({ dataType: 'singleLine', fieldLabel: '', information: '' }) }} size='large' className='' >Add field</Button>
                            </div>
                        </div>
                        {
                            customInformation.length > 0 ? <div className="info-details">
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
                            </div>
                                :
                                <div className="no-info">
                                    <p>You don't have any order properties. You can add a new one with the button above.</p>
                                </div>
                        }

                    </div>
                </div>
            </Col>
            
        </>
    );
};

export default CustomInfoAdd;