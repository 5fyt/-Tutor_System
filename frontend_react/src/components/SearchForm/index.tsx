import { FC, memo, useRef, useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import Style from './index.module.scss';
// import type { SelectProps } from 'antd';
// import { getTypes } from '@/services/api/goods';
type searchType = {
  setSearchInfo: (value: any) => void;
  options: {
    name: string;
    tooltips: string;
    label: string;
    placeholder: string;
  }[];
};
const SearchForm: FC<searchType> = ({ setSearchInfo, options }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  // const [options, setOptions] = useState<SelectProps['options']>([]);
  // const options = useRef<SelectProps['options'] | undefined>([])
  // const optionRef = useRef<SelectProps['options'] | undefined>([]);
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
    setVisible(!visible);
    setShow(!show);
  };
  const handleChange = (value: any) => {
    console.log(value);
  };
  const InputForm = options.map(item => {
    return <div>ddd</div>;
  });
  return (
    <>
      <Form
        ref={formRef}
        style={{ minWidth: '800px' }}
        layout={'horizontal'}
        wrapperCol={{ span: 14 }}
        labelCol={{ span: 8 }}
      >
        <div className="search">
          {options.length < 2 ? (
            options.slice(0, 1).map((item: any) => {
              return <div>ddd{item}</div>;
            })
          ) : (
            <></>
          )}
          {/* {!visible ? (
            show && options.length > 2 && { options.map(item => {
    return <div>ddd</div>;
  }) }
          ) : (
            <>
              <div className="input">
                <Form.Item label="套餐名称" name="name" tooltip="商品套餐">
                  <Input id="name" />
                </Form.Item>
              </div>
              <div className="input">
                <Form.Item label="套餐编号" name="code">
                  <Input id="code" />
                </Form.Item>
              </div>
              <div className="input">
                <Form.Item label="商品类别" name="type" style={{ paddingLeft: '5px' }}>
                  <Select style={{ width: 237 }} onChange={handleChange} options={optionRef.current} />
                </Form.Item>
              </div>
            </>
          )} */}

          <div className="input">
            <div className="btn">
              <Button onClick={resetBtn}>重置</Button>
              <Button type="primary" onClick={queryInfo} loading={loading}>
                查询
              </Button>
              <div className="show" onClick={clickHandle}>
                {visible ? (
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
    </>
  );
};
export default memo(SearchForm);
