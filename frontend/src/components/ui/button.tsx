import React from 'react'

const button = ({children, className}:{children:React.ReactNode,className:string}) => {
  return (
    <button className={className}>
        {children}
    </button>
  )
}

export default button