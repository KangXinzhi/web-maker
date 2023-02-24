export default (props:{font?: number,children?: string}) => {
  const {font = 14} = props
  return (
    <div style={{ margin: '8px 0',fontSize: font }}>{props.children}</div>
  )
}