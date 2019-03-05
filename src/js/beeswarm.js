/* global d3 */
import './pudding-chart/beeswarm-template';
import 'intersection-observer';
import scrollama from 'scrollama';
const _ = require('lodash');

const dataFile = 'assets/data/faces.csv';
let data = null;
let modelData = [];
let chart = null;

const parseDate = d3.timeParse("%m/%d/%Y");

const beeswarmScroller = scrollama();

// selections
const $scrollContainer = d3.select('.scroll')
const $beeswarmChart = $scrollContainer.select('.scroll__graphic')
const $scrollText = $scrollContainer.select('.scroll__text')
const $step = $scrollText.selectAll('.step')
const $modelDropdown = d3.select('#model-dropdown')
const $switch = $scrollContainer.select('.switch')

function cleanFaces(arr){
	return arr.map((d, i) => {
		return {
			...d,
			date: parseDate(d.date)
		}
	})

}

function loadFaces(){
	return new Promise((resolve, reject) => {
    d3.csv(dataFile)
      .then(response => {
          data = cleanFaces(response)
          resolve(data)
        })
      .catch(error => console.log("error loading data"))
		})
}

function setupChart() {
	chart = $beeswarmChart
		.datum(data)
		.beeswarmChart()
}

function handleStepEnter(response) {
	// response = { element, direction, index }
	$step.classed('is-active', (d, i) => i === response.index);

	renderStep(response.index);
}

function renderStep(index) {
	if (index === 0) {
		d3.selectAll('.model-circle').classed('highlight', false)
	}
	if (index === 1) {
		chart.highlightDarkTones();
	}
	if (index === 2) {
		chart.highlightLightTones();
	}
	if (index === 3) {
		chart.scatterTransition();
	}
}

function setupScroll() {
	beeswarmScroller
		.setup({
		  step: '.scroll__text .step',
			offset: 0.7
		})
		.onStepEnter(handleStepEnter);
}

function setupDropdown() {
	const uniqModels = _.uniqBy(data, 'model')
	modelData.push(uniqModels.map(function(obj) { return obj.model; }).sort())
	modelData[0].unshift('Pick a model')

	$modelDropdown.selectAll('option')
    .data(modelData[0])
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d)
}

// TODO reverse
function handleToggle() {
	const $modelImgs = d3.selectAll('.model-img')
	const $modelCircles = d3.selectAll('.model-circle')

	$switch.on('click', () => {
		const faces = $switch.classed('is-faces')
		$switch.classed('is-faces', !faces);
		$modelImgs.classed('is-visible', true);
		$modelCircles.classed('is-visible', false);
	});
}

function handleDropdown() {
	const value = this.options[this.selectedIndex].text;
	const combinedName = value.replace(' ', '-')

	// clear selections
	d3.selectAll(`.model-circle`).classed('highlight', false)
	d3.selectAll(`.model-img`).classed('highlight', false)

	d3.selectAll(`.model-circle-${combinedName}`).classed('highlight', true)
	d3.selectAll(`.model-img-${combinedName}`).classed('highlight', true)
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
				setupDropdown()
				handleToggle()

				$modelDropdown.on('change', handleDropdown)

        resolve()
      })
  })
}

export default { init, resize };
