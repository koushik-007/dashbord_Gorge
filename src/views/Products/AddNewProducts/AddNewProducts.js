import React, { useState } from "react";

// Liberties
import { Upload, Button, Collapse, Radio, Space, Input, Select, Layout } from "antd";

// Components
import { DollarOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadButton, UploadedImg } from "../../../components/UploadCustom/UploadCustom";
import Header from '../../../components/Header'

//Assets
import "./addProduct.css";
import "./responsive.css";
import RadioCustom from "./RadioCustom";
import CheckBoxCustom from "./CheckBoxCustom";
import AccordionHeaderCustom from "./AccordionHeader";
import { IconActive, IconDeactivate } from "./RadioIcon";
import { addDocumentData, db, storage } from "../../../Firebasefunctions/db";
import { collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

//variables
const Panel = Collapse.Panel;
const Option = Select.Option;
const { Content } = Layout;
// Data
const dataOfTrackingMethod = {
  1: "Rental product",
  2: "Consumable",
  3: "Service",
};
const pricingMethod = {
  1: "Price per",
  2: "Other / No pricing",
}
const AddNewProduct = () => {
  let navigate = useNavigate()

  const [data, setData] = useState({
    tracking_method: "",
    product_name: "",
    price: "",
    price_per: "Hour",
    img: "",
    imageUrl: "",
    enable_variations: false,
    tracking_method_selected_option: "",
  });
  const [loading, setLoading] = useState(false);


  const handleInputChange = ({ target }) => {
    setData((curr) => ({ ...curr, [target.name]: target.name === 'enable_variations' ? target.checked : target.value }));
  };

  const handleCollapseChange = (key) => {
    setData((curr) => ({ ...curr, tracking_method: dataOfTrackingMethod[key] }));
  };

  const handlePricingMethod = (key) => {
    setData((curr) => ({ ...curr, pricing_method: pricingMethod[key] }));
  };

  const handleRadioChange = (info) => {
    setData((curr) => ({ ...curr, tracking_method_selected_option: info.target.value }));
  };

  const handlePricePer = (value) => {
    setData((curr) => ({ ...curr, price_per: value }));
  };


  const [imageUpload, setImageUpload] = useState(null);

  const handleFile = ({ fileList }) => {
    setImageUpload(fileList[0].originFileObj);
    const imageUrl = URL.createObjectURL(fileList[0].originFileObj);
    URL.revokeObjectURL(fileList[0].originFileObj)
    setData((curr) => ({ ...curr, img: imageUrl }));
  };


  const uploadFile = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name}`);   
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(snapshot.ref);
    return {imageUrl: url, imageName: imageUpload.name}
  };

  const productCollectionsRef = collection(db, "product_collections");
  const onSubmit = async () => {
    setLoading(true)
    const uploads = await uploadFile();
    const res = await addDocumentData(productCollectionsRef, { ...data, ...uploads, discountable: true, pricing_method : 'Flat fee', sku: data.product_name.toUpperCase() });
    const variationCollection = collection(db, "product_collections", res.id, 'variations');
    const pickedUp = data.tracking_method === "Rental product" ? 0 : null
    await addDocumentData(variationCollection, { price: parseFloat(data.price), stock: 0, pickedUp, product_name: data.product_name })
    navigate('/products/details/' + res.id + '/inventory');
    setLoading(false)
  };

  return (
    <>
      <Header>
        <h1>New Product</h1>
      </Header>
      <Content className='main_content'>
        <div className="add-product-container">
          <div className="parent-add-product">
            <section className="section-1">
              <div className="gen-info">
                <div className="add-product-title-container">
                  <h3>General information</h3>
                  <div className="add-product-container-description">
                    This information helps you and your customers identify the
                    product on orders, documents and in the online store.
                  </div>
                </div>
              </div>
              <div className="add-product-title-container ">
                <div className="img-content">
                  <div className=" title-box-img ">
                    <label className="add-product-label">Product name</label>
                    <input
                      className="add-product-input"
                      type="text"
                      autoComplete="off"
                      placeholder="eg: iPad"
                      value={data.product_name}
                      onChange={handleInputChange}
                      name="product_name"
                    />
                  </div>
                  <div className="img-parent">
                    {data.img.length === 0 ?
                      <Upload
                        onChange={handleFile}
                        className="upload"
                        style={{
                          width: "100%",
                        }}
                      >
                        <UploadButton />
                      </Upload>
                      :
                      <UploadedImg srcImg={data.img} onDelete={() => { setData((curr) => ({ ...curr, img: '' })); setImageUpload(null) }} />
                    }
                  </div>
                </div>
              </div>
            </section>
            <hr />
            {/*  // -------------End Of 1st Section  ------------  */}
            <section className="section-1">
              <div className="w-25 gen-info">
                <div className="add-product-title-container">
                  <h3>Tracking method</h3>
                  <div className="add-product-container-description">
                    <p>
                      The
                      <Button
                        className=""
                        type="link"
                      >
                        tracking method <UploadOutlined />
                      </Button>

                      determines if (and how detailed) a product's inventory is
                      tracked.
                    </p>
                    <p>You can not change this later.</p>
                  </div>
                </div>
              </div>
              <div className="add-product-title-container w-full ">
                <Collapse
                  className="collapse"
                  accordion
                  bordered={false}
                  expandIcon={({ isActive }) =>
                    isActive ? <IconActive /> : <IconDeactivate />
                  }
                  onChange={handleCollapseChange}
                >
                  <Panel
                    header={
                      <AccordionHeaderCustom
                        title="Rental product"
                        description="Products you rent out. They are expected to be returned at the end of a rental period."
                      />
                    }
                    key="1"
                  >
                    <div className="collapse-body">
                      <div className="accordion-box-content">
                        <Radio.Group onChange={handleRadioChange}>
                          <Space direction="vertical">
                            <Radio
                              value={"Track in bulk"}
                              className="flex justify-start items-center"
                            >
                              <RadioCustom
                                title="Track in bulk"
                                description=" Only track quantities to easily
                                            handle a large number of items."
                              />
                            </Radio>
                            <Radio
                              value={"Track individual items"}
                              className="flex justify-start items-center"
                            >
                              <RadioCustom
                                title="Track individual items"
                                description="Keep track of individual items using identifiers (like serial numbers)."
                              />
                            </Radio>
                            <hr />
                            <CheckBoxCustom
                              checked={data.enable_variations}
                              handleCheckBox={handleInputChange}
                              checkedValue={data.enable_validation}
                            />
                          </Space>
                        </Radio.Group>
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      <AccordionHeaderCustom
                        title="Consumable"
                        description="Items you sell or give away. They are not returned at the end of a rental period."
                      />
                    }
                    key="2"
                  >
                    <div className="collapse-body">
                      <div className="accordion-box-content">
                        <Radio.Group onChange={handleRadioChange}>
                          <Space direction="vertical">
                            <Radio
                              value={"Not tracked"}
                              className="flex justify-start items-center"
                            >
                              <RadioCustom
                                title={"Not tracked"}
                                description="Don't track quantities for this product."
                              />
                            </Radio>
                            <Radio
                              value={"Track in bulk"}
                              className="flex justify-start items-center"
                            >
                              <RadioCustom
                                title={"Track in bulk"}
                                description="Track quantities for this product."
                              />
                            </Radio>
                            <hr />
                            <CheckBoxCustom
                              checked={data.enable_variations}
                              handleCheckBox={handleInputChange}
                              checkedValue={data.enable_validation}
                            />
                          </Space>
                        </Radio.Group>
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      <AccordionHeaderCustom
                        title="Service"
                        description=" Non-physical services you offer with rentals
                        (like setup costs)."
                      />
                    }
                    key="3"
                  >
                    <div className="collapse-body">
                      <div className="accordion-box-content">
                        Inventory is not tracked for services
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </section>
            <hr />
            {/*  // -------------End Of 2st Section  ------------  */}
            <section className="section-1">
              <div className="w-25 gen-info">
                <div className="add-product-title-container">
                  <h3>Pricing</h3>
                  <div className="add-product-container-description">
                    <p>
                      Determines how the price will be calculated for a rental
                      period.
                    </p>
                    <p>
                      You can configure more/different settings for the price
                      after the product has been created.
                    </p>
                  </div>
                </div>
              </div>
              <div className="add-product-title-container w-full ">
                <Collapse
                  className="collapse"
                  defaultActiveKey={["1"]}
                  accordion
                  bordered={false}
                  expandIcon={({ isActive }) =>
                    isActive ? <IconActive /> : <IconDeactivate />
                  }
                  onChange={handlePricingMethod}
                >
                  <Panel
                    header={
                      <AccordionHeaderCustom
                        title="Price per..."
                        description="Flat rate per period (e.g. $50 per day)"
                      />
                    }
                    key="1"
                  >
                    <div className="collapse-body">
                      <div className="accordion-box-content">
                        <div className="price-box">
                          <div className="price-picker">
                            <label className=" text-sm">Price</label>
                            <Input
                              placeholder="50"
                              prefix={<DollarOutlined />}
                              size="large"
                              onChange={handleInputChange}
                              name="price"
                              required
                            />
                          </div>
                          <div className="data-picker">
                            <label className="text-sm ">Per</label>
                            <Select
                              defaultValue="Hour"
                              style={{ width: "100%" }}
                              size="large"
                              onChange={handlePricePer}
                              name="price_per"
                            >
                              <Option value="Hour">Hour</Option>
                              <Option value="Day">Day</Option>
                              <Option value="Week">Week</Option>
                              <Option value="Month">Month</Option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    header={
                      <AccordionHeaderCustom
                        title="Other / no pricing"
                        description="Fixed fee, pricing structure, or no price at all
                        "
                      />
                    }
                    key="2"
                  >
                    <div className="collapse-body ">
                      You can setup other pricing methods after the product is
                      created
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </section>
          </div>
          <hr />
          <div className="parent-add-product">
            <section className="button-section">
              <div className="w-75"></div>
              <div className="button-box">
                <div className="button-box-child">
                  <Button className="button-1 ">Cancel</Button>
                  <Button
                    type="primary"
                    className={
                      data.product_name && data.tracking_method && data.price
                        ? "button-1 button-save "
                        : "button-1 button-save disable"
                    }
                    loading={loading}
                    onClick={onSubmit}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Content>
    </>
  );
};

export default AddNewProduct;
