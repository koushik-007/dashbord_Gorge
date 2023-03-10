import { Form, Input, InputNumber, Skeleton } from "antd";

export const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber prefix="$"/> : <Input/>;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{margin: 0}}
            rules={[{ required: true, message: `Please Input ${title}!`} ]}
          >
            { inputNode }
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  export const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image) => (
        image ?
        <span><img src={image} alt="" width="55px" /></span>
        :
        <Skeleton.Image active={false} />
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => (
        <span> $ {price}</span>
      )
    },
  ];

