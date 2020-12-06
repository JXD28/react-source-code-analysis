import React from "./react";
import ReactDOM from "./react-dom";

//执行React.createElement之后 ,ele转换成对象
const ele = (
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

ReactDOM.render(ele, document.getElementById("root"));

console.log("🚀 ~ file: index.jsx ~ line 7 ~ ele", ele);

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
