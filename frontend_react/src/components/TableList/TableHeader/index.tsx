import { FC, ReactNode, memo } from 'react';
import { Button, Dropdown, Space, Popover } from 'antd';
import type { MenuProps } from 'antd';
import { PlusOutlined, ReloadOutlined, ColumnHeightOutlined, SettingOutlined } from '@ant-design/icons';
import { SizeType } from 'antd/es/config-provider/SizeContext';

interface TableHeaderProps {
  searchName: string;
  element: ReactNode | (() => ReactNode);
  loadList: (value?: any) => void;
  onAddHandle: (value?: any) => void;
  changeSize: (value?: SizeType) => void;
  isShow?: Boolean;
}

const TableHeader: FC<TableHeaderProps> = ({ searchName, element, isShow, loadList, changeSize, onAddHandle }) => {
  const items: MenuProps['items'] = [
    {
      label: <div>默认</div>,
      key: '0',
      onClick: () => {
        changeTableSize();
      }
    },
    {
      label: <div>中等</div>,
      key: '1',
      onClick: () => {
        changeTableSize('middle');
      }
    },
    {
      label: <div>紧凑</div>,
      key: '3',
      onClick: () => {
        changeTableSize('small');
      }
    }
  ];
  const changeTableSize = (value?: SizeType) => {
    changeSize(value);
  };

  const refreshHandle = () => {
    loadList();
  };
  return (
    <div className="operation">
      <div className="left">{searchName}</div>
      <div className="right">
        <Space size={'middle'}>
          {/* <Radio.Group options={options} onChange={onChangeHandle} value={radioValue} optionType="button" /> */}
          {isShow && (
            <div className="add">
              <Button type="primary" icon={<PlusOutlined />} onClick={onAddHandle}>
                新建
              </Button>
            </div>
          )}
          <div className="refresh">
            <ReloadOutlined style={{ fontSize: '16px' }} onClick={refreshHandle} />
          </div>
          <div className="updateWidth">
            <Dropdown menu={{ items, selectable: true, defaultSelectedKeys: ['1'] }} trigger={['click']}>
              <a onClick={e => e.preventDefault()}>
                <Space>
                  <ColumnHeightOutlined style={{ fontSize: '16px', color: '#000' }} />
                </Space>
              </a>
            </Dropdown>
          </div>
          <div className="settings">
            <Popover
              content={element}
              trigger="click"
              placement="bottomRight"
              align={{
                offset: [12, 18]
              }}
            >
              <SettingOutlined style={{ fontSize: '16px' }} />
            </Popover>
          </div>
        </Space>
      </div>
    </div>
  );
};
export default memo(TableHeader);
