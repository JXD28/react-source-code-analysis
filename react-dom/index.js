import Component from "../react/component";

const ReactDOM = {
    render: (vnode, container) => {
        container.innerHTML = "";
        return render(vnode, container);
    },
    renderComponent,
};

function render(vnode, container) {
    return container.appendChild(_render(vnode));
}

function _render(vnode, container) {
    console.log("🚀 ~ file: index.js ~ line 10 ~ render ~ vnode", vnode);
    if (vnode === undefined) {
        return;
    }
    // 如果是一个函数,则渲染组件
    if (typeof vnode.tag === "function") {
        // 1.创建组件
        const comp = createComponent(vnode.tag, vnode.attrs);
        console.log("🚀 ~ file: index.js ~ line 24 ~ _render ~ comp", comp);
        // 2.设置组件的属性
        setComponentProp(comp, vnode.attrs);
        // 3.返回当前组件的jsx对象
        return comp.base;
    }

    if (typeof vnode === "string") {
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
    if (key === "className") {
        key = "class"; //函数的参数时可以修改的,组件的props只能读
    }

    if (/on\w+/.test(key)) {
        key = key.toLowerCase();
        dom[key] = value || ""; //DOM0级事件处理程序
        console.log("🚀 ~ file: index.js ~ line 40 ~ setAttribute ~ dom", dom);
    } else if (key === "style") {
        console.log("style", dom.style);
        //没有style或者是字符串
        if (!value || typeof value === "string") {
            dom.style.cssText = value || "";
        } else if (value && typeof value === "object") {
            for (let k in value) {
                if (value[key] === "number") {
                    dom.style[k] = value[k] + "px";
                } else {
                    dom.style[k] = value[k];
                }
            }
        }
    } else {
        //属性
        if (value) {
            //普通属性,更新
            if (key in dom) {
                dom[key] = value || "";
            } else {
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
        console.log(
            "🚀 ~ file: index.js ~ line 111 ~ createComponent ~ inst",
            inst
        );

        // 改变构造函数指向,原本是指向构造函数Component的
        inst.constructor = comp;
        // 定义render函数
        inst.render = function () {
            return this.constructor(props); //返回jsx对象
        };
    }
    return inst;
}

function setComponentProp(comp, props) {
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

    // 如果调用了setState,节点替换
    if (comp.base && comp.base.parentNode) {
        comp.base.parentNode.replaceChild(base, comp.base);
    }
    // 为组件挂载js节点对象
    comp.base = base;
}

export default ReactDOM;
