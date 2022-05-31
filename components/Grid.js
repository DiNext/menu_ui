import { Spin, Empty, Button, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
const { Meta } = Card;

export default function Grid({cards})  {
    const [selectedItem, setSelectedItem] = useState(null);

    function onBack(e) {
      setSelectedItem(null)
    }

    

    if (!cards || !Array.isArray(cards) || cards.length == 0) {
        return <Spin tip="Loading..." style={{marginTop: "300px"}}>
      </Spin>
    }
    else if(selectedItem){
      if(selectedItem.prods && selectedItem.prods.length != 0){
        return (<>
          <Button shape="circle" icon={<ArrowLeftOutlined />} style={{marginTop:20, marginLeft: 20, marginBottom:-30}} onClick={onBack}/>
          <div className="grid">
            {selectedItem.prods.map((card) => (
              
              <Card
              hoverable
              bordered={true}
              style={{
                className:"card"
              }}
              cover={<img alt="example" src={`../images/${card.image}`} />}
            >
              <Meta title="Europe Street beat" description="www.instagram.com"  bodyStyle={{className:'category_title'}} />
            </Card>
            ))}</div>
          {/* <div className="grid">
            {selectedItem.prods.map((card) => (
              <div style={{backgroundImage: `url(../images/${card.image})`, backgroundSize: "cover"}} onClick={e=>{setSelectedItem(card)}} className="card" key={card.index} data={card}>
                  <a>
                      <h2 className='category_title'>{card.name}</h2>
                  </a>
              </div> 
            ))}
          </div> */}</>)
      } 
      else if(selectedItem.children && selectedItem.children != 0){
        return (<>
          <Button shape="circle" icon={<ArrowLeftOutlined />} style={{marginTop:20, marginLeft: 20, marginBottom:-30}} onClick={onBack}/>
        <div className="grid">
        {selectedItem.children.map((card) => (
          <div style={{backgroundImage: `url(../images/${card.image})`, backgroundSize: "cover"}} onClick={e=>{setSelectedItem(card)}}className="card" key={card.index} data={card}>
              <a>
                  <h2 className='category_title'>{card.name}</h2>
              </a>
          </div> 
        ))}
      </div></>)
      }else{
        return (<>
          <Button shape="circle" icon={<ArrowLeftOutlined />} style={{marginTop:20, marginLeft: 20, marginBottom:-30}} onClick={onBack}/>
            <Empty description="Нет продукции.." style={{marginTop: 60}}></Empty>
            </>
          )  
      }
    }
    else{
      const categoryRoot = cards.filter(card => card.parent == null)

      return (
        <div className="grid">
          {categoryRoot.map((card) => (
            <div style={{backgroundImage: `url(../images/${card.image})`, backgroundSize: "cover"}} onClick={e=>{setSelectedItem(card)}}className="card" key={card.index} data={card.prods}>
                <a>
                    <h2 className='category_title'>{card.name}</h2>
                </a>
            </div> 
          ))}
        </div>
      )   
    }
}