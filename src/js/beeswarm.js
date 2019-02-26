/* global d3 */
import './pudding-chart/beeswarm-template'
const dataFile = 'assets/data/faces.csv'
let data = null

// selections
const $scrollContainer = d3.select('.scroll')
const $beeswarmChart = $scrollContainer.select('.scroll__graphic')

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

function resize() {}

function init() {
  return new Promise((resolve) => {
    loadFaces()
      .then(response => {
        setupChart()
        resolve()
      })
  })
}

export default { init, resize };
