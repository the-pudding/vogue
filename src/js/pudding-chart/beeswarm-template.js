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
		const marginTop = 0;
		const marginBottom = 16;
		const marginLeft = 16;
		const marginRight = 16;

		let simulation = null;
		let axisPadding = null;
		let radius = 10;

		// scales
		let scaleX = null;
		let scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
		let $xAxisGroup = null
		let $xAxis = null;
		let $cell = null;
		let $circle = null;
		let $faces = null;
		let $darkerLabel = null;
		let $lighterLabel = null;

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
					.attr('transform', `translate(${marginLeft},${height})`)

				$darkerLabel = $xAxisGroup.append('text').text('Darker tones').attr('class','darker label')
				$lighterLabel = $xAxisGroup.append('text').text('Lighter tones').attr('class','lighter label')

				const $g = $svg.append('g');

				// offset chart for margins
				$g.attr('transform', `translate(${marginLeft}, ${marginTop})`);

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

				// scale
				scaleX = d3.scaleLinear()
					.rangeRound([0, width])
					.domain(d3.extent(data, d => d.l))

				$xAxis = d3
					.axisBottom(scaleX)
					.tickPadding(8)
					.ticks(10);

				$axis.select('.x')
					.attr('transform', `translate(${marginLeft},${axisPadding})`)
					.call($xAxis);

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

				$cell
					.selectAll('g')
					.data(d3.voronoi().extent([[-marginLeft, -marginTop], [width + marginRight, height + marginTop]])
					.x(function(d) { return d.x; })
	        .y(function(d) { return d.y; })
	      	.polygons(data)).enter().append('g');

				$circle = $cell.selectAll('g').append('circle')
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
					.attr('cx', function(d) { return d.data.x; })
					.attr('cy', function(d) { return d.data.y; });

				$cell.selectAll('g').append('clipPath')
					.attr('id', function(d) {
						let splitz = (d.data.file_name).split('.')[0]
						return `${splitz}-clipCircle`
					})
					.append("circle")
			    .attr("r", radius)
					.attr('cx', function(d) { return d.data.x; })
					.attr('cy', function(d) { return d.data.y; })

				$faces = $cell.selectAll('g').append('svg:image')
					.attr('xlink:href', function(d) { return `assets/images/faces200/${d.data.file_name}`})
					.attr('x', function(d) { return d.data.x - radius;})
	        .attr('y', function(d) { return d.data.y - radius;})
	        .attr('height', radius*2)
	        .attr('width', radius*2)
					.attr('id', function(d) {
						let splitz = (d.data.file_name).split('.')[0]
						return `img-id img-id-${splitz}`
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
					.attr('width', width + marginLeft + marginRight)
					.attr('height', height + marginTop + marginBottom);
				return Chart;
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
