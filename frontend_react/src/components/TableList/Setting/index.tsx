import React, { useEffect, useState } from 'react';

import { Tree, Checkbox } from 'antd';

import type { DataNode, TreeProps } from 'antd/es/tree';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCheckedKeys, setAllChecked } from '@/store/module/user';
type Iprop = {
  // updateCheckKeys: (value: string[]) => void;
  // showCheck: (value: boolean) => void;
  defaultData: DataNode[];
};
//判断是否是全选
const Content: React.FC<Iprop> = ({ defaultData }) => {
  const keys = defaultData.map(item => item.key);

  //传值嵌套的组件太复杂，采用store传递数据
  const checkedKey = useAppSelector(state => state.user.checkedkeys);
  const isCheckedAll = useAppSelector(state => state.user.isAllChecked);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isCheckedAll) {
      dispatch(setCheckedKeys(keys));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //判断是否是全选，全选和树组件的复选框双向绑定
  const onCheckTreeAll = (value: any) => {
    console.log(value.target.checked);
    const checked = value.target.checked;
    dispatch(setAllChecked(checked));
    if (checked) {
      dispatch(setCheckedKeys(keys));
    } else {
      dispatch(setCheckedKeys([]));
    }
  };

  // //勾选树组件，同步勾选状态和全选
  const onCheckHandle = (checkKeys: any) => {
    dispatch(setCheckedKeys(checkKeys));

    if (checkKeys.length === defaultData.length) {
      dispatch(setAllChecked(true));
    } else {
      dispatch(setAllChecked(false));
    }
  };
  // //重置复选框
  const resetHandle = () => {
    setGData(defaultData);
    dispatch(setAllChecked(true));
    setCheckedKeys(keys);
    // updateCheckKeys(keysRef.current as string[]);
    // showCheck(true);
  };

  const [gData, setGData] = useState(defaultData);

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
        <Checkbox onChange={onCheckTreeAll} style={{ borderRadius: '0' }} checked={isCheckedAll}>
          列展示
        </Checkbox>
        <span style={{ color: '#2697ff' }} onClick={resetHandle}>
          重置
        </span>
      </div>
      <div className="setting_bottom">
        <Tree
          className="draggable-tree"
          draggable
          blockNode
          checkable
          checkedKeys={checkedKey}
          onCheck={onCheckHandle}
          onDrop={onDrop}
          treeData={gData}
        />
      </div>
    </>
  );
};
export default Content;
