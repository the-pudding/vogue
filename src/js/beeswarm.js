/* global d3 */
import './pudding-chart/beeswarm-template';
import 'intersection-observer';
import scrollama from 'scrollama';
const dataFile = 'assets/data/faces.csv';
let data = null;

const beeswarmScroller = scrollama();

// selections
const $scrollContainer = d3.select('.scroll')
const $beeswarmChart = $scrollContainer.select('.scroll__graphic')
const $scrollText = $scrollContainer.select('.scroll__text')
const $step = $scrollText.selectAll('.step')

function loadFaces(){
	return new Promise((resolve, reject) => {
    d3.csv(dataFile)
      .then(response => {
          data = response
          resolve(data)
        })
      .catch(error => console.log("error loading data"))
		})
}

function setupChart() {
	const chart = $beeswarmChart
		.datum(data)
		.beeswarmChart()
}

function handleStepEnter(response) {
	// response = { element, direction, index }
	$step.classed('is-active', (d, i) => i === response.index);
}

function setupScroll() {
	beeswarmScroller
		.setup({
		  step: '.scroll__text .step',
			offset: 0.7
		})
		.onStepEnter(handleStepEnter);
}

function resize() {
	// 1. update height of step elements
	const stepHeight = Math.floor(window.innerHeight * 0.75);
	$step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	const bodyWidth = d3.select('body').node().offsetWidth;

	$beeswarmChart
		.style('width', bodyWidth + 'px')
		.style('height', window.innerHeight + 'px');

	const chartMargin = 32;
	const textWidth = $scrollText.node().offsetWidth;
	const chartWidth = $beeswarmChart.node().offsetWidth - textWidth - chartMargin;


	// 3. tell scrollama to update new element dimensions
	beeswarmScroller.resize();
}

function init() {
  return new Promise((resolve) => {
    loadFaces()
      .then(response => {
				resize()
        setupChart()
				setupScroll()
        resolve()
      })
  })
}

export default { init, resize };
