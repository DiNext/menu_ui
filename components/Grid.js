import { Spin, Alert } from 'antd';

export default function Grid({cards})  {
    
    if (!cards || !Array.isArray(cards) || cards.length == 0) {
       console.log(Array.isArray(cards))
        return <Spin tip="Loading..." style={{marginTop: "300px"}}>
      </Spin>
      }

    return (
        <div className="grid">
          {cards.map((card) => (
            <div style={{backgroundImage: `url(${card.imageUrl})`, backgroundSize: "cover"}} className="card" key={card.index}>
                <a href={card.href}>
                    <h2 className='category_title'>{card.title}</h2>
                </a>
            </div> 
          ))}
        </div>
      )    
}