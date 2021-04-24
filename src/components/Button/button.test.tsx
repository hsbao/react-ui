import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Button, { ButtonProps } from './button'
const defaultProps = {
  onClick: jest.fn(),
}

const testProps: ButtonProps = {
  btnType: 'primary',
  size: 'lg',
  className: 'klass',
}

const disabledProps: ButtonProps = {
  disabled: true,
  onClick: jest.fn(),
}
describe('test Button component', () => {
  it('should render the correct default button', () => {
    // 渲染Button组件
    const wrapper = render(<Button {...defaultProps}>Nice</Button>)

    // getByText获取Button的children是否是Nice，返回一个HTMLButtonElement
    const element = wrapper.getByText('Nice') as HTMLButtonElement

    // 按钮是否在文档中
    expect(element).toBeInTheDocument()

    // 判断tagName是否是BUTTON
    expect(element.tagName).toEqual('BUTTON')

    //  toHaveClass：判断是否有对应的className
    expect(element).toHaveClass('cmp-btn cmp-btn-default')

    // 判断disabled属性是否设置
    expect(element.disabled).toBeFalsy()

    // 给测试按钮绑定点击事件
    fireEvent.click(element)

    // 判断给按钮绑定click事件后，点击是否会触发
    expect(defaultProps.onClick).toHaveBeenCalled()
  })
  it('should render the correct component based on different props', () => {
    const wrapper = render(<Button {...testProps}>Nice</Button>)
    const element = wrapper.getByText('Nice')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('cmp-btn-primary cmp-btn-lg klass')
  })
  it('should render a link when btnType equals link and href is provided', () => {
    const wrapper = render(
      <Button btnType='link' href='http://dummyurl'>
        Link
      </Button>
    )
    const element = wrapper.getByText('Link')
    expect(element).toBeInTheDocument()
    expect(element.tagName).toEqual('A')
    expect(element).toHaveClass('cmp-btn cmp-btn-link')
  })
  it('should render disabled button when disabled set to true', () => {
    const wrapper = render(<Button {...disabledProps}>Nice</Button>)
    const element = wrapper.getByText('Nice') as HTMLButtonElement
    expect(element).toBeInTheDocument()
    expect(element.disabled).toBeTruthy()
    fireEvent.click(element)
    expect(disabledProps.onClick).not.toHaveBeenCalled()
  })
})
