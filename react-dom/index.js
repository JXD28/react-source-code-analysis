const ReactDOM = {
    render: (vnode, container) => {
        container.innerHTML = "";
        return render(vnode, container);
    },
};

function render(vnode, container) {
    if (vnode === undefined) {
        return;
    }

    if (typeof vnode === "string") {
        const textNode = document.createTextNode(vnode);
        return container.appendChild(textNode);
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
    return container.appendChild(dom);
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

export default ReactDOM;
