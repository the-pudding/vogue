/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.beeswarmChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 16;
		const marginBottom = 16;
		const marginLeft = 32;
		const marginRight = 16;
		const padding = 16;

		let simulation = null;
		let axisPadding = null;
		let radius = 10;
		const parseDate = d3.timeParse("%m/%d/%Y");
		const formatDate = d3.timeFormat("%Y")

		// scales
		let scaleX = null;
		let scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
		let $xAxisGroup = null
		let $xAxis = null;
		let $yAxisGroup = null
		let $yAxis = null;
		let $cell = null;
		let $pod = null;
		let $circle = null;
		let $clip = null;
		let $faces = null;
		let $darkerLabel = null;
		let $lighterLabel = null;
		let $yearRect = null;


		// helper functions

		const Chart = {
			// called once at start
			init() {
				$svg = $sel.append('svg').attr('class', 'pudding-chart');

				// create axis
				$axis = $svg.append('g').attr('class', 'g-axis');

				// draw axes
				$xAxisGroup = $axis.append('g')
					.attr('class', 'x axis')
					.attr('transform', `translate(${marginRight},${height})`)

				$darkerLabel = $xAxisGroup.append('text').text('Darker tones').attr('class','darker label')
				$lighterLabel = $xAxisGroup.append('text').text('Lighter tones').attr('class','lighter label')

				$yAxisGroup = $axis.append('g')
					.attr('class', 'y axis')
					.attr('transform', `translate(${marginLeft},${height})`)

				$yearRect = $yAxisGroup.append('rect').attr('class','year-rect')

				const $g = $svg.append('g');

				// offset chart for margins
				$g.attr('transform', `translate(${marginRight}, ${marginTop})`);

				// setup viz group
				$vis = $g.append('g').attr('class', 'g-vis');

				$cell = $vis.append('g').attr('class', 'cells');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;

				axisPadding = height/2;

				// scaleX
				scaleX = d3.scaleLinear()
					.range([padding * 2, width - padding])
					.domain(d3.extent(data, d => d.l))

				$xAxis = d3
					.axisBottom(scaleX)
					.tickPadding(8)
					.ticks(10);

				$axis.select('.x')
					.attr('transform', `translate(${marginRight},${axisPadding + marginTop})`)
					.call($xAxis);

				// scaleY
				scaleY = d3.scaleLinear()
					.rangeRound([0, height])
					.domain(d3.extent(data, d => d.year))

				$yAxis = d3
					.axisLeft(scaleY)
					.tickPadding(8)
					.ticks(10);


				$axis.select('.y')
					.attr('transform', `translate(${marginLeft + (marginRight/2)},${marginTop})`)
					.call($yAxis);

				$yearRect
					.attr("x", 0)
					.attr("y", -radius)
					.attr("width", width)
					.attr("height", scaleY(2005) +  (radius * 2))
					//.attr('transform',  `translate(0, ${-radius})`)

				$darkerLabel.attr('transform', `translate(7,${axisPadding/2})`)
				$lighterLabel.attr('transform', `translate(${width - 7},${axisPadding/2})`)

				$xAxisGroup.append('path')
					.attr('d', d3.symbol().type(d3.symbolTriangle).size(32))
					.attr('transform', `translate(0,${(axisPadding/2) - 4}) rotate(-90)`);

				$xAxisGroup.append('path')
					.attr('d', d3.symbol().type(d3.symbolTriangle).size(32))
					.attr('transform', `translate(${width},${(axisPadding/2) - 4}) rotate(90)`);

				// collision
				simulation = d3.forceSimulation(data)
					.force("x", d3.forceX(function(d) { return scaleX(d.l); }).strength(1))
					.force("y", d3.forceY(height / 2))
					.force("collide", d3.forceCollide(radius + 1))
					.stop();

				for (var i = 0; i < 200; ++i) simulation.tick();

				$pod = $cell
					.selectAll('g')
					.data(d3.voronoi().extent([[-marginLeft, -marginTop], [width + marginRight, height + marginTop]])
					.x(function(d) { return d.x; })
	        .y(function(d) { return d.y; })
	      	.polygons(data)).enter().append('g')
					.attr('class', 'g-pods')
					.attr('transform', d => `translate(${d.data.x}, ${d.data.y})`)

				console.log({$pod})

				$circle = $pod.append('circle')
					.attr('r', radius)
					.attr('id', function(d) {
						let splitz = (d.data.file_name).split('.')[0]
						return `circle-id circle-id-${splitz}`
					})
					.attr('class', function(d) {
						let combinedName = (d.data.model).replace(' ', '-')
						return `model-circle model-circle-${combinedName} is-visible`
					})
					.style('fill', function(d) { return `${d.data.tone}`; })
					// .attr('cx', function(d) { return d.data.x; })
					// .attr('cy', function(d) { return d.data.y; });

				$clip = $pod.append('clipPath')
					.attr('id', function(d) {
						let splitz = (d.data.file_name).split('.')[0]
						return `${splitz}-clipCircle`
					})
					.append("circle")
			    .attr("r", radius)
					// .attr('cx', function(d) { return d.data.x; })
					// .attr('cy', function(d) { return d.data.y; })

				$faces = $pod.append('svg:image')
					.attr('xlink:href', function(d) { return `assets/images/faces200/${d.data.file_name}`})
					.attr('x', function(d) { return - radius;})
	        .attr('y', function(d) { return - radius;})
	        .attr('height', radius*2)
	        .attr('width', radius*2)
					.attr('id', function(d) {
						let splitz = (d.data.file_name).split('.')[0]
						return `img-id-${splitz}`
					})
					.attr('class', function(d) {
						let combinedName = (d.data.model).replace(' ', '-')
						return `model-img model-img-${combinedName}`
					})
					.attr('clip-path', function(d) {
						let splitz = (d.data.file_name).split('.')[0]
						return `url(#${splitz}-clipCircle)`
					})

				$svg
					.attr('width', width + marginRight)
					.attr('height', height + marginTop + marginBottom);
				return Chart;
			},
			swapFaces(){
				console.log({step2A: $pod})
				d3.selectAll('.model-img').classed('is-visible', true);
				d3.selectAll('.model-circle').classed('is-visible', false);
				$pod.attr('transform', d => `translate(${d.data.x}, ${d.data.y})`).transition(2000).ease(d3.easeLinear);
				return Chart
			},
			// highlight tones
			highlightInitTones() {
				console.log('step2B')
				console.log({$pod})
				d3.selectAll('.model-img').classed('faded', true)
				d3.selectAll('.model-img').classed('highlight', false)
				d3.selectAll('#img-id-208_01_2018_0').classed('highlight', true)
				d3.selectAll('#img-id-200_11_2010_0').classed('highlight', true)
				$pod.attr('transform', d => `translate(${d.data.x}, ${d.data.y})`).transition(2000).ease(d3.easeLinear);

				// $circle.attr('cy', function(d) { return d.data.y; }).transition(2000).ease(d3.easeLinear);
				// $clip.attr('cy', function(d) { return d.data.y; }).transition(2000).ease(d3.easeLinear);
				// $faces.attr('y', function(d) { return d.data.y - radius;}).transition(2000).ease(d3.easeLinear);
				$yearRect.style('opacity', 0);
				return Chart;
			},
			// scatterTransition
			scatterTransition(){
				console.log({step3: $pod})
				d3.selectAll('.model-img').classed('highlight', false)
				d3.selectAll('.model-img').classed('faded', false)

				$pod
					.transition(5000)
					.delay((d, i) => i * 50)
					.ease(d3.easeLinear)
					.attr('transform', d => `translate(${d.data.x}, ${scaleY(d.data.year)})`)
				// $circle.attr('cy', function(d) { return scaleY(d.data.year) }).transition(2000);
				// $clip.attr('cy', function(d) { return scaleY(d.data.year) }).transition(2000);
				// $faces.attr('y', function(d) { return scaleY(d.data.year) - radius}).transition(2000);
				$yearRect.style('opacity', 0);
				return Chart
			},
			highlightYears(){
				console.log('step4A')
				$yearRect.style('opacity', 1);
				return Chart
			},
			highlightBlackWomen(){
				console.log('step4B')
				d3.selectAll('.model-img').classed('highlight', false)
				d3.selectAll('.model-img').classed('faded', true)
				d3.select('#img-id-191_01_2001_0').classed('highlight', true)
				d3.select('#img-id-192_12_2002_0').classed('highlight', true)
				d3.select('#img-id-195_05_2005_0').classed('highlight', true)
				$pod.attr('transform', d => `translate(${d.data.x}, ${scaleY(d.data.year)})`).transition(2000).ease(d3.easeLinear);
				// $circle.attr('cy', function(d) { return scaleY(d.data.year) }).transition(5000).ease(d3.easeLinear);
				// $clip.attr('cy', function(d) { return scaleY(d.data.year) }).transition(5000).ease(d3.easeLinear);
				// $faces.attr('y', function(d) { return scaleY(d.data.year) - radius}).transition(5000).ease(d3.easeLinear);
				$yearRect
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr('y', -radius)
					.attr('height', scaleY(2005) +  (radius * 2));
				return Chart
			},
			transitionRectangle(){
				d3.selectAll('.model-img').classed('highlight', false)
				d3.selectAll('.model-img').classed('faded', false)
				$yearRect
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr('y', scaleY(2006) - radius)
					.attr('height', (scaleY(2018) - scaleY(2006)) + (radius * 2))
			},
			highlightLupita(){
				console.log('step6')
				d3.selectAll('.model-img').classed('highlight', false)
				d3.selectAll('.model-img').classed('faded', true)
				d3.selectAll('.model-img-Lupita-Nyongo').classed('highlight', true)
				$yearRect.style('opacity', 0);
				return Chart
			},
			// update scales and render chart
			render() {
				return Chart;
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$sel.datum(data);
				Chart.render();
				return Chart;
			}
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
