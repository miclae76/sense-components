/**
 * Slider component
 *
 * @todo Handles exceptions if start, startUpper, startLower is not set
 * @todo There is a weird bug if setting hideLabels ... ?!
 * @todo rtl not fully tested
 * @todo Default settings for rtl-support
 */
/*global define,_*/
define( [
		'angular',
		'qlik',
		'text!./sc-slider.ng.html',
		'./variable-utils',
		'./external/loglevel/loglevel.min',
		'./external/nouislider/nouislider.min',
		'./external/wnumb/wNumb',
		'css!./external/nouislider/nouislider.min.css',
		'css!./sc-slider.css'
	],
	function ( angular, qlik, ngTemplate, varUtils, loglevel, noUiSlider, wNumb ) {
		'use strict';

		var $injector = angular.injector( ['ng'] );
		var $timeout = $injector.get( "$timeout" );
		var $q = $injector.get( "$q" );
		var app = null;

		return {
			name: 'scSlider',
			restrict: 'E',
			replace: true,
			template: ngTemplate,
			scope: {
				sliderType: '@',
				min: '@',
				max: '@',
				start: '@',
				startLower: '@',
				startUpper: '@',
				qsVar: '@',
				qsVarLower: '@',
				qsVarUpper: '@',
				orientation: '@',
				direction: '@', 	//todo - Not fully working, yet
				tooltips: '@', 		//todo - Not fully working, yet
				hideLabels: '@', 	//todo - Not fully working, yet
				initFromQs: '@',
				debugLevel: '@'
			},
			link: function ( $scope, element, attrs ) {

				ensureApp();
				console.log( varUtils );

				// Default value // todo still doesn' work properly ...
				$scope.hideLabels = angular.isDefined( $scope.hideLabels ) ? $scope.hideLabels == 'true' : false;

				var sliderType = (['range', 'single'].indexOf( $scope.sliderType ) >= 0 ? $scope.sliderType : 'single');
				var opts = null;
				var sliderInstance = null;

				// Todo: can probably be omitted, since the watcher is triggered anyhow all the time.
				initLocalOpts();

				// Set the labels, initially
				setLabels( getSliderConfig_start() ); //Todo: should be the value, not the min & max

				//Todo: I think this can be omitted, since the watcher is always triggered anyhow
				//initSlider( getSliderConfig() );

				$scope.$watchGroup(
					[
						'sliderType',
						'min',
						'max',
						'start',
						'startLower',
						'startUpper',
						'qsVar',
						'qsVarLower',
						'qsVarUpper',
						'orientation',
						'direction',
						'tooltips',
						'hideLabels',
						'initFromQs'
					], function ( newVal, oldVal ) {
						console.log( 'new settings recognized', newVal );
						initLocalOpts();
						initSlider( getSliderConfig() );
					} );

				$scope.$watch( 'logLevel', function ( newVal, oldVal ) {
					if ( newVal && newVal !== oldVal ) {
						if ( ['off', 'error', 'warn', 'info', 'log'].indexOf( $scope.debugLevel ) > -1 ) {
							//Logger.setLevel( newVal );

						}
					}
				} );

				// *****************************************************************************************************

				/**
				 * Create the slider and apply options if the slider is not instantiated, otherwise the existing slider
				 * will be updated with the given configuration.
				 *
				 * @param config
				 * @private
				 */
				function initSlider ( config ) {
					if ( sliderRequirementsCheck( config ) ) {
						if ( !sliderInstance ) {
							console.log( 'Initializing slider', config );
							var sliderElem = element.find( '.sc-slider-item' )[0];
							sliderInstance = noUiSlider.create( sliderElem, config );
							sliderInstance.on( 'change', function ( values, handle ) {
								console.log( 'new values', values );
								setLabels( values );
								initApp()
									.then( varUtils.updateEngineVars.bind( null, app, getVarDefs() ) )
									.catch( function ( err ) {
										window.console.error( 'initSlider: ', err ); //Todo: Could be a errorHandler we use everywhere
									} )
							} );
							initSliderValues()
								.then( function ( result ) {
									console.log( 'initValues', result );
								} )
								.catch( function ( err ) {
									console.log( 'initValues: ', err );
								} )
						} else {
							console.log( 'slider already there, setting the values', config );
							sliderInstance.updateOptions( config );

						}
					}
				}

				/**
				 * Initializes the global variable app.
				 * @returns {Promise}
				 */
				function initApp () {
					return ensureApp();
				}

				/**
				 * Initializes the slider values from the Engine's variable values.
				 *
				 * @description
				 * This is only applicable if variables are defined and they have a valid value:
				 *    - inside min & max
				 *    - lower variable's value not higher then the upper variable's value, etc.
				 *
				 *    Fetching the initial values can also be turned off by the setting `initFromQs`
				 */
				function initSliderValues () {
					var defer = $q.defer();
					if ( opts.initFromQs ) {
						varUtils.getEngineVarListValues( app, getVarDefs().map( function ( v ) { return v.name} ) )
							.then( function ( reply ) {

								console.log( 'getEngineVarListValues: ', reply );
								// var values = [];
								// result.forEach( function( varModel) {
								// 	values.push(varModel.layout.qNum);
								// });
								// console.log('values', values);
								// Todo: Check errors in the result, the promise always returns true!!!
								if (opts.type === 'single') {
									$scope.start = Math.ceil(reply[0].result.layout.qNum);
								} else {
									$scope.startLower = Math.ceil(reply[0].result.layout.qNum);
									$scope.startUpper = Math.ceil(reply[1].result.layout.qNum);
								}

							} )
							.catch( function ( err ) {
								console.log( err ); //Todo: completely unnecessary, since the promise always returns true!!!
							} );

						//defer.resolve();
					} else {
						defer.resolve();
					}
					return defer.promise;
				}

				/**
				 * Set the local options, based on the scope properties, but with some default-value logic.
				 *
				 * @private
				 */
				function initLocalOpts () {
					opts = {
						type: sliderType,
						min: angular.isDefined( $scope.min ) ? $scope.min : 0,
						max: angular.isDefined( $scope.max ) ? $scope.max : 100,
						startLower: (sliderType === 'single') ? $scope.start : $scope.startLower,
						startUpper: $scope.startUpper,
						qsVarLower: (sliderType === 'single') ? $scope.qsVar : $scope.qsVarLower,
						qsVarUpper: $scope.qsVarUpper,
						orientation: (['horizontal', 'vertical'].indexOf( $scope.orientation ) > -1) ? $scope.orientation : 'horizontal',
						direction: (['ltr', 'rtl'].indexOf( $scope.direction ) > -1) ? $scope.direction : 'ltr',
						tooltips: _.isBoolean( $scope.tooltips ) ? $scope.tooltips : true,
						initFromQs: true // todo: make that dynamic
					};
				}

				/**
				 * Checks if the required options for the slider are available or not.
				 *
				 * @param config
				 * @returns {boolean} Whether the required options are met or not.
				 * @public
				 */
				function sliderRequirementsCheck ( config ) {
					if ( !config.start ) {
						return false;
					}
					return true;
				}

				/**
				 * Get the options for the slider.
				 *
				 * @returns {object} The configuration object for the slider.
				 * @private
				 */
				function getSliderConfig () {

					var toolTipConfig = [];
					return {
						start: getSliderConfig_start(),
						connect: (sliderType === 'range') ? true : false,
						range: {
							'min': parseInt( opts.min ),
							'max': parseInt( opts.max )
						},
						orientation: opts.orientation,
						format: wNumb( {
							decimals: 0,
							thousand: ',',
							postfix: ''
						} )
						//,
						//direction: opts.direction
						//tooltips: (opts.tooltips) ? [wNumb({ decimals: 0 })] : [false]
					};
				}

				function getSliderConfig_start () {
					return (sliderType === 'range') ? [parseInt( opts.startLower ), parseInt( opts.startUpper )] : [parseInt( opts.startLower )];
				}

				/**
				 * @type VariableDefinition
				 */

				/**
				 * Returns a list of values in the following format:
				 *
				 * @todo: doc more in detail
				 *
				 * @param values
				 * @returns {Array<VariableDefinition>}
				 */
				function getVarDefs ( values ) {

					if ( !values ) {
						values = sliderInstance.get();
					}

					var d = [];
					d.push( {
						name: opts.qsVarLower,
						value: values[0]
					} );
					if ( opts.type === 'range' ) {
						d.push( {
							name: opts.qsVarUpper,
							value: values[1]
						} )
					}
					return d;
				}

				/**
				 * Set the values for labels.
				 *
				 * @param values
				 * @private
				 */
				function setLabels ( values ) {
					if ( values && !$scope.hideLabels === true ) {
						if ( sliderType === 'range' ) {
							element.find( '.sc-slider-label-left' )[0].innerHTML = values[0];
							if ( values.length === 2 ) {element.find( '.sc-slider-label-right' )[0].innerHTML = values[1];}
						} else {
							element.find( '.sc-slider-label-middle' )[0].innerHTML = values[0];
						}
					}
				}

				//Todo: Move this to initApp ... breaking out does not make it more readable in this case
				function ensureApp () {
					var defer = $q.defer();
					if ( !app ) {
						// Todo: Might be changed later on to reflect enigma's logic to fetch the current app
						// (returning always a promise)
						app = qlik.currApp();
					}
					defer.resolve( app );
					return defer.promise;
				}
			}
		};

	} );