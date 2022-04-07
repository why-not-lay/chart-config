export default {
  line: {
    title: {
      text: "折线图"
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
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
  custom: {

  }
}
