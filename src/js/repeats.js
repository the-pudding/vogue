import loadData from './load-data';
import './pudding-chart/repeats-template'

let data = []
let $sel = []
let nested = []
let charts = null

// selections
const $container = d3.select('.repeat-models')
const $imageCont = d3.select('.repeat-models-container')
const $moreButton = d3.select('.show-more')

function handleShowMoreClick() {
  console.log('clicked')
  $container.classed('is-expanded', true)
  $moreButton.classed('is-visible', false)
}

function handleModelClick(){
  const $selectedModel = d3.select(this)
  const $models = d3.selectAll('.model')
  $models.classed('highlight', false)
  $selectedModel.classed('highlight', true)
}



function setupChart(){
  nested = d3.nest()
    .key(d => d.model)
    .entries(data)
    .sort((a, b) => d3.descending(a.values.length, b.values.length))
    .filter(data => data.values.length > 1)

  charts = $container
    .selectAll('.model')
    .data(nested)
    .enter()
    .append('div')
    .attr('class', 'model')
    .on('click', handleModelClick)
    .repeatModel()

}

function setupImageContainer(){
  const maxCovers = d3.range(9)

  const imageGroups = $imageCont.selectAll('.g-img')
    .data(maxCovers)
    .enter()
    .append('div')
    .attr('class', 'g-img')

  const imageContainer = imageGroups.append('div').attr('class', 'img-container')
  imageContainer.append('img')
  imageGroups.append('div').attr('class', 'img-tone')
  imageGroups.append('p').attr('class','img-year')
}

function init(){
  Promise.all([loadData()])
    .then(results => {
      data = results[0]
      setupImageContainer()

    })
    .then(() => {
      setupChart()

      //make gisele the default
      d3.select('.model').classed('highlight', true)
      d3.selectAll('.g-img').classed('hidden', false)

      $moreButton.on('click', handleShowMoreClick)
    })
}

function resize(){
  charts.forEach(d => d.resize())
}

export default {init, resize}
