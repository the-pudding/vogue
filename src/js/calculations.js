import scrollama from 'scrollama';
const $section = d3.selectAll('.calculations')
const $container = $section.selectAll('.calculations__container')
const $cover = $container.selectAll('.calculations__container-cover')
const $faces = $container.selectAll('.calculations__container-faces')
const $scrollText = $section.selectAll('.scroll-text')
const $steps = $scrollText.selectAll('.step')

console.log({$container})

const scroller = scrollama();

function showCover(){
  $cover.classed('is-visible', true)
}

function hideCover(){
  $cover.classed('is-visible', false)
}

function setupScroll(){

}

function resize(){
  const stepHeight = Math.floor(window.innerHeight)
  console.log({$steps})

  $steps
    .style('height', `${stepHeight}px`)

  scroller.resize()
}

function init(){
  resize()
}

export default {init, resize}
