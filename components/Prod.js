import { Card, Badge } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useState } from 'react';
const { Meta } = Card;

export default function Prod({card})  {
    const [count, setCount] = useState(0);

    function increment(e) {
      setCount(count + 1)
    }
    
    function decrement(e) {
      let newCount = count - 1;
      if (newCount < 0) {
        newCount = 0;
      }
      setCount(newCount);
    }

    return (<>
          <Badge style={{width:30}} count={count} status="success" showZero={false} offset={[0,18]}>       
          <Card
          hoverable
          style={{
            width:"450px",

            marginTop:20
          }}
          actions={[
            <ShoppingCartOutlined  key="setting" />,
            <PlusOutlined onClick= {increment} key="edit" />,
            <MinusOutlined onClick= {decrement} key="ellipsis" />,
          ]}
          cover={<img alt="image" src={card.image? `../images/${card.image}` : '../images/3.jpg'} style={{height:250}}/>}
        >
          <Meta title={card.name}  style={{color:"Red"}}  />
           <p style={{marginTop:4, marginBottom:0}}>Цена: {card.price + " тг."}</p>
        </Card></Badge>

      </>)
}
           