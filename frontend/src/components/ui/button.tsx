import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ children, className = "", ...rest }) => {
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  )
}

export default Button
