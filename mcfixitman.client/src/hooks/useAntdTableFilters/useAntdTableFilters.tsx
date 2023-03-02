import * as React from 'react';

import { Button, Col, Input, InputRef, Row } from 'antd';
import { get, isEqual } from 'lodash';

import { ColumnType } from 'antd/lib/table';
import Highlighter from 'react-highlight-words';
import { LiteralUnion } from 'src/types/typescriptHelpers';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

// Modified antd custom filter panel example to be a hook
// See: https://ant.design/components/table/#components-table-demo-custom-filter-panel

const useAntdTableFilters = <T,>(): (dataIndex: LiteralUnion<Extract<keyof T, string>, string> | Array<string>) => ColumnType<T> => {
    const { t } = useTranslation();

    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState<string | Array<string>>('');

    const searchInput = React.useRef<InputRef>(null);

    const getColumnSearchProps = (dataIndex: string | Array<string>): ColumnType<T> => {
        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`${t('Common.search')}...`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            confirm();
                            setSearchText((selectedKeys as Array<string>)[0] ?? '');
                            setSearchedColumn(dataIndex);
                        }}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Row
                        align="middle"
                        justify="center"
                        gutter={10}
                    >
                        <Col>
                            <Button
                                type="primary"
                                onClick={() => {
                                    confirm();
                                    setSearchText((selectedKeys as Array<string>)[0] ?? '');
                                    setSearchedColumn(dataIndex);
                                }}
                                icon={<SearchOutlined />}
                                size="small"
                                style={{ width: 90 }}
                            >
                                {t('Common.search')}
                            </Button>
                        </Col>

                        <Col>
                            <Button
                                onClick={() => {
                                    clearFilters?.();
                                    setSearchText('');
                                    confirm({ closeDropdown: true });
                                }}
                                size="small"
                                style={{ width: 90 }}
                            >
                                {t('Common.reset')}
                            </Button>
                        </Col>
                    </Row>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                get(record, dataIndex)
                    ?.toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (text) => {
                if (isEqual(searchedColumn, dataIndex)) {
                    return (
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[searchText]}
                            autoEscape={true}
                            textToHighlight={text ? text.toString() : ''}
                        />
                    );
                }

                return text;
            },
        };
    };

    return getColumnSearchProps;
};

export { useAntdTableFilters };