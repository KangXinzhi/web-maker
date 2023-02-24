import { Button, Input, Tabs } from "antd"
import React, { useEffect, useRef, useState } from 'react';

import { IEditorProps } from "../.."
import Title from "../Title";
import SingleCarousel from './SingleCarousel'

export interface ICarouselProps extends IEditorProps {
  index: number;
}

type TargetKey = React.MouseEvent | React.KeyboardEvent | string | number;



export default (props: ICarouselProps) => {
  const { cards, setCards, compActiveIndex, index } = props

  console.log("props",props)

  // cards[compActiveIndex!].config[index].item => [{url:'',link:''}]
  // const initialItems = [
  //   {
  //     label: '图片1',
  //     children: <SingleCarousel {...props}/>,
  //     key: '1'
  //   },
  // ]
  
  const initialItems = cards[compActiveIndex!].config[index].item?.map((v, i) => ({
    label: `图片${i + 1}`,
    children: <SingleCarousel {...props} currentIndex={i}/>,
    key: i + ''
  }))


  const [activeKey, setActiveKey] = useState(initialItems?.[0]?.key||0);
  const [items, setItems] = useState(initialItems!);
  const newTabIndex = useRef(initialItems?.length||0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(+newActiveKey);
  };

  const add = () => {
  
    const copyCards = cards.splice(0)
    console.log(copyCards,compActiveIndex,index)
    copyCards[compActiveIndex!].config[index].item = [
      //@ts-ignore
      ...copyCards[compActiveIndex].config[index].item,
      {url:'',link:''}
    ]
    setCards(copyCards);

    const newActiveKey = newTabIndex.current++;
    const newPanes = [
      ...items,
      { 
        label: `图片${newTabIndex.current}`, 
        children: <SingleCarousel {...props} currentIndex={+activeKey} cards={[...copyCards]}/>, 
        key: newActiveKey+'' 
      }
    ];
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key == targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key != targetKey);
    if (newPanes.length && newActiveKey == targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
    const copyCards = cards.splice(0)
    if(!compActiveIndex) return
    copyCards[compActiveIndex!].config[index].item = copyCards[compActiveIndex].config[index].item.filter((item,idx:number) => idx===targetKey)
    setCards(copyCards)
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div>
      <Title font={16}>
        图片配置
      </Title>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey+''}
        onEdit={onEdit}
        items={items}
      />
      <Title font={16}>
        参数配置
      </Title>
    </div>

  )
}