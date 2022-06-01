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
          style={{
            width:"500px",
            boxShadow: "0 0 10px 0 rgba(0,0,0,.1)",
            marginTop:20
          }}
          actions={[
            <ShoppingCartOutlined  key="setting" />,
            <PlusOutlined onClick= {increment} key="edit" />,
            <MinusOutlined onClick= {decrement} key="ellipsis" />,
          ]}
          cover={<img alt="image" src={card.image? `../images/${card.image}` : '../images/3.jpg'} style={{height:250}}/>}
        >
          <p style={{fontSize:'21px', fontWeight:'bold'}}> {card.name}</p>
           <p style={{marginTop:4, marginBottom:0, fontSize:'22px', color:'#d46b08',fontWeight:'bold'}}>{card.price + " тг."}</p>
        </Card></Badge>

      </>)
}
           