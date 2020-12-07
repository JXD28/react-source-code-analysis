import { renderComponent } from "../react-dom";
// React.Component包含了一些预先定义好的变量和方法
class Component {
    // 通过继承React.Component定义的组件有自己的私有状态state，可以通过this.state获取到。同时也能通过this.props来获取传入的数据。
    // 所以在构造函数中， 我们需要初始化state和props
    constructor(props = {}) {
        this.state = {};
        this.props = props;
    }
    setState(statChange) {
        // 将修改合并到state
        Object.assign(this.state, stateChange);
        // 重新渲染组件
        renderComponent(this);
    }
}
export default Component;
