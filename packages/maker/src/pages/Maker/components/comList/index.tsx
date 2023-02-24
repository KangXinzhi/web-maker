import React, { useCallback, useState } from 'react'
import update from 'immutability-helper'
import { ICardProps } from '../preview'
import './index.less'
import { Thumbnail } from './Thumbnail'
import { componentList } from './schema'
import classNames from 'classnames'

const index = (props: { setShowIframe: (showIframe: boolean) => void }) => {
  const [active, setActive] = useState(true)

  return (
    <div className={classNames("com-list", { "btn-active": !active })} >
      {
        componentList.map(item => (
          <div className="com-item">
            <Thumbnail
              item={item}
              setShowIframe={props.setShowIframe}
            />
          </div>

        ))
      }
      <span 
        className={"com-list-btn"} 
        onClick={() => { setActive(!active) }} 
      />
    </div>
  )
}
export default index