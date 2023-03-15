import React, { useState } from "react";

// Liberties
import { Upload, Button, Layout } from "antd";

// Components
import { UploadButton, UploadedImg } from "../../../components/UploadCustom/UploadCustom";
import Header from "../../../components/Header"
//Assets
import "./addProduct.css";
import "./responsive.css";
import { collection } from "firebase/firestore";
import { addDocumentData, db, storage } from "../../../Firebasefunctions/db";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const AddNewBundles = () => {
  let navigate = useNavigate();
  const [bundleName, setBundleName] = useState("");
  const [img, setImg] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = ({ fileList }) => {
    setImageUpload(fileList[0].originFileObj);
    const imageUrl = URL.createObjectURL(fileList[0].originFileObj);
    setImg(imageUrl);
    URL.revokeObjectURL(fileList[0].originFileObj)
  };

  const bundlesCollectionsRef = collection(db, "bundles_collections");
  const onSubmit =async () => {
    setLoading(true)
    const imageRef = ref(storage, `images/${imageUpload.name}`);
    const getSnapshot = await uploadBytes(imageRef, imageUpload);
    const url =  await getDownloadURL(getSnapshot.ref);

    const res = await addDocumentData(bundlesCollectionsRef, {
      bundleName,
      imageUrl: url,
      imageName: imageUpload.name,
      discountable: true,
      taxProfile: 'noTaxProfile',
      stock: 0, 
      pickedUp: 0,
      price: 0,
      fixedPrice: false
    });
    navigate('/bundles/details/'+res.id + '/content');
    setLoading(false)
  };

  return (
    <>
    <Header>
        <h1>New Bundles</h1>
    </Header>
    <Content className='main_content'>
    <div className="add-product-main">
      <div className="add-product-layout">
        
        <div className="add-product-container">
          <div className="parent-add-product">
            <section className="section-1">
              <div className=" gen-bundle">
                <div className="add-product-title-container">
                  <h3>General information</h3>
                  <div className="add-product-container-description">
                    This will be used to help your team and your customers
                    identify this bundle.
                  </div>
                </div>
              </div>
              <div className="add-product-title-container ">
                <div className="img-content">
                  <div className=" title-box-img ">
                    <label className="add-product-label">Bundle name</label>
                    <input
                      className="add-product-input"
                      type="text"
                      autoComplete="off"
                      placeholder="Bundles name"
                      name="bundleName"
                      onChange={(e) => {
                        setBundleName(e.target.value);
                      }}
                      value={bundleName}
                    />
                  </div>
                  <div className="img-parent">
                    {
                    img.length === 0 ? 
                      <Upload
                        onChange={handleUpload}
                        beforeUpload={() => false}
                        className="upload"
                        style={{
                          width: "100%",
                        }}
                      >
                        <UploadButton />
                      </Upload>
                      :
                      <UploadedImg srcImg={img} onDelete={()=> {setImg(''); setImageUpload(null)}} />
                    }
                  </div>
                </div>
              </div>
            </section>
            <hr />
            {/*  // -------------End Of 1st Section  ------------  */}
            <div className="parent-add-product">
              <section className="button-section">
                <div className="w-75"></div>
                <div className="button-box">
                  <div className="button-box-child">
                    <Button className="button-1 ">Cancel</Button>
                    <Button
                      loading={loading}
                      type="primary"
                      className={
                        bundleName && imageUpload
                          ? "button-1 button-save "
                          : "button-1 button-save disable"
                      }
                      onClick={onSubmit}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Content>
    </>
  );
};

export default AddNewBundles;