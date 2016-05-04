'use strict';

/**
 * @ngdoc function
 * @name svgangtestingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the svgangtestingApp
 */
angular.module('svgangtestingApp')
	.controller('MainCtrl', function($scope) {

		$scope.data = [
			[{
				label: 'tablet',
				currency:'€',
				header:'Revenue',
				value: 120000,
				fill:'#009900'
			}, {
				label: 'smartphone',
				currency:'€',
				value: 80000,
				fill:'#003D00'
			}],
			[{
				label: 'tablet',
				currency:'',
				header:'Impresions',
				value: 20000,
				fill:'#2070a1'
			}, {
				label: 'smartphone',
				currency:'',
				value: 30000,
				fill:'#2010a1'
			}],
			[{
				label: 'tablet',
				currency:'',
				header:'Visits',
				value: 480000,
				fill:'#a15420'
			}, {
				label: 'smartphone',
				currency:'',
				value: 120000,
				fill:'#a08420'
			}]
		];
		$scope.data_res = [{
			label: 'CA-Residents',
			value: 76
		}, {
			label: 'Non-Residents',
			value: 24
		}];
		$scope.accessor_res = function(d) {
			return +d.value
		};
	});