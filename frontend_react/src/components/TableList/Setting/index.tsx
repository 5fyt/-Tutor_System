import React, { useState } from 'react';

import { Tree } from 'antd';

import type { DataNode, TreeProps } from 'antd/es/tree';
type Iprop = {
  // updateCheckKeys: (value: string[]) => void;
  // showCheck: (value: boolean) => void;
  defaultData: DataNode[];
};
//判断是否是全选
const Content: React.FC<Iprop> = ({ defaultData }) => {
  //当悬停在某个子节点时，显示图标

  // const getKeys = (newArr: any[] = []) => {
  //   defaultData.forEach(item => {
  //     newArr.push(item.key);
  //   });
  //   return newArr;
  // };
  // useEffect(() => {
  //   keysRef.current = getKeys();
  //   updateCheckKeys(keysRef.current);
  // }, []);
  //判断是否是全选，全选和树组件的复选框双向绑定
  // const onCheckAllChange = (value: any) => {
  //   setCheckedAll(value.target.checked);

  //   if (value.target.checked) {
  //     setCheckedKeys(keysRef.current);
  //     updateCheckKeys(keysRef.current as string[]);
  //     showCheck(value.target.checked);
  //   } else {
  //     //没有选中时，表格数据全部隐藏，其他复选框也为不选中
  //     setCheckedKeys([]);
  //     updateCheckKeys([]);
  //     showCheck(value.target.checked);
  //   }
  // };
  // //勾选树组件，同步勾选状态和全选
  // const onCheckHandle = (checkKeys: any) => {
  //   console.log(checkKeys);
  //   setCheckedKeys(checkKeys);
  //   updateCheckKeys(checkKeys);
  //   if (checkKeys.length === defaultData.length) {
  //     setCheckedAll(true);
  //     showCheck(true);
  //   } else {
  //     setCheckedAll(false);
  //     showCheck(false);
  //   }
  // };
  // //重置复选框
  // const resetHandle = () => {
  //   setGData(defaultData);
  //   setCheckedAll(true);
  //   setCheckedKeys(keysRef.current);
  //   updateCheckKeys(keysRef.current as string[]);
  //   showCheck(true);
  // };

  const [gData, setGData] = useState(defaultData);
  // const keysRef = useRef<any[]>();
  // const [checkedKeys, setCheckedKeys] = useState<any>(getKeys());
  // const [checkedAll, setCheckedAll] = useState(true);

  const onDrop: TreeProps['onDrop'] = info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setGData(data);
  };
  return (
    <>
      <div className="setting_top">
        {/* <Checkbox onChange={onCheckAllChange} style={{ borderRadius: '0' }} checked={checkedAll}>
          列展示
        </Checkbox>
        <span style={{ color: '#2697ff' }} onClick={resetHandle}>
          重置
        </span> */}
      </div>
      <div className="setting_bottom">
        <Tree
          className="draggable-tree"
          draggable
          blockNode
          checkable
          // checkedKeys={checkedKeys}
          // onCheck={onCheckHandle}
          onDrop={onDrop}
          treeData={gData}
        />
      </div>
    </>
  );
};
export default Content;
