export default {
  line: {
    title: {
      text: "折线图"
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
    },
    yAxis: {
      type: "value"
    },
    dataset: {
      source: [],
    },
    series: [
      {
        type: "line",
        smooth: true,
      }
    ]
  },
  bar: {
    title: {
      text: "柱状图"
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
    },
    yAxis: {
      type: "value"
    },
    dataset: {
      source: [],
    },
    series: [
      {
        type: "bar",
      }
    ]
  },
  pie: {
    title: {
      text: "饼图"
    },
    tooltip: {
      trigger: "item",
    },
    dataset: {
      source: [],
    },
    series: [
      {
        type: "pie",
      }
    ]
  },
  custom: {
    title: {
      text: "自定义图表"
    },
    dataset: {
      source: [],
    },
    series: [
    ]
  }
}
