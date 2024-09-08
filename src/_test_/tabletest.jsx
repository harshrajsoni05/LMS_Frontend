// Table.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Table from '../components/table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const columns = [
  { header: 'Status', accessor: 'status' },
  { header: 'Issuance Type', accessor: 'issuance_type' },
  { header: 'Serial No', accessor: 'serialNo' }
];

const data = [
  { status: 'Returned', issuance_type: 'In House' },
  { status: 'Pending', issuance_type: 'Library' },
  { status: 'Returned', issuance_type: 'Library' }
];

describe('Table', () => {
  test('renders table with columns and data', () => {
    render(<Table data={data} columns={columns} currentPage={0} pageSize={10} />);

    // Check if headers are rendered
    columns.forEach((column) => {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    });

    // Check if data rows are rendered
    data.forEach((row, index) => {
      expect(screen.getByText(index + 1)).toBeInTheDocument(); // Serial number should be displayed
      Object.values(row).forEach((value) => {
        expect(screen.getByText(value)).toBeInTheDocument();
      });
    });
  });

  test('toggles status filter correctly', () => {
    render(<Table data={data} columns={columns} currentPage={0} pageSize={10} />);

    // Click on status header to toggle filter
    fireEvent.click(screen.getByText('Status'));
    expect(screen.getByText('Returned')).toBeInTheDocument(); // Only 'Returned' should be visible

    fireEvent.click(screen.getByText('Status'));
    expect(screen.getByText('Pending')).toBeInTheDocument(); // Only 'Pending' should be visible

    fireEvent.click(screen.getByText('Status'));
    expect(screen.getAllByText(/Returned|Pending/)).toHaveLength(data.length); // Both statuses should be visible
  });

  test('toggles issuance type filter correctly', () => {
    render(<Table data={data} columns={columns} currentPage={0} pageSize={10} />);

    // Click on issuance type header to toggle filter
    fireEvent.click(screen.getByText('Issuance Type'));
    expect(screen.getByText('In House')).toBeInTheDocument(); // Only 'In House' should be visible

    fireEvent.click(screen.getByText('Issuance Type'));
    expect(screen.getByText('Library')).toBeInTheDocument(); // Only 'Library' should be visible

    fireEvent.click(screen.getByText('Issuance Type'));
    expect(screen.getAllByText(/In House|Library/)).toHaveLength(data.length); // Both types should be visible
  });

  test('renders correct icons based on filter state', () => {
    render(<Table data={data} columns={columns} currentPage={0} pageSize={10} />);

    // Check initial icons
    expect(screen.getByRole('img', { name: /sort/i })).toBeInTheDocument();

    // Click on status header to toggle filter
    fireEvent.click(screen.getByText('Status'));
    expect(screen.getByRole('img', { name: /sort up/i })).toBeInTheDocument(); // Should show sort up icon

    // Click again to toggle filter
    fireEvent.click(screen.getByText('Status'));
    expect(screen.getByRole('img', { name: /sort down/i })).toBeInTheDocument(); // Should show sort down icon

    // Click again to reset filter
    fireEvent.click(screen.getByText('Status'));
    expect(screen.getByRole('img', { name: /sort/i })).toBeInTheDocument(); // Should show default sort icon
  });
});
