import loadData from './load-data';
import './pudding-chart/repeats-template'

let data = []
let $sel = []
let nested = []

// selections
const $container = d3.select('.repeat-models')
const $imageCont = d3.select('.repeat-models-img')

function setupChart(){
  nested = d3.nest()
    .key(d => d.model)
    .entries(data)
    .sort((a, b) => d3.descending(a.values.length, b.values.length))

  const charts = $container
    .selectAll('.model')
    .data(nested)
    .enter()
    .append('div')
    .attr('class', 'model')
    .repeatModel()
}

function setupImageContainer(){
  const maxCovers = d3.range(9)

  const imageGroups = $imageCont.selectAll('.g-img')
    .data(maxCovers)
    .enter()
    .append('div')
    .attr('class', 'g-img')

  imageGroups.append('img')
  imageGroups.append('div').attr('class', 'img-tone')
}

function init(){
  Promise.all([loadData()])
    .then(results => {
      data = results[0]
      setupChart()
      setupImageContainer()
    })
}

function resize(){

}

export default {init, resize}
