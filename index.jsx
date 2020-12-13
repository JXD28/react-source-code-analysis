import React from './react';
import ReactDOM from './react-dom';

//执行React.createElement之后 ,ele转换成对象
const ele = (
    <div
        className='active'
        title='123'
        onClick={() => {
            console.log('111');
        }}
        style={{ color: 'red' }}
        title='345'
    >
        hello,<span>react</span>
    </div>
);

//下边的函数组件与class组件在createElement 函数的参数中,tag参数都是以函数的形式传入的,不同点在于,class组件在原型链上由render()
function Home() {
    return (
        <div
            className='active'
            title='123'
            onClick={() => {
                console.log('111');
            }}
            style={{ color: 'red' }}
            title='345'
        >
            Home hello,<span>react</span>
        </div>
    );
}
class App extends React.Component {
    constructor(props) {
        super(props); //别忘了调用super,否则this是undefined
        this.state = {
            num: 0,
        };
    }
    componentWillMount() {
        console.log('componentWillMount');
    }

    componentWillReceiveProps(props) {
        console.log('componentWillReceiveProps');
    }

    componentWillUpdate() {
        console.log('componentWillUpdate');
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
    }

    componentDidMount() {
        console.log('componentDidMount');
    }
    handleClick() {
        this.setState({
            num: ++this.state.num,
        });
    }

    render() {
        return (
            <div
                className='active'
                title='123'
                onClick={() => {
                    console.log('111');
                }}
                style={{ color: 'red' }}
                title='345'
                Home
            >
                hello,<span>react{this.state.num}</span>
                <button onClick={this.handleClick.bind(this)}>点点</button>
            </div>
        );
    }
}
ReactDOM.render(<App title='home' />, document.getElementById('root'));

// console.log("🚀 ~ file: index.jsx ~ line 7 ~ ele", ele);

//jsx被babel转换成下边代码
// const ele = /*#__PURE__*/React.createElement("div", {
//     className: "active",
//     title: "123"
//   }, "hello,", /*#__PURE__*/React.createElement("span", null, "react"));

//render函数的参数
// ReactDOM.render(
//   /*#__PURE__*/ React.createElement("h1", null, "Hello,react"),
//   document.getElementById("root")
// );
