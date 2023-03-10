import { Button, Input, Modal, Select } from 'antd';
import { ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Barcode from 'react-barcode';
import "./PropertyModal.css";

const { Option } = Select;

const PropertyModal = ({ modalType, addProperty, isModalVisible, handleOk, setIsModalVisible, setAddProperty, isDelete = false, handleDelete, handleDeleteVariation, barcodeNumber, loading, isDeleteLoading }) => {

    if (modalType === "Delete variation") {
        return <Modal
            destroyOnClose={true}
            title={modalType}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
                <Button
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    onClick={() => { setIsModalVisible(false); setAddProperty('') }}>
                    Cancel
                </Button>,
                <Button
                    loading={isDeleteLoading}
                    onClick={() => handleDeleteVariation(addProperty)}
                    size='large'
                    danger
                    className='propertyBtn'
                    key="back"
                    type='primary'>
                    Delete variation
                </Button>
            ]}
        >
            <div className="deleteVariation">
                <ExclamationCircleOutlined />
                <div>
                    <h4>Are you sure you want to delete this product variation?</h4>
                    <div>This cannot be undone</div>
                </div>
            </div>
        </Modal>
    }
    if (modalType === "Edit Variation") {
        return <Modal destroyOnClose={true} title={modalType} open={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}
            footer={[
                <Button
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    type='primary'
                    onClick={() => setIsModalVisible(false)}>
                    Ok
                </Button>,
            ]}
        >        <div className="notUnique">
                <div>
                    <CloseCircleOutlined />
                </div>
                <div>
                    <h4>Can't edit variation</h4>
                    <p>Values are not unique</p>
                </div>
            </div>
        </Modal>
    }
    if (modalType === "Add barcode") {
        return <Modal
            destroyOnClose={true}
            footer={[
                <Button
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    onClick={() => { setIsModalVisible(false); setAddProperty('') }}>
                    Cancel
                </Button>,
                <Button
                    className='propertyBtn'
                    size='large'
                    key="submit"
                    type="primary"
                    onClick={handleOk}
                >
                    Save
                </Button>,
            ]}
            title={modalType} open={isModalVisible} onCancel={() => { setIsModalVisible(false); setAddProperty('') }}>
            <p>
                <strong>Barcode type</strong>
            </p>
            <Select defaultValue="Ean 13" size='large' style={{ width: "100%", marginBottom: '1rem' }} >
                <Option value="ean8">Ean 8</Option>
                <Option value="ean13">Ean 13</Option>
            </Select>
            <p>
                <strong>Barcode number</strong>
            </p>
            <Input onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    handleOk();
                }
            }} size='large' placeholder="Leave blank to let Booqable create a barcode" value={barcodeNumber} />
            {
                barcodeNumber && <Barcode value={barcodeNumber} />
            }
        </Modal>
    }
    return (
        <Modal
            destroyOnClose={true}
            footer={[
                isDelete && <Button
                    disabled={loading}
                    loading={isDeleteLoading}
                    onClick={() => handleDelete()}
                    size='large'
                    danger
                    className='propertyBtn'
                    key="back"
                    type='primary'>
                    Delete property
                </Button>,
                <Button
                    disabled={loading || isDeleteLoading}
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    onClick={() => { setIsModalVisible(false); setAddProperty('') }}>
                    Cancel
                </Button>,
                <Button
                    loading={loading}
                    className='propertyBtn'
                    size='large'
                    key="submit"
                    type="primary"
                    disabled={addProperty.length < 1 || isDeleteLoading}
                    onClick={handleOk}
                >
                    Save
                </Button>,
            ]}
            title={modalType} open={isModalVisible} onCancel={() => { setIsModalVisible(false); setAddProperty('') }}>
            <p>
                <strong>Property name</strong>
            </p>
            <Input onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    handleOk();
                }
            }} size='large' placeholder="E.g. color,size" value={addProperty} onChange={(e) => setAddProperty(e.target.value)} />
            <p>Give this property a name, like size, color, or weight</p>
        </Modal>
    );
};

export default PropertyModal;