// iframe 页面

import type { Identifier, XYCoord } from 'dnd-core'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper/core';

import { useState } from 'react';
import { FC, useMemo } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'
import classnames from 'classnames'
import './index.less'
import 'swiper/css';

SwiperCore.use([Autoplay, Pagination, Navigation]);

export interface ICarouselPicture {
  url: string
  link: string
}
export interface IComponentItemProps {
  text: string  // 组件区中组件的名称
  name: string  // 组件区中组件的的key
  icon: string  // 组件区中组件的icon地址
  config: {
    label: string   // 配置区中title名称
    type: string  // 配置区组件类型
    format: string
    value?: string 
    item?: ICarouselPicture[] //轮播图配置
    config?: {  // 默认配置项
      icon: string
      style: React.CSSProperties
      tooltip: string,
    }
    configOptions?: {  // 配置区中组件配置列表
      icon: string
      style: React.CSSProperties
      tooltip: string,
    }[]
  }[]
}

export interface CardProps {
  item: IComponentItemProps
  index: number
  cards: [] | IComponentItemProps[]
  setCards: React.Dispatch<React.SetStateAction<[] | IComponentItemProps[]>>
  IDkey: string
  compActiveIndex: number | null
  setCompActiveIndex: (compActiveIndex: number) => void
}

interface DragItem {
  originalIndex: number
  comp: IComponentItemProps
}

export const Card: FC<CardProps> = ({ item, IDkey, cards, index, setCards, compActiveIndex, setCompActiveIndex }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'comp',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.originalIndex
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      if (item.originalIndex !== -1) {
        setCards((prevCards: IComponentItemProps[]) =>
          update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex] as IComponentItemProps],
            ],
          }),
        )
      } else {
        setCards((prevCards: IComponentItemProps[]) =>
          update(prevCards, {
            $splice: [
              [hoverIndex, 0, item.comp],
            ],
          }),
        )
      }
      item.originalIndex = hoverIndex
      setCompActiveIndex(hoverIndex)
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'comp',
    item: () => {
      return { comp: item, originalIndex: index }
    },
    isDragging: (monitor) => {
      return `card-${monitor.getItem().originalIndex}` === IDkey
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  const titleTextStyle = useMemo(() => {
    let result = {}

    if (item.name === 'titleText') {
      item?.config.forEach((_item: any) => {
        if (_item.config) {
          result[_item.format] = _item.config.style
        }
      })
    }

    return result
  }, [item])

  return (
    <div
      ref={ref}
      style={{
        opacity,
        border: '1px solid #blue'
      }}
      className={classnames('card2-container', {
        'active': compActiveIndex === index
      })}
      data-handler-id={handlerId}
      onClick={() => {
        setCompActiveIndex(index)
      }}
    >
      {item.name === 'titleText' && item?.config.map((item2, index2) => {
        return (
          <div
            key={`titleText-${index2}`}
            className='title-text-container'
            style={titleTextStyle['position']}
          >
            {item2.type === 'input' && (<span className='title-text' style={titleTextStyle['title-size']}>{item2.value}</span>)}
            {item2.type === 'textarea' && (<span className='content-text' style={titleTextStyle['content-size']}>{item2.value}</span>)}
          </div>
        )
      })}
      {item.name === 'carousel' && item?.config.map((item2, index2) => {
        return (
          <div
            key={`titleText-${index2}`}
            className='carousel-container'
          >

            {item2.type === 'carousel-picture' && (
              <Swiper
                spaceBetween={0}
                centeredSlides={true}
                slidesPerView='auto'
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop
                pagination={{
                  "clickable": true
                }}
                // onSlideChange={() => console.log('slide change')}
                // onSwiper={(swiper) => console.log(swiper)}
              >
                {item2.item?.map(item3 => (
                  <SwiperSlide><img src={item3.url} /></SwiperSlide>
                ))}
              </Swiper>
            )}

          </div>
        )
      })}
    </div>
  )
}
