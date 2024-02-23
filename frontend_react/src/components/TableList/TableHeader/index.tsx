import { FC, ReactNode, memo } from 'react';
import { Button, Dropdown, Space, Popover } from 'antd';
import type { MenuProps } from 'antd';
// import { SizeType } from 'antd/es/config-provider/SizeContext';
import { PlusOutlined, ReloadOutlined, ColumnHeightOutlined, SettingOutlined } from '@ant-design/icons';

// type optionType = { label: string; value: number }[];
interface TableHeaderProps {
  // options?: optionType;
  searchName: string;
  element: ReactNode | (() => ReactNode);
}
// interface ModalProps {
//   showModal: (value?: any) => void;
// }

const TableHeader: FC<TableHeaderProps> = ({ searchName, element }) => {
  const items: MenuProps['items'] = [
    {
      label: <div>默认</div>,
      key: '0',
      onClick: () => {}
    },
    {
      label: <div>中等</div>,
      key: '1',
      onClick: () => {}
    },
    {
      label: <div>紧凑</div>,
      key: '3',
      onClick: () => {}
    }
  ];
  // const [sz, setSz] = useState<SizeType>('middle');
  // const showRef = useRef<ModalProps>(null);
  // const addShow = (value: any) => {
  //   showRef.current?.showModal(value);
  // };
  // const refreshHandle = () => {
  //   loadList(searchInfo);
  // };
  return (
    <div className="operation">
      <div className="left">{searchName}</div>
      <div className="right">
        <Space size={'middle'}>
          {/* <Radio.Group options={options} onChange={onChangeHandle} value={radioValue} optionType="button" /> */}
          <div className="add">
            <Button type="primary" icon={<PlusOutlined />}>
              新建
            </Button>
          </div>
          <div className="refresh">
            <ReloadOutlined style={{ fontSize: '16px' }} />
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
