import { FC, memo, useCallback, useEffect } from 'react';
import * as echarts from 'echarts';
import './index.less';
import { getScoreList } from '@/api/system/score';
const PerfAnalysis: FC = () => {
  // const [list, setList] = useState<any>([]);

  const getList = useCallback(async () => {
    const lists = await getScoreList();
    const option_1 = {
      title: {
        show: false,
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: {
          color: 'pink',
          fontSize: 16,
          fontWeight: 400
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '罚款类型',
          type: 'pie',

          avoidLabelOverlap: false,
          label: {
            formatter: '{name|{b}}',
            rich: {
              time: {
                fontSize: 12,
                color: '#999'
              }
            }
          },
          data: lists[0],
          roseType: 'area'
        }
      ]
    };
    const chart = echarts.init(document.getElementById('chart-1'));
    // console.log(chart)
    chart.setOption(option_1);
  }, []);
  useEffect(() => {
    getList();
  }, [getList]);
  return (
    <div id="chart-container">
      <div className="chart" id="chart-1"></div>
    </div>
  );
};
export default memo(PerfAnalysis);
