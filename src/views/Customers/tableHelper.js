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
        dataIndex: 'name',
        sorter: (a, b) => a.name.length - b.name.length
    },
    {
        title: 'E-mail',
        dataIndex: 'email',
        sorter: (a, b) => a.email.length - b.email.length
    }
];