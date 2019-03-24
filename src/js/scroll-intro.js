import scrollama from 'scrollama';

const scroller = scrollama();

let data = []

const parseDate = d3.timeParse("%m/%d/%Y");
const formatYear = d3.timeFormat("%Y")

const $section = d3.selectAll('.scroll-intro')
const $container = $section.selectAll('.face-grid')
let $group = null
let $covers = null
let $faces = null
//const $facesSkin = $faces.selectAll('.face-skin')
const $scrollText = $section.selectAll('.scroll-text')
const $steps = $scrollText.selectAll('.step')


function setupCharts(){
  const faceGroups = $container.selectAll('.face-group')
    .data(data)
    .join(
      enter =>{
      $group = enter.append('div')
        .attr('class', 'face-group')

      $faces = $group.append('img')
        .attr('class', (d, i) => `grid-face grid-face-${i}`)
        .attr('src', d => `assets/images/faces200/${d.file_name}`)
      $covers = $group.append('img')
        .attr('class', (d, i) => `grid-cover grid-cover-${i}`)
        .attr('src', d => `assets/images/covers500/${d.coverFile}`)

      }
    )
}

function hideCovers(){
  $covers
    .transition()
    .duration(500)
    .style('opacity', 0)
  console.log({$covers})
}

function showCovers(){
  $covers
    .attr('opacity', 0)
    .transition()
    .duration(500)
    .delay((d, i) => i * 50)
    .style('opacity', 1)
}

function showFaces(){
  $faces.classed('is-visible', true)
}

function hideFaces(){
  $faces.classed('is-visible', false)
}

function showSkin(){

}

function hideSkin(){

}

function showHue(){
  $group
    .transition()
    .duration(500)
    .style('background-color', d => d.tone)
}

function showLightness(){
  $group
    .transition()
    .duration(500)
    .style('background-color', d => d3.hsl(0, 0, d.l))
}



function handleStepEnter(response){
  const index = response.index
  $steps.classed('is-active', (d, i) => i === index);
  console.log({index})

  if (index === 0){
    hideCovers()
    hideFaces()
  }
  if (index === 1){
    showCovers()
    hideFaces()
  }
  if (index === 2){
    hideCovers()
    showFaces()
  }
  if (index === 3){
    hideCovers()
    hideFaces()
    showSkin()
  }
  if (index === 4){
    hideCovers()
    hideFaces()
    hideSkin()
    showHue()
  }
  if (index === 5){
    hideCovers()
    hideFaces()
    hideSkin()
    showLightness()
  }
}

function setupScroll() {
	scroller
		.setup({
		  step: '.scroll-text-intro .step',
			offset: 0.7
		})
		.onStepEnter(handleStepEnter);
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
  const stepHeight = Math.floor(window.innerHeight)

  $steps
    .style('height', `${stepHeight}px`)

  scroller.resize()
}

function init(){
  return new Promise((resolve, reject) => {
    d3.csv('assets/data/unique.csv')
      .then(response => {
          data = cleanData(response)
          resolve(data)
          setupCharts()
          resize()
          setupScroll()
        })
      .catch(error => console.log("error loading data"))
  })
}
export default {init, resize}
