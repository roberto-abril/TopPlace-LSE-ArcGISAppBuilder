///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'dijit/form/NumberTextBox',
    'dijit/form/TextBox',
    'dijit/form/CheckBox'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      // Declaramos la clase CSS para los estilos
      baseClass: 'jimu-widget-avuxi-setting',

      startup: function() {
        this.inherited(arguments);
        var config = this.config;

        // Si no existe la configuración, la creamos
        config.TPLS = config.TPLS || {}
        config.TPLS.params = config.TPLS.params || {}

        this.setConfig(this.config);
      },

      // Al abrir la configuración del widget
      setConfig: function(config) {
        this.config = config;
        var options = config.TPLS.params;

        if (options && options.apiurl) {
          this.apiurl.set('value', options.apiurl);
        }
        if (options && options.app_id) {
          this.app_id.set('value', options.app_id);
        }
        if (options && options.api_key) {
          this.api_key.set('value', options.api_key);
        }
      },

      // Al cerrar la configuración del widget
      getConfig: function() {
        if (!this.app_id.value) {
          alert(this.nls.warning);
          return false;
        }
        var options = this.config.TPLS.params;
        options.apiurl = this.apiurl.value;
        options.app_id = this.app_id.value;
        options.api_key = this.api_key.value;
        return this.config;
      }

    });
  });
