import React from "react";
import { Checkbox } from "antd";
const CheckBoxCustom = ({handleCheckBox, checked}) => {
  return (
    <Checkbox name="enable_variations" onChange={handleCheckBox} checked={checked}>
      <div className="flex flex-col">
        <div className="w-full flex justify-start items-center">
          <label className="inline-block  font-semibold leading-3 text-xs cursor-pointer">
            Enable variations
          </label>
        </div>

        <div className="flex flex-col">
          <div className="description-accordion">
            This product has multiple options, like sizes or colors.
          </div>
        </div>
      </div>
    </Checkbox>
  );
};

export default CheckBoxCustom;
