import { Button, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import classNames from 'classnames';
import React, { useState } from 'react';
import { IComponentItemProps } from '../comList/schema';

import Carousel from './components/carousel';
import './index.less';

export interface IEditorProps {
  cards: [] | IComponentItemProps[]
  setCards: React.Dispatch<React.SetStateAction<[] | IComponentItemProps[]>>
  compActiveIndex: number | null
}

const index = (props: IEditorProps) => {
  const { cards, setCards, compActiveIndex } = props
  const [active, setActive] = useState(true)
  
  return (
    <div className={classNames("editor", { "editor-btn-active": !active })} >
      {compActiveIndex != null && cards?.[compActiveIndex] && (
        <>
          <h2>{cards[compActiveIndex].text}</h2>
          {cards[compActiveIndex].config.map((item, index) => (
            item.type === 'input' && (
              <div className='item'>
                <h4>{item.label}</h4>
                <Input
                  placeholder='请输入内容'
                  value={cards[compActiveIndex].config[index].value}
                  onChange={(e) => {
                    const copyCards = cards.splice(0)
                    copyCards[compActiveIndex].config[index].value = e.target.value
                    setCards(copyCards)
                  }} />
              </div>
            ) ||
            item.type === 'textarea' && (
              <div className='item'>
                <h4>{item.label}</h4>
                <TextArea
                  placeholder='请输入内容'
                  value={cards[compActiveIndex].config[index].value}
                  onChange={(e) => {
                    const copyCards = cards.splice(0)
                    copyCards[compActiveIndex].config[index].value = e.target.value
                    setCards(copyCards)
                  }} />

              </div>
            ) ||
            item.type === 'legend-style-line' && (
              <div className='legend-line'>
                <div>
                  <span className='legend-line-title'>{item?.label || ''}</span>
                  <span className='legend-line-value'>{item?.config?.tooltip || ''}</span>
                </div>
                <div>
                  {
                    item?.configOptions?.length > 0 && (
                      item.configOptions.map((item2, index2) => (
                        <Button
                          key={`icon-${index}-${index2}`}
                          className={classNames({
                            'button-active': item?.config?.tooltip === item2.tooltip,
                          })}
                          onClick={() => {
                            const copyCards = cards.splice(0)
                            copyCards[compActiveIndex].config[index].config = item2
                            setCards(copyCards)
                          }}
                        >
                          <svg className="icon" aria-hidden="true">
                            <use xlinkHref={item2?.icon || ''}></use>
                          </svg>
                        </Button>
                      ))
                    )
                  }
                </div>
              </div>
            )||
            item.type === 'carousel-picture' && (
              <Carousel cards={cards} setCards={setCards} compActiveIndex={compActiveIndex} index={index}/>
            )
          ))}
        </>
      )}
      <span
        className={"editor-btn"}
        onClick={() => { setActive(!active) }}
      />
    </div>
  )
}

export default index