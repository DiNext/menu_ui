import { Card, Badge, Button } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
const { Meta } = Card;

export default function Prod({card})  {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(true);

    useEffect(() => {
      const backet = JSON.parse(localStorage.getItem ("Backet"));

      if(backet){
        backet.forEach(element => {
          if(element.id == card.id){
            setFlag(false);
            setCount(element.qnty);
          }
        });
      }
    });

    function increment(e) {
      const backet = JSON.parse(localStorage.getItem ("Backet"));

      if(backet){
        backet.forEach(element => {
          element.id == card.id ? element.qnty += 1: console.log('none')
        });
        localStorage.setItem ("Backet", JSON.stringify(backet));
      }
      setCount(count + 1)
    }
    
    function decrement(e) {
      let newCount = count - 1;
      if (newCount < 0) {
        newCount = 0;
      }
      const backet = JSON.parse(localStorage.getItem ("Backet"));

      if(backet){
        backet.forEach(element => {
          element.id == card.id ? element.qnty = newCount: console.log('none')
        });
        localStorage.setItem ("Backet", JSON.stringify(backet));
      }
      
      setCount(newCount);
    }

    function addProdToBacket(e) {
      const crd = {
        id: card.id,
        name: card.name,
        price: card.price,
        qnty: count == 0 ? 1 : count
      }

      const backet = JSON.parse(localStorage.getItem ("Backet"));

      if(backet){
        backet.push(crd);
        localStorage.setItem ("Backet", JSON.stringify(backet));
      }else{
        localStorage.setItem ("Backet", JSON.stringify([crd]));
      }

      setFlag(false);
    }

    function removeItem(){
      const backet = JSON.parse(localStorage.getItem ("Backet"));

      if(backet){
        backet.forEach((element, index) => {
          element.id == card.id ? backet.splice(index, 1) : console.log('none')
        });

        localStorage.setItem ("Backet", JSON.stringify(backet));
      }
      setCount(0)
      setFlag(true);
    }

    return (<>
          <Badge style={{width:30}} count={count} color='#d46b08' showZero={false} offset={[0,18]}>       
          <Card
          hoverable
          style={{
            width:"500px",
            marginTop:20
          }}
          actions={[
            flag ? <ShoppingCartOutlined onClick={addProdToBacket}/> : <CloseOutlined onClick={removeItem}/>,
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
           