import React from 'react';
import { Table } from 'antd';
import './index.css';
export interface ColumnProps<T> {
  title: string;
  dataIndex: string | number;
  key: string;
  colSpan?: number;
  width?: number;
  align?: 'left' | 'right' | 'center';
  render?: (value: any, record: T) => JSX.Element;
  sorter?: ((a: T, b: T) => number) | boolean;
  filter?: Function;
  onCellClick?: Function;
}

interface CommonTableProps<T> {
  columns: ColumnProps<T>[];
  dataSource: T[];
  rowKey?: string;
  height?: number;
  border?: boolean;
  colSpan?: number;
  pagination?: boolean;
  loading?: boolean;
  onRowClick?: (record: T, index: number) => void;
  onDBClick?: (record: T, index: number) => void;
  emtyText?: string;
}
const TableCommon = <T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey = 'key',
  height,
  border = false,
  pagination = false,
  loading = false,
  onRowClick,
  onDBClick,
  emtyText,
}: CommonTableProps<T>) => {
  const rowHeight = 55;
  const maxVisibleRows = height ? Math.floor(height / rowHeight) : 0;
  const shouldScroll = height && dataSource.length > maxVisibleRows;
  let a: number = 0;
  return (
    <Table
      loading={loading}
      scroll={{ x: 'max-content', y: shouldScroll ? height : undefined }}
      style={{ minHeight: height }}
      dataSource={dataSource}
      locale={{
        emptyText: emtyText,
      }}
      key={rowKey}
      className="custom-table-wrapper"
      pagination={pagination ? { position: ['topLeft'] } : false}
      bordered={border}
    >
      <Table.Column
        title={'STT'}
        render={(_, __, index) => <p key={index}>{index + 1}</p>}
        sorter={(a: { id: number }, b: { id: number }) => a.id - b.id}
        key={++a}
      ></Table.Column>
      {columns.map((col, index) => (
        <Table.Column
          key={index}
          dataIndex={col.dataIndex}
          title={col.title}
          align={col.align}
          sorter={col.sorter}
          onCell={(record) => ({
            onClick: () => onRowClick?.(record, 1), // Bắt sự kiện click vào ô
            style: { cursor: col.onCellClick ? 'pointer' : 'default' },
            onDoubleClick: () => onDBClick?.(record, 2),
          })}
          render={
            col.render
              ? (value, record) => col.render?.(value, record)
              : undefined
          }
        />
      ))}
    </Table>
  );
};

export default TableCommon;
