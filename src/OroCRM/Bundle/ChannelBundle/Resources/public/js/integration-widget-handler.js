define(['underscore', 'backbone', 'orotranslation/js/translator', 'routing', 'oro/dialog-widget'],
    function (_, Backbone, __, routing, DialogWidget) {
        'use strict';

        var $ = Backbone.$;

        /**
         * @export  orocrmchannel/js/integration-widget-handler
         * @class   orocrmchannel.IntegrationWidgetHandlerView
         * @extends Backbone.View
         */
        return Backbone.View.extend({
            /**
             * @type {jQuery}
             */
            $dataEl: null,

            /**
             * @type {jQuery}
             */
            $idEl: null,

            /**
             * @type {jQuery}
             */
            $typeEl: null,

            /**
             * @type {jQuery}
             */
            $nameEl: null,

            /**
             * @type {function(object):string} linkTemplate
             */
            linkTemplate: _.template('<a href="#" class="no-hash open-form-widget"><%= title %></a>'),

            /**
             * @type {Object.<string, *>}
             */
            events: {
                'click .open-form-widget': 'openDialog'
            },

            /**
             * Initialize.
             *
             * @param {Object} options
             */
            initialize: function (options) {
                if (!(options.dataEl && options.idEl && options.typeEl && options.nameEl)) {
                    throw new TypeError('Missing required options for IntegrationWidgetHandlerView');
                }

                this.$dataEl = $(options.dataEl);
                this.$idEl   = $(options.idEl);
                this.$typeEl = $(options.typeEl);
                this.$nameEl = $(options.nameEl);
            },

            /**
             * @param {jQuery.Event} e
             */
            openDialog: function (e) {
                e.preventDefault();

                var formDialog = new DialogWidget({
                    url: this._getUrl(),
                    title: this._getTitle(),
                    stateEnabled: false,
                    incrementalPosition: false,
                    dialogOptions: {
                        modal: true,
                        resizable: true,
                        autoResize: true,
                        width: 700,
                        height: 550
                    }
                });

                var processFormSave = function (data) {
                    data = _.omit(data, ['_token']);

                    this._setValue('name', data.name || '');
                    this._setValue('data', data);
                    formDialog.remove();
                    this.render();
                };

                formDialog.on('formSave', _.bind(processFormSave, this));
                formDialog.render();
            },

            render: function () {
                this.$el.html(this.linkTemplate({title: this._getTitle()}))
            },

            /**
             * Generates form widget URL based on current state
             *
             * @returns {string}
             * @private
             */
            _getUrl: function () {
                var entityId = this._getValue('id'),
                    data = this._getValue('data'),
                    route = entityId ? 'orocrm_channel_integration_update' : 'orocrm_channel_integration_create',
                    type = this._getValue('type'),
                    params = {};

                if (data) {
                    params.data = data;
                }

                if (entityId) {
                    params.id = entityId;
                } else if (type) {
                    params.type = type;
                }

                return routing.generate(route, params);
            },

            /**
             * Returns title for window
             *
             * @returns {string}
             * @private
             */
            _getTitle: function () {
                var name = this._getValue('name');

                return name ? name : __('Create integration');
            },

            /**
             * Get value by key
             *
             * @param {string?} key
             * @returns {*}
             * @private
             */
            _getValue: function (key) {
                this._assertAllowedValueKey(key);

                var preparedData,
                    data =this[['$', key, 'El'].join('')].val();

                switch (key) {
                    case 'data':
                        preparedData = data !== '' ? JSON.parse(data) : {};
                        break;
                    default:
                        preparedData = data;
                }

                return preparedData;
            },

            /**
             * Set value by key
             *
             * @param {string}key
             * @param {*} data
             * @private
             */
            _setValue: function (key, data) {
                var preparedData;

                this._assertAllowedValueKey(key);
                switch (key) {
                    case 'data':
                        preparedData = JSON.stringify(data);
                        break;
                    default:
                        preparedData = data;
                }

                this[['$', key, 'El'].join('')].val(preparedData);
            },

            /**
             * Checks whether data key is supported
             *
             * @param {string}key
             * @private
             */
            _assertAllowedValueKey: function (key) {
                if (['id', 'data', 'type', 'name'].indexOf(key) === -1) {
                    throw new TypeError('Unknown option: ' + key);
                }
            }
        });
    });
