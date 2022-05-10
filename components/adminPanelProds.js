import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function AdminPanelProds(categories) {
    return (<div style={{  width: 200, height: "100%", borderRight: "1px solid black"}}>
    <Tree showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0']}
          style={{}}
          treeData={[
            {
              title: 'Общая группа',
              key: '1',
              children: [categories]     
            },
          ]}/>
    </div> ) 
}