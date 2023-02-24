import { Button, Input } from "antd"
import { ICarouselProps } from "."
import Title from "../Title"
import cloneDeep from 'lodash/cloneDeep'
interface IProps extends ICarouselProps{
  currentIndex: number
}

export default (props: IProps)=>{
  const { cards, setCards, compActiveIndex, index, currentIndex } = props
  console.log('props2',props)

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>,type:'url'|'link') => {
    let val = event?.target?.value
   

    const copyCards = cloneDeep(cards)
    // @ts-ignore
    copyCards[compActiveIndex!].config[index].item[currentIndex][type] = val
    console.log('copyCards',copyCards)
    setCards(copyCards)
  }

  
 
  return (
    <div>
      <Title>地址：</Title>

      <div style={{display: 'flex'}}>
      <Input 
        placeholder='请填入图片地址' 
        // value={cards[compActiveIndex!].config[index].item[currentIndex].url} 
        onChange={(e)=>{onSearch(e,"url")}}
      />
      <Button style={{marginLeft: '8px'}} onClick={()=>{console.log(cards)}}>上传</Button>
      </div>
      
      <Title>预览图：</Title>
      <div 
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: 'skyBlue'
        }}
      />
      <Title>跳转链接：</Title>
      <Input 
        placeholder='请填入图片地址' 
        // value={cards[compActiveIndex!].config[index].item[currentIndex].link}
        onChange={(e)=>{onSearch(e,"link")}}
      />
    </div>
  )
}