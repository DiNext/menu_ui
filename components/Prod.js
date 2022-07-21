import { Card, Badge, Button } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
const { Meta } = Card;

export default function Prod({card})  {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(true);
    const [flagCount, setFlagCount] = useState(false);
    
    useEffect(() => {
      const id = setInterval(() => {
        checkBacket();
      }, 300);

      return () => clearInterval(id);
    }, []);

    function checkBacket() {
      const backet = JSON.parse(localStorage.getItem ("Backet"));

      if(backet != "" && backet != null && backet != undefined){
        const res = backet.some((function(item) {
          if(item.id == card.id) card.qnty = item.qnty 
          return (item.id == card.id);
        }))

        if(res){ 
          setFlag(false);
          setCount(card.qnty);
          setFlagCount(true); 
        } else{
          setFlag(true);
          
        }
      } else{
        setFlag(true);
        
      }
   } 

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
            width:"545px",
            marginTop:20,
            boxShadow: "0 0 10px rgba(0,0,0,0.2)"
          }}
          actions={[
            flag ? <ShoppingCartOutlined onClick={addProdToBacket}/> : <CloseOutlined onClick={removeItem}/>,
            <PlusOutlined onClick= {increment} key="edit" />,
            <MinusOutlined onClick= {decrement} key="ellipsis" />,
          ]}
          cover={<img alt="image" src={card.image? `${card.image}` : '../images/4.jpeg'} style={{height:320}}/>}
        >
          <p style={{fontSize:'21px', fontWeight:'bold', width:"100%", height:20, marginTop:-20}}> {card.name}</p>
          <p style={{fontSize:'14px', color:"#a0a0a0", marginTop:-5}}>{card.desc}</p>
           <p style={{marginTop:4, marginBottom:0, fontSize:'22px', color:'#00853E',fontWeight:'bold', height:20}}>{card.price + " тг."}</p>
        </Card></Badge>

      </>)
}
           