import React from 'react';

// This component will take mapData as a prop and render a table
const AttributeTable = ({ mapData }) => {
  // Convert the mapData object into an array of key-value pairs
  const dataEntries = Object.entries(mapData).map(([key, value]) => ({
    attribute: key,
    value: value,
  }));

  return (
    <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <tbody>
          {dataEntries.map((item, index) => (
            <tr
              key={index}
              className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
            >
              <th
                scope='row'
                className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize'
              >
                {item.attribute.replace(/([A-Z])/g, ' $1').trim()}{' '}
                {/* This regex adds space before capital letters */}
              </th>
              <td className='py-4 px-6'>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeTable;
