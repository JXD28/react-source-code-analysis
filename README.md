# 依赖介绍

参考:https://www.cnblogs.com/dfzc/p/11061569.html

```json
 "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-preset-env": "^1.7.0",
    "parcel-bundler": "^1.12.4"
  }
```

## 1. parcel-bundle

https://zh.parceljs.org/getting_started.html

用于打包,很快

## 2.babel-preset-env  不再需要添加2015、2016、2017，全都支持

将ES6+转换成ES5时,会根据环境的不同,来进行插件的预设,减少插件量,加快编译速度

## 3.babel-plugin-transform-react-jsx  https://www.cnblogs.com/dfzc/p/11061569.html

将jsx的语法转化成js对象(这个js对象即所谓的虚拟DOM),
```json
{
    "presets": ["env"],
    "plugins": [
        ["transform-react-jsx", {
            "pragma": "React.createElement" //编译 JSX 表达式时替用于换所使用的函数（function）。
        }]
    ]
}
```
# 函数组件->jsx

```js
function Home() {
    return (
        <div
            className="active"
            title="123"
            onClick={() => {
                console.log("111");
            }}
            style={{ color: "red" }}
            title="345"
        >
            hello,<span>react</span>
        </div>
    );
}
ReactDOM.render(<Home title = 'home'/>, document.getElementById("root"));

//---------------------babel 解析之后--------------------------------------------

function Home() {
  return /*#__PURE__*/React.createElement("div", {
    className: "active",
    title: "123",
    onClick: () => {
      console.log("111");
    },
    style: {
      color: "red"
    },
    title: "345"
  }, "hello,", /*#__PURE__*/React.createElement("span", null, "react"));
}

ReactDOM.render( /*#__PURE__*/React.createElement(Home, {
  title: "home"
}), document.getElementById("root"));

```

再看一下我们自定义的createElement的返回值
```js
function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children,
  };
}
```
其中 `Home` 就是传入的tag参数,是一个函数