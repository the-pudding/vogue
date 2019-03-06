/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.repeatModel = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();

		const $imageCont = d3.select('.repeat-models-img')

		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 10;
		const marginRight = 10;
		const radius = 6;
		const textPadding = 125

		// scales
		const scaleX = d3.scaleLinear();
		const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
		let $g = null

		// helper functions
		function handleClick(){
			$imageCont.selectAll('.g-img')
				.attr('hidden', (d, i) => data.values[i] ? false : true)

			$imageCont.selectAll('img')
				.attr('src', (d, i) => data.values[i] ? `assets/images/covers500/${data.values[i].coverFile}` : '')

			const tone = $imageCont.selectAll('.img-tone')
			console.log({tone})
				tone.style('background-color', (d, i) => data.values[i] ? `${data.values[i].tone}` : '#FFFFFF')
		}

		const Chart = {
			// called once at start
			init() {
				$svg = $sel.append('svg').attr('class', 'pudding-chart');

				$svg.on('click', handleClick)

				$g = $svg.append('g');

				// offset chart for margins
				$g.attr('transform', `translate(${marginLeft}, ${marginTop})`);

				// create axis
				$axis = $svg.append('g').attr('class', 'g-axis');

				// setup viz group
				$vis = $g.append('g').attr('class', 'g-vis');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;
				$svg
					.attr('width', width + marginLeft + marginRight)
					.attr('height', height + marginTop + marginBottom);

				scaleX
					.rangeRound([textPadding, width])
					.domain([.2127451, 0.8823529])
					// keeping all small multiples on the same global scale

				$g.selectAll('.repeat-cover')
					.attr('transform', d => `translate(${scaleX(d.l)}, ${height / 2})`)

				$g.selectAll('.repeat-name')
					.attr('transform', `translate(5, ${height / 2})`)


				return Chart;
			},
			// update scales and render chart
			render() {
				const circles = $vis.selectAll('.repeat-cover')
					.data(data.values)
					.enter()
					.append('circle')
					.attr('class', 'repeat-cover')
					.attr('r', radius)
					.attr('fill', d => d.tone)
					.attr('opacity', 0.8)

				$vis.append('text')
					.attr('class', 'repeat-name')
					.text(data.key)
					.attr('alignment-baseline', 'middle')

				Chart.resize()
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
