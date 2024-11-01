import { lazy } from "react";

interface DemoItem {
  name: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
}

export const DEMOS: DemoItem[] = [];

function addDemo(name: string, path: string) {
  DEMOS.push({ name, component: lazy(() => import(path)) });
}

addDemo("清除画布", "./demo01");
addDemo("点、线和三角形", "./demo02");
addDemo("矩形", "./demo03");
addDemo("多边形和圆", "./demo04");
addDemo("监听窗口尺寸变化", "./demo05");
addDemo("裁剪坐标转换", "./demo06");
addDemo("钢笔工具", "./demo07");
addDemo("缩放、平移和旋转——基础", "./demo08");
addDemo("缩放、平移和旋转——矩阵", "./demo09");
addDemo("图像绘制", "./demo10");
addDemo("基础动画", "./demo11");
addDemo("图像参数调节", "./demo12");
addDemo("图像参数叠加", "./demo13");
addDemo("Varying-可变量", "./demo14");
