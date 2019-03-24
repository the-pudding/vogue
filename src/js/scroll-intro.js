let data = []

const parseDate = d3.timeParse("%m/%d/%Y");
const formatYear = d3.timeFormat("%Y")

const $section = d3.selectAll('.scroll-intro')
const $container = $section.selectAll('.face-grid')

function setupCharts(){
  const faceGroups = $container.selectAll('.face-group')
    .data(data)
    .join(
      enter =>{
      const group = enter.append('div')
        .attr('class', 'face-group')

      group.append('img')
        .attr('class', (d, i) => `grid-face grid-face-${i}`)
        .attr('src', d => `assets/images/faces200/${d.file_name}`)
      group.append('img')
        .attr('class', (d, i) => `grid-cover grid-cover-${i}`)
        .attr('src', d => `assets/images/covers500/${d.coverFile}`)


      }
    )

}

function cleanData(arr){
  return arr.map((d, i) => {
    return {
      ...d,
      date: parseDate(d.date),
      year: formatYear(parseDate(d.date)),
      l: +d.l,
    }
  })
}

function resize(){

}

function init(){
  return new Promise((resolve, reject) => {
    d3.csv('assets/data/unique.csv')
      .then(response => {
          data = cleanData(response)
          resolve(data)
          setupCharts()
        })
      .catch(error => console.log("error loading data"))
  })
}
export default {init, resize}
