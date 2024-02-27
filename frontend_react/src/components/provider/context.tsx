import { FC, createContext, useState, ReactNode } from 'react';

// 创建自定义的Context对象
interface MyContextType {
  data: string;
  updateData: (newValue: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

// 创建Context Provider组件
interface MyContextProviderProps {
  children: ReactNode;
}

const MyContextProvider: FC<MyContextProviderProps> = ({ children }) => {
  // 在Provider组件中管理共享数据和相关逻辑
  const [data, setData] = useState<string>('Default Value');

  const updateData = (newValue: string) => {
    setData(newValue);
  };

  // 将共享数据和方法通过value属性传递给Provider组件的子组件
  return <MyContext.Provider value={{ data, updateData }}>{children}</MyContext.Provider>;
};

export { MyContext, MyContextProvider };
