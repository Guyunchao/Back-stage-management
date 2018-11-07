<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <div ref="chart" style="width:800px;height:600px;margin-top:15px;"></div>
    </el-card>
</template>
<script>
import echarts from "echarts";
export default {
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            // 初始化echarts
            const response = await this.$http.get("reports/:type");
            // 从服务器获取数据
            let option = response.data.data;
            const data = {
                title: {
                    text: "堆叠区域图"
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#6a7985"
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                }
            };
            option = {...data,...option};
            // 让内容充满屏幕
            option.xAxis[0].boundaryGap=false;
            const myChart = echarts.init(this.$refs.chart);

            myChart.setOption(option);
        }
    }
};
</script>
<style>
</style>
