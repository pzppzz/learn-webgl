import { lazy } from "react";

export default [
	{
		name: "清除画布",
		component: lazy(() => import("./demo01")),
	},
	{
		name: "点、线和三角形",
		component: lazy(() => import("./demo02")),
	},
	{
		name: "矩形",
		component: lazy(() => import("./demo03")),
	},
	{
		name: "多边形和圆",
		component: lazy(() => import("./demo04")),
	},
];
