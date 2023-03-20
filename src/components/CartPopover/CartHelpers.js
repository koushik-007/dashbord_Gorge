import { Button, InputNumber, Skeleton } from "antd";
import { ImCross } from "react-icons/im";
import { ArrowRightOutlined,  PlusOutlined, MinusOutlined } from "@ant-design/icons";


export const Title = ({ set, rentalPeriod, showCross=true }) => {
    return <>
        <div className='cart_pop_title'>
        {showCross ? <Button onClick={() => set(false)} type='text' size='small' icon={<ImCross />} /> : null}
            <p>My order</p>
        </div>
        {
            rentalPeriod.length > 0 ?
            <div className='cart_date_time'>
            <p>{rentalPeriod[0]}</p>
            <p><ArrowRightOutlined /></p>
            <p>{rentalPeriod[1]}</p>
        </div>
        :
        <p style={{color: 'white', textAlign: 'center'}}>Select a rental period</p>
        }
    </>
}

export const Content = ({ data, handleProductCount, handleRemoveCart, rentalPeriod }) => {
    if (data?.isBundle) {
        const { bundleName, imageUrl, stock, productCount, price, dayCount } = data;
        return <div className="product_list_item">
        <Button onClick={() => handleRemoveCart(key)} type='text' size='small' icon={<ImCross />} />
        <div className="product_list_line">
            {
                imageUrl ?
                    <img src={imageUrl} alt='' />
                    :
                    <Skeleton.Image size={555} active={false} />
            }
            <div>
                <span>
                    <b>{bundleName}</b> &nbsp;
                </span>
                <br />
                <span>{rentalPeriod.length === 2 ? stock ? `${stock} available` : 0 : null}</span>
                <br /> 
                <InputNumber 
                defaultValue={productCount} 
                onChange={(value) => handleProductCount(key, value)}
                controls={{upIcon: <PlusOutlined/>, downIcon: <MinusOutlined/>}}
                />
            </div>
        </div>
        <div className="product_list_footer">
            <span>{price * productCount * dayCount}</span>
        </div>
    </div>
    }
    const { product_name, bundleName,  imageUrl, productCount, id, key, price, dayCount, stock, pickedUp, variationId,productId, taxProfile, isBundle, ...rest  } = data;
    const variants = Object.keys(rest);       
    return (
            <div className="product_list_item">
                <Button onClick={() => handleRemoveCart(key)} type='text' size='small' icon={<ImCross />} />
                <div className="product_list_line">
                    {
                        imageUrl ?
                            <img src={imageUrl} alt='' />
                            :
                            <Skeleton.Image size={555} active={false} />
                    }
                    <div>
                        <span>
                            <b>{product_name || bundleName}</b> - &nbsp;
                            {
                                variants.map((item, index) => (<span key={index}>
                                    {index > 0 ? <span> • </span> : null}
                                    {rest[item]}
                                </span>
                                ))
                            }
                        </span>
                        <br />
                        <span>{rentalPeriod.length === 2 ? stock ? `${stock} available` : 0 : null}</span>
                        <br /> 
                        <InputNumber 
                        defaultValue={productCount} 
                        onChange={(value) => handleProductCount(key, value)}
                        controls={{upIcon: <PlusOutlined/>, downIcon: <MinusOutlined/>}}
                        />
                    </div>
                </div>
                <div className="product_list_footer">
                    <span>{price * productCount * dayCount}</span>
                </div>
            </div>
    )
}