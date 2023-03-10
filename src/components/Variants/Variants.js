import React from 'react';

const Variants = ({ data, dot = false }) => {
    const variant = Object.keys(data);
    return variant.length > 0 ?
        variant.map((item, index) => (<span key={index}>
            {index > 0 ? dot ? ' • ' : `, ` : null} {data[item]}
        </span>
        ))
        :
        <></>
};

export default Variants;