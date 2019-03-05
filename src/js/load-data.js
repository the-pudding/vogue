const parseDate = d3.timeParse("%m/%d/%Y");

function cleanData(arr){
  return arr.map((d, i) => {
    return {
      ...d,
      date: parseDate(d.date)
    }
  })
}



function init(){
  return new Promise((resolve, reject) => {
    d3.csv('assets/data/faces.csv')
      .then(response => {
          const data = cleanData(response)
          resolve(data)
        })
      .catch(error => console.log("error loading data"))
  })
}
export default init
