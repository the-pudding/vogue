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
const formatDate = d3.timeFormat("%Y")

const beeswarmScroller = scrollama();

// selections
const $scrollContainer = d3.select('.scroll')
const $beeswarmChart = $scrollContainer.select('.scroll__graphic')
const $scrollText = $scrollContainer.select('.scroll__text')
const $step = $scrollText.selectAll('.step')
const $modelDropdown = d3.select('#model-dropdown')
const $switch = $scrollContainer.select('.switch input')
let $modelImgs = null
let $modelCircles = null
const $nyongoHover = d3.selectAll('#nyongo-button')
const $nyongoAllHover = d3.selectAll('#nyongo-all-button')
const $hathawayHover = d3.selectAll('#hathaway-button')
const $jonesHover = d3.selectAll('#jones-button')
const $berryHover = d3.selectAll('#berry-button')
const $kebedeHover = d3.selectAll('#kebede-button')
const $scrollButton = d3.selectAll('.scroll-button')

function cleanFaces(arr){
	return arr.map((d, i) => {
		return {
			...d,
			date: parseDate(d.date),
			year: formatDate(parseDate(d.date))
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

	$modelImgs = d3.selectAll('.model-img')
	$modelCircles = d3.selectAll('.model-circle')
}

function handleStepEnter(response) {
	// response = { element, direction, index }
	$step.classed('is-active', (d, i) => i === response.index);

	renderStep(response.index);
}

function renderStep(index) {
	if (index === 0) {
		$switch.node().checked = false
		$modelImgs.classed('is-visible', false);
		$modelImgs.classed('faded', false)
		$modelCircles.classed('is-visible', true);
	}
	if (index === 1) {
		$switch.node().checked = true
		chart.swapFaces()
		//chart.highlightInitTones();
	}
	if (index === 2) {
		chart.scatterTransition();
	}
	if (index === 3) {
		chart.highlightYears();
		//chart.highlightBlackWomen();
	}
	if (index === 4) {
		chart.transitionRectangle()
	}
	if (index === 5) {
		chart.highlightLupita();
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
	modelData[0].unshift('All models')

	$modelDropdown.selectAll('option')
    .data(modelData[0])
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d)
}

function handleToggle() {
	const value = $modelDropdown.node().options[$modelDropdown.node().selectedIndex].text;
	const combinedName = value.replace(' ', '-')
	const faces = $switch.classed('is-faces')
	if (combinedName == 'All-models') {
		$switch.classed('is-faces', !faces);
		$modelImgs.classed('is-visible', !faces);
		$modelImgs.classed('faded', !faces);
		$modelImgs.classed('highlight', !faces);
		$modelCircles.classed('is-visible', faces);
		$modelCircles.classed('highlight', !faces);
	} else {
		if ($switch.node().checked == true) {
			$modelImgs.classed('highlight', false)
			$modelImgs.classed('faded', true)
			$modelCircles.classed('is-visible', faces);
			d3.selectAll(`.model-img-${combinedName}`).classed('highlight', true)
		}
		else if ($switch.node().checked == false) {
			$modelCircles.classed('highlight', false)
			$modelCircles.classed('is-visible', !faces)
			$modelImgs.classed('faded', false)
			$modelImgs.classed('highlight', false)
			d3.selectAll(`.model-circle-${combinedName}`).classed('highlight', true)
		}
	}
}

function handleDropdown() {
	const value = this.options[this.selectedIndex].text;
	const combinedName = value.replace(' ', '-')

	// clear selections
	$modelCircles.classed('highlight', false)
	$modelImgs.classed('faded', false)
	$modelImgs.classed('highlight', false)

	if ($switch.node().checked == true) {
		$modelImgs.classed('faded', true)
		d3.selectAll(`.model-img-${combinedName}`).classed('highlight', true)
	}
	else if ($switch.node().checked == false) {
		d3.selectAll(`.model-circle-${combinedName}`).classed('highlight', true)
	}
}

function handleModelHovers() {
	$scrollButton.on('mouseover', function() {
		if ($switch.node().checked == true){
			$modelImgs.classed('faded', true)
			$modelImgs.classed('highlight', false)
			if (this.id == 'nyongo-button') {
				d3.select('#img-id-208_01_2018_0').classed('highlight', true)
			}
			if (this.id == 'hathaway-button') {
				d3.select('#img-id-200_11_2010_0').classed('highlight', true)
			}
			if (this.id == 'jones-button') {
				d3.select('#img-id-191_01_2001_0').classed('highlight', true)
			}
			if (this.id == 'berry-button') {
				d3.select('#img-id-192_12_2002_0').classed('highlight', true)
			}
			if (this.id == 'kebede-button') {
				d3.select('#img-id-195_05_2005_0').classed('highlight', true)
			}
			if (this.id == 'nyongo-all-button') {
				d3.selectAll('.model-img-Lupita-Nyongo').classed('highlight', true)
			}
		}
		else if ($switch.node().checked == false) {
			$modelCircles.classed('highlight', false)
			if (this.id == 'nyongo-button') {
				d3.select('#circle-id-208_01_2018_0').classed('highlight', true)
			}
			if (this.id == 'hathaway-button') {
				d3.select('#circle-id-200_11_2010_0').classed('highlight', true)
			}
			if (this.id == 'jones-button') {
				d3.select('#circle-id-191_01_2001_0').classed('highlight', true)
			}
			if (this.id == 'berry-button') {
				d3.select('#circle-id-192_12_2002_0').classed('highlight', true)
			}
			if (this.id == 'kebede-button') {
				d3.select('#circle-id-195_05_2005_0').classed('highlight', true)
			}
			if (this.id == 'nyongo-all-button') {
				d3.selectAll('.model-circle-Lupita-Nyongo').classed('highlight', true)
			}
		}
	})
	$scrollButton.on('mouseout', function() {
		if ($switch.node().checked == true) {
			$modelImgs.classed('faded', false)
			$modelImgs.classed('highlight', false)
		}
		else if ($switch.node().checked == false) {
			$modelCircles.classed('highlight', false)
		}
	})
}

function resize() {
	// 1. update height of step elements
	const stepHeight = Math.floor(window.innerHeight * 0.75);
	$step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	const bodyWidth = d3.select('body').node().offsetWidth;

	// $beeswarmChart
	// 	.style('width', bodyWidth + 'px')
	// 	.style('height', window.innerHeight + 'px');

	const chartMargin = 32;
	const textWidth = $scrollText.node().offsetWidth;
	const chartWidth = $beeswarmChart.node().offsetWidth - textWidth - chartMargin;


	// 3. tell scrollama to update new element dimensions
	beeswarmScroller.resize();
	//chart.resize()
}

function init() {
  return new Promise((resolve) => {
    loadFaces()
      .then(response => {
        setupChart()
				resize()
				setupScroll()
				setupDropdown()
				handleModelHovers()

				$modelDropdown.on('change', handleDropdown)
				$switch.on('click', handleToggle)

        resolve()
      })
  })
}

export default { init, resize };
