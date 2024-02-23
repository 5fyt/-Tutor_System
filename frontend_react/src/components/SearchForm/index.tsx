import { FC, memo, useRef, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import './index.less';
type searchType = {
  setSearchInfo: (value: any) => void;
  options: {
    name: string;
    tooltips?: string;
    label: string;
    placeholder?: string;
  }[];
};
const SearchForm: FC<searchType> = ({ setSearchInfo, options }) => {
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<any>();
  //重置表单
  const resetBtn = () => {
    formRef.current?.resetFields();
    setSearchInfo(null);
  };
  //查询数据
  const queryInfo = () => {
    setLoading(true);
    formRef.current?.validateFields().then((value: any) => {
      console.log(value);
      setSearchInfo(value);
      setTimeout(() => {
        setLoading(false);
      }, 300);
    });
  };
  const clickHandle = () => {
    setShow(!show);
  };

  return (
    <div className="searchContainer">
      <Form
        ref={formRef}
        style={{ minWidth: '800px' }}
        layout={'horizontal'}
        wrapperCol={{ span: 20 }}
        labelCol={{ span: 8 }}
      >
        {/* 当展开时，遍历所有的input,当收缩时遍历前面两项input */}
        <div className="search">
          {show
            ? options.map((item: any) => {
                return (
                  <div className="input" key={item.id}>
                    <Form.Item label={item.label} name={item.name} tooltip={item.tooltip}>
                      <Input id={item.name} />
                    </Form.Item>
                  </div>
                );
              })
            : options.slice(0, 2).map((item: any) => {
                return (
                  <div className="input" key={item.id}>
                    <Form.Item label={item.label} name={item.name} tooltip={item.tooltip}>
                      <Input id={item.name} />
                    </Form.Item>
                  </div>
                );
              })}
          <div className="input">
            <div className="btn">
              <Button onClick={resetBtn}>重置</Button>
              <Button type="primary" onClick={queryInfo} loading={loading}>
                查询
              </Button>
              <div className="show" onClick={clickHandle}>
                {show ? (
                  <>
                    <span>
                      收起
                      <span className="icon">
                        <UpOutlined style={{ color: '#1890ff' }} />
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      展开
                      <span className="icon">
                        <DownOutlined style={{ color: '#1890ff' }} />
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default memo(SearchForm);
