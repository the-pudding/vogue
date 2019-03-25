import scrollama from 'scrollama';
const $section = d3.selectAll('.calculations')
const $container = $section.selectAll('.calculations__container')
const $cover = $container.selectAll('.calculations__container-cover')
const $faces = $container.selectAll('.calculations__container-faces')
const $onlyFaces = $faces.selectAll('.face-0, .face-1')
const $facesFull = $faces.selectAll('.face-full')
const $facesCrop = $faces.selectAll('.face-crop')
const $facesSkin = $faces.selectAll('.face-skin')
const $scrollText = $section.selectAll('.scroll-text')
const $steps = $scrollText.selectAll('.step')

const scroller = scrollama();

function showCover(){
  $cover.classed('is-visible', true)
}

function hideCover(){
  $cover.classed('is-visible', false)
}

function showFaces(type){
  if (type === 'full') $facesFull.classed('is-visible', true)
  if (type === 'crop') $facesCrop.classed('is-visible', true)
  if (type === 'skin') $facesSkin.classed('is-visible', true)
}

function hideFaces(type){
  if (type === 'full') $facesFull.classed('is-visible', false)
  if (type === 'crop') $facesCrop.classed('is-visible', false)
  if (type === 'skin') $facesSkin.classed('is-visible', false)
}

function facesOnCover(){
  $facesFull.classed('on-cover', true)
}

function facesOffCover(){
  $facesFull.classed('on-cover', false)
}

function emptyBackground(){
  $onlyFaces.classed('filled', false)
  $onlyFaces.classed('lightness', false)
}

function fillBackground(){
  $onlyFaces.classed('filled', true)
  $onlyFaces.classed('lightness', false)
}

function showLightness(){
  $onlyFaces.classed('lightness', true)
}

function handleStepEnter(response){
  const index = response.index
  $steps.classed('is-active', (d, i) => i === index);

  if (index === 0) {
    showCover()
    facesOnCover()
    hideFaces('full')
    hideFaces('crop')
    hideFaces('skin')
    emptyBackground()
  }
  if (index === 1){
    hideCover()
    facesOffCover()
    showFaces('full')
    hideFaces('crop')
    hideFaces('skin')
    emptyBackground()
  }
  if (index === 2){
    hideCover()
    hideFaces('full')
    hideFaces('crop')
    showFaces('skin')
    emptyBackground()
  }
  if (index === 3){
    hideCover()
    hideFaces('full')
    hideFaces('crop')
    hideFaces('skin')
    fillBackground()
  }
  if (index === 4){
    hideCover()
    hideFaces('full')
    hideFaces('crop')
    hideFaces('skin')
    showLightness()
  }
}

function setupScroll() {
	scroller
		.setup({
		  step: '.calculations .step',
			offset: 0.7
		})
		.onStepEnter(handleStepEnter);
}

function resize(){
  const stepHeight = Math.floor(window.innerHeight)
  console.log({$steps})

  $steps
    .style('height', `${stepHeight}px`)

  scroller.resize()
}

function init(){
  setupScroll()
  resize()
}

export default {init, resize}
