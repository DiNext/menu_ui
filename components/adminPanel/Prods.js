import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Empty, Button } from 'antd';

export default function AdminPanelProds({categories, prods}) {

    if(!categories || categories == [] || categories.length == 0){
      return ( <><div style={{  width: 200, height: "100%", borderRight: "1px solid black"}}>
    <Tree showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0']}
          defaultExpandAll={true}
          style={{}}
          treeData={[
            {
              title: 'Общая группа',
              key: '1',
              children: [categories]     
            },
          ]}/>
    </div>
    <div style={{marginLeft: "40%"}}>
    <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>
            Customize <a href="#API">Description</a>
          </span>
        }
      >
        <Button type="primary">Create Now</Button>
      </Empty>
    </div>
    </> ) 
    } else {
    return ( <><div style={{  width: 200, height: "100%", borderRight: "1px solid black"}}>
    <Tree showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0']}
          defaultExpandAll={true}
          style={{}}
          treeData={[
            {
              title: 'Общая группа',
              key: '1',
              children: [categories]     
            },
          ]}/>
    </div>
    <div style={{marginLeft: "40%"}}>
    
    </div>
    </> ) 
    }
}
