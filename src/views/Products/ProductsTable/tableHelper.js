export  const items = [
    {
      title: 'Edit products',
    },
    {
      title: 'Edit tags'
    },
    {
      title: 'Edit categories'
    },
    {
      title: 'Generate barcodes'
    }
  ];
export const columns = [
    {
      title: 'Name',
      dataIndex: 'product_name',
      sorter: (a, b) => a - b
    },
    {
      title: 'Product type',
      dataIndex: 'tracking_method',
      sorter: (a, b) => a - b
    },
    {
      title: 'Online store',
      dataIndex: 'onlineStore',
    },
    {
      title: 'Stock Keeping Unit(SKU)',
      dataIndex: 'sku',
      sorter: (a, b) => a.sku - b.sku
    },
  ];