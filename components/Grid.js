import { Spin } from 'antd';
import { useState } from 'react';

export default function Grid({cards})  {
    const [selectedItem, setSelectedItem] = useState(null);
    console.log(cards)
    if (!cards || !Array.isArray(cards) || cards.length == 0) {
       
        return <Spin tip="Loading..." style={{marginTop: "300px"}}>
      </Spin>
      } 

    return (
        <div className="grid">
          {cards.map((card) => (
            <div style={{backgroundImage: `url(../images/${card.image})`, backgroundSize: "cover"}} onClick={e=>{setSelectedItem(card)}}className="card" key={card.index} data={card}>
                <a>
                    <h2 className='category_title'>{card.name}</h2>
                </a>
            </div> 
          ))}
        </div>
      )    
}