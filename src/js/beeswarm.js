/* global d3 */
import './pudding-chart/beeswarm-template';
import 'intersection-observer';
import scrollama from 'scrollama';
const _ = require('lodash');

const dataFile = 'assets/data/faces.csv';
let data = null;
let modelData = [];
let chart = null;
let bodyWidth = null
let mobile = 480

const parseDate = d3.timeParse("%m/%d/%Y");
const formatDate = d3.timeFormat("%Y")

const beeswarmScroller = scrollama();

// selections
const $scrollContainer = d3.select('.scroll')
const $chartContainer = $scrollContainer.select('.scroll__graphic')
const $beeswarmChart = $chartContainer.select('.graphic__only')
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
	console.log($beeswarmChart)
	chart = $beeswarmChart
		.datum(data)
		.beeswarmChart()

	$modelImgs = d3.selectAll('.model-img')
	$modelCircles = d3.selectAll('.model-circle')
	$switch.node().checked = true
}

function handleStepEnter(response) {
	// response = { element, direction, index }
	$step.classed('is-active', (d, i) => i === response.index);

	renderStep(response.index, response.direction);
}

function renderStep(index, direction) {
	if (index === 0) {
		$switch.node().checked = false
		$modelImgs.classed('is-visible', false);
		$modelImgs.classed('faded', false)
		$modelCircles.classed('is-visible', true);
		chart.hideY();
	}
	if (index === 1) {
		chart.highlightInitTones(direction);
		chart.hideY();
	}
	if (index === 2) {
		chart.scatterTransition();
		chart.showY();
	}
	if (index === 3) {
		chart.highlightYears();
		chart.showY();
	}
	if (index === 4) {
		chart.highlightMids()
		chart.showY();
	}
	if (index === 5) {
		chart.transitionRectangle();
		chart.swapFaces();
		chart.showY();
	}
	if (index === 6) {
		chart.highlightLupita();
		chart.showY();
	}
	if (index === 7) {
		if (bodyWidth >= mobile){
			$modelImgs.classed('is-visible', true);
			$modelImgs.classed('faded', false)
			$modelCircles.classed('is-visible', false);
		}
		else {
			$modelImgs.classed('is-visible', false);
			$modelImgs.classed('faded', false)
			$modelCircles.classed('is-visible', true);
		}

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
	//$switch.node().checked = !$switch.node().checked
	const value = $modelDropdown.node().options[$modelDropdown.node().selectedIndex].text;
	const combinedName = value.replace(' ', '-')
	const faces = $switch.classed('is-faces')
	if (combinedName == 'All-models') {
			$switch.classed('is-faces', !faces);
			$modelImgs.classed('is-visible', !faces);
			$modelImgs.classed('faded', !faces);
			$modelImgs.classed('highlight', !faces);
			$modelCircles.classed('is-visible', faces);
			//$modelCircles.classed('faded', false)
			$modelCircles.classed('highlight', false);
	} else {
		if ($switch.node().checked == true) {
			$switch.classed('is-faces', false)
			$modelImgs.classed('highlight', false)
			$modelImgs.classed('faded', false)
			$modelImgs.classed('is-visible', false)
			$modelCircles.classed('is-visible', true)
			//$modelCircles.classed('faded', true)
			d3.selectAll(`.model-img-${combinedName}`).classed('highlight', true)
		}
		else if ($switch.node().checked == false) {
			$switch.classed('is-faces', true)
			$modelCircles.classed('highlight', false)
			$modelCircles.classed('is-visible', false)
			$modelImgs.classed('faded', true)
			$modelImgs.classed('highlight', false)
			$modelImgs.classed('is-visible', false)
			d3.selectAll(`.model-img-${combinedName}`).classed('highlight', true)
		}
	}
}

function handleDropdown() {
	const value = this.options[this.selectedIndex].text;
	let removeApostrophes = (value).replace("'", '')
	let combinedName = (removeApostrophes).replace(' ', '-')

	if (value == "All models"){

		if (bodyWidth >= mobile){
			if ($switch.node().checked == true) {
				$modelImgs.classed('is-visible', false)
				$modelCircles.classed('is-visible', true)
				$modelCircles.classed('faded', false)
			}
			else if ($switch.node().checked == false) {
				//$modelImgs.classed('faded', true)
				$modelImgs.classed('is-visible', true)
				$modelCircles.classed('is-visible', false)
				$modelImgs.classed('faded', false)
			}
		}
	}

	else {
		// clear selections
		$modelCircles.classed('highlight', false)
		$modelImgs.classed('faded', false)
		$modelImgs.classed('highlight', false)

		if (bodyWidth >= mobile){
			if ($switch.node().checked == true) {
				$modelImgs.classed('is-visible', false)
				//$modelCircles.classed('is-visible', true)
				//$modelCircles.classed('faded', true)
				d3.selectAll(`.model-img-${combinedName}`).classed('highlight', true).raise()
			}
			else if ($switch.node().checked == false) {
				//$modelImgs.classed('faded', true)
				$modelImgs.classed('is-visible', true)
				$modelCircles.classed('is-visible', false)
				$modelImgs.classed('faded', true)
				d3.selectAll(`.model-img-${combinedName}`).classed('highlight', true).raise()

				//d3.selectAll(`.model-circle-${combinedName}`).classed('highlight', true)
			}
		}

		else d3.selectAll(`.model-circle-${combinedName}`).classed('highlight', true).raise()

	}


}

function handleModelHovers() {
	$scrollButton.on('mouseover', function() {
		if ($switch.node().checked == true  && bodyWidth <= mobile){
			$modelImgs.classed('faded', false)
			$modelImgs.classed('highlight', false)
			$modelImgs.classed('is-visible', false)
			$modelCircles.classed('is-visible', true)
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
		}
		else if ($switch.node().checked == true  && bodyWidth >= mobile){
			$modelImgs.classed('faded', false)
			$modelImgs.classed('highlight', false)
			$modelImgs.classed('is-visible', false)
			$modelCircles.classed('is-visible', true)
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
		}
		else if ($switch.node().checked == false) {
			$modelCircles.classed('highlight', false)
			if (this.id == 'nyongo-button') {
				const nyongo = d3.select('#img-id-208_01_2018_0')
				nyongo.classed('highlight', true)
				nyongo.classed('is-visible', true)
				nyongo.classed('faded', false)
			}
			if (this.id == 'hathaway-button') {
				const hathaway = d3.select('#img-id-200_11_2010_0')
				hathaway.classed('highlight', true)
				hathaway.classed('is-visible', true)
				hathaway.classed('faded', false)
			}
			if (this.id == 'jones-button') {
				const jones = d3.select('#img-id-191_01_2001_0')
				jones.classed('highlight', true)
				jones.classed('is-visible', true)
				jones.classed('faded', false)
			}
			if (this.id == 'berry-button') {
				const berry = d3.select('#img-id-192_12_2002_0')
				berry.classed('highlight', true)
				berry.classed('is-visible', true)
				berry.classed('faded', false)
			}
			if (this.id == 'kebede-button') {
				const kedebe = d3.select('#img-id-195_05_2005_0')
				kedebe.classed('highlight', true)
				kedebe.classed('is-visible', true)
				kedebe.classed('faded', false)
			}
		}
	})
	$scrollButton.on('mouseout', function() {
		if ($switch.node().checked == true) {
			$modelImgs.classed('faded', false)
			$modelImgs.classed('highlight', false)
			$modelCircles.classed('highlight', false)
		}
		else if ($switch.node().checked == false) {
			$modelCircles.classed('highlight', false)
			$modelImgs.classed('is-visible', false)
			$modelImgs.classed('highlight', false)
		}
	})
}

function resize() {
	// 1. update height of step elements
	const stepHeight = Math.floor(window.innerHeight * 0.75);
	$step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	bodyWidth = d3.select('body').node().offsetWidth;

	// $beeswarmChart
	// 	.style('width', bodyWidth + 'px')
	// 	.style('height', window.innerHeight + 'px');

	const chartMargin = 32;
	const textWidth = $scrollText.node().offsetWidth;
	const chartWidth = $beeswarmChart.node().offsetWidth - textWidth - chartMargin;

	// 3. tell scrollama to update new element dimensions
	beeswarmScroller.resize();
	chart.resize()
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
