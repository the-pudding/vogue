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
		const marginBottom = 32;
		const marginLeft = 32;
		const marginRight = 16;
		const padding = 16;

		let simulation = null;
		let axisPadding = null;
		let radius = 5;
		const parseDate = d3.timeParse("%m/%d/%Y");
		const formatDate = d3.timeFormat("%Y")

		// scales
		let scaleX = null;
		let scaleY = null;

		// dom elements
		const $beeswarmToggle = d3.selectAll('.img-toggle')
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
		let $darkerArrow = null;
		let $lighterArrow = null;
		let $yearRect = null;
		let $leftLine = null;
		let $rightLine = null;

		// helper functions
		function appendCircles(enter){
		  let circle = enter.append('circle')
		    //.attr('r', radius)
		    .attr('id', function(d) {
		      let splitz = (d.data.file_name).split('.')[0]
		      return `circle-id-${splitz}`
		    })
		    .attr('class', function(d) {
		      let combinedName = (d.data.model).replace(' ', '-')
		      return `model-circle model-circle-${combinedName} is-visible`
		    })
		    .style('fill', function(d) { return `${d.data.tone}`; })

			$circle = d3.selectAll('.model-circle')

		 let clip = enter.append('clipPath')
		    .attr('id', function(d) {
		      let splitz = (d.data.file_name).split('.')[0]
		      return `${splitz}-clipCircle`
		    })
		    .append("circle")
		    //.attr("r", radius)
				.attr('class', 'clip-path')

			$clip = d3.selectAll('.clip-path')

		    let faces = enter.append('svg:image')
		      .attr('xlink:href', function(d) { return `assets/images/faces200/${d.data.file_name}`})
		      //.attr('x', function(d) { return - radius;})
		      //.attr('y', function(d) { return - radius;})
		      //.attr('height', radius*2)
		      //.attr('width', radius*2)
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

				$faces = d3.selectAll('.model-img')
		}

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

				$darkerArrow = $xAxisGroup.append('path')
					.attr('class', 'darker-arrow')
					.attr('d', d3.symbol().type(d3.symbolTriangle).size(32))

				$lighterArrow = $xAxisGroup.append('path')
					.attr('class', 'lighter-arrow')
					.attr('d', d3.symbol().type(d3.symbolTriangle).size(32))

				$yearRect = $yAxisGroup.append('rect').attr('class','year-rect')
				$leftLine = $xAxisGroup.append('line').attr('class', 'range-line')
				$rightLine = $xAxisGroup.append('line').attr('class', 'range-line')

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

				radius = Math.round(width * 0.01, 0)

				console.log(radius)

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
					.tickFormat(d3.format('d'))
					.ticks(10);

				$axis.select('.y')
					.attr('transform', `translate(${marginLeft + (marginRight/2)},${marginTop})`)
					.call($yAxis);

				//range lines
				$leftLine
					.attr("x1", function(d) {return scaleX(0.44248366); })
					.attr("y1", scaleY(2000) + radius)
					.attr("x2", function(d) { return scaleX(0.44248366); })
					.attr("y2", scaleY(2005) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)

					$rightLine
						.attr("x1", function(d) {return scaleX(0.855555556); })
						.attr("y1", scaleY(2000) + radius)
						.attr("x2", function(d) { return scaleX(0.855555556); })
						.attr("y2", scaleY(2005) + radius*3)
						.attr('transform', `translate(0,-${axisPadding + radius*2})`)

				//bg rectangle
				$yearRect
					.attr("x", 0)
					.attr("y", -radius)
					.attr("width", width)
					.attr("height", scaleY(2005) +  (radius * 2))
					//.attr('transform',  `translate(0, ${-radius})`)

				$darkerLabel.attr('transform', `translate(${marginLeft + 7},${height/2 + marginBottom - 4})`)
				$lighterLabel.attr('transform', `translate(${width - marginRight - 7},${height/2 + marginBottom - 4})`)

				$darkerArrow.attr('transform', `translate(${marginLeft},${(height/2) + marginBottom - 8}) rotate(-90)`);

				$lighterArrow.attr('transform', `translate(${width - marginRight},${(height/2) + marginBottom - 8}) rotate(90)`);

				// collision
				simulation = d3.forceSimulation(data)
					.force("x", d3.forceX(function(d) { return scaleX(d.l); }).strength(1))
					.force("y", d3.forceY(height / 2))
					.force("collide", d3.forceCollide(radius + 1))
					.alphaDecay(0.0228)
        	.velocityDecay(0.4)
					.restart();
				simulation.alpha(1)
				for (var i = 0; i < 200; ++i) {
					simulation.tick()
				};

				const dataDef = d3.voronoi().extent([[-marginLeft, -marginTop], [width + marginRight, height + marginTop]])
					.x(function(d) { return d.x; })
					.y(function(d) { return d.y; })
					.polygons(data)

				// for make circles
				$pod = $cell
					.selectAll('g')
					.data(dataDef)
					.join(
						enter => {
						 const g =	enter
								.append('g')
								.attr('class', 'g-pods')

									 appendCircles(g)
									 return g
				},
					update => {
						const g = d3.selectAll('.g-pods')
						$circle.attr('r', radius)
						$clip.attr('r', radius)

						$faces
							.attr('x', d => -radius)
							.attr('y', d => -radius)
							.attr('height', radius*2)
							.attr('width', radius*2)

							return g
					}
			)
					.attr('transform', d => `translate(${d.data.x}, ${d.data.y})`)


				$svg
					.attr('width', width + marginRight)
					.attr('height', height + marginTop + marginBottom);
				return Chart;
			},
			hideY(){
				$yAxisGroup.classed('is-visible', false)
			},
			showY(){
				$yAxisGroup.classed('is-visible', true)
			},
			swapFaces(){
				$beeswarmToggle.classed('is-visible', true);
				d3.select('.switch input').classed('is-faces', true);
				$faces.classed('is-visible', true);
				$circle.classed('is-visible', false);
				$circle.classed('highlight', false);
				$faces.classed('highlight', false);
				$faces.classed('faded', false);
				$yearRect.style('opacity', 1);
				$leftLine
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr("x1", function(d) {return scaleX(0.212745098); })
					.attr("y1", scaleY(2014) + radius)
					.attr("x2", function(d) { return scaleX(0.212745098); })
					.attr("y2", scaleY(2018) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)
				$rightLine
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr("x1", function(d) {return scaleX(0.858226769); })
					.attr("y1", scaleY(2014) + radius)
					.attr("x2", function(d) { return scaleX(0.858226769); })
					.attr("y2", scaleY(2018) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)

				return Chart
			},
			// highlight tones
			highlightInitTones() {
				$beeswarmToggle.classed('is-visible', false);
				$faces.classed('faded', false)
				$faces.classed('highlight', false)
				$faces.classed('is-visible', false)
				$pod.attr('transform', d => `translate(${d.data.x}, ${d.data.y})`).transition(2000).ease(d3.easeLinear);
				$yearRect.style('opacity', 0);
				$leftLine.style('opacity', 0);
				$rightLine.style('opacity', 0);
				$circle.classed('is-visible', true);
				$circle.classed('highlight', false);
				d3.selectAll('.tick')
					.classed('is-emphasized', false)
				return Chart;
			},
			// scatterTransition
			scatterTransition(){
				$beeswarmToggle.classed('is-visible', false);
				$faces.classed('highlight', false)
				$faces.classed('is-visible', false)
				$circle.classed('is-visible', true);
				$circle.classed('highlight', false);

				$pod
					.transition(5000)
					.delay((d, i) => i * 5)
					.ease(d3.easeLinear)
					.attr('transform', d => `translate(${d.data.x}, ${scaleY(d.data.year)})`)
				$yearRect.style('opacity', 0);
				$leftLine.style('opacity', 0);
				$rightLine.style('opacity', 0);

				d3.selectAll('.tick')
					.classed('is-emphasized', false)

				return Chart
			},
			highlightYears(){
				$beeswarmToggle.classed('is-visible', true);
				$circle.classed('is-visible', true);
				$circle.classed('highlight', false);
				$leftLine
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr("x1", function(d) {return scaleX(0.44248366); })
					.attr("y1", scaleY(2000) + radius)
					.attr("x2", function(d) { return scaleX(0.44248366); })
					.attr("y2", scaleY(2005) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)
				$rightLine
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr("x1", function(d) {return scaleX(0.855555556); })
					.attr("y1", scaleY(2000) + radius)
					.attr("x2", function(d) { return scaleX(0.855555556); })
					.attr("y2", scaleY(2005) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)
				$yearRect
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr('y', -radius)
					.attr('height', scaleY(2005) +  (radius * 2));

				// add emphasis class on specific tick years
				d3.selectAll('.tick')
					.classed('is-emphasized', false)
					.filter(d => d <= 2005)
					.classed('is-emphasized', true)
				return Chart
			},
			highlightMids() {
				$beeswarmToggle.classed('is-visible', false);
				$faces.classed('highlight', false)
				$faces.classed('is-visible', false)
				$circle.classed('is-visible', true);
				$circle.classed('highlight', false);
				$yearRect
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr('y', scaleY(2006) - radius)
					.attr('height', (scaleY(2013) - scaleY(2006)) + (radius * 2))
				$leftLine
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr("x1", function(d) {return scaleX(0.354117647); })
					.attr("y1", scaleY(2006) + radius)
					.attr("x2", function(d) { return scaleX(0.354117647); })
					.attr("y2", scaleY(2013) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)
				$rightLine
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr("x1", function(d) {return scaleX(0.882352941); })
					.attr("y1", scaleY(2006) + radius)
					.attr("x2", function(d) { return scaleX(0.882352941); })
					.attr("y2", scaleY(2013) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)

				d3.selectAll('.tick')
					.classed('is-emphasized', false)
					.filter(d => d >= 2006 && d <= 2013)
					.classed('is-emphasized', true)
			},
			transitionRectangle(){
				$beeswarmToggle.classed('is-visible', false);
				$faces.classed('highlight', false)
				$faces.classed('faded', false)
				$faces.classed('is-visible', true)
				$circle.classed('is-visible', false);
				$circle.classed('highlight', false);
				$yearRect
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr('y', scaleY(2014) - radius)
					.attr('height', (scaleY(2018) - scaleY(2014)) + (radius * 2))
				$leftLine
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr("x1", function(d) {return scaleX(0.212745098); })
					.attr("y1", scaleY(2014) + radius)
					.attr("x2", function(d) { return scaleX(0.212745098); })
					.attr("y2", scaleY(2018) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)
				$rightLine
					.style('opacity', 1)
					.transition(1000).ease(d3.easeLinear)
					.attr("x1", function(d) {return scaleX(0.858226769); })
					.attr("y1", scaleY(2014) + radius)
					.attr("x2", function(d) { return scaleX(0.858226769); })
					.attr("y2", scaleY(2018) + radius*3)
					.attr('transform', `translate(0,-${axisPadding + radius*2})`)

					d3.selectAll('.tick')
						.classed('is-emphasized', false)
						.filter(d => d >= 2014 && d <= 2018)
						.classed('is-emphasized', true)
			},
			highlightLupita(){
				$beeswarmToggle.classed('is-visible', true);
				$faces.classed('highlight', false)
				$faces.classed('faded', true)
				$circle.classed('is-visible', false);
				d3.selectAll('.model-img-Lupita-Nyongo').classed('highlight', true)
				$yearRect.style('opacity', 0);
				$leftLine.style('opacity', 0);
				$rightLine.style('opacity', 0);

				d3.selectAll('.tick')
					.classed('is-emphasized', false)
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
