'use strict';

/**
 * @ngdoc directive
 * @name svgangtestingApp.directive:radial
 * @description
 * # radial
 */
angular.module('svgangtestingApp')
	.directive('radial', function(d3Service) {

		return {
			restrict: 'E',
			scope: {
				'data': '=',
			},
			link: function postLink(scope, element, attrs) {
				var _data = null,
					_duration = 1000,
					_selection,
					_margin = {
						top: 0,
						right: 0,
						bottom: 30,
						left: 0
					},
					__width = 200,
					__height = 200,
					_diameter = 200,
					_label = "",
					_fontSize = 10;

				var _width, _height;

				var _mouseClick;

				var _values = [],
					_minValue = 0,
					_maxValue = 100;

				var _currentArc = 0,
					_currentArc2 = 0,
					_currentValue = 0;

				var _arc = d3.svg.arc()
					.startAngle(0 * (Math.PI / 180)); //just radians

				var _arc2 = d3.svg.arc()
					.startAngle(0 * (Math.PI / 180))
					.endAngle(0 * (Math.PI / 180)); //just radians

				_selection = d3.select(element[0]);

				function component() {

					var svg = _selection.selectAll("svg").data([_selection.datum()]);

					var enter = svg.enter().append("svg").attr("class", "radial-svg").append("g");

					measure();

					svg.attr("width", __width)
						.attr("height", __height);


					var background = enter.append("g").attr("class", "component")
						.attr("cursor", "pointer");


					_arc.endAngle(360 * (Math.PI / 180))

					background.append("rect")
						.attr("class", "background")
						.attr("width", _width)
						.attr("height", _height);

					background.append("path")
						.attr("transform", "translate(" + _width / 2 + "," + _width / 2 + ")")
						.attr("d", _arc);

					background.append("text")
						.attr("class", "label")
						.attr("transform", "translate(" + _width / 2 + "," + (_width + _fontSize) + ")")
						.text(_label);
					var g = svg.select("g")
						.attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");


					_arc.endAngle(_currentArc);
					enter.append("g").attr("class", "arcs");
					var path = svg.select(".arcs").selectAll(".arc").data([_selection.datum()]);
					path.enter().append("path")
						.attr("class", "arc")
						.attr("fill", scope.data[0].fill)
						.attr("transform", "translate(" + _width / 2 + "," + _width / 2 + ")")
						.attr("d", _arc);

					_arc2.startAngle(_currentArc);
					var path2 = svg.select(".arcs").selectAll(".arc2").data([_selection.datum()]);
					path2.enter().append("path")
						.attr("class", "arc2")
						.attr("fill", scope.data[1].fill)
						.attr("transform", "translate(" + _width / 2 + "," + _width / 2 + ")")
						.attr("d", _arc2);


					enter.append("g").attr("class", "labels");
					var label = svg.select(".labels").selectAll(".label").data([_selection.datum()]);
					label.enter().append("text")
						.attr("class", "label")
						.attr("y", _width / 2 + 34 / 3)
						.attr("x", _width / 2)
						.attr("cursor", "pointer")
						.attr("width", _width)
						.text(function(d) {
							return _maxValue;
						});

						enter.append("g").attr("class", "label-header");
						var label2= svg.select(".label-header").selectAll(".label").data([_selection.datum()]);
						label2.enter().append("text")
						.attr("class", "label")
						.attr("y", _width / 3 + 25 / 3)
						.attr("x", _width / 2)
						.attr("cursor", "pointer")
						.attr("width", _width)
						.text(function(d) {
							return scope.data[0].header;
						});

					path.exit().transition().duration(500).attr("x", 1000).remove();


					layout(svg);

					function layout(svg) {
						var ratio = (_values[0] - _minValue) / (_maxValue - _minValue);
						var endAngle = Math.min(360 * ratio, 360);
						endAngle = endAngle * Math.PI / 180;

						path.datum(endAngle);
						path.transition().duration(_duration)
							.attrTween("d", arcTween);

							_arc2.startAngle(endAngle);
							_currentArc2 = endAngle;
							path2.datum(360 * Math.PI / 180);
							path2.transition().delay(_duration).duration(_duration)
								.attrTween("d", arcTween2nd);
						


						label.datum(_maxValue);
						label.transition().duration(_duration*2)
							.tween("text", labelTween);

					}

				}

				function labelTween(a) {
					var i = d3.interpolate(_currentValue, a);
					_currentValue = i(0);

					return function(t) {
						_currentValue = i(t);
						this.textContent = Math.round(i(t)) + scope.data[0].currency;
					}
				}

				function arcTween(a) {
					var i = d3.interpolate(_currentArc, a);

					return function(t) {
						_currentArc = i(t);
						return _arc.endAngle(i(t))();
					};
				}

				function arcTween2nd(a) {
					var i = d3.interpolate(_currentArc2, a);

					return function(t) {

						return _arc2.endAngle(i(t))();
					};
				}

				function measure() {
					_width = _diameter - _margin.right - _margin.left - _margin.top - _margin.bottom;
					_height = _width;
					_fontSize = _width * .2;
					_arc.outerRadius(_width / 2);
					_arc.innerRadius(_width / 2 * .85);
					_arc2.outerRadius(_width / 2);
					_arc2.innerRadius(_width / 2 * .85);
				}

				component.render = function() {
					measure();
					component();
					return component;
				}

				component.values = function(_) {
					if (!arguments.length) return _values;
					_values = _;
					_selection.datum([_values]);
					return component;
				}


				component.margin = function(_) {
					if (!arguments.length) return _margin;
					_margin = _;
					return component;
				};

				component.diameter = function(_) {
					if (!arguments.length) return _diameter
					_diameter = _;
					return component;
				};

				component.minValue = function(_) {
					if (!arguments.length) return _minValue;
					_minValue = _;
					return component;
				};

				component.maxValue = function(_) {
					if (!arguments.length) return _maxValue;
					_maxValue = _;
					return component;
				};

				component.label = function(_) {
					if (!arguments.length) return _label;
					_label = _;
					return component;
				};

				component._duration = function(_) {
					if (!arguments.length) return _duration;
					_duration = _;
					return component;
				};

				component.diameter(200);
				component.values([scope.data[0].value, scope.data[1].value]);
				component.maxValue(scope.data[0].value + scope.data[1].value);
				component.render();
			}
		};
	});