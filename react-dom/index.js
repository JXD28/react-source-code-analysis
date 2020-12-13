import Component from '../react/component';

const ReactDOM = {
    render: (vnode, container) => {
        container.innerHTML = '';
        return render(vnode, container);
    },
    renderComponent,
};

function render(vnode, container) {
    return container.appendChild(_render(vnode));
}

//内部一直递归,直到return真实的dom节点
function _render(vnode, container) {
    if (vnode === undefined) {
        return;
    }
    // 如果是一个函数,则渲染组件
    if (typeof vnode.tag === 'function') {
        // 1.创建组件
        const comp = createComponent(vnode.tag, vnode.attrs); //返回挂载了render属性等的实例对象,如果内部还有函数组件/class继续走render函数,直到渲染到真实的dom
        // 2.设置组件的属性,渲染组件
        setComponentProp(comp, vnode.attrs); //对于函数组件和class组件之前都挂载了属性,这一步是????   挂载生命周期
        // 3.返回当前组件的节点对象
        return comp.base; //在renderComponent中挂载的
    }
    if (typeof vnode === 'number') {
        vnode = String(vnode);
    }
    if (typeof vnode === 'string') {
        const textNode = document.createTextNode(vnode);
        return textNode;
    }

    const { tag } = vnode;
    const dom = document.createElement(tag);
    if (vnode.attrs) {
        Object.keys(vnode.attrs).forEach((key) => {
            const val = vnode.attrs[key];
            setAttribute(dom, key, val);
        });
    }
    if (vnode.children) {
        vnode.children.forEach((child) => render(child, dom));
    }
    return dom;
}

function setAttribute(dom, key, value) {
    if (key === 'className') {
        key = 'class'; //函数的参数时可以修改的,组件的props只能读
    }

    //添加事件
    if (/on\w+/.test(key)) {
        key = key.toLowerCase();
        dom[key] = value || ''; //DOM0级事件处理程序
    } else if (key === 'style') {
        //添加样式
        //没有style或者是字符串
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        } else if (value && typeof value === 'object') {
            for (let k in value) {
                if (value[key] === 'number') {
                    dom.style[k] = value[k] + 'px';
                } else {
                    dom.style[k] = value[k];
                }
            }
        }
    } else {
        //添加属性
        if (value) {
            //普通属性,如果后边有重复,或者再次渲染属性更新了
            if (key in dom) {
                dom[key] = value || '';
            } else {
                //第一次渲染添加
                dom.setAttribute(key, value);
            }
        } else {
            dom.removeAttribute(key);
        }
    }
}

/* 
    @comp: 为当前函数组件还是类定义的组件  (都是函数)
    @props: 组件属性
    @return: 返回当前组件
*/
function createComponent(comp, props) {
    let inst;
    // 如果是类定义的组件,则直接返回实例
    if (comp.prototype && comp.prototype.render) {
        //有原型,原型上有render函数,则是类
        inst = new comp(props);
    } else {
        /* 
            function Home(){
                return <div>hello</div>
            }
        */
        // 是函数组件,则将函数组件扩展成类定义的组件 方便后面的统一处理
        inst = new Component(props); //执行Component中的constructor(),有了state和props的实例属性

        // 改变构造函数指向,原本是指向构造函数Component的
        inst.constructor = comp; //这里为什么要改变指向??????
        // 定义render函数
        inst.render = function () {
            console.log('this', this);
            // return this.constructor(props);
            return comp(props); //返回jsx对象,通过自定义的createElement
        };
    }
    return inst; //返回new之后的实例对象
}

function setComponentProp(comp, props) {
    if (!comp.base) {
        if (comp.componentWillMount) {
            comp.componentWillMount();
        }
    } else if (comp.componentReceiveProps) {
        comp.componentReceiveProps();
    }
    //更新props
    comp.props = props;
    //重新渲染组件
    renderComponent(comp);
}

export function renderComponent(comp) {
    // 声明一个初始化变量,用来保存当前js节点对象
    let base;
    const renderer = comp.render(); //调用render方法之后,返回的是jsx对象
    // 返回js节点对象
    base = _render(renderer);

    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate();
    }

    if (comp.base) {
        if (comp.componentDidUpdate) {
            comp.componentDidUpdate();
        }
    } else if (comp.componentDidMount) {
        comp.componentDidMount();
    }
    // 如果调用了setState,节点替换
    if (comp.base && comp.base.parentNode) {
        comp.base.parentNode.replaceChild(base, comp.base);
    }
    // 为组件挂载js节点对象
    comp.base = base;
}

export default ReactDOM;
