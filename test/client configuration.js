import chai from 'chai'
chai.should()

import webpack from 'webpack'
import fs from 'fs'
import { chunk_info_file_path } from '../source/chunks'
import client from '../source/client configuration'

describe(`client configuration`, function()
{
	it(`should generate client-side configuration`, function()
	{
		const configuration =
		{
			module:
			{
				rules:
				[{
					test: /.css$/,
					oneOf:
					[{
						resourceQuery: /hot/, // foo.css?hot
						use:
						[
							'style-loader',
							{
								loader: 'hot-loader'
							}
						]
					},
					{
						resourceQuery: /gay/, // foo.css?gay
						use:
						[
							'style-loader',
							{
								loader: 'gay-loader'
							}
						]
					}]
				}]
			}
		}

		let resulting_configuration

		// Generic scenario
		resulting_configuration = client(configuration, {})

		resulting_configuration.plugins.length.should.equal(1)
		delete resulting_configuration.plugins

		resulting_configuration.should.deep.equal
		({
			module:
			{
				rules:
				[{
					test: /.css$/,
					oneOf:
					[{
						resourceQuery: /hot/, // foo.css?hot
						use:
						[
							'style-loader',
							{
								loader: 'hot-loader'
							}
						]
					},
					{
						resourceQuery: /gay/, // foo.css?gay
						use:
						[
							'style-loader',
							{
								loader: 'gay-loader'
							}
						]
					}]
				}]
			}
		})

		// Development mode, using CSS bundle
		resulting_configuration = client(configuration, {}, { development: true, cssBundle: true })

		resulting_configuration.plugins.length.should.equal(2)
		delete resulting_configuration.plugins

		// `extract-text-webpack-plugin`
		resulting_configuration.module.rules[0].oneOf[0].use[1].loader.should.contain('extract-text-webpack-plugin')
		resulting_configuration.module.rules[0].oneOf[0].use[1].loader = 'extract-text-webpack-plugin'
		resulting_configuration.module.rules[0].oneOf[1].use[1].loader.should.contain('extract-text-webpack-plugin')
		resulting_configuration.module.rules[0].oneOf[1].use[1].loader = 'extract-text-webpack-plugin'

		resulting_configuration.should.deep.equal
		({
			module:
			{
				rules:
				[{
					test: /.css$/,
					oneOf:
					[{
						resourceQuery: /hot/, // foo.css?hot
						use:
						[{
							loader: 'style-loader'
						},
						{
							loader: 'extract-text-webpack-plugin',
							options:
							{
								id     : 1,
								omit   : 0,
								remove : false
							}
						},
						{
							loader: 'hot-loader'
						}]
					},
					{
						resourceQuery: /gay/, // foo.css?gay
						use:
						[{
							loader: 'style-loader'
						},
						{
							loader: 'extract-text-webpack-plugin',
							options:
							{
								id     : 1,
								omit   : 0,
								remove : false
							}
						},
						{
							loader: 'gay-loader'
						}]
					}]
				}]
			}
		})

		resulting_configuration = client(configuration, {}, { development: false })

		resulting_configuration.plugins.length.should.equal(2)
		delete resulting_configuration.plugins

		// `extract-text-webpack-plugin`
		resulting_configuration.module.rules[0].oneOf[0].use[0].loader.should.contain('extract-text-webpack-plugin')
		resulting_configuration.module.rules[0].oneOf[0].use[0].loader = 'extract-text-webpack-plugin'
		resulting_configuration.module.rules[0].oneOf[1].use[0].loader.should.contain('extract-text-webpack-plugin')
		resulting_configuration.module.rules[0].oneOf[1].use[0].loader = 'extract-text-webpack-plugin'

		resulting_configuration.should.deep.equal
		({
			module:
			{
				rules:
				[{
					test: /.css$/,
					oneOf:
					[{
						resourceQuery: /hot/, // foo.css?hot
						use:
						[{
							loader: 'extract-text-webpack-plugin',
							options:
							{
								id     : 2,
								omit   : 0,
								remove : true
							}
						},
						{
							loader: 'hot-loader'
						}]
					},
					{
						resourceQuery: /gay/, // foo.css?gay
						use:
						[{
							loader: 'extract-text-webpack-plugin',
							options:
							{
								id     : 2,
								omit   : 0,
								remove : true
							}
						},
						{
							loader: 'gay-loader'
						}]
					}]
				}]
			}
		})
	})

	it(`should output chunks info file after Webpack build`, function()
	{
		// Submit a Pull Request

		// const webpack_configuration = {}
		// const settings = {}
		// const client_configuration = client(webpack_configuration, settings)
		//
		// fs.unlink(chunk_info_file_path(client_configuration))
		//
		// https://webpack.github.io/docs/node.js-api.html
		// webpack(client_configuration, function(error, stats)
		// {
		// 	fs.exists(chunk_info_file_path(client_configuration)).should.equal(true)
		// })
	})
})