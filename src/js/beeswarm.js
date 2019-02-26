/* global d3 */
import './pudding-chart/beeswarm-template'
const dataFile = 'assets/data/faces.csv'
let data = null

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

function resize() {}

function init() {
  loadFaces()
}

export default { init, resize };
